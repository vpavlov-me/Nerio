import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");
const tokenCss = read("packages/tokens/src/styles.css");
const docsChrome = read("apps/docs/components/docs-chrome.tsx");
const demoApp = read("apps/demo-app/app/page.tsx");
const uiStyles = [
  read("packages/ui/src/styles/forms.css"),
  read("packages/ui/src/styles/progress.css"),
  read("packages/ui/src/styles/overlays.css"),
  read("packages/ui/src/styles/motion.css"),
].join("\n");

const themes = ["purple", "blue", "green", "orange", "red", "neutral"];
const failures = [];
const requireText = (source, text, label) => {
  if (!source.includes(text)) failures.push(`${label}: ${text}`);
};

for (const theme of themes) {
  requireText(tokenCss, `:root[data-theme="${theme}"]`, "Missing light theme selector");
  requireText(
    tokenCss,
    `:root[data-theme="${theme}"][data-mode="dark"]`,
    "Missing dark theme selector",
  );
  requireText(
    tokenCss,
    `:root[data-theme="${theme}"][data-mode="system"]`,
    "Missing system-dark theme selector",
  );
}

for (const mode of ["light", "dark", "system"]) {
  requireText(tokenCss, `data-mode="${mode}"`, "Missing mode contract");
}
requireText(tokenCss, "@media (prefers-color-scheme: dark)", "Missing OS color-scheme contract");
requireText(tokenCss, ':root[data-density="compact"]', "Missing compact density selector");
const compactDensity =
  tokenCss.match(/:root\[data-density="compact"\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
for (const token of [
  "--n-space-3",
  "--n-button-height-md",
  "--n-input-height-md",
  "--n-form-group-gap",
  "--n-card-gap",
  "--n-pagination-item-size",
  "--n-progress-height",
]) {
  requireText(compactDensity, token, "Missing compact density token");
}

for (const source of [docsChrome, demoApp]) {
  for (const axis of ["data-theme", "data-mode", "data-density"]) {
    requireText(source, `setAttribute("${axis}"`, "Runtime surface does not set axis");
  }
}

for (const axis of ["data-radius", "data-font", "data-motion", "data-contrast", "data-scale"]) {
  if (tokenCss.includes(`[${axis}`)) failures.push(`Prohibited runtime axis selector: ${axis}`);
}

for (const contract of [
  "--n-color-focus-ring",
  "--n-color-text-disabled",
  "--n-color-surface-selected",
  "--n-color-danger",
  "--n-overlay-backdrop",
]) {
  requireText(tokenCss, contract, "Missing accessibility token");
}
requireText(uiStyles, "@media (forced-colors: active)", "Missing forced-colors contract");
requireText(uiStyles, "@media (prefers-reduced-motion: reduce)", "Missing reduced-motion contract");

if (failures.length) {
  console.error("Runtime-axis validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Runtime-axis matrix verified for ${themes.length} themes, 3 modes, and 2 densities.`);
