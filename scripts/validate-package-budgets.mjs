import { execFileSync } from "node:child_process";
import { gzipSync } from "node:zlib";
import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const budgets = JSON.parse(readFileSync(join(root, "quality/package-budgets.json"), "utf8"));
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const tempRoot = mkdtempSync(join(tmpdir(), "nerio-package-budgets-"));

function assertBudget(label, actual, maximum) {
  if (actual > maximum) {
    throw new Error(`${label} is ${actual} bytes; budget is ${maximum} bytes.`);
  }
  console.log(`${label}: ${actual}/${maximum} bytes`);
}

function packedBytes(tarball) {
  return execFileSync("tar", ["-tzf", tarball], { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter((entry) => entry && !entry.endsWith("/"))
    .reduce(
      (total, entry) =>
        total + execFileSync("tar", ["-xOf", tarball, entry], { maxBuffer: 10_000_000 }).byteLength,
      0,
    );
}

async function bundleProbe(label, source, maximum, { includeLucide = false } = {}) {
  const result = await build({
    absWorkingDir: root,
    bundle: true,
    external: [
      "react",
      "react/*",
      "react-dom",
      "react-dom/*",
      "@base-ui/react",
      "@base-ui/react/*",
      "@nerio-ui/*",
      "clsx",
      "tailwind-merge",
      "@tanstack/react-table",
      "recharts",
      "react-hook-form",
      "zod",
      "motion",
      "motion/*",
      ...(includeLucide ? [] : ["lucide-react"]),
    ],
    format: "esm",
    jsx: "automatic",
    metafile: true,
    minify: true,
    platform: "browser",
    stdin: { contents: source, loader: "tsx", resolveDir: root, sourcefile: `${label}.tsx` },
    treeShaking: true,
    write: false,
  });
  const bytes = result.outputFiles.reduce((total, file) => total + file.contents.byteLength, 0);
  assertBudget(label, bytes, maximum);
  return { bytes, inputs: Object.keys(result.metafile.inputs) };
}

try {
  for (const [name, budget] of Object.entries(budgets.packages)) {
    execFileSync(pnpm, ["--filter", name, "pack", "--pack-destination", tempRoot], {
      cwd: root,
      stdio: "pipe",
    });
    const prefix = `${name.slice(1).replaceAll("/", "-")}-`;
    const filename = readdirSync(tempRoot).find(
      (entry) => entry.startsWith(prefix) && entry.endsWith(".tgz"),
    );
    if (!filename) throw new Error(`Could not find packed archive for ${name}.`);
    const tarball = join(tempRoot, filename);
    assertBudget(`${name} tarball`, statSync(tarball).size, budget.tarballBytes);
    assertBudget(`${name} unpacked`, packedBytes(tarball), budget.unpackedBytes);
  }

  const tokenCss = readFileSync(join(root, "packages/tokens/src/styles.css"));
  assertBudget("Token CSS raw", tokenCss.byteLength, budgets.css.tokensRawBytes);
  assertBudget("Token CSS gzip", gzipSync(tokenCss).byteLength, budgets.css.tokensGzipBytes);

  const uiStyleDirectory = join(root, "packages/ui/src/styles");
  const uiCss = Buffer.concat([
    readFileSync(join(root, "packages/ui/src/styles.css")),
    ...readdirSync(uiStyleDirectory)
      .filter((entry) => entry.endsWith(".css"))
      .sort()
      .map((entry) => readFileSync(join(uiStyleDirectory, entry))),
  ]);
  assertBudget("UI residual CSS raw", uiCss.byteLength, budgets.css.uiResidualRawBytes);
  assertBudget("UI residual CSS gzip", gzipSync(uiCss).byteLength, budgets.css.uiResidualGzipBytes);

  const serverBundle = await bundleProbe(
    "Server Card named import",
    'import { Card } from "./packages/ui/src/index.ts"; console.log(Card);',
    budgets.bundles.serverCardBytes,
  );
  const directServerBundle = await bundleProbe(
    "Direct Card import control",
    'import { Card } from "./packages/ui/src/components/card.tsx"; console.log(Card);',
    budgets.bundles.serverCardBytes,
  );
  if (serverBundle.bytes > directServerBundle.bytes + 250) {
    throw new Error("Server barrel import retained more than the named Card implementation.");
  }

  const clientBundle = await bundleProbe(
    "Client Button named import",
    'import { Button } from "./packages/ui/src/client.ts"; console.log(Button);',
    budgets.bundles.clientButtonBytes,
  );
  const directClientBundle = await bundleProbe(
    "Direct Button import control",
    'import { Button } from "./packages/ui/src/components/button.tsx"; console.log(Button);',
    budgets.bundles.clientButtonBytes,
  );
  if (clientBundle.bytes > directClientBundle.bytes + 250) {
    throw new Error("Client barrel import retained more than the named Button implementation.");
  }

  const adapterIconBundle = await bundleProbe(
    "Named Search icon import",
    'import { Search } from "./packages/adapters/src/icons.ts"; console.log(Search);',
    budgets.bundles.namedIconBytes,
    { includeLucide: true },
  );
  const directIconBundle = await bundleProbe(
    "Direct Search icon control",
    'import { Search } from "./packages/adapters/node_modules/lucide-react/dist/esm/lucide-react.js"; console.log(Search);',
    budgets.bundles.namedIconBytes,
    { includeLucide: true },
  );
  if (adapterIconBundle.bytes > directIconBundle.bytes + 250) {
    throw new Error("Named adapter icon import retained more than the direct Lucide icon.");
  }

  for (const [name, exportName] of [
    ["table", "useReactTable"],
    ["charts", "ResponsiveContainer"],
    ["forms", "useForm"],
    ["schema", "z"],
    ["motion", "NerioMotionConfig"],
  ]) {
    await bundleProbe(
      `${name} adapter import`,
      `import { ${exportName} } from "./packages/adapters/src/${name}${name === "motion" ? ".tsx" : ".ts"}"; console.log(${exportName});`,
      budgets.bundles[`${name}AdapterBytes`],
    );
  }

  console.log(`Package budgets passed. Override policy: ${budgets.overridePolicy}`);
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
