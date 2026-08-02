import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const botPattern = /(?:\[bot\]|dependabot|github-actions|renovate)/i;

export function dcoFailures(commits) {
  const failures = [];
  for (const commit of commits) {
    const identity = `${commit.authorName} <${commit.authorEmail}>`;
    if (botPattern.test(identity)) continue;
    const signoffs = [...commit.message.matchAll(/^Signed-off-by:\s*(.+?)\s*<([^>]+)>\s*$/gim)].map(
      (match) => `${match[1].trim().toLowerCase()} <${match[2].trim().toLowerCase()}>`,
    );
    if (!signoffs.includes(identity.toLowerCase())) {
      failures.push(`${commit.sha}: missing matching Signed-off-by for ${identity}`);
    }
  }
  return failures;
}

export function parseCommitLog(output) {
  return output
    .split("\0")
    .filter(Boolean)
    .map((record) => record.replace(/^\r?\n/, ""))
    .filter(Boolean)
    .map((record) => {
      const [sha, authorName, authorEmail, ...message] = record.split("\x1f");
      return { sha, authorName, authorEmail, message: message.join("\x1f") };
    });
}

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index];
    const value = args[index + 1];
    if (!["--base", "--head"].includes(name) || !value) {
      throw new Error("Usage: check-dco.mjs --base <sha> --head <sha>");
    }
    options[name.slice(2)] = value;
  }
  if (!options.base || !options.head) {
    throw new Error("Usage: check-dco.mjs --base <sha> --head <sha>");
  }
  return options;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { base, head } = parseArgs(process.argv.slice(2));
  const commits = parseCommitLog(
    execFileSync("git", ["log", "--format=%H%x1f%an%x1f%ae%x1f%B%x00", `${base}..${head}`], {
      encoding: "utf8",
    }),
  );
  const failures = dcoFailures(commits);
  if (failures.length) {
    throw new Error(`DCO validation failed:\n- ${failures.join("\n- ")}`);
  }
  console.log(`DCO validation passed for ${commits.length} commit(s).`);
}
