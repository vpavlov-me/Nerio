#!/usr/bin/env node
const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");
const { Buffer } = require("node:buffer");
const { clearTimeout, setTimeout } = require("node:timers");
const { Worker } = require("node:worker_threads");

const cliPackage = require("../package.json");
const DEFAULT_REGISTRY = "@nerio-ui/registry/manifest.json";
const STATE_SCHEMA_VERSION = "1.0.0";
const SUPPORTED_CONFIG_SCHEMAS = new Set(["0.1.0", "1.0.0"]);
const SUPPORTED_REGISTRY_SCHEMA_MAJOR = 1;
const STATE_FILENAME = "nerio.lock.json";
const REGISTRY_ROLES = new Set(["component", "style", "utility"]);
const REMOTE_MANIFEST_BYTES = 2 * 1024 * 1024;
const REMOTE_SOURCE_BYTES = 4 * 1024 * 1024;
const REMOTE_TIMEOUT_MS = 10_000;
const REMOTE_REDIRECT_LIMIT = 3;
const INTEGRITY_PATTERN = /^sha256-([a-f0-9]{64})$/;
const SCHEMA_VERSION_PATTERN = /^\d+\.\d+\.\d+$/;
const LOCK_CONTENT_HASH = Symbol("lock-content-hash");
const TRANSACTION_PREFIX = ".nerio-transaction-";
const TRANSACTION_SCHEMA_VERSION = "1.0.0";
const REGISTRY_LOCK_DIRECTORY = ".nerio-registry-lock";
const REGISTRY_LOCK_SCHEMA_VERSION = "1.0.0";
const REGISTRY_LOCK_WAIT_MS = 60_000;
const REGISTRY_LOCK_POLL_MS = 25;
const REGISTRY_LOCK_HEARTBEAT_MS = 1_000;
const REGISTRY_LOCK_STALE_MS = 30_000;
const REGISTRY_LOCK_RECLAIM_CONFIRM_MS = 5_000;
const REGISTRY_LOCK_CANDIDATE_PREFIX = `${REGISTRY_LOCK_DIRECTORY}.candidate-`;
const REGISTRY_LOCK_REAP_PREFIX = `${REGISTRY_LOCK_DIRECTORY}.reap-`;
const LOCK_RENEW_PREFIX = `${REGISTRY_LOCK_DIRECTORY}.renew-`;
const cwd = process.cwd();
const args = process.argv.slice(2);
const command = args[0];
const itemName =
  ["add", "diff", "info", "update"].includes(command) && !args[1]?.startsWith("--")
    ? args[1]
    : undefined;
let activeRegistryLock = null;

function option(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function hasFlag(name) {
  return args.includes(name);
}

function defaultComponentsDirectory() {
  const usesSourceDirectory =
    fs.existsSync(path.join(cwd, "src", "app")) || fs.existsSync(path.join(cwd, "src", "pages"));

  return usesSourceDirectory ? "src/components/nerio" : "components/nerio";
}

function help(commandName) {
  const sections = {
    init: [
      "Usage: nerio init [--registry <path-or-url>] [--components <directory>] [--allow-insecure-http]",
      "",
      "Create nerio.json for source-installed components.",
      "Defaults to src/components/nerio for src-dir applications and components/nerio otherwise.",
    ],
    add: [
      "Usage: nerio add <component> [--registry <path-or-url>] [--dry-run] [--overwrite] [--allow-insecure-http]",
      "",
      "Install an editable source component, its registry dependencies, and exact source metadata.",
    ],
    diff: [
      "Usage: nerio diff [component] [--registry <path-or-url>] [--allow-insecure-http]",
      "",
      "Compare installed source with its recorded baseline and the configured Registry.",
    ],
    update: [
      "Usage: nerio update [component] [--registry <path-or-url>] [--dry-run] [--force] [--allow-insecure-http]",
      "",
      "Apply safe upstream source changes without overwriting local modifications.",
    ],
    list: [
      "Usage: nerio list [--registry <path-or-url>] [--allow-insecure-http]",
      "",
      "List component names, titles, and categories from the configured registry.",
    ],
    info: [
      "Usage: nerio info <component> [--registry <path-or-url>] [--allow-insecure-http]",
      "",
      "Show registry metadata, dependencies, tokens, files, and usage for one component.",
    ],
    doctor: [
      "Usage: nerio doctor [--registry <path-or-url>] [--allow-insecure-http]",
      "",
      "Validate nerio.json and the configured registry manifest.",
    ],
    root: [
      "Usage: nerio <command> [options]",
      "",
      "Commands:",
      "  nerio init     Create nerio.json",
      "  nerio add      Install editable source components",
      "  nerio diff     Inspect local and upstream source drift",
      "  nerio update   Preview or apply non-destructive source updates",
      "  nerio list     List registry components",
      "  nerio info     Show metadata for one component",
      "  nerio doctor   Validate configuration and registry metadata",
      "",
      "Recommended local install: pnpm add -D @nerio-ui/registry@1.0.0-beta.0 @nerio-ui/cli@1.0.0-beta.0",
      "Run local commands with: pnpm exec nerio <command> [options]",
      "One-off example: pnpm dlx @nerio-ui/cli@1.0.0-beta.0 init",
      "",
      "Run nerio <command> --help for command options.",
    ],
  };

  return (sections[commandName] || sections.root).join("\n");
}

function isUrl(value) {
  return /^https?:\/\//i.test(value);
}

function safeLocation(location) {
  if (!isUrl(location)) return location;
  const url = new URL(location);
  url.username = "";
  url.password = "";
  url.search = "";
  url.hash = "";
  return url.toString();
}

function assertRemoteProtocol(location) {
  const url = new URL(location);
  if (url.username || url.password) {
    throw new Error(`Registry URLs must not contain credentials: ${safeLocation(location)}`);
  }
  if (url.protocol === "https:") return;
  if (url.protocol === "http:" && hasFlag("--allow-insecure-http")) return;
  throw new Error(
    `Registry URLs must use HTTPS. Re-run with --allow-insecure-http only for a trusted local HTTP Registry: ${safeLocation(location)}`,
  );
}

function validContentType(contentType, kind) {
  const mediaType = contentType.split(";", 1)[0].trim().toLowerCase();
  if (kind === "manifest") {
    return mediaType === "application/json" || mediaType.endsWith("+json");
  }
  return (
    mediaType.startsWith("text/") ||
    mediaType === "application/javascript" ||
    mediaType === "application/typescript" ||
    mediaType === "application/json" ||
    mediaType === "application/octet-stream"
  );
}

function remoteTimeoutMs() {
  const injected = Number(process.env.NERIO_TEST_REMOTE_TIMEOUT_MS);
  return Number.isInteger(injected) && injected > 0 ? injected : REMOTE_TIMEOUT_MS;
}

async function readRemoteText(location, { kind, maxBytes }) {
  let current = location;
  for (let redirects = 0; redirects <= REMOTE_REDIRECT_LIMIT; redirects += 1) {
    assertRemoteProtocol(current);
    const controller = new globalThis.AbortController();
    const timeoutMs = remoteTimeoutMs();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let response;
    try {
      response = await fetch(current, {
        redirect: "manual",
        signal: controller.signal,
        headers: { accept: kind === "manifest" ? "application/json" : "text/plain, */*;q=0.1" },
      });
    } catch (error) {
      if (error?.name === "AbortError") {
        throw new Error(
          `Registry ${kind} request timed out after ${timeoutMs}ms: ${safeLocation(current)}`,
        );
      }
      throw new Error(`Registry ${kind} request failed: ${safeLocation(current)}`);
    } finally {
      clearTimeout(timeout);
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      if (redirects === REMOTE_REDIRECT_LIMIT) {
        await response.body?.cancel();
        throw new Error(
          `Registry ${kind} exceeded the ${REMOTE_REDIRECT_LIMIT}-redirect limit: ${safeLocation(location)}`,
        );
      }
      const next = response.headers.get("location");
      if (!next) {
        throw new Error(
          `Registry ${kind} redirect is missing a Location header: ${safeLocation(current)}`,
        );
      }
      await response.body?.cancel();
      current = new URL(next, current).toString();
      continue;
    }
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error(
        `Registry ${kind} request failed (${response.status}): ${safeLocation(current)}`,
      );
    }

    const contentType = response.headers.get("content-type") || "";
    if (!validContentType(contentType, kind)) {
      await response.body?.cancel();
      throw new Error(
        `Registry ${kind} returned unsupported content type ${contentType || "(missing)"}: ${safeLocation(current)}`,
      );
    }
    const declaredBytes = Number(response.headers.get("content-length"));
    if (Number.isFinite(declaredBytes) && declaredBytes > maxBytes) {
      await response.body?.cancel();
      throw new Error(
        `Registry ${kind} exceeds the ${maxBytes}-byte response limit: ${safeLocation(current)}`,
      );
    }
    if (!response.body) {
      throw new Error(`Registry ${kind} response has no body: ${safeLocation(current)}`);
    }

    const chunks = [];
    let received = 0;
    const reader = response.body.getReader();
    let bodyTimedOut = false;
    const bodyTimeout = setTimeout(() => {
      bodyTimedOut = true;
      controller.abort();
    }, timeoutMs);
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.byteLength;
        if (received > maxBytes) {
          await reader.cancel();
          throw new Error(
            `Registry ${kind} exceeds the ${maxBytes}-byte response limit: ${safeLocation(current)}`,
          );
        }
        chunks.push(Buffer.from(value));
      }
    } catch (error) {
      if (bodyTimedOut || error?.name === "AbortError") {
        throw new Error(
          `Registry ${kind} request timed out after ${timeoutMs}ms: ${safeLocation(current)}`,
        );
      }
      if (error instanceof Error && error.message.startsWith("Registry ")) throw error;
      throw new Error(`Registry ${kind} response could not be read: ${safeLocation(current)}`);
    } finally {
      clearTimeout(bodyTimeout);
    }
    return { text: Buffer.concat(chunks, received).toString("utf8"), location: current };
  }
  throw new Error(`Registry ${kind} redirect handling failed: ${safeLocation(location)}`);
}

function readConfig(required = false) {
  const configPath = path.join(cwd, "nerio.json");
  if (!fs.existsSync(configPath)) {
    if (required) {
      throw new Error("nerio.json not found. Run nerio init first.");
    }
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch {
    throw new Error("nerio.json is not valid JSON.");
  }
}

function registryLocation(config) {
  return option("--registry") || process.env.NERIO_REGISTRY || config?.registry || DEFAULT_REGISTRY;
}

function resolvedLocation(location) {
  if (location === DEFAULT_REGISTRY) {
    return require.resolve(DEFAULT_REGISTRY);
  }
  return location;
}

async function readTextResult(location, kind = "source") {
  const resolved = resolvedLocation(location);
  if (isUrl(resolved)) {
    return readRemoteText(resolved, {
      kind,
      maxBytes: kind === "manifest" ? REMOTE_MANIFEST_BYTES : REMOTE_SOURCE_BYTES,
    });
  }

  const target = path.resolve(cwd, resolved);
  const size = fs.statSync(target).size;
  const maxBytes = kind === "manifest" ? REMOTE_MANIFEST_BYTES : REMOTE_SOURCE_BYTES;
  if (size > maxBytes) {
    throw new Error(`Registry ${kind} exceeds the ${maxBytes}-byte input limit: ${target}`);
  }
  return { text: fs.readFileSync(target, "utf8"), location: target };
}

async function readText(location, kind = "source") {
  return (await readTextResult(location, kind)).text;
}

async function readManifest(location) {
  let manifest;
  let manifestResult;
  try {
    manifestResult = await readTextResult(location, "manifest");
    manifest = JSON.parse(manifestResult.text);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Registry manifest is not valid JSON: ${safeLocation(location)}`);
    }
    throw error;
  }

  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new Error("Registry manifest must be a JSON object.");
  }
  if (
    ["schemaVersion", "name", "version", "sourceRevision", "styleContractVersion"].some(
      (field) => typeof manifest[field] !== "string" || !manifest[field],
    ) ||
    !Array.isArray(manifest.items)
  ) {
    throw new Error(
      "Registry manifest must define schemaVersion, name, version, sourceRevision, styleContractVersion, and items.",
    );
  }
  if (!SCHEMA_VERSION_PATTERN.test(manifest.schemaVersion)) {
    throw new Error(`Registry schema must use x.y.z format: ${manifest.schemaVersion}.`);
  }
  const schemaMajor = Number.parseInt(manifest.schemaVersion.split(".")[0], 10);
  if (schemaMajor > SUPPORTED_REGISTRY_SCHEMA_MAJOR) {
    throw new Error(
      `Registry schema ${manifest.schemaVersion} is newer than this CLI supports. Upgrade @nerio-ui/cli before continuing.`,
    );
  }
  if (schemaMajor < SUPPORTED_REGISTRY_SCHEMA_MAJOR) {
    throw new Error(
      `Registry schema ${manifest.schemaVersion} is no longer supported. Use a Registry compatible with CLI ${cliPackage.version}.`,
    );
  }
  validateManifest(manifest, {
    requireIntegrity: isUrl(resolvedLocation(location)),
    registryLocation: manifestResult.location,
  });
  Object.defineProperty(manifest, "__registryLocation", {
    value: manifestResult.location,
    enumerable: false,
  });
  return manifest;
}

function validateStringArray(item, field) {
  if (
    !Array.isArray(item[field]) ||
    item[field].some((value) => typeof value !== "string" || !value) ||
    new Set(item[field]).size !== item[field].length
  ) {
    throw new Error(
      `Registry item ${item.name || "(unnamed)"} must define ${field} as unique strings.`,
    );
  }
}

function validateManifest(manifest, { requireIntegrity = false, registryLocation } = {}) {
  const names = new Set();
  for (const item of manifest.items) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error("Registry items must be objects.");
    }
    for (const field of ["name", "title", "description", "category", "usage"]) {
      if (typeof item[field] !== "string" || !item[field]) {
        throw new Error(`Registry item ${item.name || "(unnamed)"} must define ${field}.`);
      }
    }
    if (names.has(item.name))
      throw new Error(`Registry contains duplicate item name: ${item.name}`);
    names.add(item.name);
    for (const field of [
      "dependencies",
      "registryDependencies",
      "baseUiPrimitives",
      "slots",
      "variants",
      "requiredTokens",
      "accessibility",
    ]) {
      validateStringArray(item, field);
    }
    if (item.optionalPeerDependencies !== undefined) {
      validateStringArray(item, "optionalPeerDependencies");
    }
    if (item.states !== undefined) validateStringArray(item, "states");
    if (!Array.isArray(item.files) || !item.files.length) {
      throw new Error(`Registry item ${item.name} must define at least one file.`);
    }
    const targets = new Set();
    for (const file of item.files) {
      if (
        !file ||
        typeof file !== "object" ||
        Array.isArray(file) ||
        typeof file.source !== "string" ||
        !file.source ||
        typeof file.target !== "string" ||
        !file.target ||
        !REGISTRY_ROLES.has(file.role)
      ) {
        throw new Error(`Registry item ${item.name} contains an invalid file entry.`);
      }
      if (
        path.isAbsolute(file.target) ||
        file.target.includes("\\") ||
        file.target.split("/").includes("..") ||
        file.target.includes("\0")
      ) {
        throw new Error(`Registry item ${item.name} contains unsafe target ${file.target}.`);
      }
      if (file.source.includes("\\") || file.source.includes("\0")) {
        throw new Error(`Registry item ${item.name} contains unsafe source ${file.source}.`);
      }
      if (registryLocation && isUrl(registryLocation)) {
        const sourceLocation = new URL(file.source, registryLocation).toString();
        if (!isUrl(sourceLocation)) {
          throw new Error(
            `Registry item ${item.name} source must resolve to an HTTP(S) URL: ${file.source}.`,
          );
        }
        assertRemoteProtocol(sourceLocation);
      } else if (path.isAbsolute(file.source) || isUrl(file.source)) {
        throw new Error(
          `Local Registry item ${item.name} source must be a relative file path: ${file.source}.`,
        );
      }
      if (targets.has(file.target)) {
        throw new Error(`Registry item ${item.name} contains duplicate target ${file.target}.`);
      }
      targets.add(file.target);
      if (
        (requireIntegrity || file.integrity !== undefined) &&
        (typeof file.integrity !== "string" || !INTEGRITY_PATTERN.test(file.integrity))
      ) {
        throw new Error(
          `Registry file ${item.name}:${file.target} must define sha256-<64 lowercase hex> integrity.`,
        );
      }
    }
  }
  for (const item of manifest.items) {
    for (const dependency of item.registryDependencies) {
      if (!names.has(dependency)) {
        throw new Error(`Registry item ${item.name} depends on unknown item ${dependency}.`);
      }
    }
  }
  const visited = new Set();
  const visiting = new Set();
  const visit = (name) => {
    if (visited.has(name)) return;
    if (visiting.has(name)) throw new Error(`Registry dependency cycle includes ${name}.`);
    visiting.add(name);
    const item = manifest.items.find((entry) => entry.name === name);
    for (const dependency of item.registryDependencies) visit(dependency);
    visiting.delete(name);
    visited.add(name);
  };
  for (const item of manifest.items) visit(item.name);
}

function resolveSource(registry, source) {
  const resolved = resolvedLocation(registry);
  if (isUrl(resolved)) {
    const location = new URL(source, resolved).toString();
    if (!isUrl(location)) {
      throw new Error(`Registry source must resolve to an HTTP(S) URL: ${source}`);
    }
    return location;
  }
  return path.resolve(path.dirname(path.resolve(cwd, resolved)), source);
}

function canonicalPath(target) {
  let existing = target;
  while (!fs.existsSync(existing)) {
    const parent = path.dirname(existing);
    if (parent === existing) break;
    existing = parent;
  }
  return path.resolve(fs.realpathSync(existing), path.relative(existing, target));
}

function resolveTarget(componentsRoot, target) {
  const root = path.resolve(cwd, componentsRoot);
  const resolved = path.resolve(root, target);
  if (!isWithin(root, resolved) || !isWithin(canonicalPath(root), canonicalPath(resolved))) {
    throw new Error(`Registry target escapes the components directory: ${target}`);
  }
  assertNoSymlinks(root, resolved, `Registry target contains a symlink: ${target}`);
  return resolved;
}

function assertNoSymlinks(root, target, message) {
  let current = root;
  const relative = path.relative(root, target);
  for (const segment of relative.split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    try {
      if (fs.lstatSync(current).isSymbolicLink()) throw new Error(message);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
}

function writeFileAtomic(target, content) {
  refreshActiveRegistryLockLease();
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const temporary = path.join(
    path.dirname(target),
    `.${path.basename(target)}.${process.pid}.${crypto.randomUUID()}.tmp`,
  );
  try {
    fs.writeFileSync(temporary, content, { flag: "wx" });
    fs.renameSync(temporary, target);
    refreshActiveRegistryLockLease();
  } finally {
    fs.rmSync(temporary, { force: true });
  }
}

function injectFailure(point, committed = 0) {
  const requested = process.env.NERIO_TEST_FAILURE;
  if (
    requested === point ||
    (point === "after-commit" && requested === `after-commit:${committed}`)
  ) {
    throw new Error(`Injected Registry transaction failure: ${requested}`);
  }
}

function injectCrash(point, committed = 0) {
  const requested = process.env.NERIO_TEST_CRASH;
  if (
    requested === point ||
    (point === "after-commit" && requested === `after-commit:${committed}`)
  ) {
    process.exit(86);
  }
}

function pauseTransactionForFixture() {
  const milliseconds = Number(process.env.NERIO_TEST_TRANSACTION_PAUSE_MS);
  if (Number.isSafeInteger(milliseconds) && milliseconds > 0) {
    const clock = new Int32Array(new SharedArrayBuffer(4));
    Atomics.wait(clock, 0, 0, milliseconds);
    refreshActiveRegistryLockLease();
  }
}

function removeEmptyParents(target, boundary) {
  let directory = path.dirname(target);
  while (directory !== boundary && isWithin(boundary, directory)) {
    try {
      fs.rmdirSync(directory);
    } catch {
      break;
    }
    directory = path.dirname(directory);
  }
}

function transactionJournalPath(transactionRoot) {
  return path.join(transactionRoot, "journal.json");
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function readRegistryLock(lockPath) {
  const pathStats = fs.lstatSync(lockPath);
  if (!pathStats.isFile() || pathStats.isSymbolicLink()) {
    throw new Error(`Invalid Registry lock path: ${lockPath}`);
  }
  const descriptor = fs.openSync(lockPath, "r");
  let owner;
  try {
    const stats = fs.fstatSync(descriptor);
    if (!sameFile(pathStats, stats)) {
      throw Object.assign(new Error(`Lock changed while reading its owner.`), {
        code: "EAGAIN",
      });
    }
    try {
      owner = JSON.parse(fs.readFileSync(descriptor, "utf8"));
    } catch {
      return { owner: null, stats };
    }
    if (
      owner?.schemaVersion !== REGISTRY_LOCK_SCHEMA_VERSION ||
      !Number.isSafeInteger(owner.pid) ||
      owner.pid <= 0 ||
      typeof owner.token !== "string" ||
      !owner.token ||
      typeof owner.createdAt !== "string"
    ) {
      return { owner: null, stats };
    }
    return { owner, stats };
  } finally {
    fs.closeSync(descriptor);
  }
}

function sameFile(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}

function registryReapClaims() {
  const now = Date.now();
  const claims = [];
  for (const entry of fs.readdirSync(cwd)) {
    if (!entry.startsWith(REGISTRY_LOCK_REAP_PREFIX)) continue;
    const claimPath = path.join(cwd, entry);
    let stats;
    try {
      stats = fs.lstatSync(claimPath);
    } catch (error) {
      if (error?.code === "ENOENT") continue;
      throw error;
    }
    const claimAge = now - stats.mtimeMs;
    if (stats.isFile() && !stats.isSymbolicLink() && claimAge >= REGISTRY_LOCK_STALE_MS) {
      // Claim UUID paths are never reused, so this cannot remove a replacement.
      fs.rmSync(claimPath, { force: true });
      continue;
    }
    claims.push(claimPath);
  }
  return claims.sort();
}

function activeLockArtifact(target) {
  let stats;
  try {
    stats = fs.lstatSync(target);
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
  if (!stats.isFile() || stats.isSymbolicLink()) {
    throw new Error(`Invalid Registry lock artifact: ${target}`);
  }
  const now = Date.now();
  if (now - stats.mtimeMs < REGISTRY_LOCK_STALE_MS) return true;
  if (stats.atimeMs === stats.mtimeMs) fs.utimesSync(target, new Date(now), stats.mtime);
  else if (now - stats.atimeMs >= REGISTRY_LOCK_RECLAIM_CONFIRM_MS) {
    fs.rmSync(target);
    return false;
  }
  return true;
}

function renewalActive() {
  return fs
    .readdirSync(cwd)
    .filter((entry) => entry.startsWith(LOCK_RENEW_PREFIX))
    .some((entry) => activeLockArtifact(path.join(cwd, entry)));
}

function cleanupRegistryLockCandidates(currentCandidate) {
  for (const entry of fs.readdirSync(cwd)) {
    if (!entry.startsWith(REGISTRY_LOCK_CANDIDATE_PREFIX)) continue;
    const candidatePath = path.join(cwd, entry);
    if (candidatePath === currentCandidate) continue;
    activeLockArtifact(candidatePath);
  }
}

async function reapRegistryLock(lockPath, token, observed) {
  const claimPath = path.join(cwd, `${REGISTRY_LOCK_REAP_PREFIX}${token}`);
  try {
    fs.writeFileSync(claimPath, `${token}\n`, { flag: "wx", mode: 0o600 });
    await wait(REGISTRY_LOCK_POLL_MS * 2);
    if (registryReapClaims()[0] !== claimPath) return false;
    while (renewalActive()) await wait(REGISTRY_LOCK_POLL_MS);
    let current;
    try {
      current = readRegistryLock(lockPath);
    } catch (error) {
      if (["EAGAIN", "ENOENT"].includes(error?.code)) return false;
      throw error;
    }
    if (
      !sameFile(observed.stats, current.stats) ||
      current.owner?.token !== observed.owner?.token ||
      current.stats.mtimeMs !== observed.stats.mtimeMs
    ) {
      return false;
    }
    if (Date.now() - current.stats.mtimeMs < REGISTRY_LOCK_STALE_MS) return false;
    try {
      fs.rmSync(lockPath);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
    return true;
  } finally {
    fs.rmSync(claimPath, { force: true });
  }
}

function refreshRegistryLockLease(lock) {
  const observed = readRegistryLock(lock.lockPath);
  const guard = readRegistryLock(lock.renewPath);
  if (
    observed.owner?.token !== lock.token ||
    guard.owner?.token !== lock.token ||
    !sameFile(observed.stats, guard.stats)
  ) {
    throw new Error(`Registry lock ownership changed.`);
  }
  const descriptor = fs.openSync(lock.lockPath, "r");
  const now = new Date();
  try {
    if (!sameFile(observed.stats, fs.fstatSync(descriptor))) {
      throw new Error(`Registry lock changed before its heartbeat.`);
    }
    fs.futimesSync(descriptor, now, now);
  } finally {
    fs.closeSync(descriptor);
  }
}

function refreshActiveRegistryLockLease() {
  if (activeRegistryLock) refreshRegistryLockLease(activeRegistryLock);
}

function startRegistryLockHeartbeat(lock) {
  lock.renewPath = `${lock.lockPath}.renew-${lock.token}`;
  try {
    fs.linkSync(lock.lockPath, lock.renewPath);
    lock.heartbeat = new Worker(
      `const{workerData:w}=require("node:worker_threads"),f=require("node:fs"),d=f.openSync(w.path,"r");setInterval(()=>{const n=new Date,a=f.fstatSync(d);f.futimesSync(d,n,n);const b=f.lstatSync(w.path);if(a.dev!==b.dev||a.ino!==b.ino)throw 0},w.interval)`,
      {
        eval: true,
        workerData: { path: lock.renewPath, interval: REGISTRY_LOCK_HEARTBEAT_MS },
      },
    );
  } catch (error) {
    releaseRegistryLock(lock);
    throw error;
  }
  lock.heartbeat.on("error", (error) => (lock.heartbeatError = error));
  lock.heartbeat.unref();
  return lock;
}

async function acquireRegistryLock() {
  const lockPath = path.join(cwd, REGISTRY_LOCK_DIRECTORY);
  const token = crypto.randomUUID();
  const candidatePath = `${lockPath}.candidate-${token}`;
  const deadline = Date.now() + REGISTRY_LOCK_WAIT_MS;
  writeFileAtomic(
    candidatePath,
    `${JSON.stringify(
      {
        schemaVersion: REGISTRY_LOCK_SCHEMA_VERSION,
        pid: process.pid,
        token,
        createdAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
  );
  fs.chmodSync(candidatePath, 0o600);
  let candidateHeartbeatAt = Date.now();
  let staleOwner;
  try {
    while (true) {
      cleanupRegistryLockCandidates(candidatePath);
      if (Date.now() - candidateHeartbeatAt >= REGISTRY_LOCK_HEARTBEAT_MS) {
        const now = new Date();
        fs.utimesSync(candidatePath, now, now);
        candidateHeartbeatAt = now.getTime();
      }
      if (registryReapClaims().length) {
        if (Date.now() >= deadline) {
          throw new Error(`Registry lock wait exceeded ${REGISTRY_LOCK_WAIT_MS}ms.`);
        }
        await wait(REGISTRY_LOCK_POLL_MS);
        continue;
      }
      try {
        fs.linkSync(candidatePath, lockPath);
        if (registryReapClaims().length) {
          try {
            const acquired = readRegistryLock(lockPath);
            if (acquired.owner?.token === token) fs.rmSync(lockPath, { force: true });
          } catch (error) {
            if (!["EAGAIN", "ENOENT"].includes(error?.code)) throw error;
          }
          await wait(REGISTRY_LOCK_POLL_MS);
          continue;
        }
        return startRegistryLockHeartbeat({ lockPath, token });
      } catch (error) {
        if (error?.code !== "EEXIST") throw error;
      }

      let observed;
      try {
        observed = readRegistryLock(lockPath);
      } catch (error) {
        if (["EAGAIN", "ENOENT"].includes(error?.code)) continue;
        throw error;
      }
      if (observed.owner) {
        const leaseAge = Date.now() - observed.stats.mtimeMs;
        const leaseStale = leaseAge >= REGISTRY_LOCK_STALE_MS;
        if (leaseStale) {
          if (
            staleOwner?.token !== observed.owner.token ||
            staleOwner.mtimeMs !== observed.stats.mtimeMs
          ) {
            staleOwner = {
              token: observed.owner.token,
              mtimeMs: observed.stats.mtimeMs,
              observedAt: Date.now(),
            };
          } else if (Date.now() - staleOwner.observedAt >= REGISTRY_LOCK_RECLAIM_CONFIRM_MS) {
            if (await reapRegistryLock(lockPath, token, observed)) continue;
          }
        } else {
          staleOwner = null;
        }
      }
      if (Date.now() >= deadline) {
        const owner = observed.owner ? ` held by process ${observed.owner.pid}` : "";
        throw new Error(`Registry lock wait exceeded ${REGISTRY_LOCK_WAIT_MS}ms${owner}.`);
      }
      await wait(REGISTRY_LOCK_POLL_MS);
    }
  } finally {
    fs.rmSync(candidatePath, { force: true });
  }
}

function releaseRegistryLock(lock) {
  lock.heartbeat?.terminate();
  try {
    if (!fs.existsSync(lock.lockPath)) {
      if (lock.heartbeatError) throw lock.heartbeatError;
      return;
    }
    const observed = readRegistryLock(lock.lockPath);
    if (observed.owner?.token !== lock.token) {
      throw new Error(`Lock ownership changed before release.`);
    }
    fs.rmSync(lock.lockPath, { force: true });
    if (lock.heartbeatError) throw lock.heartbeatError;
  } finally {
    fs.rmSync(lock.renewPath, { force: true });
  }
}

function writeTransactionJournal(transactionRoot, journal) {
  writeFileAtomic(transactionJournalPath(transactionRoot), `${JSON.stringify(journal, null, 2)}\n`);
}

function backupPath(transactionRoot, snapshot) {
  if (!snapshot.backup || path.isAbsolute(snapshot.backup)) {
    throw new Error("Registry transaction journal contains an invalid backup path.");
  }
  const target = path.resolve(transactionRoot, snapshot.backup);
  if (!isWithin(transactionRoot, target)) {
    throw new Error("Registry transaction journal backup escapes its transaction directory.");
  }
  const stats = fs.lstatSync(target);
  if (!stats.isFile() || stats.isSymbolicLink()) {
    throw new Error("Registry transaction journal backup must be a regular file.");
  }
  return target;
}

function validateRecoveryJournal(transactionRoot, journal) {
  const config = readConfig(true);
  if (typeof config.components !== "string" || !config.components) {
    throw new Error("nerio.json must define a components directory before recovery.");
  }
  const expectedRoot = path.resolve(cwd, config.components);
  if (
    journal?.schemaVersion !== TRANSACTION_SCHEMA_VERSION ||
    !["committing", "committed"].includes(journal.phase) ||
    !Array.isArray(journal.snapshots) ||
    !journal.lockSnapshot
  ) {
    throw new Error(`Interrupted Registry transaction has an invalid journal: ${transactionRoot}`);
  }
  const targets = new Set();
  for (const snapshot of journal.snapshots) {
    if (
      snapshot.root !== expectedRoot ||
      typeof snapshot.target !== "string" ||
      !path.isAbsolute(snapshot.target) ||
      !isWithin(expectedRoot, snapshot.target) ||
      typeof snapshot.existed !== "boolean" ||
      (snapshot.mode !== null && typeof snapshot.mode !== "number") ||
      targets.has(snapshot.target)
    ) {
      throw new Error(
        `Interrupted Registry transaction target is outside the configured components directory: ${transactionRoot}`,
      );
    }
    targets.add(snapshot.target);
    if (
      !isWithin(canonicalPath(expectedRoot), canonicalPath(snapshot.target)) ||
      snapshot.target === statePath()
    ) {
      throw new Error(`Interrupted Registry transaction target is unsafe: ${snapshot.target}`);
    }
    assertNoSymlinks(
      expectedRoot,
      snapshot.target,
      `Interrupted Registry transaction target contains a symlink: ${snapshot.target}`,
    );
    if (snapshot.existed) {
      backupPath(transactionRoot, snapshot);
    } else if (snapshot.backup !== null) {
      throw new Error(`Interrupted Registry transaction has an invalid backup marker.`);
    }
  }
  if (
    journal.lockSnapshot.target !== statePath() ||
    typeof journal.lockSnapshot.existed !== "boolean" ||
    (journal.lockSnapshot.mode !== null && typeof journal.lockSnapshot.mode !== "number")
  ) {
    throw new Error(
      `Interrupted Registry transaction lock snapshot is invalid: ${transactionRoot}`,
    );
  }
  if (journal.lockSnapshot.existed) {
    backupPath(transactionRoot, journal.lockSnapshot);
  } else if (journal.lockSnapshot.backup !== null) {
    throw new Error(`Interrupted Registry transaction has an invalid lock backup marker.`);
  }
}

function restoreTransaction(transactionRoot, snapshots, lockSnapshot) {
  const errors = [];
  for (const snapshot of [...snapshots].reverse()) {
    refreshActiveRegistryLockLease();
    try {
      if (snapshot.existed) {
        writeFileAtomic(snapshot.target, fs.readFileSync(backupPath(transactionRoot, snapshot)));
        if (snapshot.mode !== null) fs.chmodSync(snapshot.target, snapshot.mode);
      } else {
        fs.rmSync(snapshot.target, { force: true });
        removeEmptyParents(snapshot.target, snapshot.root);
      }
    } catch (error) {
      errors.push(`${snapshot.target}: ${error.message}`);
    }
  }
  try {
    if (lockSnapshot.existed) {
      writeFileAtomic(
        lockSnapshot.target,
        fs.readFileSync(backupPath(transactionRoot, lockSnapshot)),
      );
      if (lockSnapshot.mode !== null) fs.chmodSync(lockSnapshot.target, lockSnapshot.mode);
    } else {
      fs.rmSync(lockSnapshot.target, { force: true });
    }
  } catch (error) {
    errors.push(`${lockSnapshot.target}: ${error.message}`);
  }
  if (errors.length) {
    throw new Error(`Registry transaction rollback failed:\n- ${errors.join("\n- ")}`);
  }
}

function recoverInterruptedTransactions() {
  const entries = fs
    .readdirSync(cwd, { withFileTypes: true })
    .filter((entry) => entry.name.startsWith(TRANSACTION_PREFIX))
    .sort((left, right) => left.name.localeCompare(right.name));
  for (const entry of entries) {
    refreshActiveRegistryLockLease();
    const transactionRoot = path.join(cwd, entry.name);
    if (!entry.isDirectory() || fs.lstatSync(transactionRoot).isSymbolicLink()) {
      throw new Error(`Reserved Registry transaction path is not a directory: ${transactionRoot}`);
    }
    const journalPath = transactionJournalPath(transactionRoot);
    if (!fs.existsSync(journalPath)) {
      fs.rmSync(transactionRoot, { recursive: true, force: true });
      continue;
    }
    const journalStats = fs.lstatSync(journalPath);
    if (!journalStats.isFile() || journalStats.isSymbolicLink()) {
      throw new Error(
        `Interrupted Registry transaction journal must be a regular file: ${journalPath}`,
      );
    }
    let journal;
    try {
      journal = JSON.parse(fs.readFileSync(journalPath, "utf8"));
    } catch {
      throw new Error(`Interrupted Registry transaction journal is not valid JSON: ${journalPath}`);
    }
    validateRecoveryJournal(transactionRoot, journal);
    if (journal.phase === "committing") {
      restoreTransaction(transactionRoot, journal.snapshots, journal.lockSnapshot);
      console.log(`Recovered interrupted Registry transaction ${entry.name}.`);
    }
    fs.rmSync(transactionRoot, { recursive: true, force: true });
  }
}

function applyTransaction(operations, nextState, expectedLockHash, validations = operations) {
  const lockTarget = statePath();
  try {
    if (fs.lstatSync(lockTarget).isSymbolicLink()) {
      throw new Error(`${STATE_FILENAME} must not be a symlink.`);
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  const uniqueTargets = new Set();
  for (const operation of operations) {
    if (uniqueTargets.has(operation.target)) {
      throw new Error(`Registry transaction contains duplicate target ${operation.target}.`);
    }
    uniqueTargets.add(operation.target);
  }
  for (const validation of validations) {
    refreshActiveRegistryLockLease();
    if (validation.root) {
      if (
        !isWithin(validation.root, validation.target) ||
        !isWithin(canonicalPath(validation.root), canonicalPath(validation.target))
      ) {
        throw new Error(`Registry target changed outside the components directory.`);
      }
      assertNoSymlinks(
        validation.root,
        validation.target,
        `Registry target became a symlink before commit.`,
      );
    }
    const exists = fs.existsSync(validation.target);
    const currentHash = exists ? hashContent(fs.readFileSync(validation.target)) : null;
    refreshActiveRegistryLockLease();
    if (
      validation.expectedExists !== undefined &&
      (exists !== validation.expectedExists ||
        (validation.expectedHash !== undefined && currentHash !== validation.expectedHash))
    ) {
      throw new Error(
        `Registry transaction stopped because ${path.relative(cwd, validation.target)} changed after planning.`,
      );
    }
  }
  const lockExistsBeforeStaging = fs.existsSync(lockTarget);
  const currentLockHash = lockExistsBeforeStaging ? hashContent(fs.readFileSync(lockTarget)) : null;
  if (currentLockHash !== expectedLockHash) {
    throw new Error(`${STATE_FILENAME} changed after planning; no source files were written.`);
  }

  const transactionRoot = fs.mkdtempSync(path.join(cwd, TRANSACTION_PREFIX));
  const stageRoot = path.join(transactionRoot, "stage");
  const backupRoot = path.join(transactionRoot, "backup");
  fs.mkdirSync(stageRoot);
  fs.mkdirSync(backupRoot);
  const snapshots = [];
  let lockSnapshot;
  let committed = 0;
  let preserveTransaction = false;

  try {
    for (const [index, operation] of operations.entries()) {
      refreshActiveRegistryLockLease();
      const existed = fs.existsSync(operation.target);
      const snapshot = {
        target: operation.target,
        root: operation.root,
        existed,
        backup: existed ? path.join("backup", String(index)) : null,
        mode: existed ? fs.statSync(operation.target).mode : null,
      };
      snapshots.push(snapshot);
      if (existed) {
        fs.writeFileSync(
          path.join(transactionRoot, snapshot.backup),
          fs.readFileSync(operation.target),
          {
            mode: snapshot.mode,
          },
        );
      }
      if (operation.type === "write") {
        fs.writeFileSync(path.join(stageRoot, String(index)), operation.content, { flag: "wx" });
      }
    }
    const lockExists = fs.existsSync(lockTarget);
    lockSnapshot = {
      target: lockTarget,
      existed: lockExists,
      backup: lockExists ? path.join("backup", "lock") : null,
      mode: lockExists ? fs.statSync(lockTarget).mode : null,
    };
    if (lockExists) {
      fs.writeFileSync(
        path.join(transactionRoot, lockSnapshot.backup),
        fs.readFileSync(lockTarget),
        {
          mode: lockSnapshot.mode,
        },
      );
    }
    const nextLock = `${JSON.stringify(nextState, null, 2)}\n`;
    fs.writeFileSync(path.join(stageRoot, "lock"), nextLock, { flag: "wx" });
    const journal = {
      schemaVersion: TRANSACTION_SCHEMA_VERSION,
      phase: "committing",
      snapshots,
      lockSnapshot,
    };
    writeTransactionJournal(transactionRoot, journal);
    pauseTransactionForFixture();
    injectFailure("after-staging");
    injectCrash("after-staging");

    for (const [index, operation] of operations.entries()) {
      refreshActiveRegistryLockLease();
      if (operation.type === "write") {
        writeFileAtomic(operation.target, fs.readFileSync(path.join(stageRoot, String(index))));
      } else if (operation.type === "delete" && fs.existsSync(operation.target)) {
        fs.rmSync(operation.target);
      }
      committed += 1;
      injectFailure("after-commit", committed);
      injectCrash("after-commit", committed);
    }

    injectFailure("before-lock-write");
    injectCrash("before-lock-write");
    if (process.env.NERIO_TEST_FAILURE === "during-lock-write") {
      const partial = path.join(transactionRoot, "partial-lock");
      fs.writeFileSync(partial, nextLock.slice(0, Math.max(1, Math.floor(nextLock.length / 2))));
      injectFailure("during-lock-write");
    }
    writeFileAtomic(lockTarget, fs.readFileSync(path.join(stageRoot, "lock")));
    writeTransactionJournal(transactionRoot, { ...journal, phase: "committed" });
    injectCrash("after-lock-write");
  } catch (error) {
    try {
      if (lockSnapshot) restoreTransaction(transactionRoot, snapshots, lockSnapshot);
    } catch (rollbackError) {
      preserveTransaction = true;
      throw new Error(
        `${error.message}\n${rollbackError.message}\nRecovery data remains in ${transactionRoot}.`,
      );
    }
    throw new Error(
      `${error.message}\nRegistry transaction rolled back without source or lock changes.`,
    );
  } finally {
    if (!preserveTransaction) fs.rmSync(transactionRoot, { recursive: true, force: true });
  }
}

function collectItems(manifest, name, collected = new Map()) {
  const item = manifest.items.find((entry) => entry.name === name);
  if (!item) {
    throw new Error(`Unknown registry item: ${name}`);
  }
  if (collected.has(name)) return collected;

  collected.set(name, item);
  for (const dependency of item.registryDependencies || []) {
    collectItems(manifest, dependency, collected);
  }
  return collected;
}

function statePath() {
  return path.join(cwd, STATE_FILENAME);
}

function hashContent(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function readState(required = false) {
  const target = statePath();
  if (!fs.existsSync(target)) {
    if (required) {
      throw new Error(
        `${STATE_FILENAME} not found. Re-run nerio add for matching source or reinstall before diffing or updating.`,
      );
    }
    return null;
  }

  let state;
  let raw;
  try {
    raw = fs.readFileSync(target, "utf8");
    state = JSON.parse(raw);
  } catch {
    throw new Error(`${STATE_FILENAME} is not valid JSON.`);
  }
  if (state.schemaVersion !== STATE_SCHEMA_VERSION) {
    throw new Error(
      `${STATE_FILENAME} uses unsupported schema ${state.schemaVersion || "unknown"}; expected ${STATE_SCHEMA_VERSION}. Reinstall source with a compatible CLI.`,
    );
  }
  if (
    !Array.isArray(state.requestedItems) ||
    !state.registry?.schemaVersion ||
    !state.registry?.version ||
    !state.registry?.sourceRevision ||
    !state.registry?.styleContractVersion ||
    !state.items ||
    !state.files ||
    Object.values(state.files).some(
      (file) =>
        !file.hash ||
        !file.role ||
        !file.source ||
        !Array.isArray(file.owners) ||
        file.owners.some((owner) => typeof owner !== "string" || !owner) ||
        new Set(file.owners).size !== file.owners.length ||
        (file.integrity !== undefined && !INTEGRITY_PATTERN.test(file.integrity)),
    )
  ) {
    throw new Error(
      `${STATE_FILENAME} is missing Registry, requestedItems, items, or file metadata.`,
    );
  }
  Object.defineProperty(state, LOCK_CONTENT_HASH, {
    value: hashContent(raw),
    enumerable: false,
  });
  return state;
}

function emptyState(manifest) {
  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    nerioVersion: cliPackage.version,
    registry: registryMetadata(manifest),
    requestedItems: [],
    items: {},
    files: {},
  };
}

function registryMetadata(manifest) {
  return {
    schemaVersion: manifest.schemaVersion,
    name: manifest.name,
    version: manifest.version,
    sourceRevision: manifest.sourceRevision,
    styleContractVersion: manifest.styleContractVersion,
  };
}

function relativeTarget(componentsRoot, target) {
  const relative = path.relative(cwd, resolveTarget(componentsRoot, target));
  const normalized = relative.toLowerCase();
  if (
    normalized === STATE_FILENAME ||
    normalized === "nerio.json" ||
    normalized === REGISTRY_LOCK_DIRECTORY ||
    normalized.startsWith(`${REGISTRY_LOCK_DIRECTORY}.`) ||
    normalized.split(path.sep).some((segment) => segment.startsWith(".nerio-transaction-"))
  ) {
    throw new Error(`Registry target uses a reserved Nerio path: ${target}`);
  }
  return relative;
}

function isTokenStylesTarget(target) {
  const segments = target.split(path.sep);
  return segments.at(-2) === "styles" && segments.at(-1) === "tokens.css";
}

function resolveInstalledTarget(componentsRoot, storedTarget) {
  const root = path.resolve(cwd, componentsRoot);
  const resolved = path.resolve(cwd, storedTarget);
  if (!isWithin(root, resolved) || !isWithin(canonicalPath(root), canonicalPath(resolved))) {
    throw new Error(
      `${STATE_FILENAME} path escapes the configured components directory: ${storedTarget}`,
    );
  }
  assertNoSymlinks(root, resolved, `${STATE_FILENAME} path contains a symlink: ${storedTarget}`);
  return resolved;
}

async function registryFiles(registry, items, componentsRoot) {
  const files = new Map();
  for (const item of items.values()) {
    for (const file of item.files) {
      const target = relativeTarget(componentsRoot, file.target);
      const content = await readText(resolveSource(registry, file.source));
      const hash = hashContent(content);
      const expectedHash = file.integrity?.match(INTEGRITY_PATTERN)?.[1];
      if (expectedHash && hash !== expectedHash) {
        throw new Error(
          `Registry integrity mismatch for ${item.name}:${file.target}; expected ${file.integrity}.`,
        );
      }
      const existing = files.get(target);
      if (
        existing &&
        (existing.content !== content ||
          existing.role !== file.role ||
          existing.source !== file.source ||
          existing.integrity !== (file.integrity || `sha256-${hash}`))
      ) {
        throw new Error(
          `Registry items ${existing.owners.join(", ")} and ${item.name} provide conflicting metadata or content for ${target}.`,
        );
      }
      if (existing) {
        if (existing.owners.includes(item.name)) {
          throw new Error(`Registry item ${item.name} provides duplicate target ${target}.`);
        }
        existing.owners.push(item.name);
      } else {
        files.set(target, {
          content,
          hash,
          integrity: file.integrity || `sha256-${hash}`,
          role: file.role,
          source: file.source,
          owners: [item.name],
        });
      }
    }
  }
  return files;
}

function itemMetadata(item, manifest) {
  return {
    registryVersion: manifest.version,
    sourceRevision: manifest.sourceRevision,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    files: item.files.map((file) => file.target),
  };
}

function classifyFile(localHash, baselineHash, upstreamHash, existsLocally, existsUpstream) {
  if (!existsUpstream) {
    return existsLocally && localHash !== baselineHash ? "removed, locally modified" : "removed";
  }
  if (!baselineHash) {
    if (!existsLocally) return "added";
    return localHash === upstreamHash ? "matches upstream" : "added, local file exists";
  }
  if (!existsLocally)
    return upstreamHash === baselineHash ? "locally removed" : "locally removed, upstream changed";
  if (localHash === baselineHash && upstreamHash === baselineHash) return "unchanged";
  if (localHash !== baselineHash && upstreamHash === baselineHash) return "locally modified";
  if (localHash === baselineHash && upstreamHash !== baselineHash) return "upstream changed";
  if (localHash === upstreamHash) return "matches upstream";
  return "locally modified, upstream changed";
}

function formatDrift(entries) {
  const order = [
    "locally modified, upstream changed",
    "locally removed, upstream changed",
    "added, local file exists",
    "upstream changed",
    "added",
    "removed, locally modified",
    "removed",
    "locally modified",
    "locally removed",
    "matches upstream",
    "unchanged",
  ];
  return [...entries].sort(
    (left, right) =>
      order.indexOf(left.status) - order.indexOf(right.status) ||
      left.target.localeCompare(right.target),
  );
}

async function init() {
  const target = path.join(cwd, "nerio.json");
  if (fs.existsSync(target)) {
    throw new Error("nerio.json already exists.");
  }

  const configuredRegistry = option("--registry") || DEFAULT_REGISTRY;
  if (isUrl(configuredRegistry)) assertRemoteProtocol(configuredRegistry);
  const config = {
    schemaVersion: "1.0.0",
    registry: configuredRegistry,
    components: option("--components") || defaultComponentsDirectory(),
  };
  fs.writeFileSync(target, `${JSON.stringify(config, null, 2)}\n`);
  console.log("Created nerio.json");
}

async function add(name) {
  if (!name || name.startsWith("--")) {
    throw new Error(
      "Usage: nerio add <component> [--registry <path-or-url>] [--dry-run] [--overwrite] [--allow-insecure-http]",
    );
  }

  const config = readConfig(true);
  if (!config.components || typeof config.components !== "string") {
    throw new Error("nerio.json must define a components directory.");
  }

  const registry = registryLocation(config);
  const manifest = await readManifest(registry);
  const items = collectItems(manifest, name);
  const upstreamFiles = await registryFiles(
    manifest.__registryLocation || registry,
    items,
    config.components,
  );
  const state = readState(false) || emptyState(manifest);
  const written = [];
  const skipped = [];
  const writes = [];
  const validations = [];
  const componentsRoot = path.resolve(cwd, config.components);

  for (const [relative, file] of upstreamFiles) {
    const target = path.resolve(cwd, relative);
    const existed = fs.existsSync(target);
    const existingHash = existed ? hashContent(fs.readFileSync(target)) : undefined;
    validations.push({
      target,
      root: componentsRoot,
      expectedExists: existed,
      expectedHash: existingHash,
    });
    if (hasFlag("--dry-run")) {
      written.push(relative);
      continue;
    }

    if (existed && !hasFlag("--overwrite")) {
      const content = fs.readFileSync(target, "utf8");
      const tracked = state.files[relative];
      if (content === file.content || isTokenStylesTarget(relative)) {
        skipped.push(relative);
      } else if (tracked && hashContent(content) !== tracked.hash) {
        throw new Error(
          `${relative} has local modifications. Keep them and use nerio diff/update, or re-run add with --overwrite to replace them intentionally.`,
        );
      } else {
        throw new Error(
          `${relative} already exists with different Registry content. Run nerio diff and nerio update instead of silently upgrading during add.`,
        );
      }
    } else {
      writes.push({
        type: "write",
        target,
        content: file.content,
        root: componentsRoot,
        expectedExists: existed,
        expectedHash: existingHash,
      });
      written.push(relative);
    }
  }

  const item = items.get(name);
  if (hasFlag("--dry-run")) {
    console.log(`Would add ${item.title}: ${written.length} files.`);
    for (const file of written) console.log(`- ${file}`);
  } else {
    const nextState = globalThis.structuredClone(state);
    nextState.registry = registryMetadata(manifest);
    nextState.nerioVersion = cliPackage.version;
    nextState.requestedItems = [...new Set([...nextState.requestedItems, name])].sort();
    for (const dependency of items.values()) {
      nextState.items[dependency.name] = itemMetadata(dependency, manifest);
    }
    for (const [relative, file] of upstreamFiles) {
      const previous = nextState.files[relative];
      nextState.files[relative] = {
        hash: written.includes(relative) ? file.hash : previous?.hash || file.hash,
        integrity: file.integrity,
        role: file.role,
        source: file.source,
        owners: [...new Set([...(previous?.owners || []), ...file.owners])].sort(),
      };
    }
    applyTransaction(writes, nextState, state[LOCK_CONTENT_HASH] ?? null, validations);
    console.log(
      `Added ${item.title}: ${written.length} files written, ${skipped.length} unchanged.`,
    );
    console.log(`Recorded exact source metadata in ${STATE_FILENAME}.`);
  }
  if (item.dependencies?.length) {
    console.log(`Package dependencies: ${item.dependencies.join(", ")}`);
  }
}

function collectStateItems(state, name, collected = new Set()) {
  const item = state.items[name];
  if (!item) return collected;
  if (collected.has(name)) return collected;
  collected.add(name);
  for (const dependency of item.registryDependencies || []) {
    collectStateItems(state, dependency, collected);
  }
  return collected;
}

async function createUpgradePlan(config, registry, manifest, state, name) {
  const selectedRoots = name ? [name] : state.requestedItems;
  if (!selectedRoots.length) {
    throw new Error(`No source items are recorded in ${STATE_FILENAME}.`);
  }
  for (const selected of selectedRoots) {
    if (!state.requestedItems.includes(selected)) {
      throw new Error(`${selected} is not recorded as a directly installed Registry item.`);
    }
  }

  const oldSelected = new Set();
  for (const selected of selectedRoots) collectStateItems(state, selected, oldSelected);

  const newItems = new Map();
  for (const selected of selectedRoots) collectItems(manifest, selected, newItems);
  const upstreamFiles = await registryFiles(
    manifest.__registryLocation || registry,
    newItems,
    config.components,
  );

  const desiredNames = new Set(newItems.keys());
  for (const requested of state.requestedItems) {
    if (!selectedRoots.includes(requested)) collectStateItems(state, requested, desiredNames);
  }

  const nextItems = {};
  for (const desired of desiredNames) {
    const upstreamItem = newItems.get(desired);
    if (upstreamItem) nextItems[desired] = itemMetadata(upstreamItem, manifest);
    else if (state.items[desired]) nextItems[desired] = state.items[desired];
  }

  const allTargets = new Set(upstreamFiles.keys());
  for (const [target, file] of Object.entries(state.files)) {
    if (file.owners.some((owner) => oldSelected.has(owner))) allTargets.add(target);
  }

  const entries = [];
  for (const target of allTargets) {
    const previous = state.files[target];
    const upstream = upstreamFiles.get(target);
    const retainedOwners = (previous?.owners || []).filter(
      (owner) => desiredNames.has(owner) && !newItems.has(owner),
    );
    const owners = [...new Set([...(upstream?.owners || []), ...retainedOwners])].sort();
    const existsUpstream = Boolean(upstream || owners.length);
    const baselineHash = previous?.hash;
    const upstreamHash = upstream?.hash || baselineHash;
    const absolute = resolveInstalledTarget(config.components, target);
    const existsLocally = fs.existsSync(absolute);
    const localHash = existsLocally ? hashContent(fs.readFileSync(absolute)) : undefined;
    entries.push({
      target,
      status: classifyFile(localHash, baselineHash, upstreamHash, existsLocally, existsUpstream),
      previous,
      upstream,
      owners,
      existsLocally,
      localHash,
    });
  }

  return { entries: formatDrift(entries), nextItems };
}

function printUpgradePlan(title, plan) {
  console.log(title);
  for (const entry of plan.entries) {
    console.log(`${entry.status}\t${entry.target}`);
  }
}

async function diff(name) {
  if (name?.startsWith("--")) {
    throw new Error(
      "Usage: nerio diff [component] [--registry <path-or-url>] [--allow-insecure-http]",
    );
  }
  const config = readConfig(true);
  const state = readState(true);
  const registry = registryLocation(config);
  const manifest = await readManifest(registry);
  const plan = await createUpgradePlan(config, registry, manifest, state, name);
  printUpgradePlan(
    `Source drift against Registry ${manifest.version} (${manifest.sourceRevision}):`,
    plan,
  );
}

function conflictStatus(status) {
  return [
    "locally modified, upstream changed",
    "locally removed, upstream changed",
    "removed, locally modified",
    "added, local file exists",
  ].includes(status);
}

async function update(name) {
  if (name?.startsWith("--")) {
    throw new Error(
      "Usage: nerio update [component] [--registry <path-or-url>] [--dry-run] [--force] [--allow-insecure-http]",
    );
  }
  const config = readConfig(true);
  const state = readState(true);
  const registry = registryLocation(config);
  const manifest = await readManifest(registry);
  const plan = await createUpgradePlan(config, registry, manifest, state, name);
  const conflicts = plan.entries.filter((entry) => conflictStatus(entry.status));
  printUpgradePlan(
    `${hasFlag("--dry-run") ? "Would update" : "Updating"} source from Registry ${manifest.version} (${manifest.sourceRevision}):`,
    plan,
  );

  if (hasFlag("--dry-run")) {
    if (conflicts.length) {
      console.log(
        `${conflicts.length} conflict(s) require local resolution or an intentional --force update.`,
      );
    }
    return;
  }
  if (conflicts.length && !hasFlag("--force")) {
    throw new Error(
      `Update stopped before writing because ${conflicts.length} locally modified file(s) also changed upstream. Review nerio diff and resolve them, or use --force intentionally.`,
    );
  }

  const nextState = globalThis.structuredClone(state);
  const operations = [];
  const validations = [];
  const componentsRoot = path.resolve(cwd, config.components);
  for (const entry of plan.entries) {
    const absolute = resolveInstalledTarget(config.components, entry.target);
    validations.push({
      target: absolute,
      root: componentsRoot,
      expectedExists: entry.existsLocally,
      expectedHash: entry.localHash,
    });
    if (!entry.upstream && !entry.owners.length) {
      if (
        entry.existsLocally &&
        (!entry.status.includes("locally modified") || hasFlag("--force"))
      ) {
        operations.push({
          type: "delete",
          target: absolute,
          root: componentsRoot,
          expectedExists: entry.existsLocally,
          expectedHash: entry.localHash,
        });
      }
      delete nextState.files[entry.target];
      continue;
    }

    const shouldWrite =
      entry.upstream &&
      (["added", "upstream changed"].includes(entry.status) ||
        (conflictStatus(entry.status) && hasFlag("--force")));
    if (shouldWrite) {
      operations.push({
        type: "write",
        target: absolute,
        content: entry.upstream.content,
        root: componentsRoot,
        expectedExists: entry.existsLocally,
        expectedHash: entry.localHash,
      });
    }

    const preserveBaseline = ["locally modified", "locally removed"].includes(entry.status);
    const metadata = {
      hash: preserveBaseline ? entry.previous?.hash : entry.upstream?.hash || entry.previous?.hash,
      integrity: preserveBaseline
        ? entry.previous?.integrity
        : entry.upstream?.integrity || entry.previous?.integrity,
      role: entry.upstream?.role || entry.previous?.role,
      source: entry.upstream?.source || entry.previous?.source,
    };
    if (!metadata.hash || !metadata.role || !metadata.source) {
      throw new Error(`Cannot record complete update metadata for ${entry.target}.`);
    }
    nextState.files[entry.target] = {
      ...metadata,
      integrity: metadata.integrity || `sha256-${metadata.hash}`,
      owners: entry.owners,
    };
  }

  nextState.items = plan.nextItems;
  nextState.registry = registryMetadata(manifest);
  nextState.nerioVersion = cliPackage.version;
  applyTransaction(operations, nextState, state[LOCK_CONTENT_HASH] ?? null, validations);
  console.log(`Updated source metadata in ${STATE_FILENAME}.`);
}

async function list() {
  const config = readConfig(false);
  const registry = registryLocation(config);
  const manifest = await readManifest(registry);

  for (const item of manifest.items) {
    console.log(`${item.name}\t${item.title}\t${item.category}`);
  }
}

function formatList(values) {
  return values?.length ? values.join(", ") : "none";
}

const SOURCE_STYLE_ALLOWLIST = new Set([
  "tokens.css",
  "tailwind.css",
  "motion.css",
  "spinner.css",
  "feedback.css",
  "progress.css",
  "select.css",
  "overlays.css",
]);

function listCssFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if ([".git", ".next", "dist", "build", "node_modules"].includes(entry.name)) continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listCssFiles(entryPath));
    else if (entry.isFile() && entry.name.endsWith(".css")) files.push(entryPath);
  }
  return files;
}

function cssImports(source) {
  return [...source.matchAll(/@import\s+(?:url\()?\s*["']([^"']+)["']/g)].map((match) => match[1]);
}

function isTailwindImport(value) {
  return value === "tailwindcss" || importsTailwindTheme(value) || importsTailwindUtilities(value);
}

function importsTailwindTheme(value) {
  return /^tailwindcss\/theme(?:\.css)?$/.test(value);
}

function importsTailwindUtilities(value) {
  return /^tailwindcss\/utilities(?:\.css)?$/.test(value);
}

function importsPreflight(value) {
  return value === "tailwindcss" || /^tailwindcss\/preflight(?:\.css)?$/.test(value);
}

function isWithin(directory, candidate) {
  const resolvedDirectory = path.resolve(directory);
  const resolvedCandidate = path.resolve(candidate);
  return (
    resolvedCandidate === resolvedDirectory ||
    resolvedCandidate.startsWith(`${resolvedDirectory}${path.sep}`)
  );
}

function resolveCssImport(stylesheet, specifier) {
  if (!specifier.startsWith(".")) return null;
  return path.resolve(path.dirname(stylesheet), specifier.split(/[?#]/, 1)[0]);
}

function collectTailwindSetupProblems(config) {
  const stylesheets = listCssFiles(cwd).map((file) => {
    const source = fs.readFileSync(file, "utf8");
    return { file, source, imports: cssImports(source) };
  });
  const problems = [];

  if (!stylesheets.length) {
    return [
      "Tailwind setup was not found. Add a Tailwind-processed stylesheet that imports the Nerio bridge.",
    ];
  }

  const importsTailwind = stylesheets.some((stylesheet) =>
    stylesheet.imports.some(isTailwindImport),
  );
  if (!importsTailwind) {
    problems.push(
      'No Tailwind import was found. Import "tailwindcss" or the Tailwind theme and utilities layers in the consumer stylesheet.',
    );
  }

  const importsPackageBridge = stylesheets.some((stylesheet) =>
    stylesheet.imports.includes("@nerio-ui/tokens/tailwind.css"),
  );
  const importsPackageStyles = stylesheets.some((stylesheet) =>
    stylesheet.imports.includes("@nerio-ui/ui/styles.css"),
  );
  const componentsRoot = path.resolve(cwd, config.components);
  const sourceStylesRoot = path.join(componentsRoot, "styles");
  const sourceTailwindBridge = path.join(sourceStylesRoot, "tailwind.css");
  const sourceTokens = path.join(sourceStylesRoot, "tokens.css");
  const sourceStyles = stylesheets.flatMap((stylesheet) =>
    stylesheet.imports.map((specifier) => ({
      stylesheet: stylesheet.file,
      specifier,
      target: resolveCssImport(stylesheet.file, specifier),
    })),
  );
  const importedLocalStyles = sourceStyles
    .map((entry) => entry.target)
    .filter((target) => target && target.endsWith(".css") && fs.existsSync(target));
  const referencesSourceBridge = sourceStyles.some(
    (entry) => entry.target === sourceTailwindBridge,
  );
  const referencesSourceTokens = sourceStyles.some((entry) => entry.target === sourceTokens);
  const importsSourceBridge = referencesSourceBridge && fs.existsSync(sourceTailwindBridge);
  const importsSourceTokens = referencesSourceTokens && fs.existsSync(sourceTokens);
  const usesPackageMode =
    importsPackageBridge ||
    importsPackageStyles ||
    stylesheets.some((stylesheet) => /@source\s+[^;]*@nerio-ui\/ui\/src/.test(stylesheet.source));
  const usesSourceMode =
    fs.existsSync(sourceStylesRoot) ||
    sourceStyles.some((entry) => entry.target && isWithin(sourceStylesRoot, entry.target));
  if (
    (importsPackageBridge || importsPackageStyles) &&
    (referencesSourceBridge || referencesSourceTokens)
  ) {
    problems.push(
      "Package and source-install styles are imported together. Choose one Nerio distribution mode so tokens and residual styles are not duplicated.",
    );
  }

  if (!importsPackageBridge && !importsSourceBridge) {
    problems.push(
      "Nerio Tailwind bridge is missing. Import @nerio-ui/tokens/tailwind.css for package mode or the copied styles/tailwind.css for source-install mode.",
    );
  }

  if (usesPackageMode) {
    if (!importsPackageBridge) {
      problems.push("Package mode must import @nerio-ui/tokens/tailwind.css.");
    }
    if (!importsPackageStyles) {
      problems.push(
        "Package mode must import @nerio-ui/ui/styles.css so documented residual and no-Preflight compatibility styles remain active.",
      );
    }
    if (
      !stylesheets.some((stylesheet) => /@source\s+[^;]*@nerio-ui\/ui\/src/.test(stylesheet.source))
    ) {
      problems.push(
        "Package mode must register @nerio-ui/ui/src with @source so Tailwind detects Nerio component utilities.",
      );
    }
  }

  if (usesSourceMode && !importsPackageBridge) {
    if (!importsSourceBridge) {
      problems.push("Source-install mode must import the copied styles/tailwind.css bridge.");
    }
    if (!importsSourceTokens) {
      problems.push("Source-install mode must import the copied styles/tokens.css variables.");
    }
  }

  const staleSourceStyles = sourceStyles.filter(
    (entry) =>
      entry.target &&
      isWithin(sourceStylesRoot, entry.target) &&
      !SOURCE_STYLE_ALLOWLIST.has(path.basename(entry.target)),
  );
  if (staleSourceStyles.length) {
    problems.push(
      `Source-install mode imports unsupported legacy component stylesheet(s): ${staleSourceStyles
        .map((entry) => path.relative(cwd, entry.target))
        .join(
          ", ",
        )}. Keep only the documented Tailwind bridge, token stylesheet, and residual shared styles.`,
    );
  }

  const omitsPreflight =
    importsTailwind &&
    !stylesheets.some((stylesheet) => stylesheet.imports.some(importsPreflight)) &&
    stylesheets.some((stylesheet) => stylesheet.imports.some(importsTailwindTheme)) &&
    stylesheets.some((stylesheet) => stylesheet.imports.some(importsTailwindUtilities));
  const hasScopedCompatibility = [
    ...stylesheets
      .filter((stylesheet) => stylesheet.imports.some(isTailwindImport))
      .map((stylesheet) => stylesheet.source),
    ...importedLocalStyles.map((stylesheet) => fs.readFileSync(stylesheet, "utf8")),
  ].some(
    (stylesheet) =>
      stylesheet.includes("box-sizing: border-box") && stylesheet.includes("font-family: inherit"),
  );
  if (omitsPreflight && !importsPackageStyles && !hasScopedCompatibility) {
    problems.push(
      "This no-Preflight setup is missing scoped Nerio compatibility styles. Import @nerio-ui/ui/styles.css in package mode or retain the documented box-sizing and native-control typography rules in source-install mode.",
    );
  }

  return problems;
}

function installedDependencyProblems(state) {
  const packagePath = path.join(cwd, "package.json");
  if (!fs.existsSync(packagePath)) {
    return {
      errors: [],
      warnings: ["package.json was not found, so required npm dependencies could not be verified."],
    };
  }

  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  } catch {
    return { errors: ["package.json is not valid JSON."], warnings: [] };
  }
  const declared = new Set([
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}),
    ...Object.keys(packageJson.peerDependencies || {}),
  ]);
  const required = new Set(Object.values(state.items).flatMap((item) => item.dependencies || []));
  const missing = [...required].filter((dependency) => !declared.has(dependency)).sort();
  return {
    errors: missing.length
      ? [
          `Required source dependencies are not declared: ${missing.join(", ")}. Add them to the consumer package before building.`,
        ]
      : [],
    warnings: [],
  };
}

function stateDiagnostics(config, manifest) {
  const target = statePath();
  const componentsRoot = path.resolve(cwd, config.components);
  if (!fs.existsSync(target)) {
    const hasInstalledSource =
      fs.existsSync(componentsRoot) &&
      fs.statSync(componentsRoot).isDirectory() &&
      fs.readdirSync(componentsRoot, { recursive: true }).some((entry) => {
        const candidate = path.join(componentsRoot, entry);
        return fs.existsSync(candidate) && fs.statSync(candidate).isFile();
      });
    return {
      state: null,
      errors: hasInstalledSource
        ? [
            `${STATE_FILENAME} is missing for installed source. Re-run nerio add for matching items to adopt unchanged files before updating.`,
          ]
        : [],
      warnings: [],
    };
  }

  const state = readState(true);
  const errors = [];
  const warnings = [];
  if (manifest.version !== cliPackage.version) {
    errors.push(
      `CLI ${cliPackage.version} and Registry ${manifest.version} do not match. Install coordinated @nerio-ui/cli and @nerio-ui/registry versions.`,
    );
  }
  if (state.registry.schemaVersion !== manifest.schemaVersion) {
    errors.push(
      `Installed Registry schema ${state.registry.schemaVersion} differs from configured schema ${manifest.schemaVersion}.`,
    );
  }
  if (state.registry.styleContractVersion !== manifest.styleContractVersion) {
    errors.push(
      `Installed style contract ${state.registry.styleContractVersion} is outdated; Registry requires ${manifest.styleContractVersion}. Run nerio update --dry-run.`,
    );
  }
  if (
    state.registry.version !== manifest.version ||
    state.registry.sourceRevision !== manifest.sourceRevision
  ) {
    warnings.push(
      `Installed source records Registry ${state.registry.version} (${state.registry.sourceRevision}); configured Registry is ${manifest.version} (${manifest.sourceRevision}). Run nerio diff.`,
    );
  }

  for (const [name, item] of Object.entries(state.items)) {
    for (const dependency of item.registryDependencies || []) {
      if (!state.items[dependency]) {
        errors.push(
          `Installed item ${name} is missing Registry dependency ${dependency}. Run nerio update ${name}.`,
        );
      }
    }
  }

  let modified = 0;
  let missing = 0;
  for (const [relative, file] of Object.entries(state.files)) {
    const absolute = resolveInstalledTarget(config.components, relative);
    if (!fs.existsSync(absolute)) {
      missing += 1;
      continue;
    }
    if (hashContent(fs.readFileSync(absolute)) !== file.hash) modified += 1;
  }
  if (modified) {
    warnings.push(
      `${modified} installed file(s) differ from their original hashes. Run nerio diff before updating.`,
    );
  }
  if (missing) {
    warnings.push(
      `${missing} recorded installed file(s) are missing locally. Run nerio diff before updating.`,
    );
  }

  const dependencies = installedDependencyProblems(state);
  errors.push(...dependencies.errors);
  warnings.push(...dependencies.warnings);
  return { state, errors, warnings };
}

async function info(name) {
  if (!name || name.startsWith("--")) {
    throw new Error("Usage: nerio info <component> [--registry <path-or-url>]");
  }

  const config = readConfig(false);
  const registry = registryLocation(config);
  const manifest = await readManifest(registry);
  const item = manifest.items.find((entry) => entry.name === name);
  if (!item) {
    throw new Error(`Unknown registry item: ${name}`);
  }

  console.log(`${item.title} (${item.name})`);
  console.log(`Description: ${item.description}`);
  console.log(`Category: ${item.category}`);
  console.log(`Dependencies: ${formatList(item.dependencies)}`);
  if (item.optionalPeerDependencies?.length) {
    console.log(`Optional peer dependencies: ${formatList(item.optionalPeerDependencies)}`);
  }
  if (item.docsPath) console.log(`Documentation: ${item.docsPath}`);
  console.log(`Registry dependencies: ${formatList(item.registryDependencies)}`);
  console.log(`Files: ${item.files.length} (${item.files.map((file) => file.target).join(", ")})`);
  console.log(`Variants: ${formatList(item.variants)}`);
  console.log(`Required tokens: ${formatList(item.requiredTokens)}`);
  console.log(`Accessibility: ${formatList(item.accessibility)}`);
  console.log("");
  console.log("Usage:");
  console.log(item.usage);
}

async function doctor() {
  const config = readConfig(true);
  if (!config.schemaVersion || !config.registry || !config.components) {
    throw new Error("nerio.json must define schemaVersion, registry, and components.");
  }
  if (!SUPPORTED_CONFIG_SCHEMAS.has(config.schemaVersion)) {
    throw new Error(
      `nerio.json schema ${config.schemaVersion} is incompatible with CLI ${cliPackage.version}; supported schemas are ${[...SUPPORTED_CONFIG_SCHEMAS].join(", ")}.`,
    );
  }

  const registry = registryLocation(config);
  const manifest = await readManifest(registry);
  const errors = [];
  const warnings = [];
  const componentsRoot = path.resolve(cwd, config.components);
  if (fs.existsSync(componentsRoot) && !fs.statSync(componentsRoot).isDirectory()) {
    errors.push(
      `Configured components path is not a directory: ${path.relative(cwd, componentsRoot)}`,
    );
  }
  if (config.schemaVersion === "0.1.0") {
    warnings.push(
      "nerio.json uses the supported legacy 0.1.0 schema. Change schemaVersion to 1.0.0 after adopting installed source metadata.",
    );
  }
  if (manifest.version !== cliPackage.version) {
    errors.push(
      `CLI ${cliPackage.version} and Registry ${manifest.version} do not match. Install coordinated @nerio-ui/cli and @nerio-ui/registry versions.`,
    );
  }
  for (const item of manifest.items) {
    if (
      !item.name ||
      !item.title ||
      !item.description ||
      !item.category ||
      !Array.isArray(item.files)
    ) {
      throw new Error(
        "Every registry item must define name, title, description, category, and files.",
      );
    }
    for (const field of [
      "dependencies",
      "registryDependencies",
      "baseUiPrimitives",
      "slots",
      "variants",
      "requiredTokens",
      "accessibility",
    ]) {
      if (!Array.isArray(item[field])) {
        throw new Error(`Registry item ${item.name} must define ${field} as an array.`);
      }
    }
    for (const file of item.files) {
      if (!file.source || !file.target || !file.role) {
        throw new Error(`Registry item ${item.name} contains an invalid file entry.`);
      }
      resolveTarget(config.components, file.target);
    }
  }

  const tailwindProblems = collectTailwindSetupProblems(config);
  errors.push(...tailwindProblems);
  const installed = stateDiagnostics(config, manifest);
  errors.push(...installed.errors);
  warnings.push(...installed.warnings);
  if (errors.length) {
    throw new Error(`Nerio configuration requires attention:\n- ${errors.join("\n- ")}`);
  }
  if (warnings.length) {
    console.log(`Nerio diagnostics:\n- ${warnings.join("\n- ")}`);
  }

  console.log(
    `Nerio configuration is valid. Registry ${manifest.name} ${manifest.version} (${manifest.sourceRevision}) exposes ${manifest.items.length} component(s).`,
  );
}

async function main() {
  if (hasFlag("--help") || hasFlag("-h")) {
    console.log(help(command));
    return;
  }
  const guardedCommand = ["init", "add", "diff", "update", "doctor"].includes(command);
  const recoveryCommand = ["add", "diff", "update", "doctor"].includes(command);
  const lock = guardedCommand ? await acquireRegistryLock() : null;
  activeRegistryLock = lock;
  let commandError;
  try {
    if (recoveryCommand) recoverInterruptedTransactions();

    if (command === "init") await init();
    else if (command === "add") await add(itemName);
    else if (command === "diff") await diff(itemName);
    else if (command === "update") await update(itemName);
    else if (command === "list") await list();
    else if (command === "info") await info(itemName);
    else if (command === "doctor") await doctor();
    else {
      console.log(help("root"));
      process.exitCode = command ? 1 : 0;
    }
  } catch (error) {
    commandError = error;
  }
  let releaseError;
  if (lock) {
    try {
      releaseRegistryLock(lock);
    } catch (error) {
      releaseError = error;
    }
  }
  activeRegistryLock = null;
  if (commandError && releaseError) {
    console.error(
      `Registry lock release also failed: ${
        releaseError instanceof Error ? releaseError.message : String(releaseError)
      }`,
    );
  }
  if (commandError) throw commandError;
  if (releaseError) throw releaseError;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
