import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parsePathOptions } from "./validator-options.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const expectComplete = process.argv.includes("--expect-complete");
const args = process.argv.slice(2).filter((argument) => argument !== "--expect-complete");
const { "--record": recordPath } = parsePathOptions(args, {
  "--record": resolve(root, "quality/beta-feedback.json"),
});

const errors = [];
let record;
try {
  record = JSON.parse(await readFile(recordPath, "utf8"));
} catch (error) {
  errors.push(`Beta feedback record must be readable JSON: ${error.message}`);
  record = {};
}

const isIsoUtc = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) &&
  Number.isFinite(Date.parse(value));
const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;
const isEvidenceUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
};

if (record.schemaVersion !== 1) errors.push("schemaVersion must equal 1.");
if (!["evidence-pending", "complete"].includes(record.status)) {
  errors.push('status must be "evidence-pending" or "complete".');
}
if (record.trackingIssue !== 146) errors.push("trackingIssue must remain issue #146.");

const candidate = record.candidate ?? {};
if (!/^\d+\.\d+\.\d+-beta\.\d+$/.test(candidate.version ?? "")) {
  errors.push("candidate.version must be an exact beta SemVer.");
}
if (!/^[0-9a-f]{40}$/.test(candidate.commit ?? "")) {
  errors.push("candidate.commit must be an exact lowercase 40-character SHA.");
} else {
  const object = spawnSync("git", ["cat-file", "-e", `${candidate.commit}^{commit}`], {
    cwd: root,
  });
  const ancestry = spawnSync("git", ["merge-base", "--is-ancestor", candidate.commit, "HEAD"], {
    cwd: root,
  });
  if (object.status !== 0 || ancestry.status !== 0) {
    errors.push("candidate.commit must be a repository commit contained by the current history.");
  }
}
for (const field of ["windowOpenedAt", "earliestCloseAt"]) {
  if (!isIsoUtc(candidate[field])) errors.push(`candidate.${field} must be an ISO UTC timestamp.`);
}
if (
  isIsoUtc(candidate.windowOpenedAt) &&
  isIsoUtc(candidate.earliestCloseAt) &&
  Date.parse(candidate.earliestCloseAt) - Date.parse(candidate.windowOpenedAt) <
    14 * 24 * 60 * 60 * 1000
) {
  errors.push("The beta feedback window must remain open for at least 14 calendar days.");
}

const consumers = Array.isArray(record.consumers) ? record.consumers : [];
const findings = Array.isArray(record.findings) ? record.findings : [];
if (!Array.isArray(record.consumers)) errors.push("consumers must be an array.");
if (!Array.isArray(record.findings)) errors.push("findings must be an array.");

if (record.status === "evidence-pending") {
  if (consumers.length > 0 || findings.length > 0) {
    errors.push("Pending feedback must not contain unvalidated consumer or finding evidence.");
  }
  if (record.decision?.recommendation !== "pending") {
    errors.push('Pending feedback decision.recommendation must be "pending".');
  }
  if (candidate.closedAt !== null || record.decision?.recordedAt !== null) {
    errors.push("Pending feedback must not record completion timestamps.");
  }
}

if (expectComplete && record.status !== "complete") {
  errors.push('Strict beta feedback validation requires status "complete".');
}

if (record.status === "complete") {
  if (!isIsoUtc(candidate.closedAt)) {
    errors.push("Completed feedback candidate.closedAt must be an ISO UTC timestamp.");
  } else if (
    isIsoUtc(candidate.earliestCloseAt) &&
    Date.parse(candidate.closedAt) < Date.parse(candidate.earliestCloseAt)
  ) {
    errors.push("Completed feedback cannot close before candidate.earliestCloseAt.");
  }
  if (consumers.length < 3) errors.push("Completed feedback requires at least 3 consumers.");

  const ids = new Set();
  const roles = new Set();
  const modes = new Set();
  let calendarCovered = false;
  let registryCovered = false;
  for (const [index, consumer] of consumers.entries()) {
    const prefix = `consumers[${index}]`;
    if (!/^External-\d{2,}$/.test(consumer.id ?? "")) {
      errors.push(`${prefix}.id must be an anonymized External-NN identifier.`);
    } else if (ids.has(consumer.id)) {
      errors.push(`${prefix}.id must be unique.`);
    } else {
      ids.add(consumer.id);
    }
    if (!["designer", "engineer", "source-consumer"].includes(consumer.role)) {
      errors.push(`${prefix}.role must be designer, engineer, or source-consumer.`);
    } else {
      roles.add(consumer.role);
    }
    if (!nonEmpty(consumer.context)) errors.push(`${prefix}.context is required.`);
    if (!["package", "source", "both"].includes(consumer.mode)) {
      errors.push(`${prefix}.mode must be package, source, or both.`);
    } else {
      if (consumer.mode === "both") {
        modes.add("package");
        modes.add("source");
      } else {
        modes.add(consumer.mode);
      }
    }
    if (!isIsoUtc(consumer.completedAt)) {
      errors.push(`${prefix}.completedAt must be ISO UTC.`);
    } else if (
      isIsoUtc(candidate.windowOpenedAt) &&
      Date.parse(consumer.completedAt) < Date.parse(candidate.windowOpenedAt)
    ) {
      errors.push(`${prefix}.completedAt cannot predate the feedback window.`);
    }
    if (!Array.isArray(consumer.workflows) || consumer.workflows.length === 0) {
      errors.push(`${prefix}.workflows must record meaningful completed work.`);
    }
    if (!Array.isArray(consumer.evidence) || !consumer.evidence.every(isEvidenceUrl)) {
      errors.push(`${prefix}.evidence must contain only HTTPS evidence links.`);
    } else if (consumer.evidence.length === 0) {
      errors.push(`${prefix}.evidence requires at least one link.`);
    }
    calendarCovered ||= consumer.calendarAndDatePicker === true;
    registryCovered ||= consumer.registryDiffAndUpdate === true;
  }
  for (const role of ["designer", "engineer", "source-consumer"]) {
    if (!roles.has(role)) errors.push(`Completed feedback requires the ${role} role.`);
  }
  for (const mode of ["package", "source"]) {
    if (!modes.has(mode)) errors.push(`Completed feedback requires ${mode} mode coverage.`);
  }
  if (!calendarCovered)
    errors.push("Completed feedback requires Calendar and DatePicker coverage.");
  if (!registryCovered)
    errors.push("Completed feedback requires Registry diff and update coverage.");

  const findingIds = new Set();
  for (const [index, finding] of findings.entries()) {
    const prefix = `findings[${index}]`;
    if (!/^https:\/\/github\.com\/[^/]+\/[^/]+\/issues\/\d+$/.test(finding.issue ?? "")) {
      errors.push(`${prefix}.issue must be an exact GitHub issue URL.`);
    } else if (findingIds.has(finding.issue)) {
      errors.push(`${prefix}.issue must be unique.`);
    } else {
      findingIds.add(finding.issue);
    }
    if (!["P0", "P1", "P2", "P3"].includes(finding.severity)) {
      errors.push(`${prefix}.severity must be P0, P1, P2, or P3.`);
    }
    if (!["resolved", "rejected", "accepted"].includes(finding.disposition)) {
      errors.push(`${prefix}.disposition must be resolved, rejected, or accepted.`);
    }
    if (!["current-beta", "stable", "non-blocking"].includes(finding.releaseImpact)) {
      errors.push(`${prefix}.releaseImpact is invalid.`);
    }
    if (!nonEmpty(finding.summary)) errors.push(`${prefix}.summary is required.`);
  }

  const recommendation = record.decision?.recommendation;
  if (!["proceed-to-stable-docs", "blocked-before-stable"].includes(recommendation)) {
    errors.push("Completed feedback requires an allowed decision.recommendation.");
  }
  if (!isIsoUtc(record.decision?.recordedAt)) {
    errors.push("Completed feedback decision.recordedAt must be an ISO UTC timestamp.");
  } else if (
    isIsoUtc(candidate.closedAt) &&
    Date.parse(record.decision.recordedAt) < Date.parse(candidate.closedAt)
  ) {
    errors.push("Completed feedback decision cannot predate candidate.closedAt.");
  }
  if (!nonEmpty(record.decision?.summary)) {
    errors.push("Completed feedback decision.summary is required.");
  }
  const unresolvedBlocker = findings.some(
    (finding) =>
      finding.disposition === "accepted" &&
      (["P0", "P1"].includes(finding.severity) ||
        ["current-beta", "stable"].includes(finding.releaseImpact)),
  );
  if (recommendation === "proceed-to-stable-docs" && unresolvedBlocker) {
    errors.push("Proceeding to stable documentation cannot include an accepted stable blocker.");
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  console.log(
    record.status === "complete"
      ? `Beta feedback is complete: ${consumers.length} external consumers validated.`
      : "Beta feedback record is valid; external evidence remains pending and issue #146 stays open.",
  );
}
