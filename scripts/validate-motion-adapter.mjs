import { gzipSync } from "node:zlib";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const adapterRequire = createRequire(join(root, "packages/adapters/package.json"));
const motionRoot = resolve(adapterRequire.resolve("motion/package.json"), "..");
const adapterSource = readFileSync(join(root, "packages/adapters/src/motion.tsx"), "utf8");
const tokenSource = readFileSync(join(root, "packages/tokens/src/styles.css"), "utf8");
const adapterPackage = JSON.parse(
  readFileSync(join(root, "packages/adapters/package.json"), "utf8"),
);

const expectedDurations = {
  instant: ["80ms", "0.08"],
  fast: ["140ms", "0.14"],
  normal: ["220ms", "0.22"],
  slow: ["360ms", "0.36"],
};
const expectedEasings = {
  standard: ["0.2, 0, 0, 1", "0.2, 0, 0, 1"],
  enter: ["0, 0, 0.2, 1", "0, 0, 0.2, 1"],
  exit: ["0.4, 0, 1, 1", "0.4, 0, 1, 1"],
  expressive: ["0.16, 1, 0.3, 1", "0.16, 1, 0.3, 1"],
};

for (const [name, [cssValue, tsValue]] of Object.entries(expectedDurations)) {
  if (!tokenSource.includes(`--n-duration-${name}: ${cssValue};`)) {
    throw new Error(`Missing CSS motion duration parity for ${name}.`);
  }
  if (!new RegExp(`${name}:\\s*${tsValue.replace(".", "\\.")}`).test(adapterSource)) {
    throw new Error(`Motion adapter duration drift for ${name}.`);
  }
}

for (const [name, [cssValue, tsValue]] of Object.entries(expectedEasings)) {
  if (!tokenSource.includes(`--n-easing-${name}: cubic-bezier(${cssValue});`)) {
    throw new Error(`Missing CSS motion easing parity for ${name}.`);
  }
  if (!adapterSource.includes(`${name}: [${tsValue}]`)) {
    throw new Error(`Motion adapter easing drift for ${name}.`);
  }
}

if (!tokenSource.includes("--n-motion-translate-md: 0.375rem;")) {
  throw new Error("Missing CSS directional-motion distance parity.");
}
if (!adapterSource.includes('const slideDistance = "0.375rem";')) {
  throw new Error("Motion adapter directional distance drift.");
}
if (adapterPackage.exports?.["./motion"]?.default !== "./src/motion.tsx") {
  throw new Error("@nerio-ui/adapters/motion export is missing.");
}
if (
  !adapterPackage.peerDependencies?.motion ||
  !adapterPackage.peerDependenciesMeta?.motion?.optional ||
  adapterPackage.dependencies?.motion
) {
  throw new Error("motion must remain an optional @nerio-ui/adapters peer.");
}

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.[cm]?[jt]sx?$/.test(entry.name) ? [path] : [];
  });
}

for (const file of sourceFiles(join(root, "packages/ui/src"))) {
  const source = readFileSync(file, "utf8");
  if (/from\s+["']motion(?:\/[^"']*)?["']|import\s*["']motion(?:\/[^"']*)?["']/.test(source)) {
    throw new Error(`Core UI must remain Motion-free: ${file.slice(root.length + 1)}`);
  }
}

async function bundle(name, contents) {
  const result = await build({
    alias: {
      "@nerio-ui/adapters/icons": join(root, "packages/adapters/src/icons.ts"),
      "@nerio-ui/adapters/motion": join(root, "packages/adapters/src/motion.tsx"),
      "@nerio-ui/ui": join(root, "packages/ui/src/index.ts"),
      "motion/react": join(motionRoot, "dist/es/react.mjs"),
      "motion/react-m": join(motionRoot, "dist/es/react-m.mjs"),
    },
    bundle: true,
    external: ["react", "react/*", "react-dom", "react-dom/*"],
    format: "esm",
    jsx: "automatic",
    metafile: true,
    minify: true,
    platform: "browser",
    stdin: { contents, loader: "tsx", resolveDir: root, sourcefile: `${name}.tsx` },
    target: "es2022",
    write: false,
  });
  const code = result.outputFiles[0].contents;
  const motionInputs = Object.keys(result.metafile.inputs).filter((path) =>
    /node_modules\/(?:\.pnpm\/motion@[^/]+\/node_modules\/)?motion\//.test(path),
  );
  const motionBytes = Object.values(result.metafile.outputs).reduce(
    (total, output) =>
      total +
      motionInputs.reduce(
        (subtotal, path) => subtotal + (output.inputs[path]?.bytesInOutput ?? 0),
        0,
      ),
    0,
  );
  return { gzipBytes: gzipSync(code).byteLength, motionBytes, motionInputs };
}

const core = await bundle(
  "core-only",
  'import { motionClasses } from "@nerio-ui/ui"; console.log(motionClasses.hover);',
);
const icons = await bundle(
  "icons-only",
  'import { Search } from "@nerio-ui/adapters/icons"; console.log(Search);',
);
const tokenOnly = await bundle(
  "motion-token-only",
  'import { motionTransitions } from "@nerio-ui/adapters/motion"; console.log(motionTransitions.normal);',
);
const domAnimation = await bundle(
  "motion-dom-animation",
  'import { LazyMotion, domAnimation } from "motion/react"; import * as m from "motion/react-m"; import { NerioMotionConfig, motionVariants } from "@nerio-ui/adapters/motion"; console.log(LazyMotion, domAnimation, m.div, NerioMotionConfig, motionVariants.fade);',
);
const domMax = await bundle(
  "motion-dom-max",
  'import { LazyMotion, domMax } from "motion/react"; import * as m from "motion/react-m"; import { NerioMotionConfig, motionTransitions } from "@nerio-ui/adapters/motion"; console.log(LazyMotion, domMax, m.div, NerioMotionConfig, motionTransitions.layout);',
);

for (const [name, result] of Object.entries({ core, icons, tokenOnly })) {
  if (result.motionBytes > 0) {
    throw new Error(`${name} unexpectedly bundles Motion runtime code.`);
  }
}

for (const [name, result] of Object.entries({ domAnimation, domMax })) {
  const motionInstallRoots = new Set(
    result.motionInputs.map((path) => {
      const match = path.match(/node_modules\/(?:\.pnpm\/motion@[^/]+\/node_modules\/)?motion\//);
      return match?.[0] ?? path;
    }),
  );
  if (motionInstallRoots.size !== 1) {
    throw new Error(`${name} resolved ${motionInstallRoots.size} Motion runtime copies.`);
  }
}

const budgets = { domAnimation: 35_000, domMax: 45_000 };
if (domAnimation.gzipBytes > budgets.domAnimation) {
  throw new Error(
    `LazyMotion + domAnimation exceeds ${budgets.domAnimation} gzip bytes: ${domAnimation.gzipBytes}.`,
  );
}
if (domMax.gzipBytes > budgets.domMax) {
  throw new Error(`LazyMotion + domMax exceeds ${budgets.domMax} gzip bytes: ${domMax.gzipBytes}.`);
}

console.log(
  `Motion adapter verified: Core ${core.gzipBytes} B gzip (0 Motion inputs), token-only adapter ${tokenOnly.gzipBytes} B gzip (0 Motion inputs), LazyMotion + domAnimation ${domAnimation.gzipBytes} B gzip, LazyMotion + domMax ${domMax.gzipBytes} B gzip.`,
);
