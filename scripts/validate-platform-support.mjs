import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const support = readJson("quality/platform-support.json");
const rootPackage = readJson("package.json");
const publicPackagePaths = [
  "packages/tokens/package.json",
  "packages/ui/package.json",
  "packages/adapters/package.json",
  "packages/registry/package.json",
  "packages/cli/package.json",
  "packages/mcp/package.json",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(rootPackage.engines?.node === support.node, "Root Node engine must match platform support.");
assert(
  rootPackage.devDependencies?.typescript?.startsWith("^5.9."),
  "Workspace TypeScript must stay inside the documented 5.9 support line.",
);
assert(
  rootPackage.devDependencies?.["@playwright/test"] === support.playwright,
  "Pinned Playwright version must match platform support.",
);

for (const path of publicPackagePaths) {
  const manifest = readJson(path);
  assert(manifest.engines?.node === support.node, `${manifest.name} Node engine is out of policy.`);
}

const uiPackage = readJson("packages/ui/package.json");
assert(uiPackage.peerDependencies?.react === support.react, "UI React peer is out of policy.");
assert(
  uiPackage.peerDependencies?.["react-dom"] === support.reactDom,
  "UI React DOM peer is out of policy.",
);
assert(
  uiPackage.peerDependencies?.tailwindcss === support.tailwindcss,
  "UI Tailwind peer is out of policy.",
);

for (const path of ["apps/docs/package.json", "apps/demo-app/package.json"]) {
  const manifest = readJson(path);
  assert(
    manifest.dependencies?.next?.startsWith("^16.2."),
    `${manifest.name} Next.js is out of policy.`,
  );
  assert(
    manifest.dependencies?.react?.startsWith("^19."),
    `${manifest.name} React is out of policy.`,
  );
  assert(
    manifest.dependencies?.["react-dom"]?.startsWith("^19."),
    `${manifest.name} React DOM is out of policy.`,
  );
}

const policy = readFileSync(resolve(root, "docs/platform-support.md"), "utf8");
for (const value of [
  support.node,
  support.react,
  support.next,
  support.typescript,
  support.tailwindcss,
  support.browsers.chromium,
  support.browsers.firefox,
  support.browsers.webkit,
]) {
  assert(policy.includes(`\`${value}\``), `Platform support docs must include ${value}.`);
}

const playwrightConfig = readFileSync(resolve(root, "playwright.config.mjs"), "utf8");
for (const engine of ["chromium", "firefox", "webkit"]) {
  assert(playwrightConfig.includes(`-${engine}`), `Playwright config must include ${engine}.`);
}

const ci = readFileSync(resolve(root, ".github/workflows/ci.yml"), "utf8");
assert(
  ci.includes("playwright install --with-deps chromium firefox webkit"),
  "CI must install every supported browser engine.",
);

console.log("Platform support policy matches package metadata, apps, Playwright, CI, and docs.");
