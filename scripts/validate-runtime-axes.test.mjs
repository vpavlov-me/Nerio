import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const validator = resolve(root, "scripts/validate-runtime-axes.mjs");
const tokenSource = resolve(root, "packages/tokens/src/styles.css");
const catalogSource = resolve(root, "data/component-catalog.json");
const docsSource = resolve(root, "apps/docs/components/docs-chrome.tsx");
const docsPlaygroundSource = resolve(root, "apps/docs/components/visual-playground.tsx");
const docsAppearanceSource = resolve(root, "apps/docs/lib/appearance.ts");
const demoAppearanceSource = resolve(root, "apps/demo-app/lib/appearance.ts");

function run(...args) {
  return spawnSync(process.execPath, [validator, ...args], { cwd: root, encoding: "utf8" });
}

function fixture(name, contents) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-runtime-"));
  const target = resolve(directory, name);
  writeFileSync(target, contents);
  return { directory, target };
}

function withFixture(option, name, contents, assertion, expectedStatus = 1) {
  const value = fixture(name, contents);
  try {
    const result = run(option, value.target);
    assert.equal(result.status, expectedStatus, result.stderr);
    assertion(result.stderr);
  } finally {
    rmSync(value.directory, { recursive: true, force: true });
  }
}

function withSourceDirectory(files, assertion, expectedStatus = 1) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-runtime-source-"));
  try {
    for (const [relativePath, contents] of Object.entries(files)) {
      const target = resolve(directory, relativePath);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, contents);
    }
    const result = run("--ui-source-dir", directory);
    assert.equal(result.status, expectedStatus, result.stderr);
    assertion(result.stderr);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("runtime-axis validator accepts exact repository selectors", () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
});

test("runtime-axis validator scans shared TypeScript recipes outside components", () => {
  withSourceDirectory(
    {
      "components/accessibility.tsx":
        'export const accessibility = "forced-colors:border-[CanvasText]";\n',
      "lib/motion.ts": 'export const motion = "motion-reduce:animate-none";\n',
    },
    () => {},
    0,
  );
});

test("runtime-axis validator rejects selector substrings that are not exact selectors", () => {
  withFixture(
    "--token-file",
    "styles.css",
    readFileSync(tokenSource, "utf8").replace(
      ':root[data-theme="purple"] {',
      '.preview :root[data-theme="purple"] {',
    ),
    (stderr) => assert.match(stderr, /Light theme purple selector is missing or misplaced/),
  );
});

test("runtime-axis validator requires system-dark selectors inside the dark media query", () => {
  withFixture(
    "--token-file",
    "styles.css",
    readFileSync(tokenSource, "utf8").replace(
      '@media (prefers-color-scheme: dark) {\n  :root[data-mode="system"]',
      '@media (min-width: 1px) {\n  :root[data-mode="system"]',
    ),
    (stderr) => assert.match(stderr, /System-dark mode selector is missing or misplaced/),
  );
});

test("runtime-axis validator requires complete accent declarations in dark scopes", () => {
  const source = readFileSync(tokenSource, "utf8");
  const mutated = source.replace(
    /(:root\[data-theme="red"\]\[data-mode="dark"\]\s*\{[\s\S]*?)^\s*--n-chart-categorical-1:.*\n/m,
    "$1",
  );
  withFixture("--token-file", "styles.css", mutated, (stderr) => {
    assert.match(stderr, /Dark theme red is missing --n-chart-categorical-1/);
  });
});

test("runtime-axis validator rejects prohibited axes structurally", () => {
  withFixture(
    "--token-file",
    "styles.css",
    `${readFileSync(tokenSource, "utf8")}\n:root[data-font="geist"] { --n-font-sans: sans-serif; }\n`,
    (stderr) => assert.match(stderr, /Prohibited runtime axis selector: data-font/),
  );
});

for (const operator of ["=", "~=", "|=", "^=", "$=", "*=", null]) {
  test(`runtime-axis validator rejects prohibited axes with ${operator ?? "presence"} selectors`, () => {
    const selector = operator ? `[data-font${operator}"geist"]` : "[data-font]";
    withFixture(
      "--token-file",
      "styles.css",
      `${readFileSync(tokenSource, "utf8")}\n:root${selector} { --n-font-sans: sans-serif; }\n`,
      (stderr) => assert.match(stderr, /Prohibited runtime axis selector: data-font/),
    );
  });
}

for (const operator of ["=", "~=", "|=", "^=", "$=", "*=", null]) {
  test(`runtime-axis validator rejects whitespace-padded prohibited axes with ${operator ?? "presence"} selectors`, () => {
    const selector = operator ? `[data-font ${operator} "geist"]` : "[data-font ]";
    withFixture(
      "--token-file",
      "styles.css",
      `${readFileSync(tokenSource, "utf8")}\n:root${selector} { --n-font-sans: sans-serif; }\n`,
      (stderr) => assert.match(stderr, /Prohibited runtime axis selector: data-font/),
    );
  });
}

test("runtime-axis validator rejects primitive token overrides in runtime selectors", () => {
  const source = readFileSync(tokenSource, "utf8").replace(
    ':root[data-density="compact"] {',
    ':root[data-density="compact"] {\n  --n-radius-md: 0.5rem;',
  );
  withFixture("--token-file", "styles.css", source, (stderr) => {
    assert.match(
      stderr,
      /Runtime selector :root\[data-density="compact"\] redefines primitive token --n-radius-md/,
    );
  });
});

test("runtime-axis validator treats alpha neutrals as immutable primitives", () => {
  const source = readFileSync(tokenSource, "utf8").replace(
    ':root[data-density="compact"] {',
    ':root[data-density="compact"] {\n  --n-gray-a-8: rgb(15 23 42 / 0.5);',
  );
  withFixture("--token-file", "styles.css", source, (stderr) => {
    assert.match(stderr, /redefines primitive token --n-gray-a-8/);
  });
});

test("runtime-axis validator treats overlay elevation as an immutable primitive", () => {
  const source = readFileSync(tokenSource, "utf8").replace(
    ':root[data-density="compact"] {',
    ':root[data-density="compact"] {\n  --n-shadow-overlay: none;',
  );
  withFixture("--token-file", "styles.css", source, (stderr) => {
    assert.match(stderr, /redefines primitive token --n-shadow-overlay/);
  });
});

test("runtime-axis validator recognizes whitespace-padded runtime selectors", () => {
  withFixture(
    "--token-file",
    "styles.css",
    `${readFileSync(tokenSource, "utf8")}\n:root[data-theme = "custom"] { --n-radius-md: 0.5rem; }\n`,
    (stderr) => assert.match(stderr, /redefines primitive token --n-radius-md/),
  );
});

test("runtime-axis validator requires density aliases and representative component remaps", () => {
  const source = readFileSync(tokenSource, "utf8").replace(
    /(:root\[data-density="compact"\]\s*\{[\s\S]*?)^\s*--n-table-cell-padding-y:.*\n/m,
    "$1",
  );
  withFixture("--token-file", "styles.css", source, (stderr) => {
    assert.match(stderr, /Compact density is missing --n-table-cell-padding-y/);
  });
});

test("runtime-axis validator accepts a semantic custom-theme override fixture", () => {
  withFixture(
    "--token-file",
    "styles.css",
    `${readFileSync(tokenSource, "utf8")}\n:root[data-theme="custom-product"] { --n-color-action-primary: #123456; --n-button-background-primary: var(--n-color-action-primary); }\n`,
    () => {},
    0,
  );
});

test("runtime-axis validator reads theme values from the canonical catalog", () => {
  const catalog = JSON.parse(readFileSync(catalogSource, "utf8"));
  catalog.runtimeAxes.theme.push("cyan");
  withFixture("--catalog", "catalog.json", `${JSON.stringify(catalog, null, 2)}\n`, (stderr) => {
    assert.match(stderr, /Light theme cyan selector is missing or misplaced/);
  });
});

test("runtime-axis validator checks runtime controls through canonical imports", () => {
  withFixture(
    "--docs-playground",
    "visual-playground.tsx",
    readFileSync(docsPlaygroundSource, "utf8").replace(
      'import { densities, modes, themes } from "@nerio-ui/tokens";',
      'import { densities, themes } from "@nerio-ui/tokens";',
    ),
    (stderr) =>
      assert.match(stderr, /Docs Playground runtime controls must import canonical modes/),
  );
});

test("runtime-axis validator ignores commented canonical imports", () => {
  withFixture(
    "--docs-playground",
    "visual-playground.tsx",
    readFileSync(docsPlaygroundSource, "utf8").replace(
      'import { densities, modes, themes } from "@nerio-ui/tokens";',
      '// import { densities, modes, themes } from "@nerio-ui/tokens";\nimport { densities, themes } from "@nerio-ui/tokens";',
    ),
    (stderr) =>
      assert.match(stderr, /Docs Playground runtime controls must import canonical modes/),
  );
});

test("runtime-axis validator requires an explicit three-value docs mode selector", () => {
  withFixture(
    "--docs-controls",
    "docs-chrome.tsx",
    readFileSync(docsSource, "utf8").replace(
      "const modeOptions = modes.map",
      "const hiddenModeOptions = modes.map",
    ),
    (stderr) =>
      assert.match(
        stderr,
        /Docs controls must derive explicit System, Light, and Dark options from modes/,
      ),
  );
});

test("runtime-axis validator requires an accessible docs mode dropdown", () => {
  withFixture(
    "--docs-controls",
    "docs-chrome.tsx",
    readFileSync(docsSource, "utf8").replace(
      "aria-label={`Color mode: ${runtimeLabel(mode)}`}",
      'aria-label="Color mode"',
    ),
    (stderr) =>
      assert.match(
        stderr,
        /Docs controls must expose the current color mode through an accessible dropdown menu/,
      ),
  );
});

test("runtime-axis validator requires independent appearance persistence", () => {
  withFixture(
    "--docs-controls",
    "docs-chrome.tsx",
    readFileSync(docsSource, "utf8").replace(
      'persistAppearanceAxis(document.documentElement, "mode", value);',
      'document.documentElement.setAttribute("data-mode", value);',
    ),
    (stderr) => assert.match(stderr, /Docs controls must persist the mode axis independently/),
  );
});

for (const [surface, option, source] of [
  ["Docs", "--docs-appearance", docsAppearanceSource],
  ["Demo", "--demo-appearance", demoAppearanceSource],
]) {
  test(`runtime-axis validator requires ${surface} appearance helpers to write root attributes`, () => {
    withFixture(
      option,
      "appearance.ts",
      readFileSync(source, "utf8").replace(
        "root.setAttribute(`data-${axis}`, value);",
        "// Root attribute write removed.",
      ),
      (stderr) =>
        assert.match(
          stderr,
          new RegExp(
            `${surface} appearance runtime must write data-theme, data-mode, and data-density`,
          ),
        ),
    );
  });
}

test("runtime-axis validator tolerates formatting around initialization root writes", () => {
  withFixture(
    "--docs-appearance",
    "appearance.ts",
    readFileSync(docsAppearanceSource, "utf8").replace(
      "root.setAttribute(\n        contract.attribute,",
      "root.setAttribute( contract.attribute,",
    ),
    () => {},
    0,
  );
});
