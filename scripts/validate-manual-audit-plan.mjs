import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
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
  "sheet-mobile-modal",
  "overlay-focus-dismissal",
  "motion-adapter-reduced-motion",
  "runtime-axes-motion-contrast",
];
const requiredScenarioEnvironments = {
  "global-docs-navigation": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
  ],
  "global-demo-responsive": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
  ],
  "actions-buttons-toggle": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "high-contrast",
  ],
  "forms-labels-validation": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
    "high-contrast",
  ],
  "native-temporal-inputs": [
    "macos-safari-voiceover",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
  ],
  "slider-input": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "high-contrast",
  ],
  "file-input-picker": [
    "macos-safari-voiceover",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
  ],
  "calendar-grid": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
    "high-contrast",
  ],
  "date-picker-composition": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
  ],
  "table-semantics-overflow": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
  ],
  "item-semantics-states": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
  ],
  "feedback-status-states": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "reduced-motion",
    "high-contrast",
  ],
  "toast-announcements": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "reduced-motion",
    "high-contrast",
  ],
  "tabs-orientation-rtl": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
  ],
  "breadcrumbs-current": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
  ],
  "pagination-current-disabled": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
  ],
  "command-live-states": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
  ],
  "sidebar-collapse": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "zoom-reflow",
    "high-contrast",
  ],
  "sheet-mobile-modal": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
    "reduced-motion",
  ],
  "overlay-focus-dismissal": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
    "reduced-motion",
  ],
  "motion-adapter-reduced-motion": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "reduced-motion",
  ],
  "runtime-axes-motion-contrast": [
    "macos-safari-voiceover",
    "macos-chromium-keyboard",
    "windows-nvda",
    "ios-safari-voiceover",
    "android-chrome-talkback",
    "zoom-reflow",
    "reduced-motion",
    "high-contrast",
  ],
};
const requiredScenarioScopeHashes = {
  "global-docs-navigation": "fb41d8ad9148a0ae674cb214b4747e086e4582cf58d0f5562431761f62352b8f",
  "global-demo-responsive": "6b9dd5ac431243b2befadd1f5b58c4c92a75ce7df6ae4d6bc884b58d9b106c37",
  "actions-buttons-toggle": "f2ca6d8e139c415259aaefab04746624e2fab1c08f7824ac37761c29e5c6f8f7",
  "forms-labels-validation": "1983e5eef43e64152db8aaa6939199668187d1f5b293514a0efc33e8a944f0f5",
  "native-temporal-inputs": "1739c0cb5bd49b06ee0a649aed71a04dae76e7a6c42a87e125af7fe3d67b9dca",
  "slider-input": "3c61fa32660d41c275f68cfb8cf33a1eaeaa78234db50e8edfc175bcc3fbb34d",
  "file-input-picker": "f9bca9fce54391b2432683463df77d1d649f7adf2e2b8ee02c77211b393afae4",
  "calendar-grid": "2f1296f0e5ced77f7beae623aa2d46409052e1769c6d38a26c02127c799d851b",
  "date-picker-composition": "c28d2a929eaadfeaec2645b422889e82e56d02a3970020e84f2763dcf2b12e5d",
  "table-semantics-overflow": "2f51d2f5a8514e7933d10bb4eb6b5938f9a9ab1e2ebd78c56f92a32945d89569",
  "item-semantics-states": "fc8b1a03949b2f6ab3903a97d6b10d1e3136298c62466cde8b3830ce93d9594f",
  "feedback-status-states": "c8145dddef20c427ae386ddd99f8e792eef53333d06aec9022c9a2f9f1e5c119",
  "toast-announcements": "53d8e777ac302bfeae7534bbd1f08241c9d85951adfd73ce8525307c5f7b8422",
  "tabs-orientation-rtl": "b09d59d443e3c18a4e6c98a713c4aa588d496b57e8620e1f168d6717159e0ac2",
  "breadcrumbs-current": "f80a5e31b60c50109eb702fc20c230dbcc9c5b32f0b72b7e1d42c1cdc570eb33",
  "pagination-current-disabled": "a001fe613e303a9be01bc6de1a3b0bf2f5e074219dd7af47ad6ae5b6020fcf75",
  "command-live-states": "b5b933f3810c9901563ce02e7e94ae3280757c6cbcac23c70c6a61da74b5caa1",
  "sidebar-collapse": "de981faf11802f9f4582bf63d5ba94088d524dec7fa706a953818b9e8f656b9c",
  "sheet-mobile-modal": "6a586dbba7f1f9f9d13f6976a5b20f759626049a6ab04a0a70de597d3898be61",
  "overlay-focus-dismissal": "6b5317936ba831532921cd6d89037185cc747b7d20515e9c4b7d9942018090e7",
  "motion-adapter-reduced-motion":
    "e40354f31f6f5394b44d27df7c0686933cc51f6b439477672efb1ae8c9a0f9df",
  "runtime-axes-motion-contrast":
    "5ec005d4c94787f27ce85db0380e6c92a8f20d215d976d64dc3ebc64e97558a7",
};
const allowedStatuses = ["manual-evidence-pending", "complete"];
const allowedEvidenceResults = ["Pass", "Fail", "Blocked", "Not applicable"];
const allowedFindingSeverities = ["P0", "P1", "P2", "P3"];
const allowedBlockingGates = ["pilots", "api-freeze", "beta", "stable-1.0"];
const notApplicableEnvironmentFields = {
  "macos-chromium-keyboard": new Set(["assistiveTechnology"]),
  "zoom-reflow": new Set(["assistiveTechnology"]),
  "reduced-motion": new Set(["assistiveTechnology"]),
  "high-contrast": new Set(["assistiveTechnology"]),
};
const allowedPostCandidateChanges = new Set([
  "docs/audits/core-1-0-accessibility-device-audit.md",
  "quality/manual-audit-plan.json",
]);
const environmentEvidenceFields = requiredEvidenceFields;
const completionSummaryGates = [
  "No open P0 or P1 accessibility defect",
  "Blocking P2 findings resolved",
  "Every stable Core category covered with keyboard and VoiceOver",
  "NVDA covers load-bearing interactive families",
  "Mobile VoiceOver and TalkBack cover required controls and safe areas",
  "Zoom/reflow, contrast, RTL, touch, and reduced motion verified",
  "Motion adapter has manual reduced-motion evidence",
  "Missing or stale evidence is explicitly listed",
];
const concreteMacDevicePattern =
  /\b(?:MacBook\s+(?:Air|Pro)\b.*\d|Mac mini\b.*(?:M\d|\d{4})|iMac\b.*(?:M\d|\d{2,4}))/i;
const concreteWindowsDevicePattern = /\b(?:ThinkPad|Surface|Dell|HP|Lenovo)\b.*\d/i;
const concreteDesktopDevicePattern =
  /\b(?:(?:MacBook\s+(?:Air|Pro)|Mac mini|iMac)\b.*\d|(?:ThinkPad|Surface|Dell|HP|Lenovo)\b.*\d)/i;
const environmentMetadataRequirements = {
  "macos-safari-voiceover": {
    operatingSystem: /\bmacOS\b/i,
    browser: /\bSafari\b/i,
    assistiveTechnology: /\bVoiceOver\b/i,
    device: concreteMacDevicePattern,
  },
  "macos-chromium-keyboard": {
    operatingSystem: /\bmacOS\b/i,
    browser: /\b(?:Chrome|Chromium|Edge)\b/i,
    assistiveTechnology: /keyboard[- ]only/i,
    device: concreteMacDevicePattern,
  },
  "windows-nvda": {
    operatingSystem: /\bWindows\b/i,
    browser: /\b(?:Firefox|Chrome|Chromium|Edge)\b/i,
    assistiveTechnology: /\bNVDA\b/i,
    device: concreteWindowsDevicePattern,
  },
  "ios-safari-voiceover": {
    operatingSystem: /\b(?:iOS|iPadOS)\b/i,
    browser: /\bSafari\b/i,
    assistiveTechnology: /\bVoiceOver\b/i,
    device: /\b(?:iPhone|iPad)\s+(?:\d{1,2}|SE\b|Air\b|Pro\b|mini\b)/i,
  },
  "android-chrome-talkback": {
    operatingSystem: /\bAndroid\b/i,
    browser: /\bChrome\b/i,
    assistiveTechnology: /\bTalkBack\b/i,
    device:
      /\b(?:Pixel\s+\d|Galaxy\s+(?:[A-Z]+\s*)?\d|OnePlus\s+\d|Xperia\s+\d|Moto(?:rola)?\s+\S*\d|Nothing Phone\s+\d|(?:Redmi|Xiaomi|Huawei|Honor)\s+\S*\d)\b/i,
  },
  "zoom-reflow": {
    device: concreteDesktopDevicePattern,
    zoom: /(?=.*\b200%)(?=.*\b400%)/,
  },
  "reduced-motion": {
    device: concreteDesktopDevicePattern,
    notes:
      /(?:\b(?:reduce|reduced) motion\b.*\b(?:enabled|active|on)\b|\bprefers-reduced-motion\s*:\s*reduce\b)/i,
  },
  "high-contrast": {
    operatingSystem: /\b(?:macOS|Windows)\b/i,
    device: concreteDesktopDevicePattern,
    notes: /\b(?:high contrast|forced colors|increase contrast)\b.*\b(?:enabled|active|on)\b/i,
  },
};

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
    !["pending", "not run", "recorded", "none recorded", "not applicable"].includes(
      value.trim().toLowerCase(),
    )
  );
}

function isDetailedEvidenceString(value, field) {
  if (!isSubstantiveString(value)) return false;
  const normalized = value.trim();
  if (
    /^x+$/i.test(normalized) ||
    /\b(?:test|todo|tbd|unknown|placeholder|sample|example)\b/i.test(normalized)
  ) {
    return false;
  }
  switch (field) {
    case "operatingSystem":
      return /\b(?:macOS|iOS|iPadOS|Windows|Android|Linux)\b.*\d/i.test(normalized);
    case "browser":
      return /\b(?:Safari|Chrome|Chromium|Firefox|Edge)\b.*\d/i.test(normalized);
    case "assistiveTechnology":
      return (
        /keyboard[- ]only/i.test(normalized) ||
        /\b(?:VoiceOver|NVDA|TalkBack|JAWS)\b.*\d/i.test(normalized)
      );
    case "device":
      return normalized.length >= 4 && normalized.split(/\s+/).length >= 2;
    case "viewport":
      return /\b\d{2,5}\s*[x×]\s*\d{2,5}\b/i.test(normalized);
    case "zoom":
      return /\b\d{2,3}%/.test(normalized);
    case "packageMode":
      return /\b(?:pack(?:age|ed)|source(?:[- ]install)?)\b/i.test(normalized);
    case "notes":
      return normalized.length >= 24 && normalized.split(/\s+/).length >= 4;
    case "auditOwner":
      return normalized.length >= 3;
    default:
      return normalized.length >= 3;
  }
}

function isAllowedNotApplicable(environmentId, field, value) {
  return (
    typeof value === "string" &&
    value.trim().toLowerCase() === "not applicable" &&
    notApplicableEnvironmentFields[environmentId]?.has(field)
  );
}

function hasEnabledPreferenceState(environmentId, notes) {
  if (typeof notes !== "string") return false;
  if (
    environmentId === "reduced-motion" &&
    /\bprefers-reduced-motion\s*:\s*reduce\b/i.test(notes)
  ) {
    return true;
  }
  const preferencePattern =
    environmentId === "reduced-motion"
      ? /\b(?:reduce|reduced) motion\b/i
      : /\b(?:high contrast|forced colors|increase contrast)\b/i;
  const preferenceMatch = preferencePattern.exec(notes);
  if (!preferenceMatch) return false;
  const stateSegment = notes
    .slice(preferenceMatch.index + preferenceMatch[0].length)
    .match(/^(.{0,80}?)\b(enabled|active|on)\b/i);
  return Boolean(stateSegment && !/\b(?:not|never)\b/i.test(stateSegment[1]));
}

function auditScope(value) {
  return {
    issue: value?.issue,
    requiredEnvironments: value?.requiredEnvironments,
    requiredEvidenceFields: value?.requiredEvidenceFields,
    scenarios: value?.scenarios,
  };
}

function scenarioScopeHash({ id: _id, ...scope }) {
  return createHash("sha256").update(JSON.stringify(scope)).digest("hex");
}

function validateEvidenceLinks(label, evidence) {
  if (!Array.isArray(evidence) || !evidence.length) {
    errors.push(`${label} must include at least one evidence link.`);
    return;
  }
  for (const link of evidence) {
    let url;
    try {
      url = new URL(link);
    } catch {
      errors.push(`${label} evidence links must use valid https URLs.`);
      continue;
    }
    const isIssueComment =
      url.hostname === "github.com" &&
      /^\/vpavlov-me\/Nerio\/issues\/\d+$/.test(url.pathname) &&
      /^#issuecomment-\d+$/.test(url.hash);
    const isActionsArtifact =
      url.hostname === "github.com" &&
      /^\/vpavlov-me\/Nerio\/actions\/runs\/\d+\/artifacts\/\d+$/.test(url.pathname);
    const isUserAttachment =
      url.hostname === "github.com" &&
      /^\/user-attachments\/assets\/[0-9a-f-]{36}$/i.test(url.pathname);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      (!isIssueComment && !isActionsArtifact && !isUserAttachment)
    ) {
      errors.push(
        `${label} evidence links must identify a Nerio GitHub issue comment, Actions artifact, or user attachment.`,
      );
    }
  }
}

function reportStatus(id, sectionTitle) {
  const rows = reportSection(sectionTitle)
    .split(/\r?\n/)
    .filter((line) => {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim());
      return cells[0] === `\`${id}\``;
    });
  if (rows.length !== 1) return undefined;
  return rows[0]
    ?.split("|")
    .slice(1, -1)
    .map((cell) => cell.trim())[3];
}

function reportSection(title) {
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if ((report.match(new RegExp(`^## ${escapedTitle}$`, "gm")) ?? []).length !== 1) {
    return "";
  }
  return report.match(new RegExp(`## ${title}\\s+([\\s\\S]*?)(?=\\n## |$)`))?.[1] ?? "";
}

function reportTableValue(section, label) {
  const rows = section.split(/\r?\n/).filter((line) => line.trimStart().startsWith(`| ${label}`));
  if (rows.length !== 1) return undefined;
  return rows[0]
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim())[1];
}

function environmentNoteSection(id) {
  if ((report.match(new RegExp(`^### \`${id}\`$`, "gm")) ?? []).length !== 1) {
    return "";
  }
  return (
    report.match(
      new RegExp(`### \`${id}\`\\s+([\\s\\S]*?)(?=\\n### |\\n## Completion summary)`),
    )?.[1] ?? ""
  );
}

const findingLog = reportSection("Finding log");
const findingTableRows = findingLog
  .split(/\r?\n/)
  .filter((line) => line.trimStart().startsWith("|"))
  .map((line) =>
    line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim()),
  );
const findingLogRows = findingTableRows.filter(
  (cells) => cells[0] !== "Finding" && cells[0] !== "None recorded" && !cells[0].startsWith("---"),
);

function findingLogRow(issue) {
  return findingLogRows.find((cells) => cells.length === 8 && cells[5] === issue);
}

function findingCell(value) {
  return isSubstantiveString(value) && value !== "—";
}

function isDeviceConsistentMobileViewport(environment) {
  const dimensions = environment?.viewport?.match(/^(\d{3,4})\s*[x×]\s*(\d{3,4})$/i);
  if (!dimensions) return false;
  const shortEdge = Math.min(Number(dimensions[1]), Number(dimensions[2]));
  const longEdge = Math.max(Number(dimensions[1]), Number(dimensions[2]));
  const isTablet = /\b(?:iPad|tablet)\b/i.test(environment?.device ?? "");
  return isTablet
    ? shortEdge >= 600 && shortEdge <= 1100 && longEdge >= 800 && longEdge <= 1400
    : shortEdge >= 300 && shortEdge <= 600 && longEdge >= 500 && longEdge <= 1100;
}

function aggregateResults(results) {
  if (results.some(({ result }) => result === "Fail")) return "Fail";
  if (results.some(({ result }) => result === "Blocked")) return "Blocked";
  if (results.every(({ result }) => result === "Pass")) return "Pass";
  if (results.every(({ result }) => result === "Not applicable")) return "Not applicable";
  return "Blocked";
}

if (plan) {
  if (plan.issue !== 143) errors.push("Manual audit plan must target issue #143.");
  if (!allowedStatuses.includes(plan.status)) {
    errors.push(`Manual audit plan status must be one of: ${allowedStatuses.join(", ")}.`);
  }

  const environments = Array.isArray(plan.requiredEnvironments) ? plan.requiredEnvironments : [];
  const environmentIds = environments.map((environment) => environment?.id).filter(Boolean);
  addMissing("Required environments", requiredEnvironmentIds, environmentIds);
  const unexpectedEnvironmentIds = environmentIds.filter(
    (id) => !requiredEnvironmentIds.includes(id),
  );
  if (unexpectedEnvironmentIds.length) {
    errors.push(
      `Manual audit plan has unexpected required environments: ${unexpectedEnvironmentIds.join(", ")}`,
    );
  }

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
  const unexpectedEvidenceFields = evidenceFields.filter(
    (field) => !requiredEvidenceFields.includes(field),
  );
  if (unexpectedEvidenceFields.length) {
    errors.push(
      `Manual audit plan has unexpected required evidence fields: ${unexpectedEvidenceFields.join(", ")}`,
    );
  }
  if (new Set(evidenceFields).size !== evidenceFields.length) {
    errors.push("Required evidence fields must be unique.");
  }

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
    const canonicalEnvironments = requiredScenarioEnvironments[scenario?.id];
    if (
      canonicalEnvironments &&
      [...(scenario?.environments ?? [])].sort().join("\n") !==
        [...canonicalEnvironments].sort().join("\n")
    ) {
      errors.push(
        `${prefix} environments must exactly match: ${canonicalEnvironments.join(", ")}.`,
      );
    }
    const canonicalScopeHash = requiredScenarioScopeHashes[scenario?.id];
    if (canonicalScopeHash && scenarioScopeHash(scenario) !== canonicalScopeHash) {
      errors.push(
        `${prefix} scope must match its canonical title, route, surfaces, components, environments, steps, and expectations.`,
      );
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
  const reportHeader = report.split(/^## /m, 1)[0];
  const reportStatusMatches = [...reportHeader.matchAll(/^- Status: \*\*(.+)\*\*$/gm)];
  if (reportStatusMatches.length !== 1 || reportStatusMatches[0][1] !== "Complete") {
    errors.push("Completed audit report must declare Status: **Complete**.");
  }
  const reportCommitMatches = [
    ...reportHeader.matchAll(/^- Candidate commit: \*\*([0-9a-f]{40})\*\*$/gm),
  ];
  const reportCommit = reportCommitMatches.length === 1 ? reportCommitMatches[0][1] : undefined;
  if (!reportCommit) {
    errors.push("Completed audit report must record a 40-character candidate commit.");
  }
  const finalDecisionMatches = [
    ...reportHeader.matchAll(
      /^- Final decision: \*\*(Pass for real consumer pilots|Blocked before pilots)\*\*$/gm,
    ),
  ];
  const finalDecision = finalDecisionMatches.length === 1 ? finalDecisionMatches[0][1] : undefined;
  if (!finalDecision) {
    errors.push("Completed audit report must record one allowed final decision.");
  }
  const sectionDecisionMatches = [
    ...reportSection("Final decision").matchAll(
      /^\*\*(Pass for real consumer pilots|Blocked before pilots)\*\*$/gm,
    ),
  ];
  const sectionDecision =
    sectionDecisionMatches.length === 1 ? sectionDecisionMatches[0][1] : undefined;
  if (!sectionDecision) {
    errors.push("Completed audit report final-decision section must record one allowed decision.");
  } else if (finalDecision && sectionDecision !== finalDecision) {
    errors.push("Completed audit report final-decision section must match its metadata decision.");
  }
  const completionSummary = reportSection("Completion summary");
  const summaryResults = completionSummaryGates.map((gate) => ({
    gate,
    result: reportTableValue(completionSummary, gate),
  }));
  for (const { gate, result } of summaryResults) {
    if (!["Pass", "Fail", "Blocked"].includes(result)) {
      errors.push(`Completed audit summary gate "${gate}" must record Pass, Fail, or Blocked.`);
    }
  }
  if (
    finalDecision === "Pass for real consumer pilots" &&
    summaryResults.some(({ result }) => result !== "Pass")
  ) {
    errors.push("Pass for real consumer pilots requires every completion-summary gate to pass.");
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
    } else {
      const ancestry = spawnSync("git", ["merge-base", "--is-ancestor", candidate.commit, "HEAD"], {
        cwd: root,
        encoding: "utf8",
      });
      if (ancestry.status !== 0) {
        errors.push(
          "Completed audit candidate must be an available ancestor of the current checkout.",
        );
      } else {
        const candidatePlanSource = spawnSync(
          "git",
          ["show", `${candidate.commit}:quality/manual-audit-plan.json`],
          { cwd: root, encoding: "utf8" },
        );
        if (candidatePlanSource.status !== 0) {
          errors.push("Completed audit candidate must contain the manual audit plan.");
        } else {
          try {
            const candidatePlan = JSON.parse(candidatePlanSource.stdout);
            if (JSON.stringify(auditScope(candidatePlan)) !== JSON.stringify(auditScope(plan))) {
              errors.push(
                "Completed audit scope must match the routes, steps, expectations, and environment matrix locked by the candidate.",
              );
            }
          } catch {
            errors.push("Completed audit candidate manual audit plan must be valid JSON.");
          }
        }
        const diff = spawnSync("git", ["diff", "--name-only", `${candidate.commit}..HEAD`, "--"], {
          cwd: root,
          encoding: "utf8",
        });
        if (diff.status !== 0) {
          errors.push("Completed audit candidate drift could not be checked.");
        } else {
          const stalePaths = diff.stdout
            .split(/\r?\n/)
            .filter(Boolean)
            .filter((path) => !allowedPostCandidateChanges.has(path));
          if (stalePaths.length) {
            errors.push(
              `Completed audit evidence is stale after post-candidate changes: ${stalePaths.join(", ")}`,
            );
          }
        }
      }
    }
    const expectedCommitUrl = `https://github.com/vpavlov-me/Nerio/commit/${candidate.commit}`;
    if (candidate.githubVerification !== expectedCommitUrl) {
      errors.push("Completed audit GitHub verification URL must identify the exact Nerio commit.");
    }
    if (!/^https:\/\/github\.com\/vpavlov-me\/Nerio\/actions\/runs\/\d+$/.test(candidate.ciRun)) {
      errors.push("Completed audit candidate ciRun must identify a Nerio Actions run.");
    }
    let deploymentUrl;
    try {
      deploymentUrl = new URL(candidate.vercelDeployment);
    } catch {
      deploymentUrl = null;
    }
    if (
      deploymentUrl?.protocol !== "https:" ||
      !deploymentUrl.hostname.endsWith(".vercel.app") ||
      deploymentUrl.username ||
      deploymentUrl.password
    ) {
      errors.push("Completed audit candidate vercelDeployment must identify a Vercel deployment.");
    }
    for (const field of ["ciCommit", "vercelCommit"]) {
      if (candidate[field] !== candidate.commit) {
        errors.push(`Completed audit candidate ${field} must match the candidate commit.`);
      }
    }
    if (!isDetailedEvidenceString(candidate.auditOwner, "auditOwner")) {
      errors.push("Completed audit candidate must name the audit owner.");
    }
    if (!isDetailedEvidenceString(candidate.packageMode, "packageMode")) {
      errors.push("Completed audit candidate must record its package or source-install mode.");
    }
    let candidateCommittedAt = Number.NaN;
    const auditStartedAt = Date.parse(candidate.auditStartedAt);
    if (!isSubstantiveString(candidate.auditStartedAt) || Number.isNaN(auditStartedAt)) {
      errors.push("Completed audit candidate must include a valid auditStartedAt timestamp.");
    } else {
      const candidateTimestamp = spawnSync(
        "git",
        ["show", "-s", "--format=%cI", candidate.commit],
        {
          cwd: root,
          encoding: "utf8",
        },
      );
      candidateCommittedAt = Date.parse(candidateTimestamp.stdout.trim());
      if (candidateTimestamp.status !== 0 || Number.isNaN(candidateCommittedAt)) {
        errors.push("Completed audit candidate commit timestamp could not be verified.");
      } else if (auditStartedAt < candidateCommittedAt) {
        errors.push("Completed audit auditStartedAt must not predate the candidate commit.");
      }
      if (auditStartedAt > Date.now()) {
        errors.push("Completed audit auditStartedAt must not be in the future.");
      }
    }
    const automatedPrepCompletedAt = Date.parse(candidate.automatedPrepCompletedAt);
    if (Number.isNaN(automatedPrepCompletedAt)) {
      errors.push("Completed audit candidate must record automatedPrepCompletedAt.");
    } else if (
      !Number.isNaN(candidateCommittedAt) &&
      automatedPrepCompletedAt < candidateCommittedAt
    ) {
      errors.push("Completed audit automated prep must not predate the candidate commit.");
    } else if (
      !Number.isNaN(auditStartedAt) &&
      (automatedPrepCompletedAt > auditStartedAt || automatedPrepCompletedAt > Date.now())
    ) {
      errors.push("Completed audit automated prep must finish no later than the audit start.");
    }
    const candidateLock = reportSection("Candidate lock");
    for (const [field, expected] of [
      ["Commit", candidate.commit],
      ["GitHub verification", candidate.githubVerification],
      ["CI run", candidate.ciRun],
      ["Vercel deployment", candidate.vercelDeployment],
      ["Package/source mode", candidate.packageMode],
      ["Audit start", candidate.auditStartedAt],
      ["Audit owner", candidate.auditOwner],
      ["Automated prep completed", candidate.automatedPrepCompletedAt],
    ]) {
      if (reportTableValue(candidateLock, field) !== expected) {
        errors.push(`Completed audit Candidate lock "${field}" must match completion.candidate.`);
      }
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
  const unexpectedCompletedEnvironmentIds = completedEnvironmentIds.filter(
    (id) => !requiredEnvironmentIds.includes(id),
  );
  if (unexpectedCompletedEnvironmentIds.length) {
    errors.push(
      `Completed audit has unexpected environment evidence: ${unexpectedCompletedEnvironmentIds.join(", ")}.`,
    );
  }
  for (const environment of completedEnvironments) {
    const label = `Completed environment ${environment?.id ?? "without an id"}`;
    for (const field of environmentEvidenceFields) {
      if (field === "result" && !allowedEvidenceResults.includes(environment?.result)) {
        errors.push(`${label} result must use one of: ${allowedEvidenceResults.join(", ")}.`);
        continue;
      }
      if (
        !isDetailedEvidenceString(environment?.[field], field) &&
        !isAllowedNotApplicable(environment?.id, field, environment?.[field])
      ) {
        errors.push(`${label} must include substantive ${field} evidence.`);
      }
    }
    for (const [field, pattern] of Object.entries(
      environmentMetadataRequirements[environment?.id] ?? {},
    )) {
      if (isAllowedNotApplicable(environment?.id, field, environment?.[field])) continue;
      if (!pattern.test(environment?.[field] ?? "")) {
        errors.push(`${label} ${field} must match the required environment.`);
      }
    }
    if (
      ["reduced-motion", "high-contrast"].includes(environment?.id) &&
      !hasEnabledPreferenceState(environment.id, environment?.notes)
    ) {
      errors.push(`${label} notes must match the required environment.`);
    }
    if (environment?.id === "high-contrast") {
      const isCoherentMac =
        /\bmacOS\b/i.test(environment.operatingSystem ?? "") &&
        concreteMacDevicePattern.test(environment.device ?? "") &&
        /\b(?:Safari|Chrome|Chromium|Firefox|Edge)\b/i.test(environment.browser ?? "");
      const isCoherentWindows =
        /\bWindows\b/i.test(environment.operatingSystem ?? "") &&
        concreteWindowsDevicePattern.test(environment.device ?? "") &&
        /\b(?:Chrome|Chromium|Firefox|Edge)\b/i.test(environment.browser ?? "");
      if (!isCoherentMac && !isCoherentWindows) {
        errors.push(`${label} platform metadata must describe one coherent desktop environment.`);
      }
    }
    if (
      environment?.id === "zoom-reflow" &&
      /\b(?:not|never|untested|skipped)\b/i.test(environment?.zoom ?? "")
    ) {
      errors.push(`${label} zoom must match the required environment.`);
    }
    if (environment?.packageMode !== candidate?.packageMode) {
      errors.push(`${label} packageMode must match the locked candidate packageMode.`);
    }
    if (
      ["ios-safari-voiceover", "android-chrome-talkback"].includes(environment?.id) &&
      /\b(?:simulator|emulator|virtual)\b/i.test(environment?.device ?? "")
    ) {
      errors.push(`${label} device must identify physical hardware, not a simulator or emulator.`);
    }
    if (
      ["ios-safari-voiceover", "android-chrome-talkback"].includes(environment?.id) &&
      !isDeviceConsistentMobileViewport(environment)
    ) {
      errors.push(`${label} viewport must match the recorded physical mobile device.`);
    }
    const recordedStatus = reportStatus(environment?.id, "Required environments");
    if (recordedStatus !== environment?.result) {
      errors.push(
        `${label} result must match the completed report status (expected ${environment?.result ?? "missing"}, found ${recordedStatus ?? "missing"}).`,
      );
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
    if (!isDetailedEvidenceString(result?.notes, "notes")) {
      errors.push(`${label} must include substantive notes.`);
    }
    validateEvidenceLinks(label, result?.evidence);
    if (result?.result === "Fail" || result?.result === "Blocked") {
      if (
        typeof result?.issue !== "string" ||
        !/^https:\/\/github\.com\/vpavlov-me\/Nerio\/issues\/\d+$/.test(result.issue)
      ) {
        errors.push(`${label} must link a focused GitHub issue for failed or blocked evidence.`);
      } else {
        const finding = findingLogRow(result.issue);
        if (!finding) {
          errors.push(`${label} GitHub issue must have a structured report finding-log row.`);
        } else {
          const [
            findingTitle,
            findingScenario,
            findingEnvironment,
            findingSeverity,
            findingGate,
            findingIssue,
            findingResolution,
            findingRetest,
          ] = finding;
          if (!findingCell(findingTitle)) {
            errors.push(`${label} finding-log row must include a substantive finding title.`);
          }
          if (findingScenario.replaceAll("`", "") !== result.scenarioId) {
            errors.push(`${label} finding-log row must identify its scenario.`);
          }
          if (findingEnvironment.replaceAll("`", "") !== result.environmentId) {
            errors.push(`${label} finding-log row must identify its environment.`);
          }
          if (findingSeverity !== result.severity) {
            errors.push(`${label} finding-log severity must match completion evidence.`);
          }
          if (findingGate !== result.blockingGate) {
            errors.push(`${label} finding-log release impact must match blockingGate.`);
          }
          if (findingIssue !== result.issue) {
            errors.push(`${label} finding-log issue must match completion evidence.`);
          }
          if (!findingCell(findingResolution) || !findingCell(findingRetest)) {
            errors.push(`${label} finding-log row must include resolution and retest records.`);
          }
        }
      }
      if (!allowedFindingSeverities.includes(result?.severity)) {
        errors.push(`${label} severity must use one of: ${allowedFindingSeverities.join(", ")}.`);
      }
      if (!allowedBlockingGates.includes(result?.blockingGate)) {
        errors.push(`${label} blockingGate must use one of: ${allowedBlockingGates.join(", ")}.`);
      }
    }
  }
  const summaryResultByGate = new Map(summaryResults.map(({ gate, result }) => [gate, result]));
  for (const finding of findingLogRows) {
    if (finding.length !== 8) {
      errors.push("Completed audit finding-log rows must contain exactly eight table cells.");
      continue;
    }
    const [
      findingTitle,
      findingScenario,
      findingEnvironment,
      findingSeverity,
      findingGate,
      findingIssue,
      findingResolution,
      findingRetest,
    ] = finding;
    const normalizedScenario = findingScenario.replaceAll("`", "");
    const normalizedEnvironment = findingEnvironment.replaceAll("`", "");
    if (!findingCell(findingTitle)) {
      errors.push("Every finding-log row must include a substantive finding title.");
    }
    if (!requiredScenarioIds.includes(normalizedScenario)) {
      errors.push(`Finding "${findingTitle}" must identify a canonical scenario.`);
    }
    if (!requiredEnvironmentIds.includes(normalizedEnvironment)) {
      errors.push(`Finding "${findingTitle}" must identify a required environment.`);
    }
    if (!allowedFindingSeverities.includes(findingSeverity)) {
      errors.push(`Finding "${findingTitle}" must use an allowed severity.`);
    }
    if (!allowedBlockingGates.includes(findingGate)) {
      errors.push(`Finding "${findingTitle}" must use an allowed release impact.`);
    }
    if (!/^https:\/\/github\.com\/vpavlov-me\/Nerio\/issues\/\d+$/.test(findingIssue)) {
      errors.push(`Finding "${findingTitle}" must link a focused Nerio GitHub issue.`);
    }
    if (!findingCell(findingRetest)) {
      errors.push(`Finding "${findingTitle}" must include a substantive retest record.`);
    }
    const normalizedResolution = findingResolution.toLowerCase();
    if (!["open", "resolved", "closed"].includes(normalizedResolution)) {
      errors.push(
        `Finding "${findingTitle}" resolution must use exactly Open, Resolved, or Closed.`,
      );
    }
    const matchingResult = completedResults.find(
      (result) =>
        result.issue === findingIssue &&
        result.scenarioId === normalizedScenario &&
        result.environmentId === normalizedEnvironment &&
        ["Fail", "Blocked"].includes(result.result),
    );
    if (["resolved", "closed"].includes(normalizedResolution)) {
      if (matchingResult) {
        errors.push(
          `Finding "${findingTitle}" tied to a failed or blocked completion result must remain Open.`,
        );
      }
      continue;
    }
    if (!matchingResult) {
      errors.push(
        `Open finding "${findingTitle}" must match a failed or blocked completion result.`,
      );
    }
    if (
      ["P0", "P1"].includes(findingSeverity) &&
      summaryResultByGate.get("No open P0 or P1 accessibility defect") === "Pass"
    ) {
      errors.push("Completion summary cannot pass while the finding log has an open P0 or P1.");
    }
    if (
      findingSeverity === "P2" &&
      findingGate === "pilots" &&
      summaryResultByGate.get("Blocking P2 findings resolved") === "Pass"
    ) {
      errors.push("Completion summary cannot pass while the finding log has an open blocking P2.");
    }
    if (
      finalDecision === "Pass for real consumer pilots" &&
      (["P0", "P1"].includes(findingSeverity) || findingGate === "pilots")
    ) {
      errors.push("Pass for real consumer pilots cannot include an open blocking finding.");
    }
  }
  const blockingResults = completedResults.filter(({ result }) =>
    ["Fail", "Blocked"].includes(result),
  );
  if (
    finalDecision === "Blocked before pilots" &&
    (blockingResults.length === 0 || summaryResults.every(({ result }) => result === "Pass"))
  ) {
    errors.push(
      "Blocked before pilots requires failed or blocked completion evidence and a non-passing summary gate.",
    );
  }
  for (const { gate, result } of summaryResults.filter(
    ({ result }) => result === "Fail" || result === "Blocked",
  )) {
    const supportPredicates = {
      "No open P0 or P1 accessibility defect": ({ severity }) => ["P0", "P1"].includes(severity),
      "Blocking P2 findings resolved": ({ severity }) => severity === "P2",
      "Every stable Core category covered with keyboard and VoiceOver": ({ environmentId }) =>
        ["macos-safari-voiceover", "macos-chromium-keyboard"].includes(environmentId),
      "NVDA covers load-bearing interactive families": ({ environmentId }) =>
        environmentId === "windows-nvda",
      "Mobile VoiceOver and TalkBack cover required controls and safe areas": ({ environmentId }) =>
        ["ios-safari-voiceover", "android-chrome-talkback"].includes(environmentId),
      "Zoom/reflow, contrast, RTL, touch, and reduced motion verified": ({ environmentId }) =>
        [
          "ios-safari-voiceover",
          "android-chrome-talkback",
          "zoom-reflow",
          "reduced-motion",
          "high-contrast",
        ].includes(environmentId),
      "Motion adapter has manual reduced-motion evidence": ({ scenarioId }) =>
        scenarioId === "motion-adapter-reduced-motion",
      "Missing or stale evidence is explicitly listed": ({ result }) => result === "Blocked",
    };
    const supported = blockingResults.some(supportPredicates[gate] ?? (() => false));
    if (!supported) {
      errors.push(
        `Completed audit summary gate "${gate}" must be supported by failed or blocked completion evidence.`,
      );
    }
  }
  for (const environment of completedEnvironments) {
    const section = environmentNoteSection(environment.id);
    const expectedScenarios = (plan.scenarios ?? [])
      .filter((scenario) => scenario.environments.includes(environment.id))
      .map((scenario) => `\`${scenario.id}\``)
      .join(", ");
    const expectedFindings =
      [
        ...new Set(
          completedResults
            .filter(
              (result) =>
                result.environmentId === environment.id &&
                ["Fail", "Blocked"].includes(result.result) &&
                result.issue,
            )
            .map((result) => result.issue),
        ),
      ].join(", ") || "None recorded";
    for (const [field, expected] of [
      ["Operating system", environment.operatingSystem],
      ["Browser", environment.browser],
      ["Assistive technology", environment.assistiveTechnology],
      ["Device", environment.device],
      ["Viewport", environment.viewport],
      ["Zoom", environment.zoom],
      ["Package/source mode", environment.packageMode],
      ["Result", environment.result],
      ["Notes", environment.notes],
      ["Completed scenarios", expectedScenarios],
      ["Findings", expectedFindings],
    ]) {
      if (reportTableValue(section, field) !== expected) {
        errors.push(
          `Completed environment note ${environment.id} "${field}" must match completion evidence.`,
        );
      }
    }
  }
  for (const environment of completedEnvironments) {
    const expectedStatus = aggregateResults(
      completedResults.filter(({ environmentId }) => environmentId === environment.id),
    );
    if (environment.result !== expectedStatus) {
      errors.push(
        `Completed environment ${environment.id} aggregate result must match its scenario evidence (expected ${expectedStatus}, found ${environment.result ?? "missing"}).`,
      );
    }
  }
  for (const scenario of plan.scenarios ?? []) {
    const scenarioResults = completedResults.filter(({ scenarioId }) => scenarioId === scenario.id);
    const expectedStatus = aggregateResults(scenarioResults);
    const recordedStatus = reportStatus(scenario.id, "Scenario matrix");
    if (recordedStatus !== expectedStatus) {
      errors.push(
        `Completed scenario ${scenario.id} result must match the completed report status (expected ${expectedStatus}, found ${recordedStatus ?? "missing"}).`,
      );
    }
  }
  if (
    finalDecision === "Pass for real consumer pilots" &&
    (completedEnvironments.some(({ result }) => result !== "Pass") ||
      completedResults.some(({ result }) => result !== "Pass"))
  ) {
    errors.push(
      "Pass for real consumer pilots requires Pass evidence for every required environment and scenario-environment pair.",
    );
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
