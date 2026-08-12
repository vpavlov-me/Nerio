import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const plan = JSON.parse(await readFile(resolve(root, "quality/manual-audit-plan.json"), "utf8"));

const environmentFlagIndex = process.argv.indexOf("--environment");
const environmentId =
  environmentFlagIndex === -1 ? undefined : process.argv[environmentFlagIndex + 1];

if (!environmentId) {
  console.log("Usage: pnpm manual-audit:checklist -- --environment <environment-id>");
  console.log("\nAvailable environments:");
  for (const environment of plan.requiredEnvironments) {
    console.log(`- ${environment.id}: ${environment.label}`);
  }
  process.exit(0);
}

const environment = plan.requiredEnvironments.find(({ id }) => id === environmentId);
if (!environment) {
  console.error(`Unknown manual audit environment: ${environmentId}`);
  process.exit(1);
}

const scenarios = plan.scenarios.filter(({ environments }) => environments.includes(environmentId));

const lines = [
  `# Nerio Core 1.0 manual audit: ${environment.label}`,
  "",
  `- Environment ID: \`${environment.id}\``,
  "- Candidate commit: `<exact SHA>`",
  "- Candidate URL: `<GitHub commit URL>`",
  "- Audit route base URL: `<exact Vercel deployment URL>`",
  "- Date and time: `<ISO timestamp>`",
  "- Tester: `<name or participant ID>`",
  "- Operating system: `<name and exact version>`",
  "- Browser: `<name and exact version>`",
  "- Assistive technology: `<name and exact version, or not applicable>`",
  "- Device: `<exact model>`",
  "- Viewport: `<CSS pixels>`",
  "- Zoom: `<value>`",
  "- Package/source mode: `<mode actually used>`",
  "",
  "Use only `Pass`, `Fail`, or `Blocked`. Add one concrete observation for every result.",
  "A single GitHub comment containing this completed checklist may be reused as the HTTPS evidence link for every result in this environment.",
  "",
];

for (const [index, scenario] of scenarios.entries()) {
  lines.push(
    `## ${index + 1}. ${scenario.title}`,
    "",
    `- Scenario ID: \`${scenario.id}\``,
    `- Route: \`${scenario.route}\``,
    "- Result: `<Pass | Fail | Blocked>`",
    "- Notes: `<what happened, including focus or announcement details>`",
    "",
    "Steps:",
    "",
    ...scenario.steps.map((step) => `1. ${step}`),
    "",
    "Expected:",
    "",
    ...scenario.expected.map((expectation) => `- ${expectation}`),
    "",
  );
}

lines.push(
  "## Environment decision",
  "",
  "- Result: `<Pass | Fail | Blocked>`",
  "- Summary: `<what was covered and any limitations>`",
  "- Finding issues: `<Nerio issue URLs or None recorded>`",
  "",
);

console.log(lines.join("\n"));
