const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");
const { setTimeout } = require("node:timers");
const { Worker } = require("node:worker_threads");

const STATE_SCHEMA_VERSION = "1.0.0";
const STATE_FILENAME = "nerio.lock.json";
const INTEGRITY_PATTERN = /^sha256-([a-f0-9]{64})$/;
const LOCK_CONTENT_HASH = Symbol("lock-content-hash");
const TRANSACTION_PREFIX = ".nerio-transaction-";
const TRANSACTION_SCHEMA_VERSION = "1.0.0";
const CONFIG_MIGRATION_ID = "config:0.1.0-to-1.0.0";
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

function createWorkspace({ cwd, cliPackage, readConfig, readText, resolveSource }) {
  let activeRegistryLock = null;

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
    writeFileAtomic(
      transactionJournalPath(transactionRoot),
      `${JSON.stringify(journal, null, 2)}\n`,
    );
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
    if (
      journal?.schemaVersion !== TRANSACTION_SCHEMA_VERSION ||
      !["committing", "committed"].includes(journal.phase) ||
      !Array.isArray(journal.snapshots)
    ) {
      throw new Error(
        `Interrupted Registry transaction has an invalid journal: ${transactionRoot}`,
      );
    }
    if (journal.migration !== undefined) {
      const configTarget = path.join(cwd, "nerio.json");
      if (
        journal.migration !== CONFIG_MIGRATION_ID ||
        journal.snapshots.length !== 0 ||
        journal.lockSnapshot?.target !== configTarget ||
        journal.lockSnapshot.existed !== true ||
        typeof journal.lockSnapshot.mode !== "number"
      ) {
        throw new Error(
          `Interrupted Registry transaction has an invalid journal: ${transactionRoot}`,
        );
      }
      const configStats = fs.lstatSync(configTarget);
      if (!configStats.isFile() || configStats.isSymbolicLink()) {
        throw new Error(`Interrupted Registry transaction target is unsafe: ${configTarget}`);
      }
      backupPath(transactionRoot, journal.lockSnapshot);
      return;
    }
    if (!journal.lockSnapshot) {
      throw new Error(
        `Interrupted Registry transaction has an invalid journal: ${transactionRoot}`,
      );
    }
    const config = readConfig(true);
    if (typeof config.components !== "string" || !config.components) {
      throw new Error("nerio.json must define a components directory before recovery.");
    }
    const expectedRoot = path.resolve(cwd, config.components);
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

  function recoverInterruptedTransactions(report = console.log) {
    const entries = fs
      .readdirSync(cwd, { withFileTypes: true })
      .filter((entry) => entry.name.startsWith(TRANSACTION_PREFIX))
      .sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      refreshActiveRegistryLockLease();
      const transactionRoot = path.join(cwd, entry.name);
      if (!entry.isDirectory() || fs.lstatSync(transactionRoot).isSymbolicLink()) {
        throw new Error(
          `Reserved Registry transaction path is not a directory: ${transactionRoot}`,
        );
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
        throw new Error(
          `Interrupted Registry transaction journal is not valid JSON: ${journalPath}`,
        );
      }
      validateRecoveryJournal(transactionRoot, journal);
      if (journal.phase === "committing") {
        restoreTransaction(transactionRoot, journal.snapshots, journal.lockSnapshot);
        report(
          `Recovered interrupted ${journal.migration ? "Nerio migration" : "Registry transaction"} ${entry.name}.`,
        );
      }
      fs.rmSync(transactionRoot, { recursive: true, force: true });
    }
  }

  function applyMigrationTransaction({ id, target, content, expectedHash }) {
    const configTarget = path.join(cwd, "nerio.json");
    if (id !== CONFIG_MIGRATION_ID || target !== configTarget) {
      throw new Error("Invalid migration.");
    }
    applyTransaction([], content, expectedHash, [], {
      migration: id,
      stateTarget: target,
    });
  }

  function applyTransaction(
    operations,
    nextState,
    expectedLockHash,
    validations = operations,
    journalMetadata = {},
  ) {
    const migration = Boolean(journalMetadata.migration);
    const lockTarget = journalMetadata.stateTarget || statePath();
    try {
      if (fs.lstatSync(lockTarget).isSymbolicLink()) {
        throw new Error(`${path.basename(lockTarget)} must not be a symlink.`);
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
    const currentLockHash = lockExistsBeforeStaging
      ? hashContent(fs.readFileSync(lockTarget))
      : null;
    if (currentLockHash !== expectedLockHash) {
      throw new Error(
        migration
          ? "nerio.json changed after planning; no files were written."
          : `${STATE_FILENAME} changed after planning; no source files were written.`,
      );
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
    let preserveConcurrentTarget = false;

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
      const nextLock = migration ? nextState : `${JSON.stringify(nextState, null, 2)}\n`;
      fs.writeFileSync(path.join(stageRoot, "lock"), nextLock, { flag: "wx" });
      const journal = {
        schemaVersion: TRANSACTION_SCHEMA_VERSION,
        ...(journalMetadata.migration ? { migration: journalMetadata.migration } : {}),
        phase: "committing",
        snapshots,
        lockSnapshot,
      };
      writeTransactionJournal(transactionRoot, journal);
      pauseTransactionForFixture();
      injectFailure("after-staging");
      injectCrash("after-staging");

      const lockHashBeforeCommit = fs.existsSync(lockTarget)
        ? hashContent(fs.readFileSync(lockTarget))
        : null;
      if (migration && lockHashBeforeCommit !== expectedLockHash) {
        preserveConcurrentTarget = true;
        throw new Error("nerio.json changed after planning; no files were written.");
      }

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
      if (migration) fs.chmodSync(lockTarget, lockSnapshot.mode);
      injectFailure("after-state-write");
      injectCrash("after-state-write");
      writeTransactionJournal(transactionRoot, { ...journal, phase: "committed" });
      injectCrash("after-lock-write");
    } catch (error) {
      try {
        if (lockSnapshot && !preserveConcurrentTarget) {
          restoreTransaction(transactionRoot, snapshots, lockSnapshot);
        }
      } catch (rollbackError) {
        preserveTransaction = true;
        throw new Error(
          `${error.message}\n${rollbackError.message}\nRecovery data remains in ${transactionRoot}.`,
        );
      }
      throw new Error(
        `${error.message}\n${
          migration
            ? preserveConcurrentTarget
              ? "Concurrent nerio.json change preserved."
              : "Migration rolled back."
            : "Registry transaction rolled back without source or lock changes."
        }`,
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
    const sources = new Map();
    for (const item of items.values()) {
      for (const file of item.files) {
        const target = relativeTarget(componentsRoot, file.target);
        const source = resolveSource(registry, file.source);
        const sourceKey =
          source && typeof source === "object"
            ? `${source.expectedId || ""}:${source.source}`
            : source;
        let resolved = sources.get(sourceKey);
        if (!resolved) {
          const content = await readText(source);
          resolved = { content, hash: hashContent(content) };
          sources.set(sourceKey, resolved);
        }
        const { content, hash } = resolved;
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
      return upstreamHash === baselineHash
        ? "locally removed"
        : "locally removed, upstream changed";
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

  function isWithin(directory, candidate) {
    const resolvedDirectory = path.resolve(directory);
    const resolvedCandidate = path.resolve(candidate);
    return (
      resolvedCandidate === resolvedDirectory ||
      resolvedCandidate.startsWith(`${resolvedDirectory}${path.sep}`)
    );
  }

  async function acquireCommandLock() {
    const lock = await acquireRegistryLock();
    activeRegistryLock = lock;
    return lock;
  }

  function releaseCommandLock(lock) {
    try {
      return releaseRegistryLock(lock);
    } finally {
      activeRegistryLock = null;
    }
  }

  return {
    STATE_FILENAME,
    LOCK_CONTENT_HASH,
    acquireCommandLock,
    releaseCommandLock,
    recoverInterruptedTransactions,
    applyMigrationTransaction,
    applyTransaction,
    collectItems,
    readState,
    emptyState,
    registryMetadata,
    registryFiles,
    itemMetadata,
    classifyFile,
    formatDrift,
    hashContent,
    isTokenStylesTarget,
    resolveInstalledTarget,
    statePath,
    resolveTarget,
    isWithin,
  };
}

module.exports = { createWorkspace };
