import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), "utf8");
const contract = JSON.parse(read("quality/core-direction-localization.json"));
const packageManifest = JSON.parse(read("packages/ui/package.json"));
const foundations = JSON.parse(read("apps/docs/content/foundations.json"));
const parity = JSON.parse(read("quality/core-1-x-capability-parity.json"));

const failures = [];
const requireValue = (condition, message) => {
  if (!condition) failures.push(message);
};

requireValue(contract.schemaVersion === 1, "Direction/localization schemaVersion must be 1.");
requireValue(contract.issue === 342, "Direction/localization metadata must belong to issue #342.");
requireValue(contract.targetBranch === "dev", "Core 1.1 direction work must target dev.");
requireValue(
  contract.stableReleaseCandidate === false,
  "Core 1.1 direction work must remain outside the stable release candidate.",
);
requireValue(
  contract.baseUiVersion === packageManifest.dependencies["@base-ui/react"],
  "Direction metadata Base UI version must match packages/ui/package.json.",
);
requireValue(
  contract.direction?.behaviorBridge === "@base-ui/react/direction-provider",
  "Direction-sensitive Base UI behavior must use the official DirectionProvider bridge.",
);
requireValue(
  contract.direction?.runtimeAxis === false,
  "Direction must not become a runtime axis.",
);
requireValue(contract.locale?.provider === null, "Nerio must not introduce a locale provider.");
requireValue(
  contract.locale?.deterministicDefault === "en-US",
  "Locale-sensitive SSR defaults must remain explicit and deterministic.",
);

const requiredComponents = [
  "Breadcrumbs",
  "Button",
  "Calendar",
  "Command",
  "DatePicker",
  "Dialog",
  "Dropdown Menu",
  "Pagination",
  "Popover",
  "Select",
  "Sheet",
  "Sidebar Primitive",
  "Slider",
  "Tabs",
  "Toast",
  "Tooltip",
];
requireValue(
  JSON.stringify(contract.auditedComponents) === JSON.stringify(requiredComponents),
  "Direction/localization audited component coverage drifted.",
);
requireValue(
  JSON.stringify(contract.auditFindings?.map((finding) => finding.component)) ===
    JSON.stringify(requiredComponents) &&
    contract.auditFindings?.every(
      (finding) => finding.status === "verified" && finding.contract?.trim(),
    ),
  "Direction/localization audit findings must cover every required component.",
);

const policy = read("docs/direction-localization.md");
for (const phrase of [
  "@base-ui/react/direction-provider",
  "logical CSS properties",
  "default to `en-US`",
  "Translation frameworks",
  "Next.js setup",
  "Vite setup",
]) {
  requireValue(policy.includes(phrase), `Direction/localization policy is missing: ${phrase}`);
}

requireValue(
  foundations.some(
    (page) => page.path === "/docs/foundations/localization" && page.label === "Localization",
  ),
  "Public Foundations discovery is missing the Localization route.",
);
requireValue(
  read("apps/docs/app/docs/foundations/localization/page.tsx").includes(
    "DirectionProvider direction={direction}",
  ),
  "Public Localization guidance must pair HTML direction with Base UI behavior.",
);
const rtlFixture = read("apps/docs/components/localization-preview.tsx");
for (const phrase of [
  '<DirectionProvider direction="rtl">',
  'dir="rtl"',
  'label="RTL priority"',
  'aria-label="RTL workspace sections"',
]) {
  requireValue(rtlFixture.includes(phrase), `Public RTL fixture is missing: ${phrase}`);
}

const calendar = read("packages/ui/src/components/calendar.tsx");
const datePicker = read("packages/ui/src/components/date-picker.tsx");
const dialog = read("packages/ui/src/components/dialog.tsx");
const sidebar = read("packages/ui/src/components/sidebar.tsx");
const toast = read("packages/ui/src/components/toast.tsx");
requireValue(calendar.includes('locale = "en-US"'), "Calendar must keep deterministic en-US SSR.");
requireValue(
  datePicker.includes('locale = "en-US"'),
  "DatePicker must keep deterministic en-US SSR.",
);
requireValue(
  toast.includes("[inset-inline-end:var(--toast-viewport-inline-inset)]"),
  "Toast viewport must use logical inline-end placement.",
);
requireValue(
  dialog.includes("fixed left-1/2 top-1/2") && !dialog.includes("fixed start-1/2 top-1/2"),
  "Dialog centering must use consistently physical geometry in LTR and RTL.",
);
requireValue(
  sidebar.includes('closest<HTMLElement>("[dir]")') &&
    sidebar.includes("rtl:flex-row-reverse") &&
    sidebar.includes("rtl:data-[side=right]:flex-row") &&
    !sidebar.includes("[direction:ltr]") &&
    !sidebar.includes('direction = "ltr"'),
  "Sidebar must inherit direction at first paint while preserving its physical-side layout axis.",
);

const directionCapability = parity.capabilities.find(
  (capability) => capability.id === "direction-localization",
);
const directionDisposition = parity.issueDispositions.find((item) => item.issue === 342);
const directionSequence = parity.sequence.find((item) => item.id === "shared-direction-contract");
for (const [name, dependencies] of [
  ["capability", directionCapability?.dependencies],
  ["issue disposition", directionDisposition?.dependsOn],
  ["sequence", directionSequence?.dependsOn],
]) {
  requireValue(
    Array.isArray(dependencies) && dependencies.includes(341) && !dependencies.includes(151),
    `#342 ${name} dependencies must include #341 and exclude #151.`,
  );
}

if (failures.length > 0) {
  throw new Error(`Direction/localization validation failed:\n- ${failures.join("\n- ")}`);
}

console.log(
  `Direction/localization contract verified for ${contract.auditedComponents.length} audited surfaces.`,
);
