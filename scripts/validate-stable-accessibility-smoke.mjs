import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parsePathOptions } from "./validator-options.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const expectPass = process.argv.includes("--expect-pass");
const args = process.argv.slice(2).filter((argument) => argument !== "--expect-pass");
const { "--record": recordPath } = parsePathOptions(args, {
  "--record": resolve(root, "quality/stable-accessibility-smoke.json"),
});

const requiredEnvironmentIds = [
  "macos-safari-voiceover",
  "macos-chromium-keyboard",
  "zoom-reflow-contrast",
  "mobile-touch",
];
const requiredScenarioIds = [
  "docs-navigation",
  "forms-and-native-controls",
  "overlays-and-focus",
  "calendar-and-date-picker",
  "feedback-and-status",
  "responsive-touch-and-reflow",
];
const evidenceFields = [
  "operatingSystem",
  "browser",
  "assistiveTechnology",
  "device",
  "viewport",
  "zoom",
  "notes",
];
const allowedResults = ["Pending", "Pass", "Fail", "Blocked"];
const errors = [];

let record;
try {
  record = JSON.parse(await readFile(recordPath, "utf8"));
} catch (error) {
  errors.push(`Stable accessibility smoke record must be readable JSON: ${error.message}`);
  record = {};
}

const isIsoUtc = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) &&
  Number.isFinite(Date.parse(value));
const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;
const isEvidenceUrl = (value) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

function validateExactRows(rows, requiredIds, label) {
  if (!Array.isArray(rows)) {
    errors.push(`${label} must be an array.`);
    return [];
  }
  const ids = rows.map((row) => row?.id).filter(Boolean);
  const missing = requiredIds.filter((id) => !ids.includes(id));
  const unexpected = ids.filter((id) => !requiredIds.includes(id));
  if (missing.length) errors.push(`${label} is missing: ${missing.join(", ")}.`);
  if (unexpected.length) errors.push(`${label} has unexpected entries: ${unexpected.join(", ")}.`);
  if (new Set(ids).size !== ids.length) errors.push(`${label} IDs must be unique.`);
  return rows;
}

function validateEvidence(row, prefix, complete) {
  if (!allowedResults.includes(row?.result)) {
    errors.push(`${prefix}.result must be one of: ${allowedResults.join(", ")}.`);
  }
  if (!Array.isArray(row?.evidence) || !row.evidence.every(isEvidenceUrl)) {
    errors.push(`${prefix}.evidence must contain only HTTPS URLs.`);
  } else if (complete && row.evidence.length === 0) {
    errors.push(`${prefix}.evidence requires at least one URL when complete.`);
  }
  if (complete && row?.result !== "Pass") {
    errors.push(`${prefix}.result must be Pass for a release-ready smoke.`);
  }
}

if (record.schemaVersion !== 1) errors.push("schemaVersion must equal 1.");
if (!["evidence-pending", "complete"].includes(record.status)) {
  errors.push('status must be "evidence-pending" or "complete".');
}
if (record.trackingIssue !== 143) errors.push("trackingIssue must remain issue #143.");
if (expectPass && record.status !== "complete") {
  errors.push('Strict stable accessibility validation requires status "complete".');
}

const candidate = record.candidate ?? {};
if (candidate.version !== "1.0.0") errors.push("candidate.version must equal 1.0.0.");
if (record.status === "evidence-pending") {
  if (candidate.commit !== null || candidate.deployment !== null || candidate.recordedAt !== null) {
    errors.push(
      "Pending smoke evidence must not claim a candidate commit, deployment, or timestamp.",
    );
  }
} else {
  if (!/^[0-9a-f]{40}$/.test(candidate.commit ?? "")) {
    errors.push("Completed smoke candidate.commit must be an exact lowercase 40-character SHA.");
  } else {
    const object = spawnSync("git", ["cat-file", "-e", `${candidate.commit}^{commit}`], {
      cwd: root,
    });
    const ancestry = spawnSync("git", ["merge-base", "--is-ancestor", candidate.commit, "HEAD"], {
      cwd: root,
    });
    if (object.status !== 0 || ancestry.status !== 0) {
      errors.push("Completed smoke candidate.commit must be contained by the current history.");
    }
  }
  if (!isEvidenceUrl(candidate.deployment)) {
    errors.push("Completed smoke candidate.deployment must be an HTTPS URL.");
  }
  if (!isIsoUtc(candidate.recordedAt)) {
    errors.push("Completed smoke candidate.recordedAt must be an ISO UTC timestamp.");
  } else if (Date.parse(candidate.recordedAt) > Date.now()) {
    errors.push("Completed smoke candidate.recordedAt cannot be in the future.");
  }
}

const complete = record.status === "complete";
const environments = validateExactRows(record.environments, requiredEnvironmentIds, "Environments");
for (const [index, environment] of environments.entries()) {
  const prefix = `environments[${index}]`;
  validateEvidence(environment, prefix, complete);
  for (const field of evidenceFields) {
    if (complete && !nonEmpty(environment?.[field])) {
      errors.push(`${prefix}.${field} is required when complete.`);
    }
  }
}

const scenarios = validateExactRows(record.scenarios, requiredScenarioIds, "Scenarios");
for (const [index, scenario] of scenarios.entries()) {
  const prefix = `scenarios[${index}]`;
  validateEvidence(scenario, prefix, complete);
  if (complete && !nonEmpty(scenario?.notes)) {
    errors.push(`${prefix}.notes is required when complete.`);
  }
}

const findings = Array.isArray(record.findings) ? record.findings : [];
if (!Array.isArray(record.findings)) errors.push("findings must be an array.");
for (const [index, finding] of findings.entries()) {
  const prefix = `findings[${index}]`;
  if (!/^https:\/\/github\.com\/vpavlov-me\/Nerio\/issues\/\d+$/.test(finding?.issue ?? "")) {
    errors.push(`${prefix}.issue must be an exact Nerio GitHub issue URL.`);
  }
  if (!["P0", "P1", "P2", "P3"].includes(finding?.severity)) {
    errors.push(`${prefix}.severity must be P0, P1, P2, or P3.`);
  }
  if (!["resolved", "accepted", "rejected"].includes(finding?.disposition)) {
    errors.push(`${prefix}.disposition must be resolved, accepted, or rejected.`);
  }
  if (!["blocking", "non-blocking"].includes(finding?.releaseImpact)) {
    errors.push(`${prefix}.releaseImpact must be blocking or non-blocking.`);
  }
  if (!nonEmpty(finding?.summary)) errors.push(`${prefix}.summary is required.`);
}

const unresolvedBlocker = findings.some(
  (finding) =>
    finding?.disposition === "accepted" &&
    (finding?.releaseImpact === "blocking" || ["P0", "P1"].includes(finding?.severity)),
);
const decision = record.decision ?? {};
if (record.status === "evidence-pending") {
  if (decision.recommendation !== "pending" || decision.recordedAt !== null) {
    errors.push("Pending smoke decision must remain pending without a recorded timestamp.");
  }
} else {
  if (!["release-ready", "blocked-before-stable"].includes(decision.recommendation)) {
    errors.push("Completed smoke decision must be release-ready or blocked-before-stable.");
  }
  if (!isIsoUtc(decision.recordedAt)) {
    errors.push("Completed smoke decision.recordedAt must be an ISO UTC timestamp.");
  } else if (Date.parse(decision.recordedAt) > Date.now()) {
    errors.push("Completed smoke decision.recordedAt cannot be in the future.");
  }
  if (!nonEmpty(decision.summary)) errors.push("Completed smoke decision.summary is required.");
  if (decision.recommendation === "release-ready" && unresolvedBlocker) {
    errors.push("A release-ready decision cannot contain an unresolved accepted blocker.");
  }
}
if (expectPass && decision.recommendation !== "release-ready") {
  errors.push('Strict stable accessibility validation requires recommendation "release-ready".');
}

if (errors.length) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  console.log(
    complete
      ? "Scoped stable accessibility smoke is complete and internally approved."
      : "Scoped stable accessibility smoke record is valid and evidence remains pending.",
  );
}
