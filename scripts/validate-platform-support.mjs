import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parsePathOptions } from "./validator-options.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const paths = parsePathOptions(process.argv.slice(2), {
  "--playwright": resolve(root, "playwright.config.mjs"),
  "--pr-gate": resolve(root, ".github/workflows/pr-gate.yml"),
  "--release-gate": resolve(root, ".github/workflows/release-gate.yml"),
  "--canary": resolve(root, ".github/workflows/playwright-canary.yml"),
});
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const support = readJson("quality/platform-support.json");
const dependencySupport = readJson("quality/dependency-support.json");
const rootPackage = readJson("package.json");
const publicPackagePaths = [
  "packages/tokens/package.json",
  "packages/ui/package.json",
  "packages/adapters/package.json",
  "packages/registry/package.json",
  "packages/cli/package.json",
  "packages/mcp/package.json",
];
const nextPolicyMatch = support.next.match(/^>=(\d+)\.(\d+)\.(\d+) <(\d+)$/);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(rootPackage.engines?.node === support.node, "Root Node engine must match platform support.");
assert(
  JSON.stringify(support.ciNodes) === JSON.stringify(["22", "24"]),
  "Consumer CI must cover Node 22 and Node 24.",
);
for (const path of [".nvmrc", ".node-version"]) {
  assert(readFileSync(resolve(root, path), "utf8").trim() === "22", `${path} must select Node 22.`);
}
assert(
  rootPackage.devDependencies?.typescript?.startsWith("^5.9."),
  "Workspace TypeScript must stay inside the documented 5.9 support line.",
);
assert(nextPolicyMatch, `Unsupported Next.js policy format: ${support.next}`);

const nextPolicyMinimum = nextPolicyMatch.slice(1, 4).map(Number);
const nextPolicyMaximumMajor = Number(nextPolicyMatch[4]);

function compareVersions(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}
assert(
  rootPackage.devDependencies?.["@playwright/test"] === support.playwright,
  "Pinned Playwright version must match platform support.",
);

for (const path of publicPackagePaths) {
  const manifest = readJson(path);
  assert(manifest.engines?.node === support.node, `${manifest.name} Node engine is out of policy.`);
}

for (const profileName of ["minimum", "current"]) {
  const profile = dependencySupport.profiles?.[profileName];
  assert(profile, `Missing ${profileName} dependency profile.`);
  assert(/^19\./.test(profile.react), `${profileName} React must stay on React 19.`);
  assert(profile.reactDom === profile.react, `${profileName} React DOM must match React.`);
  assert(/^16\./.test(profile.next), `${profileName} Next.js must stay on Next.js 16.`);
  assert(/^5\.9\./.test(profile.typescript), `${profileName} TypeScript must stay on 5.9.`);
  assert(/^4\./.test(profile.tailwindcss), `${profileName} Tailwind must stay on 4.x.`);
  for (const peer of Object.keys(readJson("packages/adapters/package.json").peerDependencies)) {
    if (peer === "react") continue;
    assert(profile.optionalPeers?.[peer], `${profileName} profile is missing ${peer}.`);
  }
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

for (const path of ["apps/docs/package.json"]) {
  const manifest = readJson(path);
  const nextRangeMatch = manifest.dependencies?.next?.match(/^\^(\d+)\.(\d+)\.(\d+)$/);
  assert(
    nextRangeMatch &&
      compareVersions(nextRangeMatch.slice(1).map(Number), nextPolicyMinimum) >= 0 &&
      Number(nextRangeMatch[1]) + 1 <= nextPolicyMaximumMajor,
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

const playwrightConfig = readFileSync(paths["--playwright"], "utf8");
for (const engine of ["chromium", "firefox", "webkit"]) {
  assert(playwrightConfig.includes(`-${engine}`), `Playwright config must include ${engine}.`);
}

const prGate = readFileSync(paths["--pr-gate"], "utf8");
assert(
  prGate.includes("playwright install --with-deps chromium") &&
    prGate.includes("pnpm test:browser:pr"),
  "The development gate must run the focused Chromium PR smoke.",
);
assert(
  !prGate.includes("command: test:browser:firefox") &&
    !prGate.includes("command: test:browser:webkit"),
  "The development gate must not run Firefox or WebKit.",
);

const releaseGate = readFileSync(paths["--release-gate"], "utf8");
for (const engine of ["chromium", "firefox", "webkit"]) {
  assert(
    releaseGate.includes(`engine: ${engine}`) &&
      releaseGate.includes(`command: test:browser:${engine}`),
    `The release gate must run the ${engine} browser contract.`,
  );
}
for (const value of [
  "profile: minimum",
  "profile: current",
  "node: 22",
  "node: 24",
  "pnpm test:consumer:${{ matrix.profile }}",
]) {
  assert(releaseGate.includes(value), `Release consumer matrix must include ${value}.`);
}

const canary = readFileSync(paths["--canary"], "utf8");
for (const value of [
  "schedule:",
  "workflow_dispatch:",
  "@playwright/test@latest",
  "pnpm test:browser:chromium",
  "pnpm test:browser:firefox",
  "pnpm test:browser:webkit",
]) {
  assert(canary.includes(value), `Playwright canary must include ${value}.`);
}
assert(!canary.includes("pull_request:"), "The Playwright canary must not gate pull requests.");
console.log(
  "Platform support policy matches runtime declarations, package metadata, bounded dependency profiles, Node 22/24 consumers, pinned Playwright, the weekly stable canary, the cross-engine release gate, and docs.",
);
