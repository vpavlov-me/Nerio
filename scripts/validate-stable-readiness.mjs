import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function commandsForChannel(channel) {
  return channel === "stable"
    ? [
        ["validate:manual-audit-complete", "manual accessibility and device evidence"],
        ["validate:beta-feedback-complete", "external beta feedback evidence"],
      ]
    : [
        ["validate:manual-audit-plan", "manual accessibility and device plan"],
        ["validate:beta-feedback", "external beta feedback record"],
      ];
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const metadata = JSON.parse(readFileSync(resolve(root, "quality/release-metadata.json"), "utf8"));
  const strict = metadata.channel === "stable";
  for (const [script, label] of commandsForChannel(metadata.channel)) {
    const result = spawnSync("pnpm", [script], {
      cwd: root,
      encoding: "utf8",
      stdio: "inherit",
    });
    if (result.status !== 0) {
      console.error(`Stable-readiness validation failed at ${label}.`);
      process.exit(result.status ?? 1);
    }
  }

  console.log(
    strict
      ? "Stable channel selected: strict manual audit and external beta feedback evidence passed."
      : `Release channel is ${metadata.channel}: strict stable-only evidence gates remain deferred.`,
  );
}
