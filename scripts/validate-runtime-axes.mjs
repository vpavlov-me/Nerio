import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { collectRules, normalizeSelector, parseCss } from "./css-structure.mjs";
import { parsePathOptions } from "./validator-options.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const darkMedia = "(prefers-color-scheme: dark)";
const accentTokens = [
  "--n-color-surface-selected",
  "--n-color-border-focus",
  "--n-color-action-primary",
  "--n-color-action-primary-hover",
  "--n-color-action-primary-active",
  "--n-color-action-on-primary",
  "--n-color-focus-ring",
  "--n-chart-primary",
  "--n-chart-categorical-1",
  "--n-color-focus-ring-soft",
];
const modeTokens = [
  "--n-color-surface-canvas",
  "--n-color-surface-default",
  "--n-color-surface-control",
  "--n-color-surface-subtle",
  "--n-color-surface-sunken",
  "--n-color-surface-raised",
  "--n-color-surface-overlay",
  "--n-color-text-primary",
  "--n-color-text-secondary",
  "--n-color-text-tertiary",
  "--n-color-text-disabled",
  "--n-color-text-inverse",
  "--n-color-border-subtle",
  "--n-color-border-default",
  "--n-color-border-strong",
  "--n-color-border-interactive",
  "--n-overlay-backdrop",
];
const compactTokens = [
  "--n-density-space-md",
  "--n-density-space-lg",
  "--n-density-space-xl",
  "--n-button-padding-inline-md",
  "--n-input-padding-inline",
  "--n-alert-padding",
  "--n-card-padding-md",
  "--n-table-cell-padding-y",
  "--n-tabs-trigger-padding-inline-md",
  "--n-dialog-padding",
  "--n-sidebar-region-padding",
  "--n-command-state-padding",
];
const primitiveTokenPatterns = [
  /^--n-(?:gray|purple|blue|green|orange|red|amber|cyan|magenta)-\d+$/,
  /^--n-space-/,
  /^--n-radius-(?:none|xs|sm|md|lg|xl|full)$/,
  /^--n-border-width-/,
  /^--n-shadow-(?:none|xs|sm|md)$/,
  /^--n-size-(?:control|textarea|tooltip|select|empty-state|toast-stack)-/,
  /^--n-icon-size-/,
  /^--n-opacity-/,
  /^--n-transform-/,
  /^--n-duration-/,
  /^--n-easing-/,
  /^--n-font-size-/,
  /^--n-line-height-/,
  /^--n-font-weight-/,
  /^--n-font-(?:sans|mono)-(?:system|geist|inter|ibm-plex|manrope|source-sans|space-grotesk)$/,
];

function isPrimitiveToken(token) {
  return primitiveTokenPatterns.some((pattern) => pattern.test(token));
}

function findExactRule(rules, selector, media = null) {
  const expected = normalizeSelector(selector);
  return rules.find((rule) => {
    const exactSelector = rule.selectors.length === 1 && rule.selectors[0] === expected;
    const mediaRules = rule.atRules.filter((atRule) => atRule.name === "media");
    return (
      exactSelector &&
      (media === null
        ? mediaRules.length === 0
        : mediaRules.length === 1 && mediaRules[0].prelude === media)
    );
  });
}

function requireRule(rules, selector, media, tokens, label, failures) {
  const rule = findExactRule(rules, selector, media);
  if (!rule) {
    failures.push(`${label} selector is missing or misplaced: ${selector}`);
    return;
  }
  for (const token of tokens) {
    if (!rule.declarations.has(token)) failures.push(`${label} is missing ${token}.`);
  }
}

function tokenize(source) {
  return [
    ...source.matchAll(
      /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|(\/\/[^\r\n]*|\/\*[\s\S]*?\*\/)|[A-Za-z_$][A-Za-z0-9_$-]*|[{}[\],=]/g,
    ),
  ]
    .filter((match) => match[3] === undefined)
    .map((match) => match[1] ?? match[2] ?? match[0]);
}

function attributeSelectorPattern(attribute) {
  return new RegExp(`\\[${attribute}\\s*(?:[~|^$*]?=|\\])`);
}

function exportedArray(source, name) {
  const tokens = tokenize(source);
  const start = tokens.findIndex(
    (token, index) => token === name && tokens[index + 1] === "=" && tokens[index + 2] === "[",
  );
  if (start === -1) return [];
  const values = [];
  for (let index = start + 3; index < tokens.length && tokens[index] !== "]"; index += 1) {
    if (![",", "as", "const"].includes(tokens[index])) values.push(tokens[index]);
  }
  return values;
}

function namedImports(source, moduleName) {
  const tokens = tokenize(source);
  const names = new Set();
  for (let index = 0; index < tokens.length; index += 1) {
    if (tokens[index] !== "import" || tokens[index + 1] !== "{") continue;
    const imported = [];
    index += 2;
    while (index < tokens.length && tokens[index] !== "}") {
      if (tokens[index] !== ",") imported.push(tokens[index]);
      index += 1;
    }
    if (tokens[index + 1] === "from" && tokens[index + 2] === moduleName) {
      for (const name of imported) names.add(name);
    }
  }
  return names;
}

function sameValues(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function readTypeScriptSources(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return readTypeScriptSources(path);
    return entry.isFile() && /\.tsx?$/.test(entry.name) ? [readFileSync(path, "utf8")] : [];
  });
}

function validate() {
  const paths = parsePathOptions(process.argv.slice(2), {
    "--token-file": join(root, "packages/tokens/src/styles.css"),
    "--catalog": join(root, "data/component-catalog.json"),
    "--token-contract": join(root, "packages/tokens/src/index.ts"),
    "--docs-controls": join(root, "apps/docs/components/docs-chrome.tsx"),
    "--docs-layout": join(root, "apps/docs/app/layout.tsx"),
    "--docs-appearance": join(root, "apps/docs/lib/appearance.ts"),
    "--demo-controls": join(root, "apps/demo-app/app/page.tsx"),
    "--demo-layout": join(root, "apps/demo-app/app/layout.tsx"),
    "--demo-appearance": join(root, "apps/demo-app/lib/appearance.ts"),
    "--ui-source-dir": join(root, "packages/ui/src"),
  });
  const tokenCss = readFileSync(paths["--token-file"], "utf8");
  const catalog = JSON.parse(readFileSync(paths["--catalog"], "utf8"));
  const tokenContract = readFileSync(paths["--token-contract"], "utf8");
  const docsControls = readFileSync(paths["--docs-controls"], "utf8");
  const docsLayout = readFileSync(paths["--docs-layout"], "utf8");
  const docsAppearance = readFileSync(paths["--docs-appearance"], "utf8");
  const demoControls = readFileSync(paths["--demo-controls"], "utf8");
  const demoLayout = readFileSync(paths["--demo-layout"], "utf8");
  const demoAppearance = readFileSync(paths["--demo-appearance"], "utf8");
  const rules = collectRules(parseCss(tokenCss));
  const failures = [];
  const themes = catalog.runtimeAxes?.theme ?? [];
  const modes = catalog.runtimeAxes?.mode ?? [];
  const densities = catalog.runtimeAxes?.density ?? [];

  for (const [axis, expected] of Object.entries({ themes, modes, densities })) {
    const actual = exportedArray(tokenContract, axis);
    if (!sameValues(actual, expected))
      failures.push(
        `@nerio-ui/tokens ${axis} export differs from the canonical catalog: ${actual.join(", ")} !== ${expected.join(", ")}`,
      );
  }

  for (const theme of themes) {
    requireRule(
      rules,
      `:root[data-theme="${theme}"]`,
      null,
      accentTokens,
      `Light theme ${theme}`,
      failures,
    );
    requireRule(
      rules,
      `:root[data-theme="${theme}"][data-mode="dark"]`,
      null,
      accentTokens,
      `Dark theme ${theme}`,
      failures,
    );
    requireRule(
      rules,
      `:root[data-theme="${theme}"][data-mode="system"]`,
      darkMedia,
      accentTokens,
      `System-dark theme ${theme}`,
      failures,
    );
  }
  requireRule(rules, ':root[data-mode="light"]', null, modeTokens, "Light mode", failures);
  requireRule(rules, ':root[data-mode="dark"]', null, modeTokens, "Dark mode", failures);
  requireRule(
    rules,
    ':root[data-mode="system"]',
    darkMedia,
    modeTokens,
    "System-dark mode",
    failures,
  );
  requireRule(
    rules,
    ':root[data-density="compact"]',
    null,
    compactTokens,
    "Compact density",
    failures,
  );

  for (const rule of rules) {
    for (const selector of rule.selectors) {
      if (/\[data-(?:theme|mode|density)\s*(?:[~|^$*]?=|\])/.test(selector)) {
        for (const token of rule.declarations.keys()) {
          if (isPrimitiveToken(token)) {
            failures.push(`Runtime selector ${selector} redefines primitive token ${token}.`);
          }
        }
      }
      for (const axis of catalog.runtimeAxisPolicy?.notAllowedInV1 ?? []) {
        if (attributeSelectorPattern(axis).test(selector))
          failures.push(`Prohibited runtime axis selector: ${axis} in ${selector}`);
      }
    }
  }

  for (const [surface, source] of [
    ["Docs", docsControls],
    ["Demo", demoControls],
  ]) {
    const imports = namedImports(source, "@nerio-ui/tokens");
    for (const name of ["themes", "modes", "densities"]) {
      if (!imports.has(name))
        failures.push(
          `${surface} runtime controls must import canonical ${name} from @nerio-ui/tokens.`,
        );
    }
  }

  if (!docsControls.includes("const modeOptions = modes.map")) {
    failures.push("Docs controls must derive explicit System, Light, and Dark options from modes.");
  }
  if (
    !/<DropdownMenu[\s\S]*?aria-label=\{`Color mode: \$\{runtimeLabel\(mode\)\}`\}[\s\S]*?items=\{modeOptions\.map[\s\S]*?mode === option\.value/.test(
      docsControls,
    )
  ) {
    failures.push(
      "Docs controls must expose the current color mode through an accessible dropdown menu.",
    );
  }
  if (docsControls.includes("toggleMode")) {
    failures.push("Docs controls must not collapse System, Light, and Dark into a binary toggle.");
  }

  for (const [surface, controls, layout, appearance] of [
    ["Docs", docsControls, docsLayout, docsAppearance],
    ["Demo", demoControls, demoLayout, demoAppearance],
  ]) {
    for (const axis of ["theme", "mode", "density"]) {
      if (!controls.includes(`persistAppearanceAxis(document.documentElement, "${axis}"`)) {
        failures.push(`${surface} controls must persist the ${axis} axis independently.`);
      }
      if (!appearance.includes(`${axis}: "nerio-`)) {
        failures.push(`${surface} appearance runtime is missing a ${axis} storage key.`);
      }
      if (!appearance.includes(`attribute: "data-${axis}"`)) {
        failures.push(`${surface} appearance runtime is missing the data-${axis} root contract.`);
      }
    }
    if (!appearance.includes("root.setAttribute(`data-${axis}`, value);")) {
      failures.push(
        `${surface} appearance runtime must write data-theme, data-mode, and data-density to the root.`,
      );
    }
    if (!/root\.setAttribute\(\s*contract\.attribute\s*,/.test(appearance)) {
      failures.push(
        `${surface} initialization must write all persisted root appearance attributes.`,
      );
    }
    if (!controls.includes("readAppearanceFromRoot(document.documentElement)")) {
      failures.push(`${surface} controls must restore pre-hydrated appearance state.`);
    }
    if (
      !layout.includes("suppressHydrationWarning") ||
      !layout.includes("createAppearanceInitializationScript()")
    ) {
      failures.push(`${surface} layout must apply persisted appearance before hydration.`);
    }
  }

  const uiSource = readTypeScriptSources(paths["--ui-source-dir"]).join("\n");
  for (const [variant, label] of [
    ["forced-colors:", "forced-colors"],
    ["motion-reduce:", "reduced-motion"],
  ]) {
    if (!uiSource.includes(variant)) {
      failures.push(`UI Tailwind recipes are missing the ${label} variant contract.`);
    }
  }

  if (failures.length) {
    console.error("Runtime-axis validation failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Runtime-axis matrix verified structurally for ${themes.length} themes, ${modes.length} modes, and ${densities.length} densities.`,
  );
}

try {
  validate();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
