import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parsePathOptions } from "./validator-options.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const requiredEnvironmentIds = [
  "macos-safari-voiceover",
  "macos-chromium-keyboard",
  "windows-nvda",
  "ios-safari-voiceover",
  "android-chrome-talkback",
  "zoom-reflow",
  "reduced-motion",
  "high-contrast",
];

const requiredEvidenceFields = [
  "operatingSystem",
  "browser",
  "assistiveTechnology",
  "device",
  "viewport",
  "zoom",
  "packageMode",
  "result",
  "notes",
];

const requiredSurfaces = [
  "global",
  "actions-forms",
  "data-feedback",
  "navigation-overlays",
  "runtime-axes",
];

const requiredComponents = [
  "temporal-input",
  "slider",
  "file-input",
  "calendar",
  "date-picker",
  "table",
  "toast",
  "command",
  "sidebar",
  "dialog",
  "sheet",
  "popover",
  "tooltip",
  "dropdown-menu",
  "motion-adapter",
];

const paths = parsePathOptions(process.argv.slice(2), {
  "--plan": resolve(root, "quality/manual-audit-plan.json"),
  "--report": resolve(root, "docs/audits/core-1-0-accessibility-device-audit.md"),
});

const [planSource, report] = await Promise.all([
  readFile(paths["--plan"], "utf8"),
  readFile(paths["--report"], "utf8"),
]);

const errors = [];
let plan;

try {
  plan = JSON.parse(planSource);
} catch (error) {
  errors.push(`Manual audit plan is not valid JSON: ${error.message}`);
}

function addMissing(label, required, actual) {
  const actualSet = new Set(actual);
  const missing = required.filter((value) => !actualSet.has(value));
  if (missing.length) errors.push(`${label} is missing: ${missing.join(", ")}`);
}

if (plan) {
  if (plan.issue !== 143) errors.push("Manual audit plan must target issue #143.");
  if (plan.status !== "manual-evidence-pending") {
    errors.push(
      "Manual audit plan must keep status manual-evidence-pending until human evidence exists.",
    );
  }

  const environments = Array.isArray(plan.requiredEnvironments) ? plan.requiredEnvironments : [];
  const environmentIds = environments.map((environment) => environment?.id).filter(Boolean);
  addMissing("Required environments", requiredEnvironmentIds, environmentIds);

  if (new Set(environmentIds).size !== environmentIds.length) {
    errors.push("Required environment IDs must be unique.");
  }

  for (const environment of environments) {
    if (!environment?.id || !environment?.label) {
      errors.push("Every required environment must include a non-empty id and label.");
    }
  }

  const evidenceFields = Array.isArray(plan.requiredEvidenceFields)
    ? plan.requiredEvidenceFields
    : [];
  addMissing("Required evidence fields", requiredEvidenceFields, evidenceFields);

  const scenarios = Array.isArray(plan.scenarios) ? plan.scenarios : [];
  if (!scenarios.length) errors.push("Manual audit plan must include scenarios.");

  const scenarioIds = scenarios.map((scenario) => scenario?.id).filter(Boolean);
  if (new Set(scenarioIds).size !== scenarioIds.length) {
    errors.push("Manual audit scenario IDs must be unique.");
  }

  const coveredSurfaces = [];
  const coveredComponents = [];

  for (const scenario of scenarios) {
    const prefix = scenario?.id ? `Scenario ${scenario.id}` : "Scenario without an id";
    if (!scenario?.id || !scenario?.title) {
      errors.push(`${prefix} must include a non-empty id and title.`);
    }
    if (typeof scenario?.route !== "string" || !scenario.route.startsWith("/")) {
      errors.push(`${prefix} must include an absolute same-origin route.`);
    }

    for (const key of ["surfaces", "components", "environments", "steps", "expected"]) {
      if (!Array.isArray(scenario?.[key]) || !scenario[key].length) {
        errors.push(`${prefix} must include a non-empty ${key} array.`);
      }
    }

    coveredSurfaces.push(...(scenario?.surfaces ?? []));
    coveredComponents.push(...(scenario?.components ?? []));

    for (const environmentId of scenario?.environments ?? []) {
      if (!requiredEnvironmentIds.includes(environmentId)) {
        errors.push(`${prefix} references unknown environment ${environmentId}.`);
      }
    }

    if (scenario?.id && !report.includes(`\`${scenario.id}\``)) {
      errors.push(`Audit report is missing scenario ${scenario.id}.`);
    }
  }

  addMissing("Scenario surface coverage", requiredSurfaces, coveredSurfaces);
  addMissing("Scenario component coverage", requiredComponents, coveredComponents);

  for (const environmentId of requiredEnvironmentIds) {
    if (!report.includes(`\`${environmentId}\``)) {
      errors.push(`Audit report is missing environment ${environmentId}.`);
    }
  }
}

for (const requiredText of [
  "Status: **Prepared — manual evidence pending**",
  "Candidate commit: **Pending**",
  "Final decision: **Pending**",
  "**Pass for real consumer pilots**",
  "**Blocked before pilots**",
  "Never replace missing human evidence with an automated test result.",
]) {
  if (!report.includes(requiredText)) {
    errors.push(`Audit report is missing required pending-state text: ${requiredText}`);
  }
}

if (errors.length) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  console.log(
    `Manual audit plan is ready: ${plan.scenarios.length} scenarios, ${plan.requiredEnvironments.length} required environments, manual evidence still pending.`,
  );
}
