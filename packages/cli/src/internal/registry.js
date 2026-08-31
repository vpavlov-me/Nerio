const fs = require("node:fs");
const path = require("node:path");
const { Buffer } = require("node:buffer");
const { clearTimeout, setTimeout } = require("node:timers");

const DEFAULT_REGISTRY = "@nerio-ui/registry/manifest.json";
const SUPPORTED_REGISTRY_SCHEMA_MAJORS = new Set([1, 2]);
const REGISTRY_ROLES = new Set(["component", "style", "utility"]);
const REMOTE_MANIFEST_BYTES = 2 * 1024 * 1024;
const REMOTE_SOURCE_BYTES = 4 * 1024 * 1024;
const REMOTE_TIMEOUT_MS = 10_000;
const REMOTE_REDIRECT_LIMIT = 3;
const REMOTE_REDIRECT_LOCATION_BYTES = 8 * 1024;
const INTEGRITY_PATTERN = /^sha256-([a-f0-9]{64})$/;
const SCHEMA_VERSION_PATTERN = /^\d+\.\d+\.\d+$/;
const NAMESPACE_PATTERN = /^[a-z](?:[a-z0-9]*)(?:-[a-z0-9]+)*$/;
const ITEM_NAME_PATTERN = /^[a-z](?:[a-z0-9]*)(?:-[a-z0-9]+)*$/;
const REGISTRY_ID_PATTERN =
  /^(?=.{3,128}$)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;
const ENVIRONMENT_PATTERN = /^[A-Z][A-Z0-9_]{0,63}$/;
const AUTH_VALUE_MIN_BYTES = 16;
const AUTH_VALUE_BYTES = 8 * 1024;
const AUTHORIZED_HEADER_NAMES = new Set(["authorization", "x-api-key"]);

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function createRegistry({ cwd, cliPackage, option, hasFlag }) {
  function locationSource(location) {
    return isObject(location) ? location.source : location;
  }

  function isUrl(value) {
    return typeof value === "string" && /^https?:\/\//i.test(value);
  }

  function safeLocation(location) {
    location = locationSource(location);
    if (!isUrl(location)) return location;
    const url = new URL(location);
    url.username = "";
    url.password = "";
    url.search = "";
    url.hash = "";
    return url.toString();
  }

  function assertRemoteProtocol(location) {
    location = locationSource(location);
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

  function assertAllowedKeys(value, allowed, label) {
    const unexpected = Object.keys(value).filter((key) => !allowed.has(key));
    if (unexpected.length) {
      throw new Error(`${label} contains unsupported field ${unexpected[0]}.`);
    }
  }

  function validateNamespace(alias, label = "Registry namespace") {
    if (
      typeof alias !== "string" ||
      alias.length > 32 ||
      !NAMESPACE_PATTERN.test(alias) ||
      alias === "default"
    ) {
      throw new Error(
        `${label} must be a lowercase ASCII alias of at most 32 characters and must not be default.`,
      );
    }
    return alias;
  }

  function validateRegistryId(registryId, label = "Registry ID") {
    if (typeof registryId !== "string" || !REGISTRY_ID_PATTERN.test(registryId)) {
      throw new Error(`${label} must be a 3-128 character lowercase reverse-domain identifier.`);
    }
    return registryId;
  }

  function validateItemName(itemName, label = "Registry item name") {
    if (typeof itemName !== "string" || !ITEM_NAME_PATTERN.test(itemName)) {
      throw new Error(`${label} must be a lowercase single-segment item name.`);
    }
    return itemName;
  }

  function validateAuth(auth, namespace, source) {
    if (!isObject(auth)) {
      throw new Error(`Registry namespace ${namespace} auth must be an object.`);
    }
    assertAllowedKeys(auth, new Set(["headers"]), `Registry namespace ${namespace} auth`);
    if (!Array.isArray(auth.headers) || auth.headers.length < 1 || auth.headers.length > 2) {
      throw new Error(`Registry namespace ${namespace} auth must define one or two headers.`);
    }
    if (!isUrl(source) || new URL(source).protocol !== "https:") {
      throw new Error(`Registry namespace ${namespace} authentication requires an HTTPS source.`);
    }
    const names = new Set();
    const headers = auth.headers.map((header) => {
      if (!isObject(header)) {
        throw new Error(`Registry namespace ${namespace} auth headers must be objects.`);
      }
      assertAllowedKeys(
        header,
        new Set(["name", "environment", "scheme"]),
        `Registry namespace ${namespace} auth header`,
      );
      const normalizedName = typeof header.name === "string" ? header.name.toLowerCase() : "";
      if (!AUTHORIZED_HEADER_NAMES.has(normalizedName) || names.has(normalizedName)) {
        throw new Error(
          `Registry namespace ${namespace} auth headers must use unique Authorization or X-API-Key names.`,
        );
      }
      names.add(normalizedName);
      if (!ENVIRONMENT_PATTERN.test(header.environment || "")) {
        throw new Error(
          `Registry namespace ${namespace} auth environment must use an uppercase environment variable name.`,
        );
      }
      if (
        (normalizedName === "authorization" && !["Bearer", "Basic"].includes(header.scheme)) ||
        (normalizedName === "x-api-key" && header.scheme !== undefined)
      ) {
        throw new Error(
          `Registry namespace ${namespace} auth scheme is invalid for ${header.name}.`,
        );
      }
      return {
        name: normalizedName === "authorization" ? "Authorization" : "X-API-Key",
        environment: header.environment,
        ...(header.scheme ? { scheme: header.scheme } : {}),
      };
    });
    return { headers };
  }

  function validateRegistryEntry(entry, namespace, { defaultEntry = false } = {}) {
    if (!isObject(entry)) {
      throw new Error(`Registry namespace ${namespace} must be an object.`);
    }
    assertAllowedKeys(
      entry,
      new Set(
        defaultEntry ? ["alias", "source", "expectedId", "auth"] : ["source", "expectedId", "auth"],
      ),
      `Registry namespace ${namespace}`,
    );
    if (typeof entry.source !== "string" || !entry.source) {
      throw new Error(`Registry namespace ${namespace} must define a source.`);
    }
    validateRegistryId(entry.expectedId, `Registry namespace ${namespace} expectedId`);
    if (isUrl(entry.source)) {
      const url = new URL(entry.source);
      if (url.username || url.password || url.search || url.hash) {
        throw new Error(
          `Registry namespace ${namespace} URL must not contain credentials, a query, or a fragment: ${safeLocation(entry.source)}`,
        );
      }
      assertRemoteProtocol(entry.source);
    } else if (/^[a-z][a-z0-9+.-]*:/i.test(entry.source)) {
      throw new Error(`Registry namespace ${namespace} source uses an unsupported URL protocol.`);
    } else if (path.isAbsolute(entry.source)) {
      throw new Error(`Registry namespace ${namespace} local source must be project-relative.`);
    }
    const auth =
      entry.auth !== undefined ? validateAuth(entry.auth, namespace, entry.source) : undefined;
    return {
      source: entry.source,
      expectedId: entry.expectedId,
      namespace,
      schemaVersion: "2.0.0",
      ...(auth ? { auth } : {}),
    };
  }

  function schemaTwoRegistries(config) {
    if (!isObject(config.registry) || !isObject(config.registries)) {
      throw new Error("nerio.json schema 2.0.0 must define registry and registries objects.");
    }
    const entries = [];
    const aliases = new Set(["default"]);
    const defaultAlias = config.registry.alias;
    if (defaultAlias !== undefined) {
      validateNamespace(defaultAlias, "Default Registry alias");
      aliases.add(defaultAlias);
    }
    const defaultRegistry = validateRegistryEntry(config.registry, "default", {
      defaultEntry: true,
    });
    entries.push({
      ...defaultRegistry,
      ...(defaultAlias ? { alias: defaultAlias } : {}),
    });
    for (const [alias, entry] of Object.entries(config.registries)) {
      validateNamespace(alias);
      if (aliases.has(alias)) {
        throw new Error(`Registry namespace ${alias} is configured more than once.`);
      }
      aliases.add(alias);
      entries.push(validateRegistryEntry(entry, alias));
    }
    const ids = new Set();
    for (const entry of entries) {
      if (ids.has(entry.expectedId)) {
        throw new Error(`Registry ID ${entry.expectedId} is configured more than once.`);
      }
      ids.add(entry.expectedId);
    }
    return entries;
  }

  function resolveAuth(location) {
    if (!location.auth) return { credentials: [], headers: {} };
    const credentials = [];
    const headers = {};
    for (const header of location.auth.headers) {
      const value = process.env[header.environment];
      if (value === undefined || value === "") {
        throw new Error(
          `Registry namespace ${location.namespace} requires environment variable ${header.environment}.`,
        );
      }
      const hasInvalidCharacters = [...value].some((character) => {
        const codePoint = character.codePointAt(0);
        return codePoint < 32 || codePoint > 126;
      });
      if (
        Buffer.byteLength(value) < AUTH_VALUE_MIN_BYTES ||
        Buffer.byteLength(value) > AUTH_VALUE_BYTES ||
        hasInvalidCharacters ||
        /\s/.test(value)
      ) {
        throw new Error(
          `Registry namespace ${location.namespace} environment variable ${header.environment} contains an invalid credential value.`,
        );
      }
      credentials.push(value);
      headers[header.name] = header.scheme ? `${header.scheme} ${value}` : value;
    }
    return { credentials, headers };
  }

  function containsCredential(value, credentials) {
    if (typeof value === "string") {
      return credentials.some((credential) => value.includes(credential));
    }
    if (Array.isArray(value)) {
      return value.some((entry) => containsCredential(entry, credentials));
    }
    if (isObject(value)) {
      return Object.entries(value).some(
        ([key, entry]) =>
          containsCredential(key, credentials) || containsCredential(entry, credentials),
      );
    }
    return false;
  }

  function encodedValueContainsCredential(value, credentials) {
    if (Array.isArray(value)) {
      return value.some((entry) => encodedValueContainsCredential(entry, credentials));
    }
    if (isObject(value)) {
      return Object.entries(value).some(
        ([key, entry]) =>
          encodedValueContainsCredential(key, credentials) ||
          encodedValueContainsCredential(entry, credentials),
      );
    }
    if (typeof value !== "string") return false;
    let candidate = value;
    while (true) {
      if (containsCredential(candidate, credentials)) return true;
      const collapsed = candidate.replace(/%(?:25)+(?=[a-f0-9]{2})/gi, "%");
      if (collapsed !== candidate && containsCredential(collapsed, credentials)) return true;
      const decoded = collapsed.replace(/%([a-f0-9]{2})/gi, (encoded, hex) => {
        const byte = Number.parseInt(hex, 16);
        return byte <= 127 ? String.fromCharCode(byte) : encoded;
      });
      if (decoded === candidate) return false;
      candidate = decoded;
    }
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
    const descriptor = isObject(location) ? location : null;
    const auth = resolveAuth(descriptor || {});
    let current = locationSource(location);
    const authenticatedOrigin = descriptor?.auth
      ? descriptor.configuredOrigin || new URL(current).origin
      : null;
    if (authenticatedOrigin && encodedValueContainsCredential(current, auth.credentials)) {
      throw new Error(
        `Authenticated Registry namespace ${descriptor.namespace} source contained a credential value.`,
      );
    }
    for (let redirects = 0; redirects <= REMOTE_REDIRECT_LIMIT; redirects += 1) {
      assertRemoteProtocol(current);
      if (authenticatedOrigin && new URL(current).origin !== authenticatedOrigin) {
        throw new Error(
          `Authenticated Registry namespace ${descriptor.namespace} must stay on origin ${authenticatedOrigin}.`,
        );
      }
      const requestHeaders = {
        accept: kind === "manifest" ? "application/json" : "text/plain, */*;q=0.1",
        ...auth.headers,
      };
      const controller = new globalThis.AbortController();
      const timeoutMs = remoteTimeoutMs();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      let response;
      try {
        response = await fetch(current, {
          redirect: "manual",
          signal: controller.signal,
          headers: requestHeaders,
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
        await response.body?.cancel();
        if (!next) {
          throw new Error(
            `Registry ${kind} redirect is missing a Location header: ${safeLocation(current)}`,
          );
        }
        if (Buffer.byteLength(next) > REMOTE_REDIRECT_LOCATION_BYTES) {
          throw new Error(
            `Registry ${kind} redirect Location exceeds the ${REMOTE_REDIRECT_LOCATION_BYTES}-byte limit.`,
          );
        }
        const redirected = new URL(next, current).toString();
        if (encodedValueContainsCredential(redirected, auth.credentials)) {
          throw new Error(
            `Authenticated Registry namespace ${descriptor.namespace} redirect contained a credential value.`,
          );
        }
        if (authenticatedOrigin && new URL(redirected).origin !== authenticatedOrigin) {
          throw new Error(
            `Authenticated Registry namespace ${descriptor.namespace} redirect changed origin from ${authenticatedOrigin}.`,
          );
        }
        current = redirected;
        continue;
      }
      if (!response.ok) {
        await response.body?.cancel();
        if (descriptor?.auth && [401, 403].includes(response.status)) {
          throw new Error(
            `Registry namespace ${descriptor.namespace} request failed (${response.status}) at ${authenticatedOrigin}.`,
          );
        }
        throw new Error(
          `Registry ${kind} request failed (${response.status}): ${safeLocation(current)}`,
        );
      }

      const contentType = response.headers.get("content-type") || "";
      if (!validContentType(contentType, kind)) {
        await response.body?.cancel();
        const contentTypeLabel = descriptor?.auth ? "(redacted)" : contentType || "(missing)";
        throw new Error(
          `Registry ${kind} returned unsupported content type ${contentTypeLabel}: ${safeLocation(current)}`,
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
      const text = Buffer.concat(chunks, received).toString("utf8");
      if (encodedValueContainsCredential(text, auth.credentials)) {
        throw new Error(
          `Authenticated Registry namespace ${descriptor.namespace} response contained a credential value.`,
        );
      }
      return { text, location: current, credentials: auth.credentials };
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
    if (hasFlag("--namespace")) {
      throw new Error(
        "--namespace requires namespaced graph and lock support and is not available yet.",
      );
    }
    if (config?.schemaVersion === "2.0.0") {
      if (hasFlag("--registry") || process.env.NERIO_REGISTRY) {
        throw new Error(
          "--registry and NERIO_REGISTRY are supported only by single-Registry schema 1 projects.",
        );
      }
      return schemaTwoRegistries(config)[0];
    }
    if (config?.registry !== undefined && typeof config.registry !== "string") {
      throw new Error(
        `nerio.json schema ${config?.schemaVersion || "unknown"} registry must be a string. Object Registry entries require schema 2.0.0.`,
      );
    }
    return (
      option("--registry") || process.env.NERIO_REGISTRY || config?.registry || DEFAULT_REGISTRY
    );
  }

  function resolvedLocation(location) {
    const descriptor = isObject(location) ? location : null;
    const source = locationSource(location);
    if (source === DEFAULT_REGISTRY) {
      return require.resolve(DEFAULT_REGISTRY);
    }
    if (
      descriptor?.schemaVersion === "2.0.0" &&
      !isUrl(source) &&
      !source.startsWith(".") &&
      !fs.existsSync(path.resolve(cwd, source))
    ) {
      try {
        return require.resolve(source, { paths: [cwd] });
      } catch {
        // Preserve the configured source so the existing bounded file error path reports it.
      }
    }
    return source;
  }

  async function readTextResult(location, kind = "source") {
    const resolved = resolvedLocation(location);
    if (isUrl(resolved)) {
      const remoteLocation = isObject(location) ? { ...location, source: resolved } : resolved;
      return readRemoteText(remoteLocation, {
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
      if (encodedValueContainsCredential(manifest, manifestResult.credentials || [])) {
        throw new Error(
          `Authenticated Registry namespace ${location.namespace} manifest contained a credential value.`,
        );
      }
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
    if (schemaMajor > Math.max(...SUPPORTED_REGISTRY_SCHEMA_MAJORS)) {
      throw new Error(
        `Registry schema ${manifest.schemaVersion} is newer than this CLI supports. Upgrade @nerio-ui/cli before continuing.`,
      );
    }
    if (!SUPPORTED_REGISTRY_SCHEMA_MAJORS.has(schemaMajor)) {
      throw new Error(
        `Registry schema ${manifest.schemaVersion} is no longer supported. Use a Registry compatible with CLI ${cliPackage.version}.`,
      );
    }
    const descriptor = isObject(location) ? location : null;
    if (descriptor?.schemaVersion === "2.0.0" && schemaMajor !== 2) {
      throw new Error(
        `Registry namespace ${descriptor.namespace} must provide manifest schema 2.0.0 with stable identity.`,
      );
    }
    if (schemaMajor === 2) {
      validateRegistryId(manifest.registryId, "Registry manifest registryId");
      if (!descriptor?.expectedId) {
        throw new Error(
          "Registry manifest schema 2 requires an expectedId from nerio.json schema 2.0.0.",
        );
      }
      if (manifest.registryId !== descriptor.expectedId) {
        throw new Error(
          `Registry namespace ${descriptor.namespace} expected ID ${descriptor.expectedId} but received ${manifest.registryId}.`,
        );
      }
    }
    validateManifest(manifest, {
      authenticatedOrigin: descriptor?.auth ? new URL(locationSource(location)).origin : undefined,
      requireIntegrity: schemaMajor === 2 || isUrl(resolvedLocation(location)),
      registryLocation: manifestResult.location,
      schemaMajor,
    });
    const manifestLocation = descriptor
      ? {
          ...descriptor,
          source: manifestResult.location,
          ...(descriptor.auth
            ? { configuredOrigin: new URL(locationSource(location)).origin }
            : {}),
        }
      : manifestResult.location;
    Object.defineProperty(manifest, "__registryLocation", {
      value: manifestLocation,
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

  function validateRegistryDependencies(item, schemaMajor, currentRegistryId) {
    if (!Array.isArray(item.registryDependencies)) {
      throw new Error(
        `Registry item ${item.name || "(unnamed)"} must define registryDependencies as an array.`,
      );
    }
    const keys = new Set();
    for (const dependency of item.registryDependencies) {
      let key;
      if (typeof dependency === "string" && dependency) {
        key = `local:${dependency}`;
      } else if (schemaMajor === 2 && isObject(dependency)) {
        assertAllowedKeys(
          dependency,
          new Set(["registryId", "item"]),
          `Registry item ${item.name || "(unnamed)"} dependency`,
        );
        validateRegistryId(
          dependency.registryId,
          `Registry item ${item.name || "(unnamed)"} dependency registryId`,
        );
        validateItemName(
          dependency.item,
          `Registry item ${item.name || "(unnamed)"} dependency item`,
        );
        if (dependency.registryId === currentRegistryId) {
          throw new Error(
            `Registry item ${item.name || "(unnamed)"} must use a string for same-Registry dependency ${dependency.item || "(unnamed)"}.`,
          );
        }
        key = `remote:${dependency.registryId}:${dependency.item}`;
      } else {
        throw new Error(
          `Registry item ${item.name || "(unnamed)"} contains an invalid registry dependency.`,
        );
      }
      if (keys.has(key)) {
        throw new Error(
          `Registry item ${item.name || "(unnamed)"} must define registryDependencies as unique entries.`,
        );
      }
      keys.add(key);
    }
  }

  function validateManifest(
    manifest,
    { authenticatedOrigin, requireIntegrity = false, registryLocation, schemaMajor = 1 } = {},
  ) {
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
      if (schemaMajor === 2) validateItemName(item.name);
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
        "baseUiPrimitives",
        "slots",
        "variants",
        "requiredTokens",
        "accessibility",
      ]) {
        validateStringArray(item, field);
      }
      validateRegistryDependencies(item, schemaMajor, manifest.registryId);
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
          if (authenticatedOrigin && new URL(sourceLocation).origin !== authenticatedOrigin) {
            throw new Error(
              `Registry item ${item.name} authenticated source must stay on origin ${authenticatedOrigin}.`,
            );
          }
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
        if (typeof dependency === "string" && !names.has(dependency)) {
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
      for (const dependency of item.registryDependencies) {
        if (typeof dependency === "string") visit(dependency);
      }
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
      if (isObject(registry)) return { ...registry, source: location };
      return location;
    }
    return path.resolve(path.dirname(path.resolve(cwd, resolved)), source);
  }

  return {
    DEFAULT_REGISTRY,
    INTEGRITY_PATTERN,
    isUrl,
    assertRemoteProtocol,
    validateNamespace,
    validateRegistryId,
    schemaTwoRegistries,
    readConfig,
    registryLocation,
    readManifest,
    readText,
    resolveSource,
  };
}

module.exports = { createRegistry };
