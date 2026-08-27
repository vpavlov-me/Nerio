import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const allowMarker = "repo-artifacts-allow";
const textExtensions = new Set([".json", ".md", ".mdx", ".txt", ".yaml", ".yml"]);
const durableAssetPrefixes = [
  "apps/docs/public/",
  "docs/assets/",
  "docs/audits/screenshots/",
  "tests/visual/__screenshots__/darwin/",
  "tests/visual/__screenshots__/linux/",
];
const machinePathPatterns = [
  {
    label: "personal macOS home path",
    pattern: /\/Users\/[^/<>'"`\s)]+(?:\/[^<>'"`\s)]*)?/g,
  },
  { label: "macOS temporary path", pattern: /\/var\/folders\//g },
  { label: "Windows user path", pattern: /[A-Za-z]:\\Users\\[^\\<>'"`\s)]+/g },
  { label: "local file URL", pattern: /\bfile:\/\//g },
  { label: "tool-private cache path", pattern: /(?:^|\/)\.codex\//g },
  { label: "temporary tool output path", pattern: /\/(?:private\/)?tmp\/[^\s`'"<>)]+/g },
];

function normalizePath(path) {
  return path.replaceAll("\\", "/").replace(/^\.\//, "");
}

function isCanonicalText(path) {
  if (!textExtensions.has(extname(path).toLowerCase())) return false;
  return (
    path.startsWith("docs/") ||
    path.startsWith("quality/") ||
    path.startsWith("apps/docs/content/") ||
    path === "apps/docs/content/llms.txt" ||
    (!path.includes("/") && path.endsWith(".md"))
  );
}

function isDurableAsset(path) {
  return durableAssetPrefixes.some((prefix) => path.startsWith(prefix));
}

function generatedArtifactReason(path) {
  if (isDurableAsset(path)) return undefined;
  const name = path.split("/").at(-1) ?? path;
  if (/(?:^|[-_.])(?:comparison|diff).*\.html?$/i.test(name)) {
    return "generated comparison HTML must stay in an ignored artifact directory";
  }
  if (/(?:^|[-_.])(?:comparison|diff|actual|pass\d+).*\.(?:gif|jpe?g|png|webp)$/i.test(name)) {
    return "generated visual comparison output must stay in an ignored artifact directory";
  }
  if (/(?:^|[-_.])report.*\.json$/i.test(name) && !path.startsWith("quality/")) {
    return "generated JSON reports must stay in an ignored artifact directory";
  }
}

export function repositoryArtifactFailures(trackedFiles, readText) {
  const failures = [];
  for (const inputPath of trackedFiles) {
    const path = normalizePath(inputPath);
    if (
      path === "design-qa.md" ||
      path.startsWith("artifacts/") ||
      path.startsWith("design-qa-artifacts/")
    ) {
      failures.push(
        `${path}: tracked ephemeral QA output is forbidden; use an ignored artifact directory`,
      );
      continue;
    }

    const artifactReason = generatedArtifactReason(path);
    if (artifactReason) failures.push(`${path}: ${artifactReason}`);
    if (!isCanonicalText(path)) continue;

    const lines = readText(path).split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (line.includes(allowMarker)) continue;
      for (const { label, pattern } of machinePathPatterns) {
        pattern.lastIndex = 0;
        if (pattern.test(line)) {
          failures.push(
            `${path}:${index + 1}: ${label} is not portable; link durable repository or PR/CI evidence`,
          );
        }
      }
    }
  }
  return failures;
}

export function trackedRepositoryFiles(repositoryRoot = root) {
  return execFileSync("git", ["ls-files", "-z"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    maxBuffer: 20_000_000,
  })
    .split("\0")
    .filter(Boolean);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const failures = repositoryArtifactFailures(trackedRepositoryFiles(root), (path) =>
    readFileSync(resolve(root, path), "utf8"),
  );
  if (failures.length) {
    throw new Error(`Repository artifact retention validation failed:\n- ${failures.join("\n- ")}`);
  }
  console.log(
    "Repository artifact retention passed: tracked evidence is portable and in canonical locations.",
  );
}
