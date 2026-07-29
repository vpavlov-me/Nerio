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
const requiredScenarioIds = [
  "global-docs-navigation",
  "global-demo-responsive",
  "actions-buttons-toggle",
  "forms-labels-validation",
  "native-temporal-inputs",
  "slider-input",
  "file-input-picker",
  "calendar-grid",
  "date-picker-composition",
  "table-semantics-overflow",
  "item-semantics-states",
  "feedback-status-states",
  "toast-announcements",
  "tabs-orientation-rtl",
  "breadcrumbs-current",
  "pagination-current-disabled",
  "command-live-states",
  "sidebar-collapse",
  "sidebar-mobile-sheet",
  "overlay-focus-dismissal",
  "motion-adapter-reduced-motion",
  "runtime-axes-motion-contrast",
];
const allowedStatuses = ["manual-evidence-pending", "complete"];
const allowedEvidenceResults = ["Pass", "Fail", "Blocked", "Not applicable"];
const environmentEvidenceFields = requiredEvidenceFields.filter(
  (field) => field !== "result" && field !== "notes",
);

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

function isSubstantiveString(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    !["pending", "not run", "recorded", "none recorded"].includes(value.trim().toLowerCase())
  );
}

function validateEvidenceLinks(label, evidence) {
  if (!Array.isArray(evidence) || !evidence.length) {
    errors.push(`${label} must include at least one evidence link.`);
    return;
  }
  if (evidence.some((link) => typeof link !== "string" || !/^https:\/\//.test(link))) {
    errors.push(`${label} evidence links must use https URLs.`);
  }
}

if (plan) {
  if (plan.issue !== 143) errors.push("Manual audit plan must target issue #143.");
  if (!allowedStatuses.includes(plan.status)) {
    errors.push(`Manual audit plan status must be one of: ${allowedStatuses.join(", ")}.`);
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
  addMissing("Required audit scenarios", requiredScenarioIds, scenarioIds);
  const unexpectedScenarioIds = scenarioIds.filter((id) => !requiredScenarioIds.includes(id));
  if (unexpectedScenarioIds.length) {
    errors.push(`Manual audit plan has unexpected scenarios: ${unexpectedScenarioIds.join(", ")}`);
  }
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
    if (new Set(scenario?.environments ?? []).size !== (scenario?.environments ?? []).length) {
      errors.push(`${prefix} environment IDs must be unique.`);
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
  "**Pass for real consumer pilots**",
  "**Blocked before pilots**",
  "Never replace missing human evidence with an automated test result.",
]) {
  if (!report.includes(requiredText)) {
    errors.push(`Audit report is missing required pending-state text: ${requiredText}`);
  }
}

if (plan?.status === "manual-evidence-pending") {
  for (const requiredText of [
    "Status: **Prepared — manual evidence pending**",
    "Candidate commit: **Pending**",
    "Final decision: **Pending**",
  ]) {
    if (!report.includes(requiredText)) {
      errors.push(`Audit report is missing required pending-state text: ${requiredText}`);
    }
  }
}

if (plan?.status === "complete") {
  if (!report.includes("Status: **Complete**")) {
    errors.push("Completed audit report must declare Status: **Complete**.");
  }
  const reportCommit = report.match(/^- Candidate commit: \*\*([0-9a-f]{40})\*\*$/m)?.[1];
  if (!reportCommit) {
    errors.push("Completed audit report must record a 40-character candidate commit.");
  }
  if (
    !/^- Final decision: \*\*(Pass for real consumer pilots|Blocked before pilots)\*\*$/m.test(
      report,
    )
  ) {
    errors.push("Completed audit report must record one allowed final decision.");
  }
  if (/^\|.*\|\s*(Not run|Pending)\s*\|/m.test(report) || /\|\s*Pending\s*\|/m.test(report)) {
    errors.push("Completed audit report must not leave pending or not-run table evidence.");
  }

  const completion = plan.completion;
  const candidate = completion?.candidate;
  if (!candidate || typeof candidate !== "object") {
    errors.push("Completed audit plan must include completion.candidate evidence.");
  } else {
    if (!/^[0-9a-f]{40}$/.test(candidate.commit ?? "")) {
      errors.push("Completed audit plan candidate must include a 40-character commit.");
    } else if (reportCommit && candidate.commit !== reportCommit) {
      errors.push("Completed audit plan and report candidate commits must match.");
    }
    for (const field of ["githubVerification", "ciRun", "vercelDeployment"]) {
      if (typeof candidate[field] !== "string" || !/^https:\/\//.test(candidate[field])) {
        errors.push(`Completed audit candidate ${field} must be an https URL.`);
      }
    }
    if (!isSubstantiveString(candidate.auditOwner)) {
      errors.push("Completed audit candidate must name the audit owner.");
    }
    if (
      !isSubstantiveString(candidate.auditStartedAt) ||
      Number.isNaN(Date.parse(candidate.auditStartedAt))
    ) {
      errors.push("Completed audit candidate must include a valid auditStartedAt timestamp.");
    }
  }

  const completedEnvironments = Array.isArray(completion?.environments)
    ? completion.environments
    : [];
  const completedEnvironmentIds = completedEnvironments
    .map((environment) => environment?.id)
    .filter(Boolean);
  addMissing(
    "Completed audit environment evidence",
    requiredEnvironmentIds,
    completedEnvironmentIds,
  );
  if (new Set(completedEnvironmentIds).size !== completedEnvironmentIds.length) {
    errors.push("Completed audit environment evidence IDs must be unique.");
  }
  for (const environment of completedEnvironments) {
    const label = `Completed environment ${environment?.id ?? "without an id"}`;
    for (const field of environmentEvidenceFields) {
      if (!isSubstantiveString(environment?.[field])) {
        errors.push(`${label} must include substantive ${field} evidence.`);
      }
    }
  }

  const completedResults = Array.isArray(completion?.results) ? completion.results : [];
  const expectedResultIds = (plan.scenarios ?? []).flatMap((scenario) =>
    (scenario.environments ?? []).map((environmentId) => `${scenario.id}::${environmentId}`),
  );
  const completedResultIds = completedResults.map(
    (result) => `${result?.scenarioId}::${result?.environmentId}`,
  );
  addMissing("Completed scenario-environment evidence", expectedResultIds, completedResultIds);
  const unexpectedResultIds = completedResultIds.filter((id) => !expectedResultIds.includes(id));
  if (unexpectedResultIds.length) {
    errors.push(
      `Completed audit has unexpected scenario-environment evidence: ${unexpectedResultIds.join(", ")}`,
    );
  }
  if (new Set(completedResultIds).size !== completedResultIds.length) {
    errors.push("Completed scenario-environment evidence records must be unique.");
  }
  for (const result of completedResults) {
    const label = `Completed result ${result?.scenarioId ?? "unknown"}::${
      result?.environmentId ?? "unknown"
    }`;
    if (!allowedEvidenceResults.includes(result?.result)) {
      errors.push(`${label} must use one of: ${allowedEvidenceResults.join(", ")}.`);
    }
    if (!isSubstantiveString(result?.notes)) {
      errors.push(`${label} must include substantive notes.`);
    }
    validateEvidenceLinks(label, result?.evidence);
  }
}

if (errors.length) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  const state =
    plan.status === "complete" ? "manual evidence complete" : "manual evidence still pending";
  console.log(
    `Manual audit plan is ready: ${plan.scenarios.length} scenarios, ${plan.requiredEnvironments.length} required environments, ${state}.`,
  );
}
