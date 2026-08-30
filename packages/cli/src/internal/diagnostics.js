const fs = require("node:fs");
const path = require("node:path");

function createDiagnostics({
  cwd,
  cliPackage,
  STATE_FILENAME,
  statePath,
  readState,
  resolveInstalledTarget,
  hashContent,
  isWithin,
}) {
  function formatList(values) {
    return values?.length ? values.join(", ") : "none";
  }

  const SOURCE_STYLE_ALLOWLIST = new Set([
    "tokens.css",
    "tailwind.css",
    "motion.css",
    "spinner.css",
    "feedback.css",
    "progress.css",
    "select.css",
    "overlays.css",
  ]);

  function listCssFiles(directory) {
    if (!fs.existsSync(directory)) return [];

    const files = [];
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if ([".git", ".next", "dist", "build", "node_modules"].includes(entry.name)) continue;
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) files.push(...listCssFiles(entryPath));
      else if (entry.isFile() && entry.name.endsWith(".css")) files.push(entryPath);
    }
    return files;
  }

  function cssImports(source) {
    return [...source.matchAll(/@import\s+(?:url\()?\s*["']([^"']+)["']/g)].map(
      (match) => match[1],
    );
  }

  function isTailwindImport(value) {
    return (
      value === "tailwindcss" || importsTailwindTheme(value) || importsTailwindUtilities(value)
    );
  }

  function importsTailwindTheme(value) {
    return /^tailwindcss\/theme(?:\.css)?$/.test(value);
  }

  function importsTailwindUtilities(value) {
    return /^tailwindcss\/utilities(?:\.css)?$/.test(value);
  }

  function importsPreflight(value) {
    return value === "tailwindcss" || /^tailwindcss\/preflight(?:\.css)?$/.test(value);
  }

  function resolveCssImport(stylesheet, specifier) {
    if (!specifier.startsWith(".")) return null;
    return path.resolve(path.dirname(stylesheet), specifier.split(/[?#]/, 1)[0]);
  }

  function collectTailwindSetupProblems(config) {
    const stylesheets = listCssFiles(cwd).map((file) => {
      const source = fs.readFileSync(file, "utf8");
      return { file, source, imports: cssImports(source) };
    });
    const problems = [];

    if (!stylesheets.length) {
      return [
        "Tailwind setup was not found. Add a Tailwind-processed stylesheet that imports the Nerio bridge.",
      ];
    }

    const importsTailwind = stylesheets.some((stylesheet) =>
      stylesheet.imports.some(isTailwindImport),
    );
    if (!importsTailwind) {
      problems.push(
        'No Tailwind import was found. Import "tailwindcss" or the Tailwind theme and utilities layers in the consumer stylesheet.',
      );
    }

    const importsPackageBridge = stylesheets.some((stylesheet) =>
      stylesheet.imports.includes("@nerio-ui/tokens/tailwind.css"),
    );
    const importsPackageStyles = stylesheets.some((stylesheet) =>
      stylesheet.imports.includes("@nerio-ui/ui/styles.css"),
    );
    const componentsRoot = path.resolve(cwd, config.components);
    const sourceStylesRoot = path.join(componentsRoot, "styles");
    const sourceTailwindBridge = path.join(sourceStylesRoot, "tailwind.css");
    const sourceTokens = path.join(sourceStylesRoot, "tokens.css");
    const sourceStyles = stylesheets.flatMap((stylesheet) =>
      stylesheet.imports.map((specifier) => ({
        stylesheet: stylesheet.file,
        specifier,
        target: resolveCssImport(stylesheet.file, specifier),
      })),
    );
    const importedLocalStyles = sourceStyles
      .map((entry) => entry.target)
      .filter((target) => target && target.endsWith(".css") && fs.existsSync(target));
    const referencesSourceBridge = sourceStyles.some(
      (entry) => entry.target === sourceTailwindBridge,
    );
    const referencesSourceTokens = sourceStyles.some((entry) => entry.target === sourceTokens);
    const importsSourceBridge = referencesSourceBridge && fs.existsSync(sourceTailwindBridge);
    const importsSourceTokens = referencesSourceTokens && fs.existsSync(sourceTokens);
    const usesPackageMode =
      importsPackageBridge ||
      importsPackageStyles ||
      stylesheets.some((stylesheet) =>
        /@source\s+[^;]*@nerio-ui\/ui\/dist/.test(stylesheet.source),
      );
    const usesSourceMode =
      fs.existsSync(sourceStylesRoot) ||
      sourceStyles.some((entry) => entry.target && isWithin(sourceStylesRoot, entry.target));
    if (
      (importsPackageBridge || importsPackageStyles) &&
      (referencesSourceBridge || referencesSourceTokens)
    ) {
      problems.push(
        "Package and source-install styles are imported together. Choose one Nerio distribution mode so tokens and residual styles are not duplicated.",
      );
    }

    if (!importsPackageBridge && !importsSourceBridge) {
      problems.push(
        "Nerio Tailwind bridge is missing. Import @nerio-ui/tokens/tailwind.css for package mode or the copied styles/tailwind.css for source-install mode.",
      );
    }

    if (usesPackageMode) {
      if (!importsPackageBridge) {
        problems.push("Package mode must import @nerio-ui/tokens/tailwind.css.");
      }
      if (!importsPackageStyles) {
        problems.push(
          "Package mode must import @nerio-ui/ui/styles.css so documented residual and no-Preflight compatibility styles remain active.",
        );
      }
      if (
        !stylesheets.some((stylesheet) =>
          /@source\s+[^;]*@nerio-ui\/ui\/dist/.test(stylesheet.source),
        )
      ) {
        problems.push(
          "Package mode must register @nerio-ui/ui/dist with @source so Tailwind detects Nerio component utilities.",
        );
      }
    }

    if (usesSourceMode && !importsPackageBridge) {
      if (!importsSourceBridge) {
        problems.push("Source-install mode must import the copied styles/tailwind.css bridge.");
      }
      if (!importsSourceTokens) {
        problems.push("Source-install mode must import the copied styles/tokens.css variables.");
      }
    }

    const staleSourceStyles = sourceStyles.filter(
      (entry) =>
        entry.target &&
        isWithin(sourceStylesRoot, entry.target) &&
        !SOURCE_STYLE_ALLOWLIST.has(path.basename(entry.target)),
    );
    if (staleSourceStyles.length) {
      problems.push(
        `Source-install mode imports unsupported legacy component stylesheet(s): ${staleSourceStyles
          .map((entry) => path.relative(cwd, entry.target))
          .join(
            ", ",
          )}. Keep only the documented Tailwind bridge, token stylesheet, and residual shared styles.`,
      );
    }

    const omitsPreflight =
      importsTailwind &&
      !stylesheets.some((stylesheet) => stylesheet.imports.some(importsPreflight)) &&
      stylesheets.some((stylesheet) => stylesheet.imports.some(importsTailwindTheme)) &&
      stylesheets.some((stylesheet) => stylesheet.imports.some(importsTailwindUtilities));
    const hasScopedCompatibility = [
      ...stylesheets
        .filter((stylesheet) => stylesheet.imports.some(isTailwindImport))
        .map((stylesheet) => stylesheet.source),
      ...importedLocalStyles.map((stylesheet) => fs.readFileSync(stylesheet, "utf8")),
    ].some(
      (stylesheet) =>
        stylesheet.includes("box-sizing: border-box") &&
        stylesheet.includes("font-family: inherit"),
    );
    if (omitsPreflight && !importsPackageStyles && !hasScopedCompatibility) {
      problems.push(
        "This no-Preflight setup is missing scoped Nerio compatibility styles. Import @nerio-ui/ui/styles.css in package mode or retain the documented box-sizing and native-control typography rules in source-install mode.",
      );
    }

    return problems;
  }

  function installedDependencyProblems(state) {
    const packagePath = path.join(cwd, "package.json");
    if (!fs.existsSync(packagePath)) {
      return {
        errors: [],
        warnings: [
          "package.json was not found, so required npm dependencies could not be verified.",
        ],
      };
    }

    let packageJson;
    try {
      packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    } catch {
      return { errors: ["package.json is not valid JSON."], warnings: [] };
    }
    const declared = new Set([
      ...Object.keys(packageJson.dependencies || {}),
      ...Object.keys(packageJson.devDependencies || {}),
      ...Object.keys(packageJson.peerDependencies || {}),
    ]);
    const required = new Set(Object.values(state.items).flatMap((item) => item.dependencies || []));
    const missing = [...required].filter((dependency) => !declared.has(dependency)).sort();
    return {
      errors: missing.length
        ? [
            `Required source dependencies are not declared: ${missing.join(", ")}. Add them to the consumer package before building.`,
          ]
        : [],
      warnings: [],
    };
  }

  function stateDiagnostics(config, manifest) {
    const target = statePath();
    const componentsRoot = path.resolve(cwd, config.components);
    if (!fs.existsSync(target)) {
      const hasInstalledSource =
        fs.existsSync(componentsRoot) &&
        fs.statSync(componentsRoot).isDirectory() &&
        fs.readdirSync(componentsRoot, { recursive: true }).some((entry) => {
          const candidate = path.join(componentsRoot, entry);
          return fs.existsSync(candidate) && fs.statSync(candidate).isFile();
        });
      return {
        state: null,
        errors: hasInstalledSource
          ? [
              `${STATE_FILENAME} is missing for installed source. Re-run nerio add for matching items to adopt unchanged files before updating.`,
            ]
          : [],
        warnings: [],
      };
    }

    const state = readState(true);
    const errors = [];
    const warnings = [];
    if (manifest.version !== cliPackage.version) {
      errors.push(
        `CLI ${cliPackage.version} and Registry ${manifest.version} do not match. Install coordinated @nerio-ui/cli and @nerio-ui/registry versions.`,
      );
    }
    if (state.registry.schemaVersion !== manifest.schemaVersion) {
      errors.push(
        `Installed Registry schema ${state.registry.schemaVersion} differs from configured schema ${manifest.schemaVersion}.`,
      );
    }
    if (state.registry.styleContractVersion !== manifest.styleContractVersion) {
      errors.push(
        `Installed style contract ${state.registry.styleContractVersion} is outdated; Registry requires ${manifest.styleContractVersion}. Run nerio update --dry-run.`,
      );
    }
    if (
      state.registry.version !== manifest.version ||
      state.registry.sourceRevision !== manifest.sourceRevision
    ) {
      warnings.push(
        `Installed source records Registry ${state.registry.version} (${state.registry.sourceRevision}); configured Registry is ${manifest.version} (${manifest.sourceRevision}). Run nerio diff.`,
      );
    }

    for (const [name, item] of Object.entries(state.items)) {
      for (const dependency of item.registryDependencies || []) {
        if (!state.items[dependency]) {
          errors.push(
            `Installed item ${name} is missing Registry dependency ${dependency}. Run nerio update ${name}.`,
          );
        }
      }
    }

    let modified = 0;
    let missing = 0;
    for (const [relative, file] of Object.entries(state.files)) {
      const absolute = resolveInstalledTarget(config.components, relative);
      if (!fs.existsSync(absolute)) {
        missing += 1;
        continue;
      }
      if (hashContent(fs.readFileSync(absolute)) !== file.hash) modified += 1;
    }
    if (modified) {
      warnings.push(
        `${modified} installed file(s) differ from their original hashes. Run nerio diff before updating.`,
      );
    }
    if (missing) {
      warnings.push(
        `${missing} recorded installed file(s) are missing locally. Run nerio diff before updating.`,
      );
    }

    const dependencies = installedDependencyProblems(state);
    errors.push(...dependencies.errors);
    warnings.push(...dependencies.warnings);
    return { state, errors, warnings };
  }

  return { formatList, collectTailwindSetupProblems, stateDiagnostics };
}

module.exports = { createDiagnostics };
