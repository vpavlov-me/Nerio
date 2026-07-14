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
const requiredFoundationTokens = [
  ...baseSemanticTokens,
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
  "--n-color-surface-subtle",
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
