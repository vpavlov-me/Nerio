import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const tokenStyles = read("packages/tokens/src/styles.css");
const uiStyles = read("packages/ui/src/styles.css");
const manifest = JSON.parse(read("packages/registry/src/manifest.json"));

const requiredTokens = [
  "--n-font-sans-system",
  "--n-font-sans-geist",
  "--n-font-sans-inter",
  "--n-font-sans-ibm-plex",
  "--n-font-sans-manrope",
  "--n-font-sans-source-sans",
  "--n-font-sans-space-grotesk",
  "--n-font-mono-system",
  "--n-font-mono-geist",
  "--n-font-mono-ibm-plex",
  "--n-font-sans: var(--n-font-sans-system)",
  "--n-font-mono: var(--n-font-mono-system)",
];

const requiredRecipes = [
  ".n-typography-system",
  ".n-typography-geist",
  ".n-typography-inter",
  ".n-typography-ibm-plex",
  ".n-typography-manrope",
  ".n-typography-source-sans",
  ".n-typography-space-grotesk",
];

for (const contract of [...requiredTokens, ...requiredRecipes]) {
  if (!tokenStyles.includes(contract)) {
    throw new Error(`Typography token contract is missing: ${contract}`);
  }
}

if (!uiStyles.includes('@import "@nerio-ui/tokens/styles.css";')) {
  throw new Error("@nerio-ui/ui/styles.css must include the standard token stylesheet.");
}

const uiCssFiles = fs
  .readdirSync(path.join(root, "packages/ui/src/styles"))
  .filter((file) => file.endsWith(".css"));
for (const file of uiCssFiles) {
  const source = read(path.join("packages/ui/src/styles", file));
  if (/['\"](?:Geist|Inter)/.test(source)) {
    throw new Error(`Core component CSS must not name a preset font: ${file}`);
  }
}

function findFontBinaries(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findFontBinaries(entryPath);
    return /\.(woff2?|ttf|otf)$/i.test(entry.name) ? [entryPath] : [];
  });
}

const fontBinaries = ["packages/tokens", "packages/ui"].flatMap((directory) =>
  findFontBinaries(path.join(root, directory)),
);
if (fontBinaries.length) {
  throw new Error(`Core packages must not include font binaries: ${fontBinaries.join(", ")}`);
}

const typography = manifest.items.find((item) => item.name === "typography");
if (!typography) throw new Error("Typography registry item is missing.");
if (!typography.files.some((file) => file.target === "styles/tokens.css")) {
  throw new Error("Typography registry install must include the token stylesheet.");
}
for (const token of requiredTokens.slice(0, 10)) {
  if (!typography.requiredTokens.includes(token)) {
    throw new Error(`Typography registry metadata is missing ${token}.`);
  }
}

console.log("Typography token, recipe, Core CSS, font-binary, and registry contracts verified.");
