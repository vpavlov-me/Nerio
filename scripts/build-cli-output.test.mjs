import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const buildScript = join(root, "scripts/build-cli-output.mjs");
const sourceCli = join(root, "packages/cli/src/index.js");
const builtCli = join(root, "packages/cli/dist/index.cjs");

function buildOutput() {
  execFileSync(process.execPath, [buildScript], { cwd: root, stdio: "pipe" });
  return readFileSync(builtCli);
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function run(cli, args, cwd = root) {
  return spawnSync(process.execPath, [cli, ...args], { cwd, encoding: "utf8" });
}

test("CLI package output is deterministic, executable, and behavior-compatible", () => {
  const first = buildOutput();
  const second = buildOutput();
  assert.equal(sha256(second), sha256(first));
  assert.equal(statSync(builtCli).mode & 0o111, 0o111);

  for (const args of [
    ["--help"],
    ["create", "--help"],
    ["add", "--help"],
    ["diff", "--help"],
    ["update", "--help"],
    ["list", "--help"],
    ["info", "--help"],
    ["search", "--help"],
    ["view", "--help"],
    ["docs", "--help"],
    ["migrate", "--help"],
    ["doctor", "--help"],
    ["unknown"],
  ]) {
    const source = run(sourceCli, args);
    const built = run(builtCli, args);
    assert.equal(built.status, source.status, args.join(" "));
    assert.equal(built.stdout, source.stdout, args.join(" "));
    assert.equal(built.stderr, source.stderr, args.join(" "));
  }

  const tempRoot = mkdtempSync(join(tmpdir(), "nerio-built-migration-"));
  try {
    const sourceTarget = join(tempRoot, "source");
    const builtTarget = join(tempRoot, "built");
    const config = `${JSON.stringify(
      {
        schemaVersion: "0.1.0",
        registry: "./unused-registry.json",
        components: "components/nerio",
      },
      null,
      2,
    )}\n`;
    for (const target of [sourceTarget, builtTarget]) {
      mkdirSync(target);
      writeFileSync(join(target, "nerio.json"), config, { flag: "wx" });
    }
    const args = ["migrate", "config", "0.1.0", "1.0.0", "--apply", "--json"];
    const source = run(sourceCli, args, sourceTarget);
    const built = run(builtCli, args, builtTarget);
    assert.equal(built.status, source.status, "migrate apply");
    assert.equal(built.stdout, source.stdout, "migrate apply");
    assert.equal(built.stderr, source.stderr, "migrate apply");
    assert.equal(
      readFileSync(join(builtTarget, "nerio.json"), "utf8"),
      readFileSync(join(sourceTarget, "nerio.json"), "utf8"),
      "migrate config",
    );
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});
