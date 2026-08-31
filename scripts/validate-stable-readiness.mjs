import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function commandsForChannel(channel, deferredStatuses = {}) {
  return channel === "stable"
    ? [
        [
          "validate:stable-accessibility-smoke",
          "scoped internal stable accessibility evidence",
          ["--expect-pass"],
        ],
        [
          "validate:manual-audit-plan",
          "deferred exhaustive accessibility audit record",
          deferredStatuses.manualAudit === "complete" ? ["--expect-pass"] : undefined,
        ],
        [
          "validate:beta-feedback",
          "deferred external validation record",
          deferredStatuses.betaFeedback === "complete" ? ["--expect-proceed"] : undefined,
        ],
      ]
    : [
        ["validate:stable-accessibility-smoke", "scoped stable accessibility smoke record"],
        ["validate:manual-audit-plan", "manual accessibility and device plan"],
        ["validate:beta-feedback", "external beta feedback record"],
      ];
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const metadata = JSON.parse(readFileSync(resolve(root, "quality/release-metadata.json"), "utf8"));
  const strict = metadata.channel === "stable";
  const deferredStatuses = strict
    ? {
        manualAudit: JSON.parse(
          readFileSync(resolve(root, "quality/manual-audit-plan.json"), "utf8"),
        ).status,
        betaFeedback: JSON.parse(readFileSync(resolve(root, "quality/beta-feedback.json"), "utf8"))
          .status,
      }
    : {};
  for (const [script, label, args = []] of commandsForChannel(metadata.channel, deferredStatuses)) {
    const result = spawnSync("pnpm", [script, ...args], {
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
      ? "Stable channel selected: scoped internal accessibility evidence passed; exhaustive device and external validation remain tracked post-release."
      : `Release channel is ${metadata.channel}: scoped stable evidence remains pending and deferred records remain truthful.`,
  );
}
