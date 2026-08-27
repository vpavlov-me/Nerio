import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const allowMarker = "repo-artifacts-allow";
const textExtensions = new Set([".json", ".md", ".mdx", ".txt", ".yaml", ".yml"]);
const referenceTextExtensions = new Set([
  ...textExtensions,
  ".css",
  ".html",
  ".js",
  ".jsx",
  ".mjs",
  ".ts",
  ".tsx",
]);
const durableAssetPrefixes = [
  "apps/docs/public/",
  "docs/assets/",
  "docs/audits/screenshots/",
  "tests/visual/__screenshots__/darwin/",
  "tests/visual/__screenshots__/linux/",
];
const transientEvidenceExtensions = new Set([
  ".gif",
  ".jpeg",
  ".jpg",
  ".mov",
  ".mp4",
  ".png",
  ".trace",
  ".webm",
  ".webp",
  ".zip",
]);
const linuxEvidencePathPattern =
  /(?:(?:^|(?:evidence|path|file|linux|output|artifact):[ \t]*)\/home\/[^/<>'"`\s)]+\/[^<>'"`\s)]+|\/home\/[^/<>'"`\s)]+\/[^<>'"`\s)]*\.[A-Za-z0-9]{1,10}(?=$|[?#\s)]))/gi;
const machinePathPatterns = [
  {
    label: "personal macOS home path",
    pattern: /(?<![A-Za-z]:)\/Users\/[^/<>'"`\s)]+(?:\/[^<>'"`\s)]*)?/g,
  },
  {
    label: "personal Linux home path",
    pattern: linuxEvidencePathPattern,
  },
  { label: "macOS temporary path", pattern: /\/var\/folders\//g },
  { label: "Windows user path", pattern: /[A-Za-z]:\\Users\\[^\\<>'"`\s)]+/g },
  {
    label: "Windows user path",
    pattern: /\b[A-Za-z]:\/Users\/[^/<>'"`\s)]+(?:\/[^<>'"`\s)]*)?/g,
  },
  { label: "local file URL", pattern: /\bfile:\/\//g },
  { label: "tool-private cache path", pattern: /(?:^|\/)\.codex\//g },
  { label: "temporary tool output path", pattern: /\/(?:private\/)?tmp\/[^\s`'"<>)]+/g },
];

function normalizePath(path) {
  return path.replaceAll("\\", "/").replace(/^\.\//, "");
}

function isMachineLocalDestination(destination) {
  linuxEvidencePathPattern.lastIndex = 0;
  return (
    /^\/(?:Users\/|var\/folders\/|(?:private\/)?tmp\/)/.test(destination) ||
    destination.includes("/.codex/") ||
    linuxEvidencePathPattern.test(destination)
  );
}

function maskPortableUrls(line) {
  return line
    .replace(/\bhttps?:\/\/[^\s<>'"`)]+/g, (url) => " ".repeat(url.length))
    .replace(/\]\((\/[^)\s]+)(?:\s+[^)]*)?\)/g, (link, destination) =>
      isMachineLocalDestination(destination) ? link : " ".repeat(link.length),
    );
}

function isCanonicalText(path) {
  const extension = extname(path).toLowerCase();
  if (!textExtensions.has(extension)) return false;
  if (extension === ".md" || extension === ".mdx") return true;
  return (
    path.startsWith("docs/") ||
    path.startsWith("quality/") ||
    path.startsWith("apps/docs/content/") ||
    path === "apps/docs/content/llms.txt"
  );
}

function isReferenceText(path) {
  return referenceTextExtensions.has(extname(path).toLowerCase());
}

function isDurableAsset(path) {
  return durableAssetPrefixes.some((prefix) => path.startsWith(prefix));
}

function generatedArtifactReason(path) {
  const name = path.split("/").at(-1) ?? path;
  const extension = extname(name).toLowerCase();
  const segments = path.split("/");
  const hasReportMarker = segments.some((segment) => /(?:^|[-_.])report(?:$|[-_.])/i.test(segment));
  const hasComparisonMarker = segments.some((segment) =>
    /(?:^|[-_.])(?:comparison|diff)(?:$|[-_.])/i.test(segment),
  );
  if (hasReportMarker && [".htm", ".html", ".json"].includes(extension)) {
    return "generated diagnostic reports must stay in an ignored artifact directory";
  }
  if (hasComparisonMarker && [".htm", ".html"].includes(extension)) {
    return "generated comparison HTML must stay in an ignored artifact directory";
  }
  if (isDurableAsset(path)) return undefined;
  if (transientEvidenceExtensions.has(extname(name).toLowerCase())) {
    return "transient screenshot, video, or trace output must stay in an ignored artifact directory";
  }
  if (/(?:^|[-_.])(?:comparison|diff|actual|pass\d+).*\.(?:gif|jpe?g|png|webp)$/i.test(name)) {
    return "generated visual comparison output must stay in an ignored artifact directory";
  }
}

export function repositoryArtifactFailures(trackedFiles, readText) {
  const paths = trackedFiles.map(normalizePath);
  const referenceText = new Map(
    paths.filter(isReferenceText).map((path) => [path, readText(path)]),
  );
  const canonicalText = new Map([...referenceText].filter(([path]) => isCanonicalText(path)));
  const failures = [];
  for (const path of paths) {
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

    if (path.startsWith("docs/audits/screenshots/")) {
      const name = path.split("/").at(-1) ?? path;
      const hasAuditOwner = [...canonicalText].some(
        ([source, contents]) =>
          source.startsWith("docs/audits/") &&
          !source.startsWith("docs/audits/screenshots/") &&
          contents.includes(name),
      );
      if (!hasAuditOwner) {
        failures.push(`${path}: durable audit evidence must be referenced by an audit document`);
      }
    }

    if (
      !isReferenceText(path) &&
      (path.startsWith("docs/assets/") || path.startsWith("apps/docs/public/"))
    ) {
      const ownerPath = path.startsWith("docs/assets/")
        ? path.slice("docs/".length)
        : path.slice("apps/docs/public".length);
      const hasOwner = [...referenceText].some(
        ([source, contents]) => source !== path && contents.includes(ownerPath),
      );
      if (!hasOwner) {
        failures.push(`${path}: durable public assets must have a live repository reference`);
      }
    }

    const artifactReason = generatedArtifactReason(path);
    if (artifactReason) failures.push(`${path}: ${artifactReason}`);
    if (!isCanonicalText(path)) continue;

    const lines = canonicalText.get(path).split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (line.includes(allowMarker)) continue;
      const portableText = maskPortableUrls(line);
      for (const { label, pattern } of machinePathPatterns) {
        pattern.lastIndex = 0;
        if (pattern.test(portableText)) {
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
