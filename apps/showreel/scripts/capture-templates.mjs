import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const showreelDirectory = resolve(scriptDirectory, "..");
const repositoryDirectory = resolve(showreelDirectory, "../..");
const captureDirectory = resolve(showreelDirectory, "public/captures");
const baseUrl = "http://127.0.0.1:3100";

const wait = (milliseconds) =>
  new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

async function assertPortAvailable() {
  try {
    const response = await fetch(baseUrl, { signal: AbortSignal.timeout(750) });
    throw new Error(
      `Port 3100 is already serving HTTP ${response.status}; stop that process before capture.`,
    );
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Port 3100")) throw error;
  }
}

async function waitForDocs() {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/views/operations-workspace`, {
        signal: AbortSignal.timeout(2_000),
      });
      if (response.ok) return;
    } catch {
      // The development server is still compiling.
    }
    await wait(500);
  }
  throw new Error("Timed out waiting for the docs development server on port 3100.");
}

await assertPortAvailable();
await mkdir(captureDirectory, { recursive: true });

const server = spawn(
  "pnpm",
  [
    "--filter",
    "@nerio-ui/docs",
    "exec",
    "next",
    "dev",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3100",
  ],
  {
    cwd: repositoryDirectory,
    detached: true,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: "inherit",
  },
);

try {
  await waitForDocs();
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      colorScheme: "light",
      locale: "en-US",
      reducedMotion: "reduce",
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem("nerio-docs-theme", "purple");
      localStorage.setItem("nerio-docs-mode", "light");
      localStorage.setItem("nerio-docs-density", "comfortable");
    });

    for (const capture of [
      { file: "operations-workspace.png", route: "/views/operations-workspace" },
      { file: "finance-assets.png", route: "/views/finance-assets" },
    ]) {
      await page.goto(`${baseUrl}${capture.route}`, { waitUntil: "domcontentloaded" });
      await page.locator("main").first().waitFor({ state: "visible" });
      await page.evaluate(() => {
        document.documentElement.dataset.theme = "purple";
        document.documentElement.dataset.mode = "light";
        document.documentElement.dataset.density = "comfortable";
        document.documentElement.dir = "ltr";
      });
      await page.addStyleTag({
        content:
          "nextjs-portal{display:none!important}*{animation-duration:0s!important;transition-duration:0s!important}",
      });
      await page.waitForTimeout(1_200);
      await page.screenshot({
        animations: "disabled",
        path: resolve(captureDirectory, capture.file),
      });
    }
    await context.close();
  } finally {
    await browser.close();
  }
} finally {
  if (server.pid) {
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {
      server.kill("SIGTERM");
    }
  }
}
