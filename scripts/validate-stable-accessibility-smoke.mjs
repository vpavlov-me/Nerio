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
const macDeviceFamilyPattern = /\b(?:MacBook\s+(?:Air|Pro)|Mac (?:mini|Studio|Pro)|iMac)\b/i;
const explicitDesktopPlaceholderPattern =
  /\b(?:test|sample|generic|unknown|placeholder|example)\b/i;
const knownUnnumberedDesktopFamilyPattern = /\bFramework\s+Laptop\b/i;
const identityNegationPattern = /\b(?:not|never|without|no(?!\.))\b/i;
const genericDesktopWords = new Set([
  "desktop",
  "laptop",
  "computer",
  "chromebook",
  "chromeos",
  "hardware",
  "machine",
  "pc",
  "device",
  "model",
  "workstation",
  "windows",
  "macos",
  "linux",
  "ubuntu",
]);
const genericDesktopOperatingSystemWords = new Set([
  "build",
  "computer",
  "current",
  "desktop",
  "environment",
  "kernel",
  "operating",
  "os",
  "platform",
  "release",
  "stable",
  "system",
  "version",
]);
const genericDesktopOperatingSystemSource = [...genericDesktopOperatingSystemWords].join("|");
const mobileOperatingSystemPattern = /\b(?:Android|iOS|iPadOS)\b/i;
const browserOnlyOperatingSystemPattern = new RegExp(
  `^(?:(?:${genericDesktopOperatingSystemSource})\\s+)*(?:(?:Apple|Google|Microsoft|Mozilla)\\s+)?(?:Safari|Chrome(?!\\s+OS\\b)|Chromium(?!\\s+OS\\b)|Firefox|Edge|WebKit)(?:$|[\\s/-].*)`,
  "i",
);
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
function isConcreteDesktopOperatingSystem(value) {
  const normalized = normalizeContractedNegations(value);
  if (
    typeof normalized !== "string" ||
    !/^[A-Za-z][A-Za-z0-9 .()+_/-]{1,79}$/.test(normalized) ||
    !/\d/.test(normalized) ||
    explicitDesktopPlaceholderPattern.test(normalized) ||
    mobileOperatingSystemPattern.test(normalized) ||
    browserOnlyOperatingSystemPattern.test(normalized)
  ) {
    return false;
  }
  const identity = [...normalized.matchAll(/[A-Za-z][A-Za-z0-9-]*/g)].find(
    ([word]) => !genericDesktopOperatingSystemWords.has(word.toLowerCase()),
  );
  return (
    identity !== undefined && !identityNegationPattern.test(normalized.slice(0, identity.index))
  );
}
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
  if (typeof normalized !== "string" || explicitDesktopPlaceholderPattern.test(normalized)) {
    return false;
  }
  if (macDeviceFamilyPattern.test(normalized)) return isMacDeviceDescription(normalized);
  const words = [...normalized.matchAll(/[A-Za-z][A-Za-z0-9-]*/g)];
  const identityWords = words.filter(([word]) => !genericDesktopWords.has(word.toLowerCase()));
  const numericIdentifier = /\d/.exec(normalized);
  const modelToken = identityWords.find(
    ([word]) => /^[A-Z]{2,}$/.test(word) || /^[A-Z][a-z]+(?:[A-Z][A-Za-z0-9]*)+$/.test(word),
  );
  const knownFamily = knownUnnumberedDesktopFamilyPattern.exec(normalized);
  const identity = knownFamily ?? modelToken ?? numericIdentifier;
  const hasModelIdentity =
    knownFamily !== null ||
    (modelToken !== undefined && identityWords.length >= 2) ||
    (numericIdentifier !== null && identityWords.length >= 1);
  return (
    hasModelIdentity &&
    identity !== null &&
    !identityNegationPattern.test(normalized.slice(0, identity.index))
  );
}
const virtualDeviceSource = "(?:emulators?|simulators?|virtual(?:\\s+devices?)?)";
const virtualDevicePattern = new RegExp(`\\b${virtualDeviceSource}\\b`, "i");
const mobilePlaceholderPattern = new RegExp(
  `\\b(?:test|sample|generic|unknown|placeholder|example|${virtualDeviceSource})\\b`,
  "i",
);
const nonAndroidFamilyPattern =
  /(?:iPhones?|iPads?|\bApple\b|MacBook|Mac mini|Mac Studio|Mac Pro|iMac|\b(?:Android|iOS|iPadOS|Windows|macOS|Linux)\b)/i;
const browserOnlyDevicePattern =
  /^(?:(?:Google|Mozilla|Apple|Mobile)\s+)?(?:Safari|Chrome|Chromium|Firefox|Edge|WebKit|Mozilla)(?:$|[\s/-].*)/i;
const genericMobileWords = new Set([
  "physical",
  "mobile",
  "touch",
  "device",
  "phone",
  "tablet",
  "hardware",
  "handset",
]);
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
    operatingSystem: isConcreteDesktopOperatingSystem,
    browser: (value) => isMaintainedBrowserDescription(value, maintainedBrowserProducts),
    device: isConcreteDesktopDeviceDescription,
  },
  "mobile-touch": {
    operatingSystem: /\b(?:iOS|iPadOS|Android)\b.*\d/i,
    browser: (value) => isMaintainedBrowserDescription(value, maintainedBrowserProducts),
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
    ? value.replace(/\b([A-Za-z]+)n['’]t\b/gi, "$1 not").replace(/\bcannot\b/gi, "can not")
    : value;
const nonCompletionModifierSource =
  "(?:allegedly|apparently|barely|conditionally|hardly|incompletely|insufficiently|lightly|maybe|merely|minimally|mostly|nearly|nominally|ostensibly|partially|partly|perhaps|possibly|potentially|presumably|probably|provisionally|reportedly|roughly|scarcely|seemingly|selectively|superficially|supposedly|tentatively)";
const completionModifierTokenSource = `(?!(?:${nonCompletionModifierSource})\\b)(?:[A-Za-z]+ly|already|both|later|now|today|yesterday)`;
const completionModifierSource = `(?:${completionModifierTokenSource}\\s+){0,2}`;
const hasNonEvidenceAction = (value, actionSource, completedCorrectionSource) => {
  const nonEvidenceAction = new RegExp(
    `\\b(?:(?:must|should|will|shall|can|could|may|might|would)\\s+(?:(?:actually|already|eventually|later|possibly|probably|soon|still)\\s+){0,2}(?:(?:have\\s+)?been\\s+|have\\s+|be\\s+)?${actionSource}|(?:am|is|are|was|were)\\s+(?:(?:going|about|set|due|supposed)\\s+to|to)\\s+(?:be\\s+)?${actionSource}|(?:planned|scheduled|expected|required|intended)\\s+(?:to\\s+)?(?:be\\s+)?${actionSource}|needs?\\s+to\\s+(?:be\\s+)?${actionSource}|${nonCompletionModifierSource}\\s+(?:(?:am|is|are|was|were|has|have|had)\\s+(?:been\\s+)?)?${actionSource})\\b`,
    "i",
  );
  const match = nonEvidenceAction.exec(value);
  if (!match) return false;
  const correctionSource =
    completedCorrectionSource ??
    `${completionModifierSource}(?:(?:am|is|are|was|were)\\s+|(?:has|have|had)\\s+been\\s+)?${completionModifierSource}${actionSource}\\b`;
  const completedCorrection = new RegExp(
    `\\b(?:but(?:\\s+also)?|and(?:\\s+then)?|then)\\s+${correctionSource}`,
    "i",
  );
  return !completedCorrection.test(value.slice(match.index + match[0].length));
};
const negatedSetupPattern =
  /\b(?:no|not|never|neither|nor|without|disabled|off|untested|skipped|unavailable|absent|failed|impossible)\b/i;
const negatedDeviceDescriptionPattern = /^\s*(?:no|not(?:\s+an?)?|without)\b/i;
const isConcreteAppleMobileDevice = (value) => {
  if (typeof value !== "string") return false;
  const device = value.trim();
  if (
    !/^(?:iPhone|iPad)\s+[A-Za-z0-9][A-Za-z0-9 .()+_/-]{0,60}$/i.test(device) ||
    mobilePlaceholderPattern.test(device) ||
    /\b(?:Safari|Chrome|Chromium|Firefox|Edge|Android|macOS|Windows|Linux|physical|mobile|touch|device|phone|tablet|hardware|handset)\b/i.test(
      device,
    )
  ) {
    return false;
  }
  const model = device.replace(/^(?:iPhone|iPad)\s+/i, "");
  return /\d/.test(model) || /^(?:X|XR|XS|SE|Air)\b/i.test(model);
};
const isConcreteAndroidMobileDevice = (value) => {
  if (typeof value !== "string") return false;
  const device = value.trim();
  if (
    !/^[A-Za-z0-9][A-Za-z0-9 .()+_/-]{2,79}$/.test(device) ||
    mobilePlaceholderPattern.test(device) ||
    nonAndroidFamilyPattern.test(device) ||
    browserOnlyDevicePattern.test(device)
  ) {
    return false;
  }
  const tokens = device.match(/[A-Za-z0-9]+/g) ?? [];
  const descriptiveWords = tokens.filter(
    (token) => /[A-Za-z]/.test(token) && !genericMobileWords.has(token.toLowerCase()),
  );
  if (descriptiveWords.length === 0) return false;
  const hasModelIdentifier = /[A-Za-z]/.test(device) && /\d/.test(device);
  return hasModelIdentifier || descriptiveWords.length >= 2;
};
const hasRequiredZoom = (value) => {
  const normalized = normalizeContractedNegations(value);
  const affirmativeZoomAction = "(?:tested|verified|checked|completed|passed)";
  const levelSource = (level) => `\\b${level}%`;
  const coordinatedLevelsSource = `(?:${levelSource(200)}\\s*(?:,?\\s*(?:and|&)|/)\\s*${levelSource(400)}|${levelSource(400)}\\s*(?:,?\\s*(?:and|&)|/)\\s*${levelSource(200)})`;
  const followingLevelBoundarySource = `(?=\\s*(?:$|(?:,\\s*(?:and\\s+)?|(?:and|&)\\s+)(?:${levelSource(200)}|${levelSource(400)})))`;
  const completionTailSource = `(?:\\s+${completionModifierTokenSource}){0,2}${followingLevelBoundarySource}`;
  const actionBeforeTargetSource = `\\b${affirmativeZoomAction}\\b(?:\\s+(?:reflow|zoom|layout|content|testing|verification|checks?))?(?:\\s+(?:at|with|on|under))?\\s+`;
  const actionAfterTargetSource = `(?:\\s+|\\s*,\\s*)(?:(?:reflow|zoom|layout|content|testing|verification|checks?)\\s+)?(?:(?:am|is|are|was|were)\\s+|(?:has|have|had)\\s+been\\s+)?${completionModifierSource}\\b${affirmativeZoomAction}\\b${completionTailSource}`;
  const correctedActionAfterTargetSource = `[^.;\\n]{0,56}\\b(?:but(?:\\s+also)?|and(?:\\s+then)?|then)\\s+${completionModifierSource}(?:(?:am|is|are|was|were)\\s+|(?:has|have|had)\\s+been\\s+)?${completionModifierSource}\\b${affirmativeZoomAction}\\b${completionTailSource}`;
  const evidenceClauses = typeof normalized === "string" ? normalized.split(/[.;\n]+/) : [];
  const hasTargetEvidence = (targetSource, requireTargetBoundary = false) => {
    const directEvidence = new RegExp(
      `(?:${actionBeforeTargetSource}${targetSource}${requireTargetBoundary ? followingLevelBoundarySource : ""}|${targetSource}${actionAfterTargetSource})`,
      "i",
    );
    const correctedEvidence = new RegExp(`${targetSource}${correctedActionAfterTargetSource}`, "i");
    return evidenceClauses.some(
      (clause) =>
        (directEvidence.test(clause) || correctedEvidence.test(clause)) &&
        !hasNonEvidenceAction(clause, affirmativeZoomAction),
    );
  };
  const hasSharedLevelEvidence = hasTargetEvidence(coordinatedLevelsSource, true);
  return (
    typeof normalized === "string" &&
    /\b200%/.test(normalized) &&
    /\b400%/.test(normalized) &&
    (hasSharedLevelEvidence ||
      (hasTargetEvidence(levelSource(200)) && hasTargetEvidence(levelSource(400)))) &&
    !/\b(?:not|never|without|skipped|untested|unavailable|absent|failed|impossible)\b[^.;\n]{0,40}(?:200%|400%)|(?:200%|400%)[^.;\n]{0,40}\b(?:not|never|without|skipped|untested|unavailable|absent|failed|impossible)\b/i.test(
      normalized,
    ) &&
    !/\bno\s+(?:(?:testing|tests?|verification|evidence)\b[^.;\n]{0,40})?(?:at\s+)?(?:200%|400%)|\bneither\b[^.;\n]{0,40}(?:200%|400%)[^.;\n]{0,40}\bnor\b/i.test(
      normalized,
    ) &&
    !/(?:200%|400%)[^.;\n]{0,40}\bno\s+(?:testing|tests?|verification|evidence)\b|\bneither\b[^.;\n]{0,40}\b(?:tested|verified|checked)\b[^.;\n]{0,40}(?:200%|400%)/i.test(
      normalized,
    )
  );
};
const hasEnabledContrast = (value) => {
  const normalized = normalizeContractedNegations(value);
  if (typeof normalized !== "string") return false;
  const target = "(?:high|increased|increase) contrast";
  const positive = new RegExp(
    `(?:\\b${target}\\b[^.;,\\n]{0,40}\\b(?:(?:is|was|remained|stayed|kept)\\s+)?(?:enabled|active)\\b|\\b(?:enabled|activated|turned\\s+on)\\b[^.;,\\n]{0,40}\\b${target}\\b)`,
    "i",
  );
  const negative = new RegExp(
    `(?:\\b${target}\\b[^.;,\\n]{0,40}\\b(?:not|never|disabled|off|unavailable|absent|failed|impossible)\\b|\\bno\\s+${target}\\b\\s*(?:(?:is|was|remained)\\s+)?(?:enabled|active|available)\\b|\\b(?:not|never|without)\\s+(?:(?:using|having|enabling|activating)\\s+)?(?:the\\s+)?${target}\\b|\\bneither\\b(?=[^.;,\\n]{0,64}\\bnor\\b)(?=[^.;,\\n]{0,64}\\b${target}\\b))`,
    "i",
  );
  const anaphoricCompletionTail = `(?=(?:\\s+${completionModifierTokenSource}){0,2}\\s*(?:$|(?:during|throughout|for)\\s+(?:(?:the|this)\\s+)?(?:test|testing|smoke|audit|verification)\\b))`;
  const targetBoundCorrection = `(?:${completionModifierSource}(?:(?:am|is|are|was|were)\\s+|(?:has|have|had)\\s+been\\s+)${completionModifierSource}(?:enabled|active)\\b${anaphoricCompletionTail}|${completionModifierSource}(?:enabled|activated|turned\\s+on)\\b\\s+(?:(?:the|macOS)\\s+){0,2}${target}\\b|(?:the\\s+)?${target}\\b\\s+${completionModifierSource}(?:(?:is|was|remained|stayed|kept)\\s+)?${completionModifierSource}(?:enabled|active)\\b)`;
  return normalized
    .split(/[.;,\n]+/)
    .some(
      (clause) =>
        positive.test(clause) &&
        !negative.test(clause) &&
        !hasNonEvidenceAction(
          clause,
          "(?:enabled|active|activated|turned\\s+on)",
          targetBoundCorrection,
        ),
    );
};
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const asFlexibleRegexPhrase = (value) => value.trim().split(/\s+/).map(escapeRegExp).join("\\s+");
const hasPhysicalTouchClaim = (value, device) => {
  const normalized = normalizeContractedNegations(value);
  if (typeof normalized !== "string") return false;
  const concreteModel =
    typeof device === "string" && device.trim().length > 0
      ? `|physical\\s+${asFlexibleRegexPhrase(device)}`
      : "";
  const target = `(?:physical(?:\\s+mobile)?\\s+(?:touch\\s+)?(?:device|phone|tablet)${concreteModel})`;
  const boundedTarget = `\\b${target}(?![A-Za-z0-9_])`;
  const actionToTargetBridge =
    "(?:(?!\\b(?:simulators?|emulators?|virtual|physical|device|phone|tablet)\\b)[^;,\\n]){0,56}";
  const directPositive = new RegExp(
    `(?:\\b(?:tested|used|using)\\b${actionToTargetBridge}\\b(?:on|with|using)\\s+(?:(?:an?|the)\\s+)?${boundedTarget}|\\b(?:tested|used|using)\\b\\s+(?:(?:an?|the)\\s+)?${boundedTarget}|${boundedTarget}[^;,\\n]{0,40}\\b(?:(?:is|was|were|are|remained)\\s+)?(?:used|tested)\\b)`,
    "i",
  );
  const contextualActionBridge = `(?:\\s+${completionModifierTokenSource}){0,2}(?:\\s+(?:(?:the|this)\\s+)?(?:touch\\s+(?:interaction|controls?|testing)|tests?|testing|verification|checks?|smoke(?:\\s+(?:test(?:ing)?|checks?))?|audit))?(?:\\s+${completionModifierTokenSource}){0,2}`;
  const contextualPositive = new RegExp(
    `\\b(?:verified|performed|completed|ran|passed)\\b${contextualActionBridge}\\s+(?:on|with|using)\\s+(?:(?:an?|the)\\s+)?${boundedTarget}`,
    "i",
  );
  const directContextualCorrection = new RegExp(
    `\\b(?:verified|performed|completed|ran|passed)\\b(?:\\s+${completionModifierTokenSource}){0,2}\\s+(?:on|with|using)\\s+(?:(?:an?|the)\\s+)?${boundedTarget}`,
    "i",
  );
  const actualTestContextSource =
    "(?:tested|testing|tests?|verification|touch\\s+(?:interaction|controls?|testing)|smoke(?:\\s+(?:test(?:ing)?|checks?))?)";
  const actualTestContext = new RegExp(`\\b${actualTestContextSource}\\b`, "i");
  const absentTestActionSource =
    "(?:available|completed|conducted|done|executed|performed|run|carried\\s+out)";
  const absentTestStateSource =
    "(?:aborted|absent|blocked|canceled|cancelled|deferred|failed|incomplete|pending|postponed|skipped|unavailable|unperformed|untested)";
  const remoteQualifierBoundary = "(?!\\s+remotely\\b)";
  const absentTestContext = new RegExp(
    `(?:\\b(?:no|without)\\s+(?:(?:actual|completed)\\s+)?${actualTestContextSource}\\b|\\b${actualTestContextSource}\\b[^;,\\n]{0,32}\\b(?:(?:did|does|do)\\s+(?:not|never)\\s+(?:complete|conduct|execute|happen|occur|perform|run|carry\\s+out)${remoteQualifierBoundary}|(?:was|were|is|are|has|have|had|can|could|would|will|should|may|might)\\s+(?:not|never)\\s+(?:(?:be|been)\\s+)?${absentTestActionSource}${remoteQualifierBoundary}|(?:was|were|is|are|has|have|had|remained|stayed|became)\\s+(?:been\\s+)?${absentTestStateSource}\\b|never\\s+(?:completed|happened|occurred|ran)${remoteQualifierBoundary})|\\b${actualTestContextSource}\\b\\s+(?:failed|skipped)\\b)`,
    "i",
  );
  const unrelatedCompletionTarget = /\b(?:assignment|checklist)\b/i;
  const negativeAction =
    "(?:tested|used|verified|performed|completed|ran|passed|testing|using|test|use|verify|perform|complete|run|pass)";
  const modifierBridge =
    "(?:\\s+(?!(?:but|simulators?|emulators?|virtual|physical|device|phone|tablet)\\b)[A-Za-z-]+){0,6}";
  const negativePatterns = [
    new RegExp(
      `${boundedTarget}\\s+(?:(?:(?:is|was|were|are|remained|stayed)\\s+)(?:not\\s+)?(?:used|tested|available|working|unavailable|absent|failed|disabled|off)|(?:not|never)\\s+(?:used|tested|available|working))\\b`,
      "i",
    ),
    new RegExp(
      `\\bno\\s+${target}(?![A-Za-z0-9_])\\s*(?:(?:is|was|were|are)\\s+)?(?:used|tested|available|working)\\b`,
      "i",
    ),
    new RegExp(
      `\\b(?:not|never|without)${modifierBridge}\\s+${negativeAction}${modifierBridge}(?:\\s+(?:on|with|using))?\\s+(?:(?:an?|the)\\s+)?${boundedTarget}`,
      "i",
    ),
    new RegExp(
      `\\b(?:not|never)${modifierBridge}\\s+(?:(?:on|with|using)\\s+)?(?:(?:an?|the)\\s+)?${boundedTarget}`,
      "i",
    ),
    new RegExp(
      `\\bwithout${modifierBridge}\\s+(?:(?:using|with)\\s+)?(?:(?:an?|the)\\s+)?${boundedTarget}`,
      "i",
    ),
    new RegExp(
      `\\bno\\s+(?:(?!(?:issues?|problems?|defects?)\\b)[A-Za-z-]+\\s+){0,3}(?:testing|tests?|verification|evidence)\\b[^;,:\\n]{0,64}${boundedTarget}`,
      "i",
    ),
    new RegExp(`\\bneither\\b(?=[^;,\\n]{0,64}\\bnor\\b)(?=[^;,\\n]{0,64}${boundedTarget})`, "i"),
    new RegExp(`\\banything\\s+but\\s+${negativeAction}[^;,:\\n]{0,64}${boundedTarget}`, "i"),
    new RegExp(
      `${boundedTarget}[^;:\n]{0,64}\\b(?:but\\s+)?no\\s+(?:(?!(?:issues?|problems?|defects?)\\b)[A-Za-z-]+\\s+){0,3}(?:testing|tests?|verification|evidence)\\b`,
      "i",
    ),
  ];
  return normalized.split(/(?<![A-Za-z0-9])\.|\.(?![A-Za-z0-9])|[;:\n]+/).some((clause) => {
    const semanticClause = clause.replace(
      /\bnot\s+(?:only|just|merely|simply)\b(?=[^;,:\n]{0,96}\bbut(?:\s+also)?\b)/gi,
      "",
    );
    const negativeClause = semanticClause.replace(/[,–—]/g, " ");
    if (negativePatterns.some((pattern) => pattern.test(negativeClause))) return false;
    let inheritedTestContext = false;
    let inheritedTestSubject = false;
    return semanticClause.split(/\b(?:but(?:\s+also)?|(?:and\s+)?then)\b/i).some((segment) => {
      const hasSegmentTestContext = actualTestContext.test(segment);
      const hasAffirmativeSegmentTestContext =
        hasSegmentTestContext && !absentTestContext.test(segment);
      const hasEvidence =
        directPositive.test(segment) ||
        (inheritedTestSubject && directContextualCorrection.test(segment)) ||
        ((hasAffirmativeSegmentTestContext || inheritedTestContext) &&
          !unrelatedCompletionTarget.test(segment) &&
          contextualPositive.test(segment));
      inheritedTestSubject ||= hasSegmentTestContext;
      inheritedTestContext ||= hasAffirmativeSegmentTestContext;
      return hasEvidence && !hasNonEvidenceAction(segment, negativeAction);
    });
  });
};
const hasNonNegatedVirtualMention = (value) => {
  const normalized = normalizeContractedNegations(value);
  if (typeof normalized !== "string") return false;
  const groupedVirtualDevices = `${virtualDeviceSource}(?:\\s+(?:or|nor)\\s+(?:an?\\s+)?${virtualDeviceSource})*`;
  const negatedPatterns = [
    new RegExp(`\\b(?:no|without)\\s+(?:using\\s+)?(?:an?\\s+)?${groupedVirtualDevices}\\b`, "gi"),
    new RegExp(
      `\\bneither\\s+(?:an?\\s+)?${virtualDeviceSource}\\s+nor\\s+(?:an?\\s+)?${virtualDeviceSource}\\b`,
      "gi",
    ),
    new RegExp(
      `\\b${groupedVirtualDevices}\\s+(?:(?:was|is|were|are|can|could|would|should|will|has|have|had)\\s+)?(?:not|never)\\s+(?:be\\s+)?(?:used|involved|present|available|enabled|working)\\b`,
      "gi",
    ),
    new RegExp(
      `\\b(?:did|do|does|can|could|would|should|will)\\s+(?:not|never)\\s+(?:use|involve)\\s+(?:an?\\s+)?${groupedVirtualDevices}\\b`,
      "gi",
    ),
    new RegExp(`\\bnot\\s+(?:an?\\s+)?${groupedVirtualDevices}\\b`, "gi"),
  ];
  const affirmativeRemainder = negatedPatterns.reduce(
    (remainder, pattern) => remainder.replace(pattern, " "),
    normalized,
  );
  return virtualDevicePattern.test(affirmativeRemainder);
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
    if (complete && !nonEmpty(environment?.[field])) {
      errors.push(`${prefix}.${field} is required when complete.`);
    }
  }
  if (complete) {
    const requirements = environmentMetadataRequirements[environment?.id] ?? {};
    for (const [field, requirement] of Object.entries(requirements)) {
      const value = environment?.[field];
      const normalizedValue = typeof value === "string" ? value.trim() : "";
      const matchesRequirement =
        typeof requirement === "function"
          ? requirement(normalizedValue)
          : requirement.test(normalizedValue);
      const negated =
        (field === "device" && negatedDeviceDescriptionPattern.test(normalizedValue)) ||
        (["operatingSystem", "browser", "assistiveTechnology"].includes(field) &&
          negatedSetupPattern.test(normalizeContractedNegations(value)));
      if (nonEmpty(value) && (!matchesRequirement || negated)) {
        errors.push(`${prefix}.${field} does not match the required ${environment.id} setup.`);
      }
    }
    if (environment?.id === "zoom-reflow-contrast" && !hasRequiredZoom(environment.zoom)) {
      errors.push(`${prefix}.zoom must affirm testing both 200% and 400% without negation.`);
    }
    if (environment?.id === "zoom-reflow-contrast" && !hasEnabledContrast(environment.notes)) {
      errors.push(`${prefix}.notes must confirm increased or high contrast was enabled.`);
    }
    if (
      environment?.id === "mobile-touch" &&
      (virtualDevicePattern.test(environment?.device ?? "") ||
        hasNonNegatedVirtualMention(environment.notes))
    ) {
      errors.push(`${prefix} must use a physical mobile touch device, not an emulator.`);
    }
    if (
      environment?.id === "mobile-touch" &&
      !hasPhysicalTouchClaim(environment.notes, environment.device)
    ) {
      errors.push(`${prefix}.notes must affirm use of a physical mobile touch device.`);
    }
    if (environment?.id === "mobile-touch") {
      const operatingSystem = environment.operatingSystem ?? "";
      const device = typeof environment.device === "string" ? environment.device.trim() : "";
      const hasAppleOperatingSystem = /\b(?:iOS|iPadOS)\b/i.test(operatingSystem);
      const hasAndroidOperatingSystem = /\bAndroid\b/i.test(operatingSystem);
      const hasExactlyOneOperatingSystemFamily =
        Number(hasAppleOperatingSystem) + Number(hasAndroidOperatingSystem) === 1;
      if (!hasExactlyOneOperatingSystemFamily) {
        errors.push(`${prefix}.operatingSystem must name exactly one supported mobile OS family.`);
      }
      const deviceMatchesOperatingSystem = hasExactlyOneOperatingSystemFamily
        ? hasAppleOperatingSystem
          ? isConcreteAppleMobileDevice(device)
          : isConcreteAndroidMobileDevice(device)
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
