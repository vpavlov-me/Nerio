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
const desktopEvidenceDocumentPattern =
  /\b(?:accessibility|audit|checklist|compliance|documentation|evidence|guide|manual|matrix|release|report|roadmap|worksheet)\b/i;
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
const desktopDeviceNegationPattern =
  /\b(?:absent|former|free|lacks?|missing|neither|never|nil|no|non|none|nor|not|unavailable|without)\b/i;
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
const androidMobileBrowserProducts = new Set(["chrome", "chromium", "edge", "firefox"]);
const appleMobileBrowserProducts = new Set(["safari", "chrome", "edge", "firefox"]);
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
    desktopEvidenceDocumentPattern.test(vocabulary) ||
    desktopEvidenceDocumentPattern.test(normalized) ||
    desktopNonIdentityPattern.test(vocabulary) ||
    desktopNonIdentityPattern.test(normalized) ||
    nonDesktopProductDescriptionPattern.test(vocabulary) ||
    nonDesktopProductDescriptionPattern.test(normalized) ||
    browserOnlyDesktopDevicePattern.test(normalized) ||
    browserOnlyDesktopDevicePattern.test(vocabulary) ||
    desktopDeviceNegationPattern.test(vocabulary) ||
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
  `(?:\\b(?:test|sample|generic|unknown|placeholder|example)\\b|${virtualDeviceSource})`,
  "i",
);
const nonAndroidFamilyPattern =
  /(?:iPhones?|iPads?|\bApple\b|MacBook|Mac mini|Mac Studio|Mac Pro|iMac|\b(?:Android|iOS|iPadOS|Windows|macOS|Linux)\b)/i;
const browserOnlyDevicePattern =
  /^(?:(?:Google|Microsoft|Mozilla|Apple|Mobile)\s+)?(?:Safari|Chrome|Chromium|Firefox|Edge|WebKit|Mozilla)(?:$|[\s/-].*)/i;
const knownUnnumberedAndroidModelPattern =
  /^(?:(?:Google\s+)?Pixel\s+(?:Fold|Tablet)|Samsung\s+Galaxy\s+Fold|OnePlus\s+Open|Microsoft\s+Surface\s+Duo|Motorola\s+Razr\+?)$/i;
const nonMobileAndroidDescriptionPattern =
  /\b(?:account|adapter|aspire|audit|book|browser|buds?|camera|case|charger|checklist|chromebook|cover|desktop|display|dock|documentation|ear(?:buds?)?|fit|gear|gram|headphones?|headset|hub|ideapad|keyboard|laptop|magicbook|matebook|monitor|mouse|nest|office|pen|pixelbook|printer|projector|redmibook|release|report|ring|router|scanner|sleeve|speaker|stand|strix|support|swift|tag|television|thinkbook|thinkcentre|thinkpad|travelmate|tuf|tv|ultrapc|vaio|vivobook|watch|wearable|workspace|zenbook|zephyrus)\d*[A-Za-z]*\b|\b[A-Za-z]+Book\d*[A-Za-z]*\b|\bSurface\s+(?:Laptop|Pro|Studio)\b|\bYoga\b(?!\s+Tab\b)|\bROG\b(?!\s+Phone\b)/i;
const knownAndroidModelCodePattern =
  /^(?:(?:Samsung\s+)?SM-[A-Z]\d{3}[A-Z0-9]{0,2}(?:\/[A-Z]{2,3})?|(?:Sony\s+)?XQ-[A-Z]{2}\d{2}(?:\/[A-Z]{2})?|(?:(?:OPPO|OnePlus)\s+)?CPH\d{4}|(?:Motorola\s+)?XT\d{4}(?:-\d{1,2})?|(?:Nokia\s+)?TA-\d{4})$/i;
const numberedAndroidQualifierSource =
  "(?:\\s+(?:5G|Edge|FE\\+?|Fold|Lite|Max|Neo|Plus|Pro|Pro\\+|Pro XL|Ultra)){0,2}";
const knownNumberedAndroidModelPattern = new RegExp(
  `^(?:(?:Google\\s+)?Pixel\\s+\\d{1,2}[A-Za-z]?${numberedAndroidQualifierSource}|` +
    `Fairphone\\s+\\d+(?:\\.\\d+)?|Nothing\\s+Phone\\s*(?:\\d+[A-Za-z]?|\\(\\d+[A-Za-z]?\\))${numberedAndroidQualifierSource}|` +
    `Nokia\\s+\\d+(?:\\.\\d+)?${numberedAndroidQualifierSource}|` +
    `Samsung\\s+Galaxy\\s+(?:S\\d{1,3}\\+?|[AMF]\\d{1,3}|Note\\s*\\d{1,3}|XCover\\s*\\d{1,3}|Z\\s+(?:Fold|Flip)\\s*\\d{1,2}|Tab\\s+[A-Z]\\d{1,2}\\+?)${numberedAndroidQualifierSource}|` +
    `Motorola\\s+(?:(?:Edge|Razr\\+?)\\s+\\d+${numberedAndroidQualifierSource}|Moto\\s+(?:[A-Z]\\s*\\d+|G(?:\\s+(?:Power|Stylus)(?:\\s+5G)?)?\\s+\\d+)${numberedAndroidQualifierSource})|` +
    `Sony\\s+Xperia\\s+(?:\\d{1,2}(?:\\s+[IVX]+)?|[A-Z]\\d+[A-Za-z0-9-]*)${numberedAndroidQualifierSource}|` +
    `(?:Xiaomi\\s+)?Redmi\\s+Note\\s+\\d{1,3}[A-Za-z]?${numberedAndroidQualifierSource}|` +
    `Xiaomi\\s+(?:(?:Redmi\\s+)?\\d{1,3}[A-Za-z]?|Pad\\s+\\d{1,2})${numberedAndroidQualifierSource}|` +
    `OPPO\\s+(?:A\\d+|Find\\s+[A-Z]?\\d+|Reno\\s*\\d+)${numberedAndroidQualifierSource}|` +
    `OnePlus\\s+(?:\\d{1,2}[A-Za-z]?|Nord\\s+(?:CE\\s*)?[A-Z]?\\d{1,2}|Pad\\s+\\d{1,2})${numberedAndroidQualifierSource}|` +
    `Microsoft\\s+Surface\\s+Duo\\s+\\d+${numberedAndroidQualifierSource}|` +
    `Lenovo\\s+(?:(?:Yoga\\s+)?Tab\\s+[A-Z]?\\d+|Legion\\s+[A-Z]\\d+)${numberedAndroidQualifierSource}|` +
    `ASUS\\s+(?:ROG\\s+Phone|Zenfone)\\s+\\d+${numberedAndroidQualifierSource}|` +
    `Honor\\s+(?:Magic\\s*V?\\d+|X\\s*\\d+[A-Za-z]?|\\d+)${numberedAndroidQualifierSource}|` +
    `Huawei\\s+(?:Mate\\s+(?:X\\s*)?\\d+[A-Za-z]?|Nova\\s+\\d+[A-Za-z]?|P\\s*\\d+[A-Za-z]?)${numberedAndroidQualifierSource}|` +
    `realme\\s+(?:(?:GT\\s+)?\\d+|(?:C|P)\\s*\\d+|Note\\s+\\d+)${numberedAndroidQualifierSource}|` +
    `Nubia\\s+(?:Flip|RedMagic\\s+\\d+|Z\\s*\\d+)${numberedAndroidQualifierSource}|` +
    `POCO\\s+[CFMX]\\s*\\d+${numberedAndroidQualifierSource}|` +
    `vivo\\s+[XVY]\\s*\\d+${numberedAndroidQualifierSource}|` +
    `ZTE\\s+(?:A\\s*\\d+|Axon\\s+\\d+|Blade\\s+[A-Z]\\d+)${numberedAndroidQualifierSource}|` +
    `TCL\\s+\\d+(?:\\s+XL)?(?:\\s+NXTPAPER)?${numberedAndroidQualifierSource}|` +
    `HTC\\s+U\\s*\\d+${numberedAndroidQualifierSource}|` +
    `LG\\s+[GV]\\s*\\d+(?:\\s+ThinQ)?${numberedAndroidQualifierSource}|` +
    `Motorola\\s+[GE]\\s*\\d+${numberedAndroidQualifierSource}|` +
    `Samsung\\s+[AMFS]\\s*\\d+${numberedAndroidQualifierSource})$`,
  "i",
);
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
    ? value.replace(/\b([A-Za-z]+)n['’]t\b/gi, "$1 not").replace(/\bcannot\b/gi, "can not")
    : value;
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
    browserOnlyDevicePattern.test(device) ||
    nonMobileAndroidDescriptionPattern.test(device)
  ) {
    return false;
  }
  return (
    knownAndroidModelCodePattern.test(device) ||
    knownUnnumberedAndroidModelPattern.test(device) ||
    knownNumberedAndroidModelPattern.test(device)
  );
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
    if (complete && !nonEmpty(environment?.[field])) {
      errors.push(`${prefix}.${field} is required when complete.`);
    }
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
    if (environment?.id === "mobile-touch") {
      const operatingSystem = environment.operatingSystem ?? "";
      const device = typeof environment.device === "string" ? environment.device.trim() : "";
      const hasIosOperatingSystem = /\biOS\b/i.test(operatingSystem);
      const hasIpadOperatingSystem = /\biPadOS\b/i.test(operatingSystem);
      const hasAndroidOperatingSystem = /\bAndroid\b/i.test(operatingSystem);
      const hasExactlyOneOperatingSystemFamily =
        Number(hasIosOperatingSystem) +
          Number(hasIpadOperatingSystem) +
          Number(hasAndroidOperatingSystem) ===
        1;
      if (!hasExactlyOneOperatingSystemFamily) {
        errors.push(`${prefix}.operatingSystem must name exactly one supported mobile OS family.`);
      }
      const deviceMatchesOperatingSystem = hasExactlyOneOperatingSystemFamily
        ? hasIosOperatingSystem
          ? /^iPhone\b/i.test(device) && isConcreteAppleMobileDevice(device)
          : hasIpadOperatingSystem
            ? /^iPad\b/i.test(device) && isConcreteAppleMobileDevice(device)
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
