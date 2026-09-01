import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const validator = resolve(root, "scripts/validate-stable-accessibility-smoke.mjs");
const platformSupport = JSON.parse(
  readFileSync(resolve(root, "quality/platform-support.json"), "utf8"),
);
const browserFloor = (engine) => platformSupport.browsers[engine].replace(/\+$/, "");
const supportedSafari = `Safari ${browserFloor("webkit")}`;
const supportedChrome = `Chrome ${browserFloor("chromium")}`;
const supportedChromium = `Chromium ${browserFloor("chromium")}`;
const supportedEdge = `Edge ${browserFloor("chromium")}`;
const supportedFirefox = `Firefox ${browserFloor("firefox")}`;

function run(args = []) {
  return spawnSync(process.execPath, [validator, ...args], { cwd: root, encoding: "utf8" });
}

const coordinatedPackages = ["tokens", "adapters", "registry", "ui", "cli", "mcp"];

function withRecord(record, callback, release = {}) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-stable-smoke-"));
  const target = resolve(directory, "record.json");
  const releaseMetadata = resolve(directory, "release-metadata.json");
  const packagesRoot = resolve(directory, "packages");
  const coreVersion = release.coreVersion ?? "1.0.0";
  writeFileSync(target, JSON.stringify(record, null, 2));
  writeFileSync(
    releaseMetadata,
    JSON.stringify(
      {
        channel: release.channel ?? "stable",
        coreVersion,
        registryVersion: release.registryVersion ?? coreVersion,
        publicInstallationVersion: release.publicInstallationVersion ?? coreVersion,
      },
      null,
      2,
    ),
  );
  for (const packageName of coordinatedPackages) {
    const packageDirectory = resolve(packagesRoot, packageName);
    mkdirSync(packageDirectory, { recursive: true });
    writeFileSync(
      resolve(packageDirectory, "package.json"),
      JSON.stringify({ version: release.packageVersion ?? coreVersion }, null, 2),
    );
  }
  try {
    callback(target, releaseMetadata, packagesRoot);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function strictArgs(record, releaseMetadata, packagesRoot) {
  return [
    "--expect-pass",
    "--record",
    record,
    "--release-metadata",
    releaseMetadata,
    "--packages-root",
    packagesRoot,
  ];
}

function completedRecord() {
  const commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  const evidence = ["https://github.com/vpavlov-me/Nerio/issues/143#issuecomment-1"];
  const environmentMetadata = {
    "macos-safari-voiceover": {
      operatingSystem: "macOS 15.5",
      browser: supportedSafari,
      assistiveTechnology: "VoiceOver 15.5",
      device: "Mac Studio M2 Max (2023)",
      viewport: "1280x800",
      zoom: "100%",
      notes: "Verified the scoped scenarios with Safari and VoiceOver.",
    },
    "macos-chromium-keyboard": {
      operatingSystem: "macOS 15.5",
      browser: supportedChrome,
      assistiveTechnology: "Keyboard-only navigation",
      device: "Mac Studio M2 Max (2023)",
      viewport: "1280x800",
      zoom: "100%",
      notes: "Verified the scoped scenarios with keyboard-only navigation.",
    },
    "zoom-reflow-contrast": {
      operatingSystem: "macOS 15.5",
      browser: supportedChrome,
      assistiveTechnology: "Not applicable",
      device: "Mac Studio M2 Max (2023)",
      viewport: "1280x800",
      zoom: "Verified reflow at 200% and 400%",
      notes: "Verified reflow with macOS Increase Contrast enabled.",
    },
    "mobile-touch": {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      assistiveTechnology: "Touch-only navigation",
      device: "iPhone 15 Pro",
      viewport: "393x852",
      zoom: "100%",
      notes: "Verified touch interaction on a physical mobile device.",
    },
  };
  return {
    schemaVersion: 1,
    status: "complete",
    trackingIssue: 143,
    candidate: {
      version: "1.0.0",
      commit,
      deployment: "https://nerio.example.com",
      recordedAt: "2026-08-30T10:00:00Z",
    },
    environments: [
      "macos-safari-voiceover",
      "macos-chromium-keyboard",
      "zoom-reflow-contrast",
      "mobile-touch",
    ].map((id) => ({
      id,
      result: "Pass",
      ...environmentMetadata[id],
      evidence,
    })),
    scenarios: [
      "docs-navigation",
      "forms-and-native-controls",
      "overlays-and-focus",
      "calendar-and-date-picker",
      "feedback-and-status",
      "responsive-touch-and-reflow",
    ].map((id) => ({ id, result: "Pass", evidence, notes: "Scenario passed." })),
    findings: [],
    decision: {
      recommendation: "release-ready",
      recordedAt: "2026-08-30T10:05:00Z",
      summary: "No release-blocking accessibility defect remains in the scoped smoke.",
    },
  };
}

test("pending repository smoke record is valid without claiming completion", () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /evidence remains pending/);
});

test("strict validation rejects pending evidence", () => {
  const result = run(["--expect-pass"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /requires status "complete"/);
});

test("strict validation accepts a complete scoped smoke", () => {
  withRecord(completedRecord(), (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /internally approved/);
  });
});

test("malformed smoke records fail with scoped diagnostics instead of stack traces", () => {
  withRecord(null, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Stable accessibility smoke record must be a JSON object/);
    assert.doesNotMatch(result.stderr, /TypeError|\n\s+at |Node\.js v/);
  });

  const record = completedRecord();
  record.environments.find(({ id }) => id === "mobile-touch").device = [];
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /device is required when complete/);
    assert.doesNotMatch(result.stderr, /TypeError|\n\s+at |Node\.js v/);
  });
});

test("strict validation rejects non-object release metadata", () => {
  withRecord(completedRecord(), (target, releaseMetadata, packagesRoot) => {
    writeFileSync(releaseMetadata, "null");
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Release metadata must be a JSON object/);
    assert.doesNotMatch(result.stderr, /TypeError|\n\s+at |Node\.js v/);
  });
});

test("strict validation rejects a stale ancestor after non-evidence changes", () => {
  const record = completedRecord();
  const latestValidatorChange = execFileSync(
    "git",
    ["rev-list", "-n", "1", "HEAD", "--", "scripts/validate-stable-accessibility-smoke.mjs"],
    {
      cwd: root,
      encoding: "utf8",
    },
  ).trim();
  record.candidate.commit = execFileSync("git", ["rev-parse", `${latestValidatorChange}^`], {
    cwd: root,
    encoding: "utf8",
  }).trim();
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /stale after non-evidence changes/);
  });
});

test("strict validation rejects release metadata and package versions outside the candidate", () => {
  withRecord(
    completedRecord(),
    (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /requires release metadata channel "stable"/);
      assert.match(result.stderr, /must match release metadata coreVersion 1\.0\.0-beta\.1/);
      assert.match(result.stderr, /package\.json version must match/);
    },
    { channel: "beta", coreVersion: "1.0.0-beta.1" },
  );
});

test("strict validation rejects evidence recorded against the wrong required environments", () => {
  const record = completedRecord();
  record.environments.find(({ id }) => id === "macos-safari-voiceover").browser = supportedChrome;
  const mobile = record.environments.find(({ id }) => id === "mobile-touch");
  mobile.device = "iPhone 15 Pro Simulator";
  mobile.notes = "Verified touch interaction on an iOS simulator.";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /browser does not match the required macos-safari-voiceover setup/);
    assert.match(result.stderr, /notes must affirm use of a physical mobile touch device/);
    assert.match(result.stderr, /must use a physical mobile touch device/);
  });
});

test("strict validation accepts browser families at the maintained policy floor", () => {
  for (const browser of [
    supportedSafari,
    supportedChrome,
    supportedChromium,
    supportedEdge,
    supportedFirefox,
    "Safari 26.10",
  ]) {
    const record = completedRecord();
    record.environments.find(({ id }) => id === "zoom-reflow-contrast").browser = browser;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.equal(result.status, 0, `${browser}: ${result.stderr}`);
      assert.match(result.stdout, /internally approved/);
    });
  }
});

test("strict validation rejects browsers below the maintained policy floor", () => {
  for (const { id, browser } of [
    { id: "macos-safari-voiceover", browser: "Safari 1" },
    { id: "macos-safari-voiceover", browser: supportedChrome },
    { id: "macos-chromium-keyboard", browser: "Chrome 1" },
    { id: "macos-chromium-keyboard", browser: supportedSafari },
    { id: "zoom-reflow-contrast", browser: "Safari 26.4" },
    { id: "zoom-reflow-contrast", browser: "Chrome 150" },
    { id: "zoom-reflow-contrast", browser: "Chromium 150" },
    { id: "zoom-reflow-contrast", browser: "Edge 150" },
    { id: "zoom-reflow-contrast", browser: "Firefox 1" },
    { id: "zoom-reflow-contrast", browser: "Firefox 152" },
    { id: "mobile-touch", browser: "Safari 1" },
    { id: "mobile-touch", browser: "Firefox 1" },
  ]) {
    const record = completedRecord();
    record.environments.find(({ id: candidateId }) => candidateId === id).browser = browser;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0, `${id}: ${browser}`);
      assert.match(result.stderr, new RegExp(`browser does not match the required ${id} setup`));
    });
  }
});

test("strict validation accepts ordinary Mac hardware descriptions without inventory details", () => {
  const record = completedRecord();
  record.environments.find(({ id }) => id === "macos-safari-voiceover").device =
    "MacBook Pro without Touch Bar";
  record.environments.find(({ id }) => id === "macos-chromium-keyboard").device = "Mac Studio";
  record.environments.find(({ id }) => id === "zoom-reflow-contrast").device = "Mac mini";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /internally approved/);
  });
});

test("strict validation accepts ordinary concrete desktop descriptions without inventory details", () => {
  for (const device of [
    "Dell XPS",
    "Lenovo ThinkPad",
    "Framework Laptop",
    "Framework Laptop 13",
    "Microsoft Surface Laptop 7",
    "Microsoft Surface Pro",
    "Dell Latitude",
    "Acer Swift",
    "Acer Swift Go",
    "Acer Swift Edge",
    "Acer Swift Edge 16",
    "Samsung Galaxy Book",
    "Samsung Galaxy Book Pro",
    "Samsung Galaxy Book Edge",
    "Samsung Galaxy Book4 Edge",
    "Samsung Galaxy Book6 Edge",
    "Purism Librem Mini",
    "HP EliteDesk 800 G9 Desktop Mini PC",
    "HP EliteDesk 800 G9 asset No. 42",
    "Intel NUC 13 Pro",
    "TUXEDO InfinityBook",
  ]) {
    const record = completedRecord();
    const desktop = record.environments.find(({ id }) => id === "zoom-reflow-contrast");
    desktop.operatingSystem = "Windows 11";
    desktop.device = device;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.equal(result.status, 0, `${device}: ${result.stderr}`);
      assert.match(result.stdout, /internally approved/);
    });
  }
});

test("strict validation accepts a concrete ChromeOS desktop environment", () => {
  for (const operatingSystem of [
    "ChromeOS 140",
    "Chrome OS 140",
    "Google Chrome OS 140",
    "Chromium OS 140",
  ]) {
    const record = completedRecord();
    const desktop = record.environments.find(({ id }) => id === "zoom-reflow-contrast");
    desktop.operatingSystem = operatingSystem;
    desktop.browser = supportedChrome;
    desktop.device = "Acer Chromebook 516 GE";
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.equal(result.status, 0, `${operatingSystem}: ${result.stderr}`);
      assert.match(result.stdout, /internally approved/);
    });
  }
});

test("strict validation rejects placeholder, mobile, and browser-only desktop OS metadata", () => {
  for (const operatingSystem of [
    "ChromeOS",
    "Generic OS 140",
    "Desktop OS 140",
    "Android 16",
    supportedChrome,
    "Desktop Chrome 140.0",
    "OS Firefox 143.0",
  ]) {
    const record = completedRecord();
    record.environments.find(({ id }) => id === "zoom-reflow-contrast").operatingSystem =
      operatingSystem;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0, operatingSystem);
      assert.match(
        result.stderr,
        /operatingSystem does not match the required zoom-reflow-contrast setup/,
      );
    });
  }
});

test("strict validation rejects placeholder, generic-only, and negated desktop descriptions", () => {
  for (const { id, device } of [
    { id: "macos-safari-voiceover", device: "Test MacBook Pro" },
    { id: "macos-safari-voiceover", device: "Generic Mac Studio" },
    { id: "macos-safari-voiceover", device: "Example Mac mini" },
    { id: "macos-safari-voiceover", device: "Unknown MacBook Pro" },
    { id: "macos-safari-voiceover", device: "Not a MacBook Pro" },
    { id: "macos-safari-voiceover", device: "No Mac Studio" },
    { id: "macos-safari-voiceover", device: "This is not a MacBook Pro" },
    { id: "macos-safari-voiceover", device: "Definitely not a MacBook Pro" },
    { id: "zoom-reflow-contrast", device: "desktop device 123" },
    { id: "zoom-reflow-contrast", device: "Windows desktop" },
    { id: "zoom-reflow-contrast", device: "PC 123" },
    { id: "zoom-reflow-contrast", device: "hardware machine 42" },
    { id: "zoom-reflow-contrast", device: "Office laptop" },
    { id: "zoom-reflow-contrast", device: "My computer" },
    { id: "zoom-reflow-contrast", device: "Available device" },
    { id: "zoom-reflow-contrast", device: "Kitchen Chair" },
    { id: "zoom-reflow-contrast", device: "office workstation" },
    { id: "zoom-reflow-contrast", device: "Home PC" },
    { id: "zoom-reflow-contrast", device: "The Machine" },
    { id: "zoom-reflow-contrast", device: "Chromebook 140" },
    { id: "zoom-reflow-contrast", device: "ChromeOS device 140" },
    { id: "zoom-reflow-contrast", device: "Generic Chromebook 714" },
    { id: "zoom-reflow-contrast", device: "Generic Microsoft Surface Pro" },
    { id: "zoom-reflow-contrast", device: "This is not a Microsoft Surface Pro" },
    { id: "zoom-reflow-contrast", device: "Microsoft Office" },
    { id: "zoom-reflow-contrast", device: "Microsoft Edge 140" },
    { id: "zoom-reflow-contrast", device: "Google Chrome OS 140" },
    { id: "zoom-reflow-contrast", device: "Microsoft Windows 11" },
    { id: "zoom-reflow-contrast", device: "Dell Desktop" },
    { id: "zoom-reflow-contrast", device: "Microsoft Account" },
    { id: "zoom-reflow-contrast", device: "Microsoft Account 365" },
    { id: "zoom-reflow-contrast", device: "Apple Music" },
    { id: "zoom-reflow-contrast", device: "Google Workspace" },
    { id: "zoom-reflow-contrast", device: "Dell Support" },
    { id: "zoom-reflow-contrast", device: "Samsung Browser" },
    { id: "zoom-reflow-contrast", device: "Dell Chrome 140" },
    { id: "zoom-reflow-contrast", device: "Samsung Windows 11" },
    { id: "zoom-reflow-contrast", device: "HP Printer" },
    { id: "zoom-reflow-contrast", device: "HP Printer 123" },
    { id: "zoom-reflow-contrast", device: "Dell Monitor" },
    { id: "zoom-reflow-contrast", device: "Lenovo Support" },
    { id: "zoom-reflow-contrast", device: "HP LaserJet Printer 123" },
    { id: "zoom-reflow-contrast", device: "Dell UltraSharp Monitor U2723QE" },
    { id: "zoom-reflow-contrast", device: "Lenovo ThinkVision Monitor P27h-30" },
    { id: "zoom-reflow-contrast", device: "Microsoft 365 Account" },
    { id: "zoom-reflow-contrast", device: "Dell SupportAssist" },
    { id: "zoom-reflow-contrast", device: "Dell Latitude Dock" },
    { id: "zoom-reflow-contrast", device: "Microsoft Surface Pro Keyboard" },
    { id: "zoom-reflow-contrast", device: "Razer Blade Mouse" },
    { id: "zoom-reflow-contrast", device: "Samsung Galaxy Book Adapter" },
    { id: "zoom-reflow-contrast", device: "Dell WD19 Dock" },
    { id: "zoom-reflow-contrast", device: "HP USB-C Dock G5" },
    { id: "zoom-reflow-contrast", device: "Dell KM7321W Keyboard" },
    { id: "zoom-reflow-contrast", device: "Dell Laptop Windows 11" },
    { id: "zoom-reflow-contrast", device: "HP Computer Windows 11" },
    { id: "zoom-reflow-contrast", device: "Lenovo PC Ubuntu 24.04" },
    { id: "zoom-reflow-contrast", device: "Microsoft Surface Windows 11" },
    { id: "zoom-reflow-contrast", device: "Dell Laptop Android 16" },
    { id: "zoom-reflow-contrast", device: "HP Computer iOS 18" },
    { id: "zoom-reflow-contrast", device: "Lenovo PC iPadOS 18" },
    { id: "zoom-reflow-contrast", device: "Dell Laptop Mac OS 15" },
    { id: "zoom-reflow-contrast", device: "Desktop Edge 140" },
    { id: "zoom-reflow-contrast", device: "OS Edge 140" },
    { id: "zoom-reflow-contrast", device: "MS Edge 140" },
    { id: "zoom-reflow-contrast", device: "MicrosoftEdge 140" },
    { id: "zoom-reflow-contrast", device: "EdgeHTML 18" },
    { id: "zoom-reflow-contrast", device: "Google Edge 140" },
    { id: "zoom-reflow-contrast", device: "Microsoft Surface Pro Case" },
    { id: "zoom-reflow-contrast", device: "Samsung Galaxy Book Cover" },
    { id: "zoom-reflow-contrast", device: "Dell Latitude Sleeve" },
    { id: "zoom-reflow-contrast", device: "This isn't a Dell XPS" },
    { id: "zoom-reflow-contrast", device: "This isn’t a Dell XPS" },
  ]) {
    const record = completedRecord();
    record.environments.find(({ id: candidateId }) => candidateId === id).device = device;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0, device);
      assert.match(result.stderr, new RegExp(`device does not match the required ${id} setup`));
    });
  }
});

test("strict validation accepts maintained mobile browsers compatible with the recorded OS", () => {
  for (const setup of [
    { operatingSystem: "iOS 18.5", browser: supportedSafari, device: "iPhone 15 Pro" },
    { operatingSystem: "iOS 18.5", browser: supportedChrome, device: "iPhone 15 Pro" },
    { operatingSystem: "iOS 18.5", browser: supportedEdge, device: "iPhone 15 Pro" },
    { operatingSystem: "iOS 18.5", browser: supportedFirefox, device: "iPhone 15 Pro" },
    { operatingSystem: "iPadOS 18.5", browser: supportedSafari, device: "iPad Pro (M4)" },
    { operatingSystem: "Android 16", browser: supportedChrome, device: "Google Pixel 9" },
    { operatingSystem: "Android 16", browser: supportedChromium, device: "Google Pixel 9" },
    { operatingSystem: "Android 16", browser: supportedEdge, device: "Google Pixel 9" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Fairphone 5" },
  ]) {
    const record = completedRecord();
    Object.assign(
      record.environments.find(({ id }) => id === "mobile-touch"),
      setup,
    );
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.equal(
        result.status,
        0,
        `${setup.operatingSystem} / ${setup.browser}: ${result.stderr}`,
      );
      assert.match(result.stdout, /internally approved/);
    });
  }
});

test("strict validation rejects Safari for Android mobile evidence", () => {
  const record = completedRecord();
  Object.assign(
    record.environments.find(({ id }) => id === "mobile-touch"),
    {
      operatingSystem: "Android 16",
      browser: supportedSafari,
      device: "Google Pixel 9",
      notes: "Verified touch interaction using a physical Google Pixel 9.",
    },
  );
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /browser does not match the required mobile-touch setup/);
  });
});

test("strict validation rejects mobile browser products unavailable on the recorded OS", () => {
  for (const setup of [
    { operatingSystem: "iOS 18.5", browser: supportedChromium, device: "iPhone 15 Pro" },
    { operatingSystem: "iPadOS 18.5", browser: supportedChromium, device: "iPad Pro (M4)" },
  ]) {
    const record = completedRecord();
    Object.assign(
      record.environments.find(({ id }) => id === "mobile-touch"),
      setup,
    );
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /browser does not match the required mobile-touch setup/);
    });
  }
});

test("strict validation accepts physical-device claims naming the concrete mobile model", () => {
  for (const setup of [
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Tested touch interaction on a physical iPhone 15 Pro.",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "Fairphone 5",
      notes: "Verified touch interaction using a physical Fairphone 5.",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "Nothing Phone (2)",
      notes: "Tested touch interaction on a physical Nothing Phone (2).",
    },
    {
      operatingSystem: "iPadOS 18.5",
      browser: supportedSafari,
      device: "iPad Pro (M4)",
      notes: "Tested touch interaction on a physical iPad Pro (M4).",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "Nokia 7.2",
      notes: "Tested in Android 16.0 on a physical Nokia 7.2.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Not only tested on a physical iPhone 15 Pro but also verified.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Testing was not only performed on a physical iPhone 15 Pro but also passed.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Testing was not merely performed but completed on a physical iPhone 15 Pro.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Testing was not simply performed but completed on a physical iPhone 15 Pro.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Used touch interaction on a physical iPhone 15 Pro.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Using touch controls with a physical iPhone 15 Pro.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Testing was not performed remotely but was verified on a physical iPhone 15 Pro.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Testing was not conducted remotely but was verified on a physical iPhone 15 Pro.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Testing was not run remotely but was verified on a physical iPhone 15 Pro.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Testing was not executed remotely but was verified on a physical iPhone 15 Pro.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Tested touch interaction on a physical iPhone 15 Pro — not a simulator.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Tested touch interaction on a physical iPhone 15 Pro with VoiceOver off.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Testing was planned, then completed on a physical iPhone 15 Pro.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Testing was pending, then completed on a physical iPhone 15 Pro.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Testing was incomplete, then completed on a physical iPhone 15 Pro.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Testing was unavailable remotely and completed on a physical iPhone 15 Pro.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes:
        "Testing was completed on a physical iPhone 15 Pro today and will be repeated tomorrow.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes:
        "Tested touch interaction on a physical iPhone 15 Pro. The physical iPhone 15 Pro was unavailable the next day.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes:
        "Tested touch interaction on a physical iPhone 15 Pro. The physical iPhone 15 Pro was unavailable after testing.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes:
        "Tested touch interaction on a physical iPhone 15 Pro. The physical iPhone 15 Pro was unavailable after testing was completed.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes:
        "Tested touch interaction on a physical iPhone 15 Pro. The physical iPhone 15 Pro was unavailable after testing had been completed.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes:
        "Tested touch interaction on a physical iPhone 15 Pro. The physical iPhone 15 Pro was unavailable after all testing was completed.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes:
        "Tested touch interaction on a physical iPhone 15 Pro. It was not used for anything else.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Tested touch interaction on a physical iPhone 15 Pro, and a simulator was not used.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes:
        "Testing was completed on a physical iPhone 15 Pro to reduce regressions in the future.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes:
        "Testing was completed on a physical iPhone 15 Pro after the release candidate was cut.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes:
        "Testing was completed on a physical iPhone 15 Pro only after the release candidate was cut.",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      notes: "Testing was required by policy and completed on a physical iPhone 15 Pro.",
    },
  ]) {
    const record = completedRecord();
    Object.assign(
      record.environments.find(({ id }) => id === "mobile-touch"),
      setup,
    );
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.equal(result.status, 0, `${setup.device}: ${result.stderr}`);
      assert.match(result.stdout, /internally approved/);
    });
  }
});

test("strict validation rejects negated testing claims naming the concrete mobile model", () => {
  for (const notes of [
    "Not tested on a physical iPhone 15 Pro.",
    "No testing was performed on a physical iPhone 15 Pro.",
    "No touch testing was performed on a physical iPhone 15 Pro.",
    "Testing was not performed on a physical iPhone 15 Pro.",
    "Testing was never completed on a physical iPhone 15 Pro.",
    "Testing was not actually performed on a physical iPhone 15 Pro.",
    "Testing was never fully completed on a physical iPhone 15 Pro.",
    "Testing hasn't been performed on a physical iPhone 15 Pro.",
    "Testing couldn't be performed on a physical iPhone 15 Pro.",
    "Testing has not yet been performed on a physical iPhone 15 Pro.",
    "Testing was not previously performed on a physical iPhone 15 Pro.",
    "Testing was never before completed on a physical iPhone 15 Pro.",
    "Testing passed but not on a physical iPhone 15 Pro.",
    "Testing passed but not on the physical iPhone 15 Pro.",
    "Testing passed without a physical iPhone 15 Pro.",
    "Testing was not performed on another device because a physical iPhone 15 Pro was merely available.",
    "Testing was not performed on another device or on a physical iPhone 15 Pro.",
    "Testing was not performed on a lab phone nor on a physical iPhone 15 Pro.",
    "Testing was not performed: only planned on a physical iPhone 15 Pro.",
    "Testing was anything but performed on a physical iPhone 15 Pro.",
    "Completed the checklist assignment with a physical mobile device available.",
    "Testing was planned, but completed the documentation with a physical mobile device available.",
    "Testing did not occur, but completed the audit with a physical mobile device available.",
    "Testing did not occur and completed the audit with a physical mobile device available.",
    "Testing was skipped, but completed the audit with a physical mobile device available.",
    "Testing was skipped remotely, but completed the audit with a physical mobile device available.",
    "Testing was unavailable remotely and the documentation was completed on a physical iPhone 15 Pro.",
    "Testing was unavailable remotely and the audit was completed on a physical iPhone 15 Pro.",
    "The documentation for testing was unavailable remotely and completed on a physical iPhone 15 Pro.",
    "The audit for testing was unavailable remotely and completed on a physical iPhone 15 Pro.",
    "Testing was skipped, but the audit was completed on a physical iPhone 15 Pro.",
    "Testing was unavailable remotely, the documentation was reviewed and completed on a physical iPhone 15 Pro.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro, but the test never happened.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro tomorrow.",
    "Testing was completed on a physical iPhone 15 Pro, but the test never happened, but completed the audit with a physical iPhone 15 Pro.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro, although the test never happened.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro, but testing was not actually completed.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro next Monday.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro in two business days.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro, which was not used.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro, which was not really used.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro, which was never fully tested.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro, which had not yet been used.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro, but it was not used.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro, which was in fact not used.",
    "Tested touch interaction on a physical iPhone 15 Pro. It was not used.",
    "Testing was completed on a physical iPhone 15 Pro. The device was not used.",
    "Tested touch interaction on a physical iPhone 15 Pro. It was not used for anything else, and it was not used for testing.",
    "Tested touch interaction on a physical iPhone 15 Pro. It was not used for anything else because it was not used at all.",
    "Tested touch interaction on a physical iPhone 15 Pro. The physical iPhone 15 Pro was not used and became unavailable later.",
    "Tested touch interaction on a physical iPhone 15 Pro. The physical iPhone 15 Pro was unavailable later without using it.",
    "Tested touch interaction on a physical iPhone 15 Pro. The physical iPhone 15 Pro was unavailable later without ever using it.",
    "Tested touch interaction on a physical iPhone 15 Pro. The physical iPhone 15 Pro was unavailable later without really using it.",
    "Tested touch interaction on a physical iPhone 15 Pro. The physical iPhone 15 Pro was unavailable after testing failed.",
    "Tested touch interaction on a physical iPhone 15 Pro. The physical iPhone 15 Pro was unavailable after testing was skipped.",
    "Tested touch interaction on a physical iPhone 15 Pro. The physical iPhone 15 Pro was unavailable after testing had failed.",
    "Tested touch interaction on a physical iPhone 15 Pro. The physical iPhone 15 Pro was unavailable after testing was not completed.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro after release.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro in the future.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro only after release.",
    "Testing was unavailable remotely and completed on a physical iPhone 15 Pro sometime after release.",
    "Testing was absent, but completed the audit with a physical mobile device available.",
    "Testing was unavailable, but completed the audit with a physical mobile device available.",
    "Testing failed, but completed the audit with a physical mobile device available.",
    "Tested on a physical iPhone 15 Pro but not actually on a physical mobile device.",
    "Must be tested on a physical iPhone 15 Pro before release.",
    "Can be tested on a physical iPhone 15 Pro.",
    "Could be tested on a physical iPhone 15 Pro.",
    "May be tested on a physical iPhone 15 Pro.",
    "Might be tested on a physical iPhone 15 Pro.",
    "Testing is expected to be performed on a physical iPhone 15 Pro.",
    "Touch interaction is going to be tested on a physical iPhone 15 Pro.",
    "Touch interaction should have been tested on a physical iPhone 15 Pro.",
    "Touch interaction was supposed to be tested on a physical iPhone 15 Pro.",
    "Touch interaction was intended to be tested on a physical iPhone 15 Pro.",
    "Testing was not, due to lab access, performed on a physical iPhone 15 Pro.",
    "Tested on a physical iPhone 15 Pro but no testing occurred.",
    "Tested on a physical iPhone 15 Pro_simulator.",
  ]) {
    const record = completedRecord();
    record.environments.find(({ id }) => id === "mobile-touch").notes = notes;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0, notes);
      assert.match(result.stderr, /must affirm use of a physical mobile touch device/);
    });
  }
});

test("strict validation accepts concrete mobile names and model codes", () => {
  for (const device of [
    "Google Pixel Fold",
    "Google Pixel Tablet",
    "Samsung SM-S921B/DS",
    "Motorola Edge 50 Pro",
    "Motorola Razr 50 Ultra",
    "Samsung Galaxy S25 Edge",
    "Samsung Galaxy Z Fold5",
    "Samsung Galaxy S24+",
    "Sony Xperia 1 VI",
    "Xiaomi 14 Ultra",
    "OPPO Find X8 Pro",
    "OnePlus 12",
    "Microsoft Surface Duo 2",
    "Lenovo Tab P12",
    "Lenovo Yoga Tab 13",
    "Xiaomi Pad 7",
    "OnePlus Pad 2",
    "ASUS ROG Phone 8",
    "ASUS ROG Phone 9",
    "SM-S921B/DS",
    "CPH2581",
    "XQ-EC54",
  ]) {
    const record = completedRecord();
    const mobile = record.environments.find(({ id }) => id === "mobile-touch");
    mobile.operatingSystem = "Android 16";
    mobile.browser = supportedFirefox;
    mobile.device = device;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.equal(result.status, 0, `${device}: ${result.stderr}`);
      assert.match(result.stdout, /internally approved/);
    });
  }
});

test("strict validation accepts a concrete named Apple model", () => {
  const record = completedRecord();
  record.environments.find(({ id }) => id === "mobile-touch").device = "iPhone Air";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /internally approved/);
  });
});

test("strict validation rejects placeholder and browser-only mobile device values", () => {
  for (const setup of [
    { operatingSystem: "iOS 18.5", browser: supportedSafari, device: "iPhone test device" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: supportedFirefox },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Physical mobile device" },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "Physical mobile device 123",
    },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Mobile phone" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Apple iPhone 15 Pro" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Google Chrome 143.0" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Mozilla/5.0" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "WebKit 605.1" },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "Audit Checklist",
      notes: "Tested touch interaction on a physical Audit Checklist.",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "Audit Checklist 2026",
      notes: "Tested touch interaction on a physical Audit Checklist 2026.",
    },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "AUDIT-2026" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Audit Checklist V2026" },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "Audit Checklist XQ-EC54",
    },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Google Pixel Watch 3" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Google Pixel Watch2" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Google Pixel Case 3" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Samsung Galaxy Book 5" },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "Samsung Galaxy Book4 Edge",
    },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Samsung Galaxy Watch7" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Google Pixel Buds Pro 2" },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "Samsung Galaxy Buds3 Pro",
    },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Nothing Ear2" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Google Pixel Stand 2" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Samsung Galaxy Ring 2" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Samsung Galaxy Fit3" },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "Pixel Release Checklist 2026",
    },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Acer Swift 5" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Acer Aspire 5" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Acer TravelMate P2" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "ASUS Vivobook 15" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "ASUS TUF A15" },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "ASUS ROG Zephyrus G14",
    },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "ASUS ROG Strix G16" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Lenovo Yoga 7" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Lenovo ThinkBook 14" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Honor MagicBook 14" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Xiaomi RedmiBook 15" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Google Pixelbook Go 2" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "LG Gram 16" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "LG UltraPC 16" },
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "Sony VAIO 5" },
    { operatingSystem: "iOS 18.5", browser: supportedSafari, device: "iPhone Safari 18.5" },
  ]) {
    const record = completedRecord();
    Object.assign(
      record.environments.find(({ id }) => id === "mobile-touch"),
      setup,
    );
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0, setup.device);
      assert.match(
        result.stderr,
        /device must be a concrete physical model for its recorded mobile OS/,
      );
    });
  }
});

test("strict validation rejects negated contrast and physical-device claims", () => {
  const record = completedRecord();
  record.environments.find(({ id }) => id === "zoom-reflow-contrast").zoom =
    "200% and 400% were not tested";
  record.environments.find(({ id }) => id === "zoom-reflow-contrast").notes =
    "Reflow passed, but Increase Contrast was not enabled.";
  record.environments.find(({ id }) => id === "mobile-touch").notes =
    "Touch passed, but this was not a physical device.";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /both 200% and 400% without negation/);
    assert.match(result.stderr, /contrast was enabled/);
    assert.match(result.stderr, /must affirm use of a physical mobile touch device/);
  });
});

test("strict validation rejects negated or future contrast evidence", () => {
  for (const notes of [
    "Verified reflow without high contrast enabled.",
    "High contrast will be enabled during the test.",
    "High contrast is going to be enabled during the test.",
    "High contrast should have been enabled during the test.",
    "High contrast was supposed to be enabled during the test.",
    "High contrast was intended to be enabled during the test.",
    "High contrast was intended to be enabled but enabled dark mode instead.",
    "High contrast was intended to be enabled but enabled dark mode instead of high contrast.",
    "High contrast was intended to be enabled but high contrast was intended to be enabled.",
  ]) {
    const record = completedRecord();
    record.environments.find(({ id }) => id === "zoom-reflow-contrast").notes = notes;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0, notes);
      assert.match(result.stderr, /contrast was enabled/);
    });
  }
});

test("strict validation accepts completed evidence after an unmet expectation", () => {
  const record = completedRecord();
  const zoomContrast = record.environments.find(({ id }) => id === "zoom-reflow-contrast");
  zoomContrast.zoom = "200% and 400% should have been tested yesterday and were tested today";
  zoomContrast.notes =
    "High contrast should have been enabled earlier and was enabled during the test";
  record.environments.find(({ id }) => id === "mobile-touch").notes =
    "Touch interaction should have been completed yesterday and was completed today on a physical iPhone 15 Pro.";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /internally approved/);
  });
});

test("strict validation accepts a target-bound contrast correction", () => {
  const record = completedRecord();
  record.environments.find(({ id }) => id === "zoom-reflow-contrast").notes =
    "High contrast was intended to be enabled but high contrast was enabled during the test";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /internally approved/);
  });
});

test("strict validation rejects straight and curly contracted negations", () => {
  const record = completedRecord();
  record.environments.find(({ id }) => id === "macos-safari-voiceover").assistiveTechnology =
    "VoiceOver wasn't enabled";
  record.environments.find(({ id }) => id === "zoom-reflow-contrast").zoom =
    "200% and 400% weren't tested";
  record.environments.find(({ id }) => id === "zoom-reflow-contrast").notes =
    "Increase Contrast wasn’t enabled.";
  record.environments.find(({ id }) => id === "mobile-touch").notes =
    "This wasn’t a physical mobile device.";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /assistiveTechnology does not match the required macos-safari-voiceover setup/,
    );
    assert.match(result.stderr, /both 200% and 400% without negation/);
    assert.match(result.stderr, /contrast was enabled/);
    assert.match(result.stderr, /must affirm use of a physical mobile touch device/);
  });
});

test("strict validation rejects no, neither, and cannot evidence negations", () => {
  const record = completedRecord();
  record.environments.find(({ id }) => id === "macos-safari-voiceover").assistiveTechnology =
    "No VoiceOver was used";
  record.environments.find(({ id }) => id === "zoom-reflow-contrast").zoom =
    "Neither 200% nor 400% was tested";
  record.environments.find(({ id }) => id === "zoom-reflow-contrast").notes =
    "Increase Contrast cannot be enabled.";
  record.environments.find(({ id }) => id === "mobile-touch").notes =
    "No physical mobile device was used.";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /assistiveTechnology does not match the required macos-safari-voiceover setup/,
    );
    assert.match(result.stderr, /both 200% and 400% without negation/);
    assert.match(result.stderr, /contrast was enabled/);
    assert.match(result.stderr, /must affirm use of a physical mobile touch device/);
  });
});

test("strict validation rejects no-testing zoom claims on either side of the values", () => {
  for (const zoom of [
    "No testing was performed at 200% or 400%",
    "200% and 400%: no testing was performed",
  ]) {
    const record = completedRecord();
    record.environments.find(({ id }) => id === "zoom-reflow-contrast").zoom = zoom;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0, zoom);
      assert.match(result.stderr, /both 200% and 400% without negation/);
    });
  }
});

test("strict validation requires affirmative zoom testing language", () => {
  for (const zoom of [
    "200% and 400% are planned for later",
    "200% and 400% are scheduled to be tested",
    "200% and 400% are going to be tested",
    "200% and 400% should have been tested",
    "200% and 400% were supposed to be tested",
    "200% and 400% were intended to be tested",
  ]) {
    const record = completedRecord();
    record.environments.find(({ id }) => id === "zoom-reflow-contrast").zoom = zoom;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0, zoom);
      assert.match(result.stderr, /both 200% and 400% without negation/);
    });
  }
});

test("strict validation binds affirmative evidence to both required zoom levels", () => {
  for (const zoom of [
    "200% was planned, but 400% was tested",
    "200% remained pending, while 400% was verified",
    "200% remained pending and the unrelated keyboard check passed; 400% was tested",
    "200% was planned, but tested at 400%",
    "400% was planned, but verified at 200%",
    "200% remained pending, but passed the unrelated keyboard check; 400% was verified",
    "200% and 400% were planned, but ultimately tested at 400%",
    "200% passed the unrelated keyboard check; 400% was verified",
    "200% and 400% were possibly tested",
    "200% and 400% were only partially tested",
    "200% and 400% were barely tested",
    "200% and 400% were hardly tested",
    "200% and 400% were incompletely tested",
    "200% and 400% were tested unsuccessfully",
    "200% and 400% were unsuccessfully tested",
    "200% and 400% were tested incorrectly",
    "200% and 400% were tested inconclusively",
    "Tested at 200%, and 400% was planned",
    "Verified at 400%, and 200% remained pending",
  ]) {
    const record = completedRecord();
    record.environments.find(({ id }) => id === "zoom-reflow-contrast").zoom = zoom;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0, zoom);
      assert.match(result.stderr, /both 200% and 400% without negation/);
    });
  }
});

test("strict validation accepts completed evidence bound to both zoom levels", () => {
  for (const zoom of [
    "200% was tested and 400% was verified",
    "200% was planned, but ultimately tested; 400% was verified",
    "200% and 400% were both tested",
    "200% and 400% were successfully tested",
    "200% and 400% were thoroughly tested",
    "200% and 400% were carefully tested",
    "200% and 400% were tested independently",
    "200% and 400% were only tested today",
    "At 200% and 400%, testing passed",
  ]) {
    const record = completedRecord();
    record.environments.find(({ id }) => id === "zoom-reflow-contrast").zoom = zoom;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.equal(result.status, 0, `${zoom}: ${result.stderr}`);
      assert.match(result.stdout, /internally approved/);
    });
  }
});

test("strict validation rejects failed or unavailable target evidence", () => {
  const record = completedRecord();
  record.environments.find(({ id }) => id === "zoom-reflow-contrast").zoom =
    "200% and 400% testing failed.";
  record.environments.find(({ id }) => id === "zoom-reflow-contrast").notes =
    "High contrast was unavailable; keyboard navigation remained enabled.";
  record.environments.find(({ id }) => id === "mobile-touch").notes =
    "Physical mobile device was unavailable; no simulator was used.";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /both 200% and 400% without negation/);
    assert.match(result.stderr, /contrast was enabled/);
    assert.match(result.stderr, /must affirm use of a physical mobile touch device/);
  });
});

test("strict validation requires actual use of the physical device", () => {
  const record = completedRecord();
  record.environments.find(({ id }) => id === "mobile-touch").notes =
    "A physical mobile device was available.";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /must affirm use of a physical mobile touch device/);
  });
});

test("strict validation accepts positive target evidence after no-issues observations", () => {
  const record = completedRecord();
  record.environments.find(({ id }) => id === "zoom-reflow-contrast").notes =
    "No high contrast issues were found; Increase Contrast remained enabled.";
  record.environments.find(({ id }) => id === "mobile-touch").notes =
    "No physical mobile device issues were found; tests ran on a physical mobile device.";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /internally approved/);
  });
});

test("strict validation accepts explicitly negated simulator mentions", () => {
  for (const notes of [
    "Verified touch interaction on a physical mobile device, not a simulator.",
    "Verified touch interaction on a physical mobile device; the simulator wasn't used.",
    "Verified touch interaction on a physical mobile device; the simulator wasn’t used.",
    "Verified touch interaction on a physical mobile device; the simulator couldn't be used.",
    "Verified touch interaction on a physical mobile device with no issues.",
    "Verified touch interaction on a physical mobile device; no simulator or emulator was used.",
  ]) {
    const record = completedRecord();
    record.environments.find(({ id }) => id === "mobile-touch").notes = notes;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /internally approved/);
    });
  }
});

test("strict validation rejects plural virtual-device evidence", () => {
  for (const mutate of [
    (mobile) => {
      mobile.device = "iPhone 15 Pro Simulators";
    },
    (mobile) => {
      mobile.notes = "Verified touch on a physical mobile device using simulators.";
    },
  ]) {
    const record = completedRecord();
    mutate(record.environments.find(({ id }) => id === "mobile-touch"));
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /must use a physical mobile touch device, not an emulator/);
    });
  }
});

test("strict validation rejects a used simulator despite an earlier physical-device negation", () => {
  const record = completedRecord();
  record.environments.find(({ id }) => id === "mobile-touch").notes =
    "Physical mobile device wasn't working, used simulator.";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /must use a physical mobile touch device, not an emulator/);
  });
});

test("strict validation rejects a mobile OS and device-family mismatch", () => {
  for (const setup of [
    { operatingSystem: "Android 16", browser: supportedFirefox, device: "iPhone 15 Pro" },
    { operatingSystem: "iOS 18.5", browser: supportedSafari, device: "iPad Pro (M4)" },
    { operatingSystem: "iPadOS 18.5", browser: supportedSafari, device: "iPhone 15 Pro" },
  ]) {
    const record = completedRecord();
    Object.assign(
      record.environments.find(({ id }) => id === "mobile-touch"),
      setup,
    );
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /device must be a concrete physical model for its recorded mobile OS/,
      );
    });
  }
});

test("strict validation rejects mixed mobile OS families", () => {
  for (const operatingSystem of ["iOS 26 / Android 16", "iOS 18.5 / iPadOS 18.5"]) {
    const record = completedRecord();
    const mobile = record.environments.find(({ id }) => id === "mobile-touch");
    mobile.operatingSystem = operatingSystem;
    mobile.device = "iPhone 17 Pro";
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /must name exactly one supported mobile OS family/);
    });
  }
});

test("strict validation rejects missing coverage and accepted blockers", () => {
  const record = completedRecord();
  record.environments.pop();
  record.findings.push({
    issue: "https://github.com/vpavlov-me/Nerio/issues/999",
    severity: "P1",
    disposition: "accepted",
    releaseImpact: "blocking",
    summary: "Representative blocker",
  });
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /mobile-touch/);
    assert.match(result.stderr, /unresolved accepted blocker/);
  });
});
