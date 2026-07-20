import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { collectRules, exactRule, parseCss } from "./css-structure.mjs";
import { parsePathOptions } from "./validator-options.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baseSemanticTokens = [
  "--n-color-surface-canvas",
  "--n-color-surface-default",
  "--n-color-surface-subtle",
  "--n-color-surface-sunken",
  "--n-color-surface-raised",
  "--n-color-surface-overlay",
  "--n-color-surface-selected",
  "--n-color-text-primary",
  "--n-color-text-secondary",
  "--n-color-text-tertiary",
  "--n-color-text-inverse",
  "--n-color-text-disabled",
  "--n-color-border-subtle",
  "--n-color-border-default",
  "--n-color-border-strong",
  "--n-color-border-interactive",
  "--n-color-border-focus",
  "--n-color-border-danger",
  "--n-color-action-primary",
  "--n-color-action-primary-hover",
  "--n-color-action-primary-active",
  "--n-color-action-on-primary",
  "--n-color-action-secondary",
  "--n-color-action-secondary-hover",
  "--n-color-action-tertiary",
  "--n-color-focus-ring",
  "--n-color-focus-offset",
  "--n-color-status-success",
  "--n-color-status-warning",
  "--n-color-status-danger",
  "--n-color-status-info",
  "--n-color-status-neutral",
  "--n-color-danger",
  "--n-color-success",
  "--n-overlay-backdrop",
];
const neutralAlphaPrimitiveTokens = [
  "--n-gray-1000",
  "--n-gray-a-4",
  "--n-gray-a-6",
  "--n-gray-a-8",
  "--n-gray-a-10",
  "--n-gray-a-12",
  "--n-gray-a-16",
  "--n-gray-a-20",
  "--n-gray-a-24",
  "--n-white-a-4",
  "--n-white-a-6",
  "--n-white-a-8",
  "--n-white-a-10",
  "--n-white-a-12",
  "--n-white-a-16",
  "--n-white-a-20",
  "--n-white-a-24",
];
const visualFoundationTokens = [
  "--n-radius-2xl",
  "--n-shadow-overlay",
  "--n-motion-hover-duration",
  "--n-motion-hover-easing",
  "--n-radius-control",
  "--n-radius-container",
  "--n-radius-overlay",
  "--n-button-shadow-outline",
  "--n-avatar-background",
  "--n-select-popup-radius",
  "--n-checkbox-radius",
  "--n-overlay-background",
  "--n-overlay-foreground",
  "--n-overlay-foreground-muted",
  "--n-overlay-control-background",
  "--n-overlay-control-background-hover",
  "--n-overlay-selected-background",
  "--n-overlay-divider",
  "--n-overlay-surface-filter",
  "--n-overlay-backdrop-filter",
  "--n-overlay-shadow",
  "--n-dropdown-radius",
  "--n-popover-radius",
  "--n-tooltip-radius",
];
const requiredFoundationTokens = [
  ...baseSemanticTokens,
  ...neutralAlphaPrimitiveTokens,
  ...visualFoundationTokens,
  "--n-font-sans",
  "--n-radius-md",
  "--n-space-4",
  "--n-duration-normal",
];
const contrastTokens = [
  "--n-contrast-text-primary",
  "--n-contrast-text-secondary",
  "--n-contrast-text-tertiary",
  "--n-contrast-text-inverse",
  "--n-contrast-action",
  "--n-contrast-status",
  "--n-contrast-focus-ring",
];
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
const modeSemanticTokens = [
  "--n-color-surface-canvas",
  "--n-color-surface-default",
  "--n-color-surface-control",
  "--n-color-surface-control-hover",
  "--n-color-surface-control-active",
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
  "--n-color-status-neutral-soft",
  "--n-chart-grid",
];

function references(value) {
  return [...value.matchAll(/var\(\s*(--n-[a-z0-9-]+)/g)].map((match) => match[1]);
}

function findCycles(graph) {
  const cycles = new Set();
  const visiting = new Set();
  const visited = new Set();
  const stack = [];
  function visit(token) {
    if (visiting.has(token)) {
      const start = stack.indexOf(token);
      cycles.add([...stack.slice(start), token].join(" -> "));
      return;
    }
    if (visited.has(token)) return;
    visiting.add(token);
    stack.push(token);
    for (const dependency of graph.get(token) ?? []) visit(dependency);
    stack.pop();
    visiting.delete(token);
    visited.add(token);
  }
  for (const token of graph.keys()) visit(token);
  return [...cycles].sort();
}

function requireDeclarations(rule, tokens, scope, failures) {
  if (!rule) {
    failures.push(`Required CSS scope is missing: ${scope}`);
    return;
  }
  for (const token of tokens) {
    if (!rule.declarations.has(token))
      failures.push(`Required token is missing from ${scope}: ${token}`);
  }
}

function resolveToken(token, declarations, stack = new Set()) {
  if (stack.has(token)) return null;
  const value = declarations.get(token);
  if (!value) return null;
  const nextStack = new Set(stack).add(token);
  return value.replace(/var\(\s*(--n-[a-z0-9-]+)\s*\)/g, (_, reference) => {
    return resolveToken(reference, declarations, nextStack) ?? `var(${reference})`;
  });
}

function parseColor(value) {
  const normalized = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(normalized)) {
    return {
      red: Number.parseInt(normalized.slice(1, 3), 16),
      green: Number.parseInt(normalized.slice(3, 5), 16),
      blue: Number.parseInt(normalized.slice(5, 7), 16),
      alpha: 1,
    };
  }
  const rgb = normalized.match(
    /^rgb\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/,
  );
  if (!rgb) return null;
  const alpha = rgb[4]?.endsWith("%")
    ? Number.parseFloat(rgb[4]) / 100
    : Number.parseFloat(rgb[4] ?? "1");
  return {
    red: Number.parseFloat(rgb[1]),
    green: Number.parseFloat(rgb[2]),
    blue: Number.parseFloat(rgb[3]),
    alpha,
  };
}

function composite(foreground, background) {
  const alpha = foreground.alpha + background.alpha * (1 - foreground.alpha);
  if (alpha === 0) return { red: 0, green: 0, blue: 0, alpha: 0 };
  return {
    red:
      (foreground.red * foreground.alpha +
        background.red * background.alpha * (1 - foreground.alpha)) /
      alpha,
    green:
      (foreground.green * foreground.alpha +
        background.green * background.alpha * (1 - foreground.alpha)) /
      alpha,
    blue:
      (foreground.blue * foreground.alpha +
        background.blue * background.alpha * (1 - foreground.alpha)) /
      alpha,
    alpha,
  };
}

function luminance(color) {
  const channel = (value) => {
    const normalized = value / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(color.red) + 0.7152 * channel(color.green) + 0.0722 * channel(color.blue);
}

function contrastRatio(foreground, background) {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

function validateContrastPair({
  context,
  declarations,
  foregroundToken,
  backgroundToken,
  canvasToken = "--n-color-surface-canvas",
  minimum,
  failures,
}) {
  const canvas = parseColor(resolveToken(canvasToken, declarations) ?? "");
  const foreground = parseColor(resolveToken(foregroundToken, declarations) ?? "");
  const background = parseColor(resolveToken(backgroundToken, declarations) ?? "");
  if (!canvas || !foreground || !background) {
    failures.push(
      `Unable to calculate ${context} contrast for ${foregroundToken} on ${backgroundToken}.`,
    );
    return;
  }
  const opaqueBackground = composite(background, canvas);
  const opaqueForeground = composite(foreground, opaqueBackground);
  const ratio = contrastRatio(opaqueForeground, opaqueBackground);
  if (ratio + Number.EPSILON < minimum) {
    failures.push(
      `${context} contrast is ${ratio.toFixed(2)}:1 for ${foregroundToken} on ${backgroundToken}; expected at least ${minimum}:1.`,
    );
  }
}

function validate() {
  const paths = parsePathOptions(process.argv.slice(2), {
    "--token-file": join(root, "packages/tokens/src/styles.css"),
    "--manifest": join(root, "packages/registry/src/manifest.json"),
    "--catalog": join(root, "data/component-catalog.json"),
  });
  const tokenCss = readFileSync(paths["--token-file"], "utf8");
  const manifest = JSON.parse(readFileSync(paths["--manifest"], "utf8"));
  const catalog = JSON.parse(readFileSync(paths["--catalog"], "utf8"));
  const rules = collectRules(parseCss(tokenCss));
  const rootRule = exactRule(rules, ":root");
  const failures = [];
  const definitions = new Map();
  const graph = new Map();

  for (const rule of rules) {
    const scope = `${rule.atRules.map((atRule) => `@${atRule.name} ${atRule.prelude}`).join(" > ")}${rule.atRules.length ? " > " : ""}${rule.selectors.join(", ")}`;
    for (const [property, value] of rule.declarations) {
      if (!property.startsWith("--n-")) continue;
      const entries = definitions.get(property) ?? [];
      entries.push(scope);
      definitions.set(property, entries);
      const dependencies = graph.get(property) ?? new Set();
      for (const dependency of references(value)) dependencies.add(dependency);
      graph.set(property, dependencies);
    }
  }

  const uiStyles = readdirSync(join(root, "packages/ui/src/styles"))
    .filter((file) => file.endsWith(".css"))
    .map((file) => readFileSync(join(root, "packages/ui/src/styles", file), "utf8"));
  const referenced = new Set([
    ...[...graph.values()].flatMap((values) => [...values]),
    ...uiStyles.flatMap((source) => references(source)),
  ]);

  requireDeclarations(rootRule, requiredFoundationTokens, ":root base semantic contract", failures);
  requireDeclarations(rootRule, contrastTokens, ":root contrast contract", failures);

  const themes = catalog.runtimeAxes?.theme ?? [];
  for (const theme of themes) {
    requireDeclarations(
      exactRule(rules, `:root[data-theme="${theme}"]`),
      accentTokens,
      `preset theme ${theme}`,
      failures,
    );
  }
  requireDeclarations(
    exactRule(rules, ':root[data-mode="light"]'),
    modeSemanticTokens,
    "light mode",
    failures,
  );

  for (const mode of ["light", "dark"]) {
    for (const theme of themes) {
      const declarations = new Map(rootRule?.declarations ?? []);
      for (const rule of [
        exactRule(rules, `:root[data-theme="${theme}"]`),
        exactRule(rules, `:root[data-mode="${mode}"]`),
        exactRule(rules, `:root[data-theme="${theme}"][data-mode="${mode}"]`),
      ]) {
        for (const [token, value] of rule?.declarations ?? []) declarations.set(token, value);
      }
      const context = `${theme}/${mode}`;
      for (const [foregroundToken, backgroundToken, minimum] of [
        ["--n-color-text-primary", "--n-color-surface-default", 4.5],
        ["--n-color-text-secondary", "--n-color-surface-default", 4.5],
        ["--n-overlay-foreground", "--n-color-surface-overlay", 4.5],
        ["--n-color-action-on-primary", "--n-color-action-primary", 4.5],
        ["--n-color-focus-ring", "--n-color-surface-canvas", 3],
      ]) {
        validateContrastPair({
          context,
          declarations,
          foregroundToken,
          backgroundToken,
          minimum,
          failures,
        });
      }
    }
  }
  requireDeclarations(
    exactRule(rules, ':root[data-mode="dark"]'),
    modeSemanticTokens,
    "dark mode",
    failures,
  );
  requireDeclarations(
    exactRule(rules, ':root[data-mode="system"]', "(prefers-color-scheme: dark)"),
    modeSemanticTokens,
    "system dark mode",
    failures,
  );

  for (const token of [...referenced].filter((item) => !definitions.has(item)).sort()) {
    failures.push(`Unresolved token reference: ${token}`);
  }
  for (const cycle of findCycles(graph)) failures.push(`Token alias cycle: ${cycle}`);

  const registryFailures = new Map();
  for (const item of manifest.items ?? []) {
    for (const token of item.requiredTokens ?? []) {
      if (!definitions.has(token)) {
        const values = registryFailures.get(item.name) ?? [];
        values.push(`global: ${token} is not defined`);
        registryFailures.set(item.name, values);
      } else if (!rootRule?.declarations.has(token)) {
        const values = registryFailures.get(item.name) ?? [];
        values.push(`:root: ${token} is defined only in ${definitions.get(token).join(", ")}`);
        registryFailures.set(item.name, values);
      }
    }
  }
  for (const [item, values] of registryFailures) {
    failures.push(
      `Registry item ${item} has invalid requiredTokens:\n${values.map((value) => `  - ${value}`).join("\n")}`,
    );
  }

  if (failures.length) {
    console.error("Token validation failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Token contract verified: ${definitions.size} definitions, ${referenced.size} resolved references, ${themes.length} preset theme scopes, and ${(manifest.items ?? []).length} registry items.`,
  );
}

try {
  validate();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
