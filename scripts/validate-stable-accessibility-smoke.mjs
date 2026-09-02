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
  "--platform-support": platformSupportPath,
} = parsePathOptions(args, {
  "--record": resolve(root, "quality/stable-accessibility-smoke.json"),
  "--release-metadata": resolve(root, "quality/release-metadata.json"),
  "--packages-root": resolve(root, "packages"),
  "--platform-support": resolve(root, "quality/platform-support.json"),
});

const errors = [];
const isJsonObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
let platformSupport;
try {
  platformSupport = JSON.parse(await readFile(platformSupportPath, "utf8"));
} catch (error) {
  errors.push(`Platform support policy must be readable JSON: ${error.message}`);
}
if (platformSupport !== undefined && !isJsonObject(platformSupport)) {
  errors.push("Platform support policy must be a JSON object.");
  platformSupport = undefined;
}

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
const macHardwareQualifierSource =
  "(?:M\\d+(?:\\s+(?:Max|Pro|Ultra))?|Retina\\s+\\dK|\\d{2,4}(?:-inch)?|Late\\s+\\d{4}|Pro|with(?:out)?\\s+Touch\\s+Bar)";
const macDeviceFamilyPattern = new RegExp(
  `^(?:MacBook\\s+(?:Air|Pro)|Mac\\s+(?:mini|Studio|Pro)|iMac)` +
    `(?:\\s+${macHardwareQualifierSource}){0,2}` +
    `(?:\\s+\\(${macHardwareQualifierSource}(?:,\\s*${macHardwareQualifierSource}){0,2}\\))?$`,
  "i",
);
const explicitDesktopPlaceholderPattern =
  /\b(?:test|sample|generic|unknown|placeholder|example)\b/i;
const evidenceDocumentPattern =
  /\b(?:accessibility|audit|checklist|compliance|documentation|evidence|guide|manual|matrix|release|report|roadmap|worksheet)\b/i;
const evidenceDocumentCompoundPattern =
  /(?:accessibility|audit|compliance|evidence|release|roadmap|user)(?:checklist|documentation|evidence|guide|item|manual|matrix|notes?|record|report|roadmap|worksheet)/i;
const desktopSoftwareProductSource =
  "(?:account|android|browser|calendar|chrome(?:\\s*os)?|chromium(?:\\s*os)?|edgehtml|firefox|ios|ipados|linux|mac\\s*os|(?:microsoft|ms)\\s*edge|music|office|safari|support(?:assist)?|teams|ubuntu|webkit|windows|workspace)";
const desktopPeripheralSource =
  "(?:adapter|camera|case|charger|console|cover|display|dock|headset|hub|keyboard|monitor|mouse|phone|printer|projector|router|scanner|server|sleeve|speaker|stand|tablet|television|watch)";
const nonDesktopProductDescriptionPattern = new RegExp(
  `\\b(?:${desktopSoftwareProductSource}|${desktopPeripheralSource})\\b`,
  "i",
);
const browserOnlyDesktopDevicePattern =
  /^(?:(?:desktop|google|os)\s+)?(?:edge|edgehtml)(?:\s+\d+(?:\.\d+)*)?$/i;
const desktopNonIdentityPattern =
  /\b(?:abc\d*|chair|conference|fake|fixture|kitchen|mock|qa\d*|room|widget)\b/i;
const desktopDeviceAbsencePattern =
  /^(?:(?:this|that)\s+(?:is|was)\s+|definitely\s+)?(?:former|missing|neither|no|non|not|unavailable|without)\b|\b(?:can|could|did|does|is|may|might|must|should|was|were|will|would)\s+(?:not|never)\s+(?:be\s+)?(?:available|present|tested|used)\b|\b(?:has|have|had)\s+(?:not|never)\s+been\s+(?:available|present|tested|used)\b|\b(?:not|never)\s+(?:available|present|tested|used)\b|\b(?:became|is|remains?|was|were)\s+(?:absent|missing|unavailable|untested|unused)\b|\bno\s+longer\s+(?:available|present|tested|used)\b|\b(?:absent|missing|unavailable|untested|unused)\s*$|\blacks?\s+availability\b|\b(?:is|was|were)\s+not\s+(?:an?\s+)?(?:physical\s+)?(?:computer|desktop|device|handset|hardware|laptop|machine|pc|phone|tablet|workstation)\s*$|\b(?:no|without)\s+(?:an?\s+)?(?:computer|desktop|device|handset|hardware|laptop|machine|pc|phone|tablet|workstation)\s*$/i;
const desktopMissingValuePattern = /^(?:n\s*a|none|nil|null|pending|tba|tbd|unset)$/i;
const desktopForbiddenCompoundPattern =
  /(?:test|sample|generic|unknown|placeholder|example|qa|widget|mock|fake)(?:device|laptop|pc|machine|notebook|book|computer|desktop|workstation)|(?:accessibility|audit|compliance|evidence|release|roadmap|user)(?:checklist|guide|item|matrix|notes?|record|report)|(?:(?:microsoftoffice|googleworkspace|applemusic|googlecalendar|chrome(?:os)?browser|chromiumbrowser|firefoxbrowser|edgebrowser|safaribrowser|windows(?:pc|laptop)|androidlaptop|desktopbrowser|edgehtml|webkit)(?=\d|$)\d*)|(?:(?:dell|gaming|desktop)monitor(?:[a-z]?\d[a-z0-9]*)?|hpprinter\d[a-z0-9]*|usbkeyboard[a-z]?\d[a-z0-9]*|printermodel\d[a-z0-9]*)/i;
const desktopCompactSoftwareOnlyPattern = /^(?:microsoft(?:365)?)?copilot[a-z0-9]*$/i;
const desktopCopilotTokenPattern = /\bcopilot\b/i;
const desktopCopilotPcPattern = /\bcopilot\s+pc\b/i;
const desktopCopilotSoftwarePrefixPattern = /\b(?:azure|dynamics|github|security)\b/i;
const desktopCompactMobileOsPattern = /^(?:ios|ipados)\d*$/i;
const genericDesktopDeviceWords = new Set([
  "a",
  "actual",
  "an",
  "available",
  "chromebook",
  "company",
  "computer",
  "configured",
  "corporate",
  "current",
  "default",
  "development",
  "desktop",
  "device",
  "environment",
  "hardware",
  "home",
  "laptop",
  "local",
  "main",
  "machine",
  "my",
  "number",
  "office",
  "operating",
  "other",
  "our",
  "pc",
  "personal",
  "physical",
  "platform",
  "primary",
  "production",
  "real",
  "some",
  "standard",
  "system",
  "that",
  "the",
  "their",
  "this",
  "those",
  "user",
  "work",
  "workstation",
  "your",
  "acer",
  "asus",
  "dell",
  "google",
  "hp",
  "huawei",
  "lenovo",
  "lg",
  "microsoft",
  "msi",
  "panasonic",
  "razer",
  "samsung",
  "sony",
]);
const identityNegationPattern = /\b(?:not|never|without|no(?!\.))\b/i;
const normalizeDesktopDeviceVocabulary = (value) =>
  typeof value === "string"
    ? value
        .replace(/\bNo\.\s*(?=\d)/gi, "number ")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/([A-Za-z])(\d)/g, "$1 $2")
        .replace(/(\d)([A-Za-z])/g, "$1 $2")
        .replace(/[_./()+,-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : value;
const desktopOperatingSystemFamilies = new Set([
  "windows",
  "macos",
  "linux",
  "chromeos",
  "bsd",
  "unix",
  "other",
]);
const desktopOperatingSystemVersionPattern = /^(?=.{1,32}$)\d+(?:\.\d+){0,3}$/;
const browserPolicyEngine = new Map([
  ["safari", "webkit"],
  ["chrome", "chromium"],
  ["chromium", "chromium"],
  ["edge", "chromium"],
  ["firefox", "firefox"],
]);
const parsePolicyMinimum = (value) => {
  const match = typeof value === "string" ? /^(\d+(?:\.\d+)*)\+$/.exec(value) : null;
  return match ? match[1].split(".").map(Number) : null;
};
const browserPolicyMinimums = Object.fromEntries(
  ["chromium", "firefox", "webkit"].map((engine) => [
    engine,
    parsePolicyMinimum(platformSupport?.browsers?.[engine]),
  ]),
);
for (const [engine, minimum] of Object.entries(browserPolicyMinimums)) {
  if (minimum === null) {
    errors.push(`Platform support policy must define browsers.${engine} as a numeric minimum+.`);
  }
}
const compareVersionParts = (left, right) => {
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
};
function isMaintainedBrowserDescription(value, allowedProducts) {
  if (typeof value !== "string") return false;
  const match =
    /^(?:(?:Apple|Google|Microsoft|Mozilla)\s+)?(Safari|Chrome|Chromium|Firefox|Edge)\s+(\d+(?:\.\d+){0,3})$/i.exec(
      value.trim(),
    );
  if (!match) return false;
  const product = match[1].toLowerCase();
  if (!allowedProducts.has(product)) return false;
  const minimum = browserPolicyMinimums[browserPolicyEngine.get(product)];
  return minimum !== null && compareVersionParts(match[2].split(".").map(Number), minimum) >= 0;
}
const safariProducts = new Set(["safari"]);
const chromiumProducts = new Set(["chrome", "chromium", "edge"]);
const maintainedBrowserProducts = new Set(browserPolicyEngine.keys());
const androidMobileBrowserProducts = new Set(["chrome", "chromium", "edge", "firefox"]);
const appleMobileBrowserProducts = new Set(["safari", "chrome", "edge", "firefox"]);
function isMacDeviceDescription(value) {
  const normalized = normalizeContractedNegations(value);
  const identity = typeof normalized === "string" ? macDeviceFamilyPattern.exec(normalized) : null;
  return (
    identity !== null &&
    !explicitDesktopPlaceholderPattern.test(normalized) &&
    !identityNegationPattern.test(normalized.slice(0, identity.index))
  );
}
function isConcreteDesktopDeviceDescription(value) {
  const normalized = normalizeContractedNegations(value);
  if (
    typeof normalized !== "string" ||
    !/^[A-Za-z0-9][A-Za-z0-9 ,.()+_/-]{1,79}$/.test(normalized)
  ) {
    return false;
  }
  if (macDeviceFamilyPattern.test(normalized)) return isMacDeviceDescription(normalized);
  const vocabulary = normalizeDesktopDeviceVocabulary(normalized);
  const compactVocabulary = vocabulary.replace(/\s+/g, "").toLowerCase();
  const copilot = desktopCopilotTokenPattern.exec(vocabulary);
  const copilotHardwarePrefixWords =
    copilot === null
      ? []
      : (vocabulary.slice(0, copilot.index).match(/[A-Za-z][A-Za-z0-9+]*/g) ?? []);
  const copilotHardwarePrefix = copilot === null ? "" : vocabulary.slice(0, copilot.index);
  const isCopilotPcHardware =
    copilot !== null &&
    desktopCopilotPcPattern.test(vocabulary) &&
    !desktopCopilotSoftwarePrefixPattern.test(copilotHardwarePrefix) &&
    copilotHardwarePrefixWords.some((word) => !genericDesktopDeviceWords.has(word.toLowerCase()));
  if (
    explicitDesktopPlaceholderPattern.test(vocabulary) ||
    explicitDesktopPlaceholderPattern.test(normalized) ||
    evidenceDocumentPattern.test(vocabulary) ||
    evidenceDocumentPattern.test(normalized) ||
    desktopNonIdentityPattern.test(vocabulary) ||
    desktopNonIdentityPattern.test(normalized) ||
    nonDesktopProductDescriptionPattern.test(vocabulary) ||
    nonDesktopProductDescriptionPattern.test(normalized) ||
    browserOnlyDesktopDevicePattern.test(normalized) ||
    browserOnlyDesktopDevicePattern.test(vocabulary) ||
    desktopDeviceAbsencePattern.test(vocabulary) ||
    desktopMissingValuePattern.test(vocabulary) ||
    desktopForbiddenCompoundPattern.test(compactVocabulary) ||
    (copilot !== null && !isCopilotPcHardware) ||
    desktopCompactSoftwareOnlyPattern.test(compactVocabulary) ||
    desktopCompactMobileOsPattern.test(compactVocabulary)
  ) {
    return false;
  }
  const identityWords = vocabulary.match(/[A-Za-z][A-Za-z0-9+]*/g) ?? [];
  const uppercaseCount = (normalized.match(/[A-Z]/g) ?? []).length;
  const hasDescriptionStructure =
    /\d/.test(normalized) || /[\s_./()+,-]/.test(normalized) || uppercaseCount >= 2;
  // The release contract requires a maintained desktop browser, not a closed hardware catalog.
  // Keep the device label non-placeholder while allowing real and future product families.
  return (
    hasDescriptionStructure &&
    identityWords.some((word) => !genericDesktopDeviceWords.has(word.toLowerCase()))
  );
}
const virtualDeviceSource = "(?:emulators?|simulators?|virtual(?:\\s+devices?)?)";
const mobilePlaceholderPattern = new RegExp(
  `(?:\\b(?:default|demo|example|generic|placeholder|prototype|sample|temporary|test|unknown)\\b|${virtualDeviceSource})`,
  "i",
);
const browserOnlyDevicePattern =
  /^(?:(?:Google|Microsoft|Mozilla|Apple|Mobile)\s+)?(?:Safari|Chrome|Chromium|Firefox|Edge|WebKit|Mozilla)(?:$|[\s/-].*)/i;
const ambiguousEdgeModelPattern =
  /^(?!.*(?:browser|chrome|chromium|firefox|mozilla|safari|webkit))Edge\s*\d[A-Za-z0-9 .()+_/-]*$/i;
const mobileNonIdentityPattern =
  /\b(?:abc|fake|fixture|mock|qa|wid|widget)\d*\b|(?:abc|fake|fixture|mock|qa|wid|widget)\d*$/i;
const mobileMissingValuePattern = /^(?:n\s*\/?\s*a|none|nil|null|pending|tba|tbd|unset)$/i;
const mobileMissingMarkerPattern =
  /\b(?:none|nil|null|pending|tba|tbd|unset)\b|\bn\s+a(?:\s+(?:device|handset|hardware|mobile|model|phone|tablet|unit))?\b/i;
const mobilePlaceholderCompoundPattern =
  /\btest(?:\s+)?(?:device|handset|hardware|mobile|model|phone|tablet|unit)\b/i;
const mobileForbiddenSubstringPattern =
  /(?:sample|generic|unknown|placeholder|example|widget|mock|fake|fixture|dummy)|(?:none|nil|null|pending|tba|tbd|unset)(?:device|handset|hardware|mobile|model|phone|tablet|unit)|(?:qa|abc|wid)(?:device|handset|hardware|mobile|model|phone|tablet|unit)/i;
const genericMobileDeviceWords = new Set([
  "actual",
  "android",
  "available",
  "browser",
  "device",
  "handset",
  "hardware",
  "ios",
  "ipados",
  "linux",
  "macos",
  "mobile",
  "model",
  "operating",
  "os",
  "phone",
  "physical",
  "system",
  "tablet",
  "touch",
  "windows",
]);
const mobileDeviceClasses = new Set(["phone", "tablet"]);
const genericMobileLabelTokens = new Set([
  ...genericMobileDeviceWords,
  "abc",
  "apple",
  "chrome",
  "chromium",
  "dummy",
  "example",
  "fake",
  "firefox",
  "fixture",
  "generic",
  "google",
  "microsoft",
  "mock",
  "mozilla",
  "na",
  "nil",
  "no",
  "none",
  "null",
  "pending",
  "placeholder",
  "qa",
  "safari",
  "sample",
  "tba",
  "tbd",
  "test",
  "unit",
  "unknown",
  "unset",
  "web",
  "webkit",
  "wid",
  "widget",
]);
const mobileOperatingSystemDescriptionPattern =
  /^(?:(iOS|iPadOS)\s+\d+(?:\.\d+){0,3}|(Android)\s+(?:\d+L?|\d+(?:\.\d+){1,3}))$/i;
const environmentMetadataRequirements = {
  "macos-safari-voiceover": {
    operatingSystem: /\bmacOS\b.*\d/i,
    browser: (value) => isMaintainedBrowserDescription(value, safariProducts),
    assistiveTechnology: /\bVoiceOver\b/i,
    device: isMacDeviceDescription,
  },
  "macos-chromium-keyboard": {
    operatingSystem: /\bmacOS\b.*\d/i,
    browser: (value) => isMaintainedBrowserDescription(value, chromiumProducts),
    assistiveTechnology: /keyboard[- ]only/i,
    device: isMacDeviceDescription,
  },
  "zoom-reflow-contrast": {
    browser: (value) => isMaintainedBrowserDescription(value, maintainedBrowserProducts),
    device: isConcreteDesktopDeviceDescription,
  },
  "mobile-touch": {
    operatingSystem: (value) => mobileOperatingSystemDescriptionPattern.test(value),
    browser: (value, environment) =>
      isMaintainedBrowserDescription(
        value,
        /\bAndroid\b/i.test(environment?.operatingSystem ?? "")
          ? androidMobileBrowserProducts
          : /\b(?:iOS|iPadOS)\b/i.test(environment?.operatingSystem ?? "")
            ? appleMobileBrowserProducts
            : maintainedBrowserProducts,
      ),
  },
};

let record;
try {
  record = JSON.parse(await readFile(recordPath, "utf8"));
} catch (error) {
  errors.push(`Stable accessibility smoke record must be readable JSON: ${error.message}`);
  record = {};
}
if (!isJsonObject(record)) {
  errors.push("Stable accessibility smoke record must be a JSON object.");
  record = {};
}

const isIsoUtc = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) &&
  Number.isFinite(Date.parse(value));
const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;
const normalizeContractedNegations = (value) =>
  typeof value === "string"
    ? value
        .replace(/\bcan['’]t\b/gi, "can not")
        .replace(/\bwon['’]t\b/gi, "will not")
        .replace(/\b([A-Za-z]+)n['’]t\b/gi, "$1 not")
        .replace(/\bcannot\b/gi, "can not")
    : value;
const negatedSetupPattern =
  /\b(?:no|not|never|neither|nor|without|disabled|off|untested|skipped|unavailable|absent|failed|impossible)\b/i;
const negatedDeviceDescriptionPattern = /^\s*(?:no|not(?:\s+an?)?|without)\b/i;
function isComposedOnlyOfGenericMobileLabelTokens(value) {
  const letters = value.toLowerCase().replace(/\d+/g, "");
  if (letters.length === 0) return true;
  const reachable = Array.from({ length: letters.length + 1 }, () => false);
  reachable[0] = true;
  for (let index = 0; index < letters.length; index += 1) {
    if (!reachable[index]) continue;
    for (const token of genericMobileLabelTokens) {
      if (letters.startsWith(token, index)) reachable[index + token.length] = true;
    }
  }
  return reachable[letters.length];
}
function isGenericMobileLabelPhrase(value) {
  const words = value.toLowerCase().match(/[a-z]+/g) ?? [];
  if (["a", "an", "the"].includes(words[0])) words.shift();
  return words.length > 0 && words.every((word) => genericMobileLabelTokens.has(word));
}
const isConcreteMobileDeviceLabel = (value) => {
  if (typeof value !== "string") return false;
  const device = value.trim();
  const vocabulary = normalizeDesktopDeviceVocabulary(device);
  const compactVocabulary = vocabulary.replace(/\s+/g, "");
  if (
    !/^[A-Za-z0-9][A-Za-z0-9 ,.()+_/-]{2,79}$/.test(device) ||
    mobilePlaceholderPattern.test(device) ||
    mobilePlaceholderPattern.test(vocabulary) ||
    evidenceDocumentPattern.test(vocabulary) ||
    evidenceDocumentCompoundPattern.test(compactVocabulary) ||
    mobileForbiddenSubstringPattern.test(compactVocabulary) ||
    mobileNonIdentityPattern.test(vocabulary) ||
    mobileMissingValuePattern.test(vocabulary) ||
    mobileMissingMarkerPattern.test(vocabulary) ||
    mobilePlaceholderCompoundPattern.test(vocabulary) ||
    negatedDeviceDescriptionPattern.test(vocabulary) ||
    isComposedOnlyOfGenericMobileLabelTokens(compactVocabulary) ||
    isGenericMobileLabelPhrase(vocabulary) ||
    ((browserOnlyDevicePattern.test(device) || browserOnlyDevicePattern.test(vocabulary)) &&
      !ambiguousEdgeModelPattern.test(device) &&
      !ambiguousEdgeModelPattern.test(vocabulary))
  ) {
    return false;
  }
  const identityWords = vocabulary.match(/[A-Za-z][A-Za-z0-9+]*/g) ?? [];
  const meaningfulWords = identityWords.filter(
    (word) => !genericMobileDeviceWords.has(word.toLowerCase()),
  );
  // The model label is self-attested metadata, not a source for class or physical-use claims.
  return meaningfulWords.length > 0 && (/\d/.test(device) || identityWords.length >= 2);
};
const requiredZoomLevels = ["200%", "400%"];
const hasRequiredZoomLevels = (value) =>
  Array.isArray(value) &&
  value.length === requiredZoomLevels.length &&
  new Set(value).size === requiredZoomLevels.length &&
  requiredZoomLevels.every((level) => value.includes(level));
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
  if (releaseMetadata !== undefined && !isJsonObject(releaseMetadata)) {
    errors.push("Release metadata must be a JSON object.");
    releaseMetadata = undefined;
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
    const usesStructuredDesktopOperatingSystem =
      environment?.id === "zoom-reflow-contrast" && field === "operatingSystem";
    if (complete && !usesStructuredDesktopOperatingSystem && !nonEmpty(environment?.[field])) {
      errors.push(`${prefix}.${field} is required when complete.`);
    }
  }
  if (environment?.id === "zoom-reflow-contrast" && environment?.operatingSystem !== null) {
    errors.push(
      `${prefix}.operatingSystem must remain null; use operatingSystemFamily and operatingSystemVersion.`,
    );
  }
  if (
    !complete &&
    environment?.id === "zoom-reflow-contrast" &&
    environment?.zoomLevelsTested !== null
  ) {
    errors.push(`${prefix}.zoomLevelsTested must remain null while evidence is pending.`);
  }
  if (
    !complete &&
    environment?.id === "zoom-reflow-contrast" &&
    environment?.increasedOrHighContrastEnabled !== null
  ) {
    errors.push(
      `${prefix}.increasedOrHighContrastEnabled must remain null while evidence is pending.`,
    );
  }
  if (!complete && environment?.id === "zoom-reflow-contrast") {
    for (const field of ["operatingSystemFamily", "operatingSystemVersion"]) {
      if (environment?.[field] !== null) {
        errors.push(`${prefix}.${field} must remain null while evidence is pending.`);
      }
    }
  }
  if (!complete && environment?.id === "mobile-touch") {
    if (environment?.deviceClass !== null) {
      errors.push(`${prefix}.deviceClass must remain null while evidence is pending.`);
    }
    if (environment?.physicalDeviceUsed !== null) {
      errors.push(`${prefix}.physicalDeviceUsed must remain null while evidence is pending.`);
    }
  }
  if (complete) {
    const requirements = environmentMetadataRequirements[environment?.id] ?? {};
    for (const [field, requirement] of Object.entries(requirements)) {
      const value = environment?.[field];
      const normalizedValue = typeof value === "string" ? value.trim() : "";
      const matchesRequirement =
        typeof requirement === "function"
          ? requirement(normalizedValue, environment)
          : requirement.test(normalizedValue);
      const negated =
        (field === "device" && negatedDeviceDescriptionPattern.test(normalizedValue)) ||
        (["operatingSystem", "browser", "assistiveTechnology"].includes(field) &&
          negatedSetupPattern.test(normalizeContractedNegations(value)));
      if (nonEmpty(value) && (!matchesRequirement || negated)) {
        errors.push(`${prefix}.${field} does not match the required ${environment.id} setup.`);
      }
    }
    if (
      environment?.id === "zoom-reflow-contrast" &&
      !hasRequiredZoomLevels(environment.zoomLevelsTested)
    ) {
      errors.push(`${prefix}.zoomLevelsTested must contain exactly "200%" and "400%".`);
    }
    if (
      environment?.id === "zoom-reflow-contrast" &&
      environment?.increasedOrHighContrastEnabled !== true
    ) {
      errors.push(
        `${prefix}.increasedOrHighContrastEnabled must equal true after the setting was tested.`,
      );
    }
    if (environment?.id === "zoom-reflow-contrast") {
      if (!desktopOperatingSystemFamilies.has(environment.operatingSystemFamily)) {
        errors.push(
          `${prefix}.operatingSystemFamily must be one of: ${[...desktopOperatingSystemFamilies].join(", ")}.`,
        );
      }
      if (
        typeof environment.operatingSystemVersion !== "string" ||
        !desktopOperatingSystemVersionPattern.test(environment.operatingSystemVersion)
      ) {
        errors.push(
          `${prefix}.operatingSystemVersion must be a standalone numeric OS version when complete.`,
        );
      }
    }
    if (environment?.id === "mobile-touch") {
      const operatingSystem = environment.operatingSystem ?? "";
      const device = typeof environment.device === "string" ? environment.device.trim() : "";
      const deviceClass = environment.deviceClass;
      const operatingSystemMatch = mobileOperatingSystemDescriptionPattern.exec(
        operatingSystem.trim(),
      );
      const operatingSystemFamily = (
        operatingSystemMatch?.[1] ?? operatingSystemMatch?.[2]
      )?.toLowerCase();
      if (operatingSystemMatch === null) {
        errors.push(`${prefix}.operatingSystem must name exactly one supported mobile OS family.`);
      }
      if (!mobileDeviceClasses.has(deviceClass)) {
        errors.push(`${prefix}.deviceClass must equal "phone" or "tablet" when complete.`);
      } else if (
        (operatingSystemFamily === "ios" && deviceClass !== "phone") ||
        (operatingSystemFamily === "ipados" && deviceClass !== "tablet")
      ) {
        errors.push(`${prefix}.deviceClass does not match the recorded mobile OS family.`);
      }
      if (environment.physicalDeviceUsed !== true) {
        errors.push(`${prefix}.physicalDeviceUsed must equal true when complete.`);
      }
      if (!isConcreteMobileDeviceLabel(device)) {
        errors.push(
          `${prefix}.device must be a concrete non-placeholder mobile model label when complete.`,
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
