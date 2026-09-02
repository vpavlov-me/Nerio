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
      operatingSystem: null,
      operatingSystemFamily: "macos",
      operatingSystemVersion: "15.5",
      browser: supportedChrome,
      assistiveTechnology: "Not applicable",
      device: "Mac Studio M2 Max (2023)",
      viewport: "1280x800",
      zoom: "Verified reflow at 200% and 400%",
      zoomLevelsTested: ["200%", "400%"],
      increasedOrHighContrastEnabled: true,
      notes: "Verified reflow with macOS Increase Contrast enabled.",
    },
    "mobile-touch": {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      assistiveTechnology: "Touch-only navigation",
      device: "iPhone 15 Pro",
      deviceClass: "phone",
      physicalDeviceUsed: true,
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

test("pending evidence cannot pre-claim structured desktop, zoom, or contrast results", () => {
  for (const [field, values] of [
    ["operatingSystem", ["macOS", "Ubuntu 24.04", false, undefined]],
    ["operatingSystemFamily", ["macos", "linux", false, undefined]],
    ["operatingSystemVersion", ["15.5", "24H2", 15.5, undefined]],
    ["zoomLevelsTested", [[], ["200%", "400%"], "200%, 400%", undefined]],
    ["increasedOrHighContrastEnabled", [true, false, "true", undefined]],
  ]) {
    for (const value of values) {
      const record = JSON.parse(
        readFileSync(resolve(root, "quality/stable-accessibility-smoke.json"), "utf8"),
      );
      record.environments.find(({ id }) => id === "zoom-reflow-contrast")[field] = value;
      withRecord(record, (target) => {
        const result = run(["--record", target]);
        assert.notEqual(result.status, 0, `${field}: ${String(value)}`);
        assert.match(result.stderr, /must remain null/);
      });
    }
  }
});

test("pending evidence cannot pre-claim structured physical mobile results", () => {
  for (const [field, values] of [
    ["deviceClass", ["phone", "tablet", false, undefined]],
    ["physicalDeviceUsed", [true, false, "true", undefined]],
  ]) {
    for (const value of values) {
      const record = JSON.parse(
        readFileSync(resolve(root, "quality/stable-accessibility-smoke.json"), "utf8"),
      );
      record.environments.find(({ id }) => id === "mobile-touch")[field] = value;
      withRecord(record, (target) => {
        const result = run(["--record", target]);
        assert.notEqual(result.status, 0, `${field}: ${String(value)}`);
        assert.match(result.stderr, /must remain null while evidence is pending/);
      });
    }
  }
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
  mobile.notes = "Verified touch interaction on a physical iPhone 15 Pro.";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /browser does not match the required macos-safari-voiceover setup/);
    assert.match(
      result.stderr,
      /device must be a concrete non-placeholder mobile model label when complete/,
    );
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

test("strict validation binds optional browser vendors to canonical products", () => {
  const versionByProduct = new Map([
    ["Safari", browserFloor("webkit")],
    ["Chrome", browserFloor("chromium")],
    ["Chromium", browserFloor("chromium")],
    ["Edge", browserFloor("chromium")],
    ["Firefox", browserFloor("firefox")],
  ]);
  const canonicalProductByVendor = new Map([
    ["Apple", "Safari"],
    ["Google", "Chrome"],
    ["Microsoft", "Edge"],
    ["Mozilla", "Firefox"],
  ]);

  for (const [vendor, canonicalProduct] of canonicalProductByVendor) {
    for (const [product, version] of versionByProduct) {
      const browser = `${vendor} ${product} ${version}`;
      const record = completedRecord();
      record.environments.find(({ id }) => id === "zoom-reflow-contrast").browser = browser;
      withRecord(record, (target, releaseMetadata, packagesRoot) => {
        const result = run(strictArgs(target, releaseMetadata, packagesRoot));
        if (product === canonicalProduct) {
          assert.equal(result.status, 0, `${browser}: ${result.stderr}`);
          assert.match(result.stdout, /internally approved/);
        } else {
          assert.notEqual(result.status, 0, browser);
          assert.match(
            result.stderr,
            /browser does not match the required zoom-reflow-contrast setup/,
          );
        }
      });
    }
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

test("strict validation binds desktop browser products to the structured OS family", () => {
  for (const { family, browser } of [
    { family: "windows", browser: supportedSafari },
    { family: "linux", browser: supportedSafari },
    { family: "chromeos", browser: supportedSafari },
    { family: "chromeos", browser: supportedEdge },
    { family: "bsd", browser: supportedSafari },
    { family: "bsd", browser: supportedChrome },
    { family: "unix", browser: supportedSafari },
    { family: "unix", browser: supportedEdge },
    { family: "other", browser: supportedSafari },
    { family: "other", browser: supportedChrome },
  ]) {
    const record = completedRecord();
    const desktop = record.environments.find(({ id }) => id === "zoom-reflow-contrast");
    desktop.operatingSystemFamily = family;
    desktop.browser = browser;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0, `${family}: ${browser}`);
      assert.match(result.stderr, /browser does not match the required zoom-reflow-contrast setup/);
    });
  }
});

test("strict validation rejects mixed or malformed macOS metadata", () => {
  for (const operatingSystem of [
    "macOS 15.5 / Windows 11",
    "Windows 11 / macOS 15.5",
    "macOS 15.5 Windows 11",
    "macOS15.5",
    "Apple macOS 15.5",
    "macOS 15.5 report",
    "macOS 15.5.1.2.3",
  ]) {
    for (const id of ["macos-safari-voiceover", "macos-chromium-keyboard"]) {
      const record = completedRecord();
      record.environments.find(({ id: candidateId }) => candidateId === id).operatingSystem =
        operatingSystem;
      withRecord(record, (target, releaseMetadata, packagesRoot) => {
        const result = run(strictArgs(target, releaseMetadata, packagesRoot));
        assert.notEqual(result.status, 0, `${id}: ${operatingSystem}`);
        assert.match(
          result.stderr,
          new RegExp(`operatingSystem does not match the required ${id} setup`),
        );
      });
    }
  }
});

test("strict validation accepts ordinary Mac hardware descriptions without inventory details", () => {
  const record = completedRecord();
  record.environments.find(({ id }) => id === "macos-safari-voiceover").device =
    "MacBook Pro 14-inch (M4 Pro)";
  record.environments.find(({ id }) => id === "macos-chromium-keyboard").device =
    "MacBook Pro without Touch Bar";
  record.environments.find(({ id }) => id === "zoom-reflow-contrast").device = "Mac mini M4";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /internally approved/);
  });
});

test("strict validation accepts concrete legacy and Touch Bar Mac descriptions", () => {
  const record = completedRecord();
  record.environments.find(({ id }) => id === "macos-safari-voiceover").device = "iMac Pro";
  record.environments.find(({ id }) => id === "macos-chromium-keyboard").device =
    "MacBook Pro with Touch Bar";
  record.environments.find(({ id }) => id === "zoom-reflow-contrast").device =
    "Mac Pro (Late 2013)";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /internally approved/);
  });
});

test("strict validation accepts concrete Apple-formatted Mac descriptions", () => {
  const record = completedRecord();
  record.environments.find(({ id }) => id === "macos-safari-voiceover").device =
    "MacBook Air (M2, 2022)";
  record.environments.find(({ id }) => id === "macos-chromium-keyboard").device =
    "MacBook Pro (13-inch, M1, 2020)";
  record.environments.find(({ id }) => id === "zoom-reflow-contrast").device =
    "iMac (Retina 5K, 27-inch, 2020)";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /internally approved/);
  });
});

test("strict validation accepts ordinary concrete desktop descriptions without inventory details", () => {
  for (const device of [
    "Dell XPS",
    "Dell XPS 13",
    "Acer Aspire 5",
    "Dell Inspiron 15",
    "HP Pavilion 15",
    "HP EliteBook 840 G10",
    "HP ProBook 450 G10",
    "ASUS Vivobook S 15 OLED",
    "Lenovo ThinkPad",
    "Lenovo ThinkPad X1 Carbon Gen 12",
    "Framework Laptop",
    "Framework Laptop 13",
    "Microsoft Surface Laptop 7",
    "Microsoft Surface Pro",
    "Microsoft Surface Book 3",
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
    "MSI Prestige 16",
    "System76 Lemur Pro",
    "Huawei MateBook X Pro",
    "Gigabyte Aero 16",
    "Razer Book 13",
    "Samsung Galaxy Book5 Pro",
    "Samsung Galaxy Book4 Ultra",
    "TUXEDO InfinityBook Pro 14",
    "HP EliteBook x360 1040 G11",
    "Dell XPS 13 2-in-1",
    "Samsung Galaxy Book4 360",
    "Microsoft Surface Laptop Studio 2",
    "ASUS ROG Zephyrus G14",
    "Dell Precision",
    "Dell Precision 5680",
    "Dell Precision 3680 Tower",
    "HP ZBook",
    "HP ZBook Firefly 14 G11",
    "HP ZBook Power 16 G11",
    "HP ZBook 15 G6",
    "ASUS ExpertBook",
    "ASUS ExpertBook B5",
    "ASUS ExpertBook B1 B1503",
    "Acer Predator Helios 16",
    "HP OMEN 45L desktop",
    "Lenovo LOQ 15IRX9 laptop",
    "ASUS NUC 14 Pro mini PC",
    "MSI MAG Infinite S3 14NUE7 desktop",
    "Fujitsu Lifebook U9413 notebook",
    "VAIO FE16",
    "Beelink SER8 mini PC",
    "MINISFORUM UM790 Pro mini PC",
    "Custom Ryzen 7950X workstation",
    "FutureBrand Model-Z9 desktop",
    "System76 Thelio",
    "Lenovo ThinkStation Tiny",
    "Dell OptiPlex Micro",
    "X1",
    "Custom Sprinter X1 workstation",
    "Sprinter X1 workstation",
    "Monitorium X1 workstation",
    "Keyboardist X1 workstation",
    "WebKitten X1 workstation",
    "Printerton X1 workstation",
    "Microsoft Surface Laptop 7 Copilot+ PC",
    "Surface Pro 11 Copilot+ PC",
    "ASUS Vivobook S 15 Copilot+ PC",
    "Dell XPS Copilot+ PC",
    "HP OmniBook X Copilot+ PC",
    "Microsoft Surface Pro Copilot+ PC",
    "Dell Latitude 7440 (non-touch)",
    "Lenovo ThinkPad T14 without touchscreen",
    "HP EliteBook 840 G10 (no touch)",
    "Dell Precision 5680 without discrete GPU",
    "Dell Latitude 7440 touch-free",
    "Dell Latitude 7440 without hardware acceleration",
  ]) {
    const record = completedRecord();
    const desktop = record.environments.find(({ id }) => id === "zoom-reflow-contrast");
    desktop.operatingSystemFamily = "windows";
    desktop.operatingSystemVersion = "11";
    desktop.device = device;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.equal(result.status, 0, `${device}: ${result.stderr}`);
      assert.match(result.stdout, /internally approved/);
    });
  }
});

test("strict validation accepts a structured ChromeOS desktop environment", () => {
  for (const browser of [supportedChrome, supportedChromium, supportedFirefox]) {
    const record = completedRecord();
    const desktop = record.environments.find(({ id }) => id === "zoom-reflow-contrast");
    desktop.operatingSystemFamily = "chromeos";
    desktop.operatingSystemVersion = "140";
    desktop.browser = browser;
    desktop.device = "Acer Chromebook 516 GE";
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.equal(result.status, 0, `${browser}: ${result.stderr}`);
      assert.match(result.stdout, /internally approved/);
    });
  }
});

test("strict validation accepts every structured desktop OS family", () => {
  for (const { example, family, version } of [
    { example: "Windows 11", family: "windows", version: "11" },
    { example: "macOS 15.5", family: "macos", version: "15.5" },
    { example: "Ubuntu 24.04.2 LTS", family: "linux", version: "24.04.2" },
    { example: "ChromeOS build 140.0.7339.207", family: "chromeos", version: "140.0.7339.207" },
    { example: "FreeBSD 14.3", family: "bsd", version: "14.3" },
    { example: "Solaris 11.4", family: "unix", version: "11.4" },
    { example: "Haiku release 1", family: "other", version: "1" },
  ]) {
    const record = completedRecord();
    const desktop = record.environments.find(({ id }) => id === "zoom-reflow-contrast");
    desktop.operatingSystemFamily = family;
    desktop.operatingSystemVersion = version;
    desktop.browser = ["bsd", "unix", "other"].includes(family)
      ? supportedChromium
      : supportedChrome;
    desktop.device = "Framework Laptop 13";
    desktop.notes = `Verified the scoped scenarios on ${example}.`;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.equal(result.status, 0, `${example}: ${result.stderr}`);
      assert.match(result.stdout, /internally approved/);
    });
  }
});

test("strict validation rejects legacy free-form desktop OS metadata", () => {
  for (const operatingSystem of [
    "ChromeOS",
    "Generic OS 140",
    "Desktop OS 140",
    "Android 16",
    supportedChrome,
    "Desktop Chrome 140.0",
    "OS Firefox 143.0",
    "Audit Checklist 2026",
    "auditchecklist2026",
    "Kitchen Chair 2026",
    "Future Product 2026",
    "Windows Release Report 2026",
    "Windows 11 / Ubuntu 24.04",
    "Windows 11 and Ubuntu 24.04",
    "Windows Ubuntu 24.04",
    "Ubuntu on Framework 13",
    "Ubuntu Framework 13",
    "Dell XPS",
    "Apple MacBook Pro",
    "Mac Studio",
    "Fedora Linux Mint",
    "Ubuntu Linux Mint",
  ]) {
    const record = completedRecord();
    record.environments.find(({ id }) => id === "zoom-reflow-contrast").operatingSystem =
      operatingSystem;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0, operatingSystem);
      assert.match(
        result.stderr,
        /operatingSystem must remain null; use operatingSystemFamily and operatingSystemVersion/,
      );
    });
  }
});

test("strict validation requires authoritative structured desktop OS evidence", () => {
  for (const { field, values, diagnostic } of [
    {
      field: "operatingSystemFamily",
      values: [undefined, null, "", "ubuntu", "windows/linux", false],
      diagnostic: /operatingSystemFamily must be one of/,
    },
    {
      field: "operatingSystemVersion",
      values: [
        undefined,
        null,
        "",
        "v11",
        "Ubuntu 24.04",
        "11 Ubuntu",
        "Framework 13",
        "11/24H2",
        "11Ubuntu",
        "24H2",
        "14.3-RELEASE-p1",
        11,
      ],
      diagnostic: /operatingSystemVersion must be a standalone numeric OS version/,
    },
  ]) {
    for (const value of values) {
      const record = completedRecord();
      record.environments.find(({ id }) => id === "zoom-reflow-contrast")[field] = value;
      withRecord(record, (target, releaseMetadata, packagesRoot) => {
        const result = run(strictArgs(target, releaseMetadata, packagesRoot));
        assert.notEqual(result.status, 0, `${field}: ${String(value)}`);
        assert.match(result.stderr, diagnostic);
      });
    }
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
    { id: "macos-safari-voiceover", device: "MacBook Pro Widget" },
    { id: "macos-safari-voiceover", device: "MacBook Pro ROOM 42" },
    { id: "macos-safari-voiceover", device: "MacBook Pro QA2026" },
    { id: "macos-safari-voiceover", device: "iMac ROOM 42" },
    { id: "macos-safari-voiceover", device: "MacBook Pro (not available)" },
    { id: "zoom-reflow-contrast", device: "desktop device 123" },
    { id: "zoom-reflow-contrast", device: "Windows desktop" },
    { id: "zoom-reflow-contrast", device: "PC 123" },
    { id: "zoom-reflow-contrast", device: "hardware machine 42" },
    { id: "zoom-reflow-contrast", device: "Office laptop" },
    { id: "zoom-reflow-contrast", device: "My computer" },
    { id: "zoom-reflow-contrast", device: "Available device" },
    { id: "zoom-reflow-contrast", device: "TestDevice 123" },
    { id: "zoom-reflow-contrast", device: "SampleLaptop 14" },
    { id: "zoom-reflow-contrast", device: "GenericPC 42" },
    { id: "zoom-reflow-contrast", device: "UnknownDevice X1" },
    { id: "zoom-reflow-contrast", device: "PlaceholderMachine 1" },
    { id: "zoom-reflow-contrast", device: "ExampleNotebook 14" },
    { id: "zoom-reflow-contrast", device: "QALaptop 14" },
    { id: "zoom-reflow-contrast", device: "WidgetBook 14" },
    { id: "zoom-reflow-contrast", device: "test_device 123" },
    { id: "zoom-reflow-contrast", device: "AuditReport 2026" },
    { id: "zoom-reflow-contrast", device: "ReleaseNotes 2026" },
    { id: "zoom-reflow-contrast", device: "AccessibilityChecklist 2026" },
    { id: "zoom-reflow-contrast", device: "ComplianceMatrix 2026" },
    { id: "zoom-reflow-contrast", device: "UserGuide 2026" },
    { id: "zoom-reflow-contrast", device: "MicrosoftOffice 365" },
    { id: "zoom-reflow-contrast", device: "GoogleWorkspace 2026" },
    { id: "zoom-reflow-contrast", device: "ChromeBrowser 140" },
    { id: "zoom-reflow-contrast", device: "FirefoxBrowser 143" },
    { id: "zoom-reflow-contrast", device: "EdgeBrowser 140" },
    { id: "zoom-reflow-contrast", device: "SafariBrowser 26" },
    { id: "zoom-reflow-contrast", device: "WindowsPC 11" },
    { id: "zoom-reflow-contrast", device: "AndroidLaptop 16" },
    { id: "zoom-reflow-contrast", device: "DesktopBrowser 140" },
    { id: "zoom-reflow-contrast", device: "DellMonitor U2723QE" },
    { id: "zoom-reflow-contrast", device: "HPPrinter 123" },
    { id: "zoom-reflow-contrast", device: "GamingMonitor U27" },
    { id: "zoom-reflow-contrast", device: "USBKeyboard K1" },
    { id: "zoom-reflow-contrast", device: "PrinterModel 123" },
    { id: "zoom-reflow-contrast", device: "DesktopMonitor U27" },
    { id: "zoom-reflow-contrast", device: "Primary laptop" },
    { id: "zoom-reflow-contrast", device: "Work computer" },
    { id: "zoom-reflow-contrast", device: "Corporate workstation" },
    { id: "zoom-reflow-contrast", device: "Physical device" },
    { id: "zoom-reflow-contrast", device: "Desktop environment" },
    { id: "zoom-reflow-contrast", device: "Current device" },
    { id: "zoom-reflow-contrast", device: "Local machine" },
    { id: "zoom-reflow-contrast", device: "Company PC" },
    { id: "zoom-reflow-contrast", device: "Main desktop" },
    { id: "zoom-reflow-contrast", device: "Dell XPS unavailable" },
    { id: "zoom-reflow-contrast", device: "Unavailable Dell XPS" },
    { id: "zoom-reflow-contrast", device: "Dell XPS absent" },
    { id: "zoom-reflow-contrast", device: "Missing Dell XPS" },
    { id: "zoom-reflow-contrast", device: "Non-Dell XPS" },
    { id: "zoom-reflow-contrast", device: "NotDell XPS 13" },
    { id: "zoom-reflow-contrast", device: "NoDell XPS 13" },
    { id: "zoom-reflow-contrast", device: "WithoutDell XPS 13" },
    { id: "zoom-reflow-contrast", device: "N/A" },
    { id: "zoom-reflow-contrast", device: "None" },
    { id: "zoom-reflow-contrast", device: "This device" },
    { id: "zoom-reflow-contrast", device: "Our standard system" },
    { id: "zoom-reflow-contrast", device: "testdevice" },
    { id: "zoom-reflow-contrast", device: "samplelaptop" },
    { id: "zoom-reflow-contrast", device: "genericpc" },
    { id: "zoom-reflow-contrast", device: "unknowndevice" },
    { id: "zoom-reflow-contrast", device: "placeholdermachine" },
    { id: "zoom-reflow-contrast", device: "examplenotebook" },
    { id: "zoom-reflow-contrast", device: "qalaptop" },
    { id: "zoom-reflow-contrast", device: "widgetbook" },
    { id: "zoom-reflow-contrast", device: "mockbook" },
    { id: "zoom-reflow-contrast", device: "fakebook" },
    { id: "zoom-reflow-contrast", device: "auditreport" },
    { id: "zoom-reflow-contrast", device: "releasenotes" },
    { id: "zoom-reflow-contrast", device: "accessibilitychecklist" },
    { id: "zoom-reflow-contrast", device: "compliancematrix" },
    { id: "zoom-reflow-contrast", device: "userguide" },
    { id: "zoom-reflow-contrast", device: "evidencerecord" },
    { id: "zoom-reflow-contrast", device: "roadmapitem" },
    { id: "zoom-reflow-contrast", device: "microsoftoffice" },
    { id: "zoom-reflow-contrast", device: "googleworkspace" },
    { id: "zoom-reflow-contrast", device: "chromebrowser" },
    { id: "zoom-reflow-contrast", device: "firefoxbrowser" },
    { id: "zoom-reflow-contrast", device: "edgebrowser" },
    { id: "zoom-reflow-contrast", device: "safaribrowser" },
    { id: "zoom-reflow-contrast", device: "dellmonitor" },
    { id: "zoom-reflow-contrast", device: "hpprinter" },
    { id: "zoom-reflow-contrast", device: "usbkeyboard" },
    { id: "zoom-reflow-contrast", device: "Edge_HTML 18" },
    { id: "zoom-reflow-contrast", device: "Web_Kit 26" },
    { id: "zoom-reflow-contrast", device: "i_OS 18" },
    { id: "zoom-reflow-contrast", device: "iPad_OS 18" },
    { id: "zoom-reflow-contrast", device: "Configured device" },
    { id: "zoom-reflow-contrast", device: "Actual laptop" },
    { id: "zoom-reflow-contrast", device: "Real workstation" },
    { id: "zoom-reflow-contrast", device: "Some PC" },
    { id: "zoom-reflow-contrast", device: "Other computer" },
    { id: "zoom-reflow-contrast", device: "User device" },
    { id: "zoom-reflow-contrast", device: "Development machine" },
    { id: "zoom-reflow-contrast", device: "Neither Dell nor HP" },
    { id: "zoom-reflow-contrast", device: "Neither a Dell XPS nor an HP ZBook" },
    { id: "zoom-reflow-contrast", device: "Dell XPS lacks availability" },
    { id: "zoom-reflow-contrast", device: "Dell Latitude 7440 was not available" },
    { id: "zoom-reflow-contrast", device: "Lenovo ThinkPad T14 never used" },
    { id: "zoom-reflow-contrast", device: "Dell Latitude 7440 without a device" },
    { id: "zoom-reflow-contrast", device: "Dell Latitude 7440 was unavailable for the smoke" },
    { id: "zoom-reflow-contrast", device: "Dell Latitude 7440 is no longer available" },
    { id: "zoom-reflow-contrast", device: "Null" },
    { id: "zoom-reflow-contrast", device: "TBD" },
    { id: "zoom-reflow-contrast", device: "TBA" },
    { id: "zoom-reflow-contrast", device: "Unset" },
    { id: "zoom-reflow-contrast", device: "Pending" },
    { id: "zoom-reflow-contrast", device: "applemusic 2026" },
    { id: "zoom-reflow-contrast", device: "microsoftcopilot 2026" },
    { id: "zoom-reflow-contrast", device: "Copilot 2026" },
    { id: "zoom-reflow-contrast", device: "Microsoft Copilot Pro" },
    { id: "zoom-reflow-contrast", device: "Microsoft Copilot Chat" },
    { id: "zoom-reflow-contrast", device: "Microsoft Copilot for Microsoft 365" },
    { id: "zoom-reflow-contrast", device: "GitHub Copilot" },
    { id: "zoom-reflow-contrast", device: "Microsoft Security Copilot" },
    { id: "zoom-reflow-contrast", device: "Security Copilot+ PC" },
    { id: "zoom-reflow-contrast", device: "Microsoft Security Copilot+ PC" },
    { id: "zoom-reflow-contrast", device: "GitHub Copilot+ PC" },
    { id: "zoom-reflow-contrast", device: "Azure Copilot+ PC" },
    { id: "zoom-reflow-contrast", device: "Dynamics Copilot+ PC" },
    { id: "zoom-reflow-contrast", device: "googlecalendar 2026" },
    { id: "zoom-reflow-contrast", device: "Former Dell XPS" },
    { id: "zoom-reflow-contrast", device: "Kitchen Chair" },
    { id: "zoom-reflow-contrast", device: "Kitchen Chair 2026" },
    { id: "zoom-reflow-contrast", device: "Conference Room 42" },
    { id: "zoom-reflow-contrast", device: "Audit Checklist 2026" },
    { id: "zoom-reflow-contrast", device: "Accessibility QA 2026" },
    { id: "zoom-reflow-contrast", device: "QA REPORT 2026" },
    { id: "zoom-reflow-contrast", device: "Release Notes 2026" },
    { id: "zoom-reflow-contrast", device: "Evidence Matrix 2026" },
    { id: "zoom-reflow-contrast", device: "Compliance Record 2026" },
    { id: "zoom-reflow-contrast", device: "HP Widget" },
    { id: "zoom-reflow-contrast", device: "LG Widget" },
    { id: "zoom-reflow-contrast", device: "ASUS Widget" },
    { id: "zoom-reflow-contrast", device: "TUXEDO Widget" },
    { id: "zoom-reflow-contrast", device: "HP Kitchen Chair" },
    { id: "zoom-reflow-contrast", device: "HP QA 2026" },
    { id: "zoom-reflow-contrast", device: "HP WIDGET 2026" },
    { id: "zoom-reflow-contrast", device: "HP ROOM 42" },
    { id: "zoom-reflow-contrast", device: "ASUS ABC 8" },
    { id: "zoom-reflow-contrast", device: "Dell Precision Widget 5680" },
    { id: "zoom-reflow-contrast", device: "HP ZBook Widget 14 G11" },
    { id: "zoom-reflow-contrast", device: "ASUS ExpertBook QA5" },
    { id: "zoom-reflow-contrast", device: "Google Calendar" },
    { id: "zoom-reflow-contrast", device: "Microsoft Copilot" },
    { id: "zoom-reflow-contrast", device: "Acer Projector" },
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
    { id: "zoom-reflow-contrast", device: "Dell XPS 13 User Guide" },
    { id: "zoom-reflow-contrast", device: "Microsoft Surface Pro 9 Manual" },
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
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone 15 Pro",
      deviceClass: "phone",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedChrome,
      device: "iPhone 15 Pro",
      deviceClass: "phone",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedEdge,
      device: "iPhone 15 Pro",
      deviceClass: "phone",
    },
    {
      operatingSystem: "iOS 18.5",
      browser: supportedFirefox,
      device: "iPhone 15 Pro",
      deviceClass: "phone",
    },
    {
      operatingSystem: "iPadOS 18.5",
      browser: supportedSafari,
      device: "iPad Pro (M4)",
      deviceClass: "tablet",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedChrome,
      device: "Google Pixel 9",
      deviceClass: "phone",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedChromium,
      device: "Google Pixel 9",
      deviceClass: "phone",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedEdge,
      device: "Pixel Tablet",
      deviceClass: "tablet",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "FutureBrand Nova",
      deviceClass: "phone",
    },
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
    {
      operatingSystem: "iOS 18.5",
      browser: supportedChromium,
      device: "iPhone 15 Pro",
      deviceClass: "phone",
    },
    {
      operatingSystem: "iPadOS 18.5",
      browser: supportedChromium,
      device: "iPad Pro (M4)",
      deviceClass: "tablet",
    },
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

test("mobile-touch note phrasing does not override valid structured evidence", () => {
  for (const notes of [
    "Touch checks completed on the locked candidate.",
    "A physical mobile device was available.",
    "No physical-device claim is restated here.",
    "The simulator was used for unrelated setup.",
    "The emulator was unavailable during the smoke.",
    "Touch verification was reported as pending.",
  ]) {
    const record = completedRecord();
    record.environments.find(({ id }) => id === "mobile-touch").notes = notes;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.equal(result.status, 0, `${notes}: ${result.stderr}`);
      assert.match(result.stdout, /internally approved/);
    });
  }
});

test("mobile-touch notes cannot substitute for invalid structured evidence", () => {
  for (const { mutate, diagnostic } of [
    {
      mutate: (mobile) => {
        mobile.result = "Fail";
      },
      diagnostic: /result must be Pass for a release-ready smoke/,
    },
    {
      mutate: (mobile) => {
        mobile.physicalDeviceUsed = false;
      },
      diagnostic: /physicalDeviceUsed must equal true when complete/,
    },
    {
      mutate: (mobile) => {
        mobile.deviceClass = "watch";
      },
      diagnostic: /deviceClass must equal "phone" or "tablet" when complete/,
    },
    {
      mutate: (mobile) => {
        mobile.device = "iPhone 15 Pro Simulator";
      },
      diagnostic: /device must be a concrete non-placeholder mobile model label when complete/,
    },
  ]) {
    const record = completedRecord();
    const mobile = record.environments.find(({ id }) => id === "mobile-touch");
    mobile.notes = "Verified touch interaction on a physical iPhone 15 Pro.";
    mutate(mobile);
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, diagnostic);
    });
  }
});

test("strict validation accepts open mobile labels with structured physical evidence", () => {
  for (const setup of [
    {
      operatingSystem: "iOS 18.5",
      browser: supportedSafari,
      device: "iPhone Air",
      deviceClass: "phone",
    },
    {
      operatingSystem: "iPadOS 18.5",
      browser: supportedSafari,
      device: "iPad Pro (M4)",
      deviceClass: "tablet",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "TECNO CAMON 40 Pro",
      deviceClass: "phone",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedChrome,
      device: "Pixel Tablet",
      deviceClass: "tablet",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedEdge,
      device: "SM-S921B/DS",
      deviceClass: "phone",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedChromium,
      device: "FutureBrand Nova",
      deviceClass: "tablet",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "LatestPhone 1",
      deviceClass: "phone",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedChrome,
      device: "Motorola Edge 60 Pro",
      deviceClass: "phone",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedChrome,
      device: "Edge 20",
      deviceClass: "phone",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedEdge,
      device: "Nothing Phone 3",
      deviceClass: "phone",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "SHIFTphone 8",
      deviceClass: "phone",
    },
    {
      operatingSystem: "Android 12L",
      browser: supportedChrome,
      device: "A15",
      deviceClass: "phone",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedEdge,
      device: "N100",
      deviceClass: "phone",
    },
    {
      operatingSystem: "Android 16",
      browser: supportedFirefox,
      device: "NOA N10",
      deviceClass: "phone",
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

test("strict validation requires authoritative structured physical mobile evidence", () => {
  for (const { field, values, diagnostic } of [
    {
      field: "physicalDeviceUsed",
      values: [null, false, "true", 1, undefined],
      diagnostic: /physicalDeviceUsed must equal true when complete/,
    },
    {
      field: "deviceClass",
      values: [null, "desktop", "Phone", [], undefined],
      diagnostic: /deviceClass must equal "phone" or "tablet" when complete/,
    },
  ]) {
    for (const value of values) {
      const record = completedRecord();
      record.environments.find(({ id }) => id === "mobile-touch")[field] = value;
      withRecord(record, (target, releaseMetadata, packagesRoot) => {
        const result = run(strictArgs(target, releaseMetadata, packagesRoot));
        assert.notEqual(result.status, 0, `${field}: ${String(value)}`);
        assert.match(result.stderr, diagnostic);
      });
    }
  }
});

test("strict validation rejects placeholder and browser-only mobile model labels", () => {
  for (const device of [
    "iPhone test device",
    "iPhone 15 ProSimulator",
    "iPad Pro (M4) VirtualDevice",
    "TECNO CAMON 40 Pro Emulator",
    "testdevice 40",
    "genericphone 40",
    "placeholdermodel 40",
    "iphone15proplaceholder",
    "deviceplaceholder40",
    "modelunknown40",
    "firefoxphone42",
    "chromemobile42",
    "Chrome143",
    "Safari18",
    "AndroidChrome143",
    "iOSSafari18",
    "mobiledevice42",
    "androidphone42",
    "MOBILEHARDWARE42",
    "No device",
    "Pending model 1",
    "TBD 123",
    "testunit40",
    "unknownunit42",
    "deviceplaceholderpro40",
    "Unit 123",
    "Dummy phone 1",
    "None phone 1",
    "N/A model 1",
    "abcphone42",
    "widphone42",
    "iphone15proplaceholder40",
    "iphone15proplaceholdermodel40",
    "safariios18",
    "firefoxandroid42",
    "mobilefirefox42",
    "Android browser 143",
    "Browser Chrome 143",
    "chromebrowser143",
    "Web Browser 143",
    "The Safari 18",
    "Mobile Web Browser 143",
    "Edge 143 Browser",
    "Edge143Browser",
    "Edge143Safari",
    "A phone 1",
    "An Android phone 1",
    "The mobile device 1",
    "Demo phone 1",
    "Temporary phone 1",
    "Prototype device 1",
    "Default model 1",
    "Audit Checklist 2026",
    "Accessibility Report 2026",
    "Release Evidence 2026",
    "auditchecklist2026",
    "AUDITCHECKLIST2026",
    "accessibilityreport2026",
    "releaseevidence2026",
    "iPhone 15 pending model 1",
    "iphone15testphone",
    "Physical mobile device",
    "Google Chrome 143.0",
    "Mozilla/5.0",
    "N/A",
  ]) {
    const record = completedRecord();
    record.environments.find(({ id }) => id === "mobile-touch").device = device;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0, device);
      assert.match(
        result.stderr,
        /device must be a concrete non-placeholder mobile model label when complete/,
      );
    });
  }
});

test("strict validation requires authoritative structured zoom and contrast evidence", () => {
  for (const { field, values, diagnostic } of [
    {
      field: "zoomLevelsTested",
      values: [
        undefined,
        null,
        [],
        ["200%"],
        ["400%"],
        ["200%", "200%"],
        ["400%", "400%"],
        ["200%", "400%", "500%"],
        ["200", "400"],
        "200%, 400%",
        true,
      ],
      diagnostic: /zoomLevelsTested must contain exactly "200%" and "400%"/,
    },
    {
      field: "increasedOrHighContrastEnabled",
      values: [undefined, null, false, "true", 1],
      diagnostic: /increasedOrHighContrastEnabled must equal true/,
    },
  ]) {
    for (const value of values) {
      const record = completedRecord();
      record.environments.find(({ id }) => id === "zoom-reflow-contrast")[field] = value;
      withRecord(record, (target, releaseMetadata, packagesRoot) => {
        const result = run(strictArgs(target, releaseMetadata, packagesRoot));
        assert.notEqual(result.status, 0, `${field}: ${JSON.stringify(value)}`);
        assert.match(result.stderr, diagnostic);
      });
    }
  }
});

test("strict validation accepts the exact structured zoom set in either order", () => {
  for (const zoomLevelsTested of [
    ["200%", "400%"],
    ["400%", "200%"],
  ]) {
    const record = completedRecord();
    record.environments.find(({ id }) => id === "zoom-reflow-contrast").zoomLevelsTested =
      zoomLevelsTested;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /internally approved/);
    });
  }
});

test("free-form zoom prose and notes cannot substitute for structured results", () => {
  const record = completedRecord();
  const zoomContrast = record.environments.find(({ id }) => id === "zoom-reflow-contrast");
  zoomContrast.zoomLevelsTested = null;
  zoomContrast.increasedOrHighContrastEnabled = false;
  zoomContrast.zoom = "Verified reflow at 200% and 400%.";
  zoomContrast.notes =
    "The report says both zoom levels and increased contrast passed on the locked candidate.";
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /zoomLevelsTested must contain exactly "200%" and "400%"/);
    assert.match(result.stderr, /increasedOrHighContrastEnabled must equal true/);
  });
});

test("structured zoom and contrast results do not depend on free-form phrasing", () => {
  for (const { zoom, notes } of [
    {
      zoom: "200% and 400% were tested. Later review established that no zoom testing actually occurred.",
      notes: "Increase Contrast was not enabled according to an obsolete report.",
    },
    {
      zoom: "Zoom testing was not performed again because the first run passed.",
      notes: "No high contrast issues were found.",
    },
    {
      zoom: "No zoom testing issues occurred.",
      notes: "Was high contrast enabled? See the linked evidence for the structured result.",
    },
  ]) {
    const record = completedRecord();
    const zoomContrast = record.environments.find(({ id }) => id === "zoom-reflow-contrast");
    zoomContrast.zoom = zoom;
    zoomContrast.notes = notes;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /internally approved/);
    });
  }
});

test("strict validation still rejects negated assistive-technology metadata", () => {
  for (const assistiveTechnology of ["VoiceOver wasn't enabled", "No VoiceOver was used"]) {
    const record = completedRecord();
    record.environments.find(({ id }) => id === "macos-safari-voiceover").assistiveTechnology =
      assistiveTechnology;
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0, assistiveTechnology);
      assert.match(
        result.stderr,
        /assistiveTechnology does not match the required macos-safari-voiceover setup/,
      );
    });
  }
});

test("strict validation rejects a mobile OS and structured device-class mismatch", () => {
  for (const setup of [
    { operatingSystem: "iOS 18.5", deviceClass: "tablet" },
    { operatingSystem: "iPadOS 18.5", deviceClass: "phone" },
  ]) {
    const record = completedRecord();
    Object.assign(
      record.environments.find(({ id }) => id === "mobile-touch"),
      setup,
    );
    withRecord(record, (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /deviceClass does not match the recorded mobile OS family/);
    });
  }
});

test("strict validation rejects mixed mobile or desktop OS families", () => {
  for (const operatingSystem of [
    "iOS 26 / Android 16",
    "iOS 18.5 / iPadOS 18.5",
    "iOS 18.5 / Windows 11",
    "Android 16 / macOS 15",
    "iOS 18.5 / Ubuntu 24.04",
    "Android 16 / watchOS 11",
    "Android 16 / HarmonyOS 5",
    "iOS 18.5 (Android 16)",
    "iOS 18.5 Android16",
    "Android 16 (iPadOS 18.5)",
    "Android 16 Windows11",
    "iPadOS 18.5 macOS15",
    "Android 16 (Ubuntu 24.04)",
  ]) {
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
