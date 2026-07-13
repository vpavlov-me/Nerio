import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tokenFileArgument = process.argv.indexOf("--token-file");
const tokenFile =
  tokenFileArgument === -1
    ? join(root, "packages/tokens/src/styles.css")
    : resolve(process.argv[tokenFileArgument + 1]);
const tokenCss = readFileSync(tokenFile, "utf8");
const uiStyles = readdirSync(join(root, "packages/ui/src/styles"))
  .filter((file) => file.endsWith(".css"))
  .map((file) => [file, readFileSync(join(root, "packages/ui/src/styles", file), "utf8")]);
const defined = new Set([...tokenCss.matchAll(/(--n-[a-z0-9-]+)\s*:/g)].map((match) => match[1]));
const referenced = new Set(
  [
    ...tokenCss.matchAll(/var\((--n-[a-z0-9-]+)/g),
    ...uiStyles.flatMap(([, css]) => [...css.matchAll(/var\((--n-[a-z0-9-]+)/g)]),
  ].map((match) => match[1]),
);
const required = [
  "--n-color-surface-canvas",
  "--n-color-surface-raised",
  "--n-color-surface-overlay",
  "--n-color-text-primary",
  "--n-color-text-secondary",
  "--n-color-text-tertiary",
  "--n-color-text-inverse",
  "--n-color-text-disabled",
  "--n-color-border-subtle",
  "--n-color-border-default",
  "--n-color-border-strong",
  "--n-color-action-primary",
  "--n-color-action-secondary",
  "--n-color-danger",
  "--n-color-status-success",
  "--n-color-status-warning",
  "--n-color-status-info",
  "--n-color-focus-ring",
  "--n-color-surface-selected",
  "--n-overlay-backdrop",
  "--n-font-sans",
  "--n-radius-md",
  "--n-space-4",
  "--n-duration-normal",
  "--n-contrast-text-primary",
  "--n-contrast-action",
  "--n-contrast-focus-ring",
];
const failures = [
  ...required
    .filter((token) => !defined.has(token))
    .map((token) => `Required token is missing: ${token}`),
  ...[...referenced]
    .filter((token) => !defined.has(token))
    .sort()
    .map((token) => `Unresolved token reference: ${token}`),
];
for (const theme of ["purple", "blue", "green", "orange", "red", "neutral"]) {
  if (!tokenCss.includes(`:root[data-theme="${theme}"]`))
    failures.push(`Preset theme selector is missing: ${theme}`);
}
for (const axis of ["data-radius", "data-font", "data-motion", "data-contrast", "data-scale"]) {
  if (new RegExp(`\\[${axis.replace("-", "\\-")}`).test(tokenCss))
    failures.push(`Prohibited runtime axis selector: ${axis}`);
}
if (failures.length) {
  console.error("Token validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(
  `Token contract verified: ${defined.size} definitions and ${referenced.size} resolved references.`,
);
