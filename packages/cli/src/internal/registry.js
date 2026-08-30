const fs = require("node:fs");
const path = require("node:path");
const { Buffer } = require("node:buffer");
const { clearTimeout, setTimeout } = require("node:timers");

const DEFAULT_REGISTRY = "@nerio-ui/registry/manifest.json";
const SUPPORTED_REGISTRY_SCHEMA_MAJOR = 1;
const REGISTRY_ROLES = new Set(["component", "style", "utility"]);
const REMOTE_MANIFEST_BYTES = 2 * 1024 * 1024;
const REMOTE_SOURCE_BYTES = 4 * 1024 * 1024;
const REMOTE_TIMEOUT_MS = 10_000;
const REMOTE_REDIRECT_LIMIT = 3;
const INTEGRITY_PATTERN = /^sha256-([a-f0-9]{64})$/;
const SCHEMA_VERSION_PATTERN = /^\d+\.\d+\.\d+$/;

function createRegistry({ cwd, cliPackage, option, hasFlag }) {
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

  function readConfig(required = false, includeSource = false) {
    const configPath = path.join(cwd, "nerio.json");
    if (!fs.existsSync(configPath)) {
      if (required) {
        throw new Error("nerio.json not found. Run nerio init first.");
      }
      return null;
    }

    try {
      const source = fs.readFileSync(configPath, "utf8");
      const config = JSON.parse(source);
      return includeSource ? [config, source] : config;
    } catch {
      throw new Error("nerio.json is not valid JSON.");
    }
  }

  function registryLocation(config) {
    return (
      option("--registry") || process.env.NERIO_REGISTRY || config?.registry || DEFAULT_REGISTRY
    );
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
      if (item.docsPath !== undefined && (typeof item.docsPath !== "string" || !item.docsPath)) {
        throw new Error(
          `Registry item ${item.name || "(unnamed)"} must define docsPath as a non-empty string when provided.`,
        );
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

  return {
    DEFAULT_REGISTRY,
    INTEGRITY_PATTERN,
    isUrl,
    assertRemoteProtocol,
    readConfig,
    registryLocation,
    readManifest,
    readText,
    resolveSource,
  };
}

module.exports = { createRegistry };
