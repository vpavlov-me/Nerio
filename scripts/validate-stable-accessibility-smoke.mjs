import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parsePathOptions } from "./validator-options.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const expectPass = process.argv.includes("--expect-pass");
const args = process.argv.slice(2).filter((argument) => argument !== "--expect-pass");
const {
  "--record": recordPath,
  "--release-metadata": releaseMetadataPath,
  "--packages-root": packagesRoot,
} = parsePathOptions(args, {
  "--record": resolve(root, "quality/stable-accessibility-smoke.json"),
  "--release-metadata": resolve(root, "quality/release-metadata.json"),
  "--packages-root": resolve(root, "packages"),
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
const allowedPostCandidateEvidencePaths = new Set([
  "docs/audits/core-1-0-stable-accessibility-smoke.md",
  "quality/stable-accessibility-smoke.json",
]);
const coordinatedPackages = ["tokens", "adapters", "registry", "ui", "cli", "mcp"];
const concreteMacDevicePattern =
  /\b(?:MacBook\s+(?:Air|Pro)\b.*\d|Mac (?:mini|Studio|Pro)\b.*(?:M\d|\d{4})|iMac\b.*(?:M\d|\d{2,4}))/i;
const concreteDesktopDevicePattern =
  /\b(?:(?:MacBook\s+(?:Air|Pro)|Mac (?:mini|Studio|Pro)|iMac)\b.*\d|(?!(?:desktop|laptop|computer|hardware|machine|PC)\b)(?:[A-Za-z][A-Za-z0-9-]*\s+){1,5}(?:[A-Za-z]*\d[A-Za-z0-9-]*|\d{2,4}))\b/i;
const concreteAppleMobileDevicePattern =
  /^(?:iPhone|iPad)\s+(?!(?:emulator|simulator|virtual)\b)[A-Za-z0-9][A-Za-z0-9 .()+_-]{1,60}$/i;
const concreteAndroidMobileDevicePattern =
  /^(?!.*\b(?:iPhone|iPad|MacBook|Mac mini|Mac Studio|Mac Pro|iMac|desktop|laptop|computer|hardware|machine|test device|sample device|generic device|emulator|simulator|virtual)\b)(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9][A-Za-z0-9 .()+_-]{2,79}$/i;
const environmentMetadataRequirements = {
  "macos-safari-voiceover": {
    operatingSystem: /\bmacOS\b.*\d/i,
    browser: /\bSafari\b.*\d/i,
    assistiveTechnology: /\bVoiceOver\b/i,
    device: concreteMacDevicePattern,
  },
  "macos-chromium-keyboard": {
    operatingSystem: /\bmacOS\b.*\d/i,
    browser: /\b(?:Chrome|Chromium|Edge)\b.*\d/i,
    assistiveTechnology: /keyboard[- ]only/i,
    device: concreteMacDevicePattern,
  },
  "zoom-reflow-contrast": {
    operatingSystem: /\b(?:macOS|Windows|Linux)\b.*\d/i,
    browser: /\b(?:Safari|Chrome|Chromium|Firefox|Edge)\b.*\d/i,
    device: concreteDesktopDevicePattern,
  },
  "mobile-touch": {
    operatingSystem: /\b(?:iOS|iPadOS|Android)\b.*\d/i,
    browser: /\b(?:Safari|Chrome|Chromium|Firefox|Edge)\b.*\d/i,
  },
};
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
const negatedSetupPattern = /\b(?:not|never|without|disabled|off|untested|skipped)\b/i;
const hasRequiredZoom = (value) =>
  typeof value === "string" &&
  /\b200%/.test(value) &&
  /\b400%/.test(value) &&
  !/\b(?:not|never|without|skipped|untested)\b[^.;\n]{0,32}(?:200%|400%)|(?:200%|400%)[^.;\n]{0,32}\b(?:not|never|without|skipped|untested)\b/i.test(
    value,
  );
const hasEnabledContrast = (value) =>
  typeof value === "string" &&
  /\b(?:high|increased|increase) contrast\b.*\b(?:enabled|active|on)\b|\b(?:enabled|active|on)\b.*\b(?:high|increased|increase) contrast\b/i.test(
    value,
  ) &&
  !/\b(?:not|never|without)\b[^.;\n]{0,40}\b(?:high|increased|increase) contrast\b|\b(?:high|increased|increase) contrast\b[^.;\n]{0,40}(?:\b(?:not|never|without)\b[^.;\n]{0,24}\b(?:enabled|active|on)\b|\b(?:disabled|off)\b)/i.test(
    value,
  );
const hasPhysicalTouchClaim = (value) =>
  typeof value === "string" &&
  /\bphysical(?:\s+mobile)?\s+(?:touch\s+)?device\b|\bphysical\s+(?:phone|tablet)\b|\bphysical\b[^.;\n]{0,32}\btouch\b/i.test(
    value,
  ) &&
  !/\b(?:not|never|without)\b[^.;\n]{0,32}\bphysical\b|\bphysical(?:\s+mobile)?\s+(?:touch\s+)?device\b[^.;\n]{0,24}\b(?:was|is)?\s*(?:not|never)\s+(?:used|available|tested)\b/i.test(
    value,
  );
const hasNonNegatedVirtualMention = (value) => {
  if (typeof value !== "string") return false;
  const matches = value.matchAll(/\b(?:emulator|simulator|virtual(?:\s+device)?)\b/gi);
  return [...matches].some((match) => {
    const before = value.slice(Math.max(0, match.index - 32), match.index);
    const after = value.slice(match.index + match[0].length, match.index + match[0].length + 32);
    const negatedBefore = /\b(?:no|not|never|without)\b[^.;\n]{0,24}$/i.test(before);
    const negatedAfter = /^\s*(?:was|is)?\s*(?:not|never)\s+(?:used|involved|present)\b/i.test(
      after,
    );
    return !negatedBefore && !negatedAfter;
  });
};
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
    } else {
      const changedPaths = spawnSync("git", ["diff", "--name-only", `${candidate.commit}..HEAD`], {
        cwd: root,
        encoding: "utf8",
      });
      const changedPathOutput = typeof changedPaths.stdout === "string" ? changedPaths.stdout : "";
      const disallowedPaths = changedPathOutput
        .split("\n")
        .filter(Boolean)
        .filter((path) => !allowedPostCandidateEvidencePaths.has(path));
      if (changedPaths.status !== 0 || disallowedPaths.length > 0) {
        errors.push(
          `Completed smoke candidate is stale after non-evidence changes: ${disallowedPaths.join(", ") || "unable to inspect candidate diff"}.`,
        );
      }
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
if (complete) {
  let releaseMetadata;
  try {
    releaseMetadata = JSON.parse(await readFile(releaseMetadataPath, "utf8"));
  } catch (error) {
    errors.push(`Release metadata must be readable JSON: ${error.message}`);
  }

  if (releaseMetadata) {
    if (releaseMetadata.channel !== "stable") {
      errors.push('Completed stable smoke requires release metadata channel "stable".');
    }
    if (candidate.version !== releaseMetadata.coreVersion) {
      errors.push(
        `Completed smoke candidate.version must match release metadata coreVersion ${releaseMetadata.coreVersion}.`,
      );
    }
    for (const field of ["registryVersion", "publicInstallationVersion"]) {
      if (releaseMetadata[field] !== candidate.version) {
        errors.push(
          `Release metadata ${field} must match completed smoke candidate.version ${candidate.version}.`,
        );
      }
    }

    for (const packageDirectory of coordinatedPackages) {
      const manifestPath = join(packagesRoot, packageDirectory, "package.json");
      try {
        const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
        if (manifest.version !== candidate.version) {
          errors.push(
            `${manifestPath} version must match completed smoke candidate.version ${candidate.version}.`,
          );
        }
      } catch (error) {
        errors.push(`Coordinated package manifest must be readable JSON: ${error.message}`);
      }
    }
  }
}

const environments = validateExactRows(record.environments, requiredEnvironmentIds, "Environments");
for (const [index, environment] of environments.entries()) {
  const prefix = `environments[${index}]`;
  validateEvidence(environment, prefix, complete);
  for (const field of evidenceFields) {
    if (complete && !nonEmpty(environment?.[field])) {
      errors.push(`${prefix}.${field} is required when complete.`);
    }
  }
  if (complete) {
    const requirements = environmentMetadataRequirements[environment?.id] ?? {};
    for (const [field, pattern] of Object.entries(requirements)) {
      const value = environment?.[field];
      const negated =
        ["operatingSystem", "browser", "assistiveTechnology"].includes(field) &&
        negatedSetupPattern.test(value);
      if (nonEmpty(value) && (!pattern.test(value.trim()) || negated)) {
        errors.push(`${prefix}.${field} does not match the required ${environment.id} setup.`);
      }
    }
    if (environment?.id === "zoom-reflow-contrast" && !hasRequiredZoom(environment.zoom)) {
      errors.push(`${prefix}.zoom must confirm both 200% and 400% without negation.`);
    }
    if (environment?.id === "zoom-reflow-contrast" && !hasEnabledContrast(environment.notes)) {
      errors.push(`${prefix}.notes must confirm increased or high contrast was enabled.`);
    }
    if (
      environment?.id === "mobile-touch" &&
      (/\b(?:emulator|simulator|virtual(?:\s+device)?)\b/i.test(environment.device ?? "") ||
        hasNonNegatedVirtualMention(environment.notes))
    ) {
      errors.push(`${prefix} must use a physical mobile touch device, not an emulator.`);
    }
    if (environment?.id === "mobile-touch" && !hasPhysicalTouchClaim(environment.notes)) {
      errors.push(`${prefix}.notes must affirm use of a physical mobile touch device.`);
    }
    if (environment?.id === "mobile-touch") {
      const operatingSystem = environment.operatingSystem ?? "";
      const device = environment.device?.trim() ?? "";
      const deviceMatchesOperatingSystem = /\b(?:iOS|iPadOS)\b/i.test(operatingSystem)
        ? concreteAppleMobileDevicePattern.test(device)
        : /\bAndroid\b/i.test(operatingSystem)
          ? concreteAndroidMobileDevicePattern.test(device)
          : false;
      if (!deviceMatchesOperatingSystem) {
        errors.push(
          `${prefix}.device must be a concrete physical model for its recorded mobile OS.`,
        );
      }
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
