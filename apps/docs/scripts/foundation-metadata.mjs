import postcss from "postcss";

const typographyRolePattern =
  /^--n-(?:body|control|label|helper)-(?:font-size|font-weight|line-height)$/;
const densityAliasPattern = /^--n-density-space-/;
const modeMappingTokens = [
  "--n-color-surface-canvas",
  "--n-color-surface-default",
  "--n-color-surface-sunken",
  "--n-color-surface-raised",
  "--n-color-surface-overlay",
];

function references(value) {
  return [...value.matchAll(/var\((--n-[a-z0-9-]+)/g)].map((match) => match[1]);
}

function directReference(value) {
  return value.match(/^var\((--n-[a-z0-9-]+)\)$/)?.[1] ?? null;
}

function selectorRules(root, selector, media = null) {
  const matches = [];
  root.walkRules((rule) => {
    if (!rule.selectors.includes(selector)) return;
    const parentMedia =
      rule.parent?.type === "atrule" && rule.parent.name === "media" ? rule.parent.params : null;
    if (parentMedia === media) matches.push(rule);
  });
  return matches;
}

function declarationsFor(root, selector, media = null) {
  const declarations = new Map();
  for (const rule of selectorRules(root, selector, media)) {
    rule.walkDecls(/^--n-/, (declaration) => {
      declarations.set(declaration.prop, declaration.value.trim());
    });
  }
  return declarations;
}

function requireDeclarations(root, selector, media = null) {
  const declarations = declarationsFor(root, selector, media);
  if (!declarations.size) {
    const context = media ? ` inside @media (${media})` : "";
    throw new Error(`Foundation metadata source is missing selector ${selector}${context}.`);
  }
  return declarations;
}

function requireValue(declarations, token, selector) {
  const value = declarations.get(token);
  if (!value) {
    throw new Error(`Foundation metadata source ${selector} is missing ${token}.`);
  }
  return value;
}

function tokenRecord(token, value) {
  return { token, value, reference: directReference(value) };
}

function validateDeclarations(root) {
  const definitions = new Set();
  const graph = new Map();

  root.walkRules((rule) => {
    const seen = new Set();
    rule.walkDecls(/^--n-/, (declaration) => {
      if (seen.has(declaration.prop)) {
        throw new Error(
          `Foundation metadata source has duplicate declaration ${declaration.prop} in ${rule.selector}.`,
        );
      }
      seen.add(declaration.prop);
      definitions.add(declaration.prop);
      const edges = graph.get(declaration.prop) ?? new Set();
      references(declaration.value).forEach((reference) => edges.add(reference));
      graph.set(declaration.prop, edges);
    });
  });

  for (const [token, tokenReferences] of graph) {
    for (const reference of tokenReferences) {
      if (!definitions.has(reference)) {
        throw new Error(
          `Foundation metadata source ${token} references missing alias ${reference}.`,
        );
      }
    }
  }

  const visiting = new Set();
  const visited = new Set();
  function visit(token, path = []) {
    if (visiting.has(token)) {
      throw new Error(
        `Foundation metadata source has unsupported alias cycle: ${[...path, token].join(" -> ")}.`,
      );
    }
    if (visited.has(token)) return;
    visiting.add(token);
    for (const reference of graph.get(token) ?? []) visit(reference, [...path, token]);
    visiting.delete(token);
    visited.add(token);
  }
  for (const token of graph.keys()) visit(token);
}

function formatPixels(value) {
  const rem = value.match(/^(-?[0-9.]+)rem$/)?.[1];
  if (!rem) return null;
  return `${Number(rem) * 16}px`;
}

function labelFromPreset(value) {
  const labels = {
    system: "System",
    geist: "Geist",
    inter: "Inter",
    "ibm-plex": "IBM Plex",
    manrope: "Manrope",
    "source-sans": "Source Sans 3",
    "space-grotesk": "Space Grotesk",
  };
  return (
    labels[value] ?? value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

function validateFoundationPages(pages) {
  if (!Array.isArray(pages) || !pages.length) {
    throw new Error("Foundation route metadata must be a non-empty array.");
  }
  const paths = new Set();
  const labels = new Set();
  for (const page of pages) {
    if (!page || typeof page.path !== "string" || typeof page.label !== "string") {
      throw new Error("Every foundation route must define string path and label values.");
    }
    if (!page.path.startsWith("/docs/foundations/")) {
      throw new Error(`Foundation route ${page.path} must live under /docs/foundations/.`);
    }
    if (paths.has(page.path)) throw new Error(`Duplicate foundation route path: ${page.path}.`);
    if (labels.has(page.label)) throw new Error(`Duplicate foundation route label: ${page.label}.`);
    paths.add(page.path);
    labels.add(page.label);
  }
}

export function createFoundationMetadata({ cssSource, catalog, foundationPages }) {
  let root;
  try {
    root = postcss.parse(cssSource, { from: "packages/tokens/src/styles.css" });
  } catch (error) {
    throw new Error(`Could not parse canonical token CSS: ${error.message}`, { cause: error });
  }
  validateDeclarations(root);
  validateFoundationPages(foundationPages);

  const base = requireDeclarations(root, ":root");
  const themes = catalog.runtimeAxes?.theme ?? [];
  const modes = catalog.runtimeAxes?.mode ?? [];
  const densities = catalog.runtimeAxes?.density ?? [];
  const defaults = catalog.defaultRuntimeAttributes ?? {};
  if (!themes.length || !modes.length || !densities.length) {
    throw new Error(
      "data/component-catalog.json must define theme, mode, and density runtime axes.",
    );
  }

  const typographyScale = [...base]
    .filter(([token, value]) => token.startsWith("--n-font-size-") && !value.startsWith("var("))
    .map(([token, value]) => ({
      name: token.slice("--n-font-size-".length),
      token,
      value,
      pixels: formatPixels(value),
    }));
  const lineHeights = [...base]
    .filter(([token, value]) => token.startsWith("--n-line-height-") && !value.startsWith("var("))
    .map(([token, value]) => tokenRecord(token, value));
  const semanticRoles = [...base]
    .filter(([token]) => typographyRolePattern.test(token))
    .map(([token, value]) => tokenRecord(token, value));

  const typographyPresets = [];
  root.walkRules((rule) => {
    if (!/^\.n-typography-[a-z0-9-]+$/.test(rule.selector)) return;
    const value = rule.selector.slice(".n-typography-".length);
    const declarations = declarationsFor(root, rule.selector);
    typographyPresets.push({
      value,
      label: labelFromPreset(value),
      className: rule.selector.slice(1),
      sans: tokenRecord(
        "--n-font-sans",
        requireValue(declarations, "--n-font-sans", rule.selector),
      ),
      mono: tokenRecord(
        "--n-font-mono",
        requireValue(declarations, "--n-font-mono", rule.selector),
      ),
    });
  });

  const themeMetadata = themes.map((theme) => {
    const lightSelector = `:root[data-theme="${theme}"]`;
    const darkSelector = `:root[data-theme="${theme}"][data-mode="dark"]`;
    const systemSelector = `:root[data-theme="${theme}"][data-mode="system"]`;
    const light = requireDeclarations(root, lightSelector);
    const dark = requireDeclarations(root, darkSelector);
    const systemDark = requireDeclarations(root, systemSelector, "(prefers-color-scheme: dark)");
    return {
      value: theme,
      label: theme[0].toUpperCase() + theme.slice(1),
      selectors: {
        light: lightSelector,
        dark: darkSelector,
        systemDark: systemSelector,
      },
      primaryAccent: {
        light: tokenRecord(
          "--n-color-action-primary",
          requireValue(light, "--n-color-action-primary", lightSelector),
        ),
        dark: tokenRecord(
          "--n-color-action-primary",
          requireValue(dark, "--n-color-action-primary", darkSelector),
        ),
        systemDark: tokenRecord(
          "--n-color-action-primary",
          requireValue(systemDark, "--n-color-action-primary", systemSelector),
        ),
      },
    };
  });

  const modeMetadata = modes.map((mode) => {
    const selector = `:root[data-mode="${mode}"]`;
    const media = mode === "system" ? "(prefers-color-scheme: dark)" : null;
    const declarations = requireDeclarations(root, selector, media);
    return {
      value: mode,
      selector,
      media,
      mappings: modeMappingTokens.map((token) =>
        tokenRecord(token, requireValue(declarations, token, selector)),
      ),
    };
  });

  const densityMetadata = densities.map((density) => {
    const selector =
      density === defaults["data-density"] ? ":root" : `:root[data-density="${density}"]`;
    const declarations = requireDeclarations(root, selector);
    return {
      value: density,
      selector,
      aliases: [...declarations]
        .filter(([token]) => densityAliasPattern.test(token))
        .map(([token, value]) => tokenRecord(token, value)),
    };
  });

  return {
    schemaVersion: 1,
    sourcePrecedence: {
      tokenValues: "packages/tokens/src/styles.css",
      runtimeAxes: "data/component-catalog.json",
      foundationRoutes: "apps/docs/content/foundations.json",
    },
    typography: {
      scale: typographyScale,
      presets: typographyPresets,
      semanticRoles,
      lineHeights,
    },
    runtimeAxes: {
      theme: {
        attribute: "data-theme",
        defaultValue: defaults["data-theme"],
        values: themes,
        presets: themeMetadata,
      },
      mode: {
        attribute: "data-mode",
        defaultValue: defaults["data-mode"],
        values: modes,
        mappings: modeMetadata,
      },
      density: {
        attribute: "data-density",
        defaultValue: defaults["data-density"],
        values: densities,
        mappings: densityMetadata,
      },
    },
  };
}

export function renderFoundationMetadataModule(metadata) {
  return `// Generated by apps/docs/scripts/validate-foundation-metadata.mjs. Do not edit.\n\nexport const foundationMetadata = ${JSON.stringify(metadata, null, 2)} as const;\n`;
}

export function renderFoundationPagesModule(pages) {
  return `// Generated by apps/docs/scripts/validate-foundation-metadata.mjs. Do not edit.\n\nexport const foundationPages = ${JSON.stringify(pages, null, 2)} as const;\n`;
}

export function assertGeneratedProjection({ actual, expected, target, sources }) {
  if (actual === expected) return;
  throw new Error(
    `${target} drifted from ${sources.join(", ")}. Run pnpm prepare:foundation-metadata and commit the deterministic projection.`,
  );
}

export function foundationDiscoveryFailures({ pages, llmsSource, routeExists }) {
  const failures = [];
  for (const page of pages) {
    if (!routeExists(page.path)) {
      failures.push(`${page.path}: canonical foundation route has no page.tsx implementation.`);
    }
    if (!llmsSource.includes(`\`${page.path}\``)) {
      failures.push(
        `apps/docs/content/llms.txt is missing canonical foundation route ${page.path}; update the Foundations index.`,
      );
    }
  }
  return failures;
}
