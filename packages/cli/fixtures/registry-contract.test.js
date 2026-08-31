const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const { createDiscoveryCommand } = require("../src/internal/discovery");
const { createRegistry } = require("../src/internal/registry");

const registryId = "com.acme.design-system";
const source = "export const button = true;\n";
const integrity = `sha256-${crypto.createHash("sha256").update(source).digest("hex")}`;

function registryServices(
  cwd,
  { registryFlag = false, registryOverride, allowInsecureHttp = false } = {},
) {
  return createRegistry({
    cwd,
    cliPackage: { version: "1.0.0-test" },
    option: (name) => (name === "--registry" ? registryOverride : undefined),
    hasFlag: (name) =>
      (name === "--allow-insecure-http" && allowInsecureHttp) ||
      (name === "--registry" && (registryFlag || registryOverride !== undefined)),
  });
}

function config(entry = {}, registries = {}) {
  return {
    schemaVersion: "2.0.0",
    registry: {
      alias: "acme",
      source: "https://registry.acme.test/manifest.json",
      expectedId: registryId,
      ...entry,
    },
    registries,
    components: "components/nerio",
  };
}

function item(registryDependencies = []) {
  return {
    name: "button",
    title: "Button",
    description: "Schema 2 fixture.",
    category: "actions",
    dependencies: ["react"],
    registryDependencies,
    files: [
      {
        source: "./button.ts",
        target: "components/button.ts",
        role: "component",
        integrity,
      },
    ],
    baseUiPrimitives: [],
    slots: [],
    variants: [],
    requiredTokens: [],
    accessibility: [],
    usage: "import { button } from './button';",
  };
}

function manifest(overrides = {}) {
  return {
    schemaVersion: "2.0.0",
    registryId,
    name: "acme-registry",
    version: "1.0.0",
    sourceRevision: "fixture",
    styleContractVersion: "tailwind-v1",
    items: [item([{ registryId: "com.acme.icons", item: "icon" }])],
    ...overrides,
  };
}

function jsonResponse(value, init = {}) {
  return new globalThis.Response(JSON.stringify(value), {
    status: init.status || 200,
    headers: { "content-type": "application/json", ...init.headers },
  });
}

test("schema 2 config produces one canonical default Registry entry", () => {
  const { registryLocation, schemaTwoRegistries } = registryServices(process.cwd());
  const current = config(
    {},
    {
      icons: {
        source: "./fixtures/icons.json",
        expectedId: "com.acme.icons",
      },
    },
  );
  assert.deepEqual(registryLocation(current), {
    source: "https://registry.acme.test/manifest.json",
    expectedId: registryId,
    namespace: "default",
    schemaVersion: "2.0.0",
    alias: "acme",
  });
  assert.deepEqual(
    schemaTwoRegistries(current).map(({ namespace, expectedId }) => ({ namespace, expectedId })),
    [
      { namespace: "default", expectedId: registryId },
      { namespace: "icons", expectedId: "com.acme.icons" },
    ],
  );
});

test("schema 2 rejects ambiguous aliases, identities, sources, and auth definitions", () => {
  const services = registryServices(process.cwd());
  const cases = [
    [config({ alias: "default" }), /must not be default/],
    [config({ alias: "ACME" }), /lowercase ASCII alias/],
    [
      config({}, { acme: { source: "./other.json", expectedId: "com.acme.other" } }),
      /configured more than once/,
    ],
    [
      config({}, { icons: { source: "./other.json", expectedId: registryId } }),
      /configured more than once/,
    ],
    [config({ source: "/absolute/manifest.json" }), /project-relative/],
    [config({ source: "file:///tmp/manifest.json" }), /unsupported URL protocol/],
    [
      config({ source: "https://registry.acme.test/manifest.json?token=secret" }),
      /query, or a fragment/,
    ],
    [
      config({
        auth: {
          headers: [{ name: "Cookie", environment: "ACME_TOKEN" }],
        },
      }),
      /Authorization or X-API-Key/,
    ],
    [
      config({
        auth: {
          headers: [
            {
              name: "Authorization",
              environment: "ACME_TOKEN",
              scheme: "Digest",
            },
          ],
        },
      }),
      /scheme is invalid/,
    ],
    [
      config({
        source: "./manifest.json",
        auth: {
          headers: [{ name: "X-API-Key", environment: "ACME_TOKEN" }],
        },
      }),
      /requires an HTTPS source/,
    ],
    [
      config({
        auth: {
          headers: [{ name: "X-API-Key", environment: "ACME_TOKEN", value: "inline" }],
        },
      }),
      /unsupported field value/,
    ],
    [config({ auth: null }), /auth must be an object/],
    [
      {
        schemaVersion: "2.0.1",
        registry: {
          source: "https://registry.acme.test/manifest.json",
          auth: { headers: [{ name: "Cookie", environment: "ACME_TOKEN" }] },
        },
      },
      /registry must be a string.*require schema 2\.0\.0/,
    ],
  ];
  for (const [current, expected] of cases) {
    assert.throws(() => services.registryLocation(current), expected);
  }

  assert.throws(
    () =>
      registryServices(process.cwd(), { registryOverride: "./override.json" }).registryLocation(
        config(),
      ),
    /supported only by single-Registry schema 1 projects/,
  );
  assert.throws(
    () => registryServices(process.cwd(), { registryFlag: true }).registryLocation(config()),
    /supported only by single-Registry schema 1 projects/,
  );
});

test("schema 2 manifests require configured stable identity and integrity", async (context) => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nerio-registry-schema-two-"));
  context.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  const manifestPath = path.join(cwd, "manifest.json");
  const current = config({ source: "./manifest.json" });
  const services = registryServices(cwd);

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest())}\n`);
  const loaded = await services.readManifest(services.registryLocation(current));
  assert.equal(loaded.registryId, registryId);
  assert.deepEqual(loaded.items[0].registryDependencies, [
    { registryId: "com.acme.icons", item: "icon" },
  ]);

  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(manifest({ registryId: "com.evil.registry" }))}\n`,
  );
  await assert.rejects(
    services.readManifest(services.registryLocation(current)),
    /expected ID com\.acme\.design-system but received com\.evil\.registry/,
  );

  const missingIntegrity = manifest();
  delete missingIntegrity.items[0].files[0].integrity;
  fs.writeFileSync(manifestPath, `${JSON.stringify(missingIntegrity)}\n`);
  await assert.rejects(
    services.readManifest(services.registryLocation(current)),
    /must define sha256-<64 lowercase hex> integrity/,
  );

  const sameRegistryObjectDependency = manifest();
  sameRegistryObjectDependency.items[0].registryDependencies = [{ registryId, item: "missing" }];
  fs.writeFileSync(manifestPath, `${JSON.stringify(sameRegistryObjectDependency)}\n`);
  await assert.rejects(
    services.readManifest(services.registryLocation(current)),
    /must use a string for same-Registry dependency missing/,
  );

  const invalidItemName = manifest();
  invalidItemName.items[0].name = "Button/Thing";
  fs.writeFileSync(manifestPath, `${JSON.stringify(invalidItemName)}\n`);
  await assert.rejects(
    services.readManifest(services.registryLocation(current)),
    /Registry item name must be a lowercase single-segment item name/,
  );

  for (const invalidDependencyItem of ["Icon/Thing", "@bad"]) {
    const invalidDependency = manifest();
    invalidDependency.items[0].registryDependencies = [
      { registryId: "com.acme.icons", item: invalidDependencyItem },
    ];
    fs.writeFileSync(manifestPath, `${JSON.stringify(invalidDependency)}\n`);
    await assert.rejects(
      services.readManifest(services.registryLocation(current)),
      /dependency item must be a lowercase single-segment item name/,
    );
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest())}\n`);
  await assert.rejects(
    services.readManifest("./manifest.json"),
    /requires an expectedId from nerio\.json schema 2\.0\.0/,
  );
});

test("schema 2 resolves scoped and unscoped package exports", async (context) => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nerio-registry-package-root-"));
  context.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  const packageRoot = path.join(cwd, "node_modules/@fixture/registry");
  fs.mkdirSync(packageRoot, { recursive: true });
  fs.writeFileSync(
    path.join(packageRoot, "package.json"),
    `${JSON.stringify({ name: "@fixture/registry", main: "manifest.json" })}\n`,
  );
  fs.writeFileSync(path.join(packageRoot, "manifest.json"), `${JSON.stringify(manifest())}\n`);
  const services = registryServices(cwd);
  const scoped = await services.readManifest(
    services.registryLocation(config({ source: "@fixture/registry" })),
  );
  assert.equal(scoped.registryId, registryId);

  const unscopedRoot = path.join(cwd, "node_modules/fixture-registry");
  fs.mkdirSync(unscopedRoot, { recursive: true });
  fs.writeFileSync(
    path.join(unscopedRoot, "package.json"),
    `${JSON.stringify({ name: "fixture-registry", main: "manifest.json" })}\n`,
  );
  fs.writeFileSync(path.join(unscopedRoot, "manifest.json"), `${JSON.stringify(manifest())}\n`);
  const unscoped = await services.readManifest(
    services.registryLocation(config({ source: "fixture-registry" })),
  );
  assert.equal(unscoped.registryId, registryId);
  const unscopedSubpath = await services.readManifest(
    services.registryLocation(config({ source: "fixture-registry/manifest.json" })),
  );
  assert.equal(unscopedSubpath.registryId, registryId);
});

test("schema 2 item inspection stops before projecting object dependencies as schema 1", (context) => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nerio-registry-inspection-boundary-"));
  context.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  fs.writeFileSync(path.join(cwd, "manifest.json"), `${JSON.stringify(manifest())}\n`);
  const schemaTwoConfig = config({ source: "./manifest.json" });
  fs.writeFileSync(path.join(cwd, "nerio.json"), `${JSON.stringify(schemaTwoConfig)}\n`);
  const matchingSearch = spawnSync(
    process.execPath,
    [path.join(__dirname, "../src/index.js"), "search", "icon", "--json"],
    { cwd, encoding: "utf8" },
  );
  assert.equal(matchingSearch.status, 0, matchingSearch.stderr);
  assert.equal(JSON.parse(matchingSearch.stdout).total, 1);
  const objectSearch = spawnSync(
    process.execPath,
    [path.join(__dirname, "../src/index.js"), "search", "object", "--json"],
    { cwd, encoding: "utf8" },
  );
  assert.equal(objectSearch.status, 0, objectSearch.stderr);
  assert.equal(JSON.parse(objectSearch.stdout).total, 0);
  for (const registryConfig of [
    schemaTwoConfig,
    { schemaVersion: "1.0.0", registry: "./manifest.json", components: "components/nerio" },
  ]) {
    fs.writeFileSync(path.join(cwd, "nerio.json"), `${JSON.stringify(registryConfig)}\n`);
    for (const arguments_ of [
      ["list", "--namespace", "other"],
      ["search", "button", "--namespace", "other"],
    ]) {
      const namespacedDiscovery = spawnSync(
        process.execPath,
        [path.join(__dirname, "../src/index.js"), ...arguments_],
        { cwd, encoding: "utf8" },
      );
      assert.equal(namespacedDiscovery.status, 1);
      assert.match(
        namespacedDiscovery.stderr,
        /--namespace requires namespaced graph and lock support/,
      );
      assert.equal(namespacedDiscovery.stdout, "");
    }
  }
  fs.writeFileSync(path.join(cwd, "nerio.json"), `${JSON.stringify(schemaTwoConfig)}\n`);
  const result = spawnSync(
    process.execPath,
    [path.join(__dirname, "../src/index.js"), "view", "button", "--json"],
    {
      cwd,
      encoding: "utf8",
    },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /requires versioned namespaced inspection output/);
  assert.doesNotMatch(result.stdout, /\[object Object\]/);
});

test("schema 2 item inspection rejects before loading the Registry", async () => {
  let registryLoads = 0;
  const { view } = createDiscoveryCommand({
    positionalArguments: ["button"],
    option: () => undefined,
    hasFlag: () => false,
    readConfig: () => ({ schemaVersion: "2.0.0" }),
    registryLocation: () => {
      throw new Error("Registry location must not be resolved for unsupported inspection.");
    },
    readManifest: async () => {
      registryLoads += 1;
      throw new Error("Registry must not be loaded for unsupported inspection.");
    },
    registryMetadata: () => ({}),
    formatList: () => "none",
  });
  await assert.rejects(view(), /requires versioned namespaced inspection output/);
  assert.equal(registryLoads, 0);
});

test("schema 2 source mutations stop before lock or consumer writes", (context) => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nerio-registry-mutation-boundary-"));
  context.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  fs.writeFileSync(
    path.join(cwd, "nerio.json"),
    `${JSON.stringify(config({ source: "./manifest.json" }))}\n`,
  );
  const result = spawnSync(
    process.execPath,
    [path.join(__dirname, "../src/index.js"), "remove", "button"],
    {
      cwd,
      encoding: "utf8",
    },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /require namespaced lock and graph support/);
  assert.equal(fs.existsSync(path.join(cwd, "nerio.lock.json")), false);
  assert.deepEqual(fs.readdirSync(cwd), ["nerio.json"]);
});

test("schema 2 doctor accepts an independently versioned Registry", (context) => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nerio-registry-independent-version-"));
  context.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  fs.writeFileSync(
    path.join(cwd, "manifest.json"),
    `${JSON.stringify(manifest({ version: "9.8.7" }))}\n`,
  );
  fs.writeFileSync(
    path.join(cwd, "nerio.json"),
    `${JSON.stringify(config({ source: "./manifest.json" }))}\n`,
  );
  fs.writeFileSync(
    path.join(cwd, "app.css"),
    [
      '@import "tailwindcss";',
      '@import "@nerio-ui/tokens/tailwind.css";',
      '@import "@nerio-ui/ui/styles.css";',
      '@source "./node_modules/@nerio-ui/ui/dist";',
    ].join("\n"),
  );
  const result = spawnSync(process.execPath, [path.join(__dirname, "../src/index.js"), "doctor"], {
    cwd,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Registry acme-registry 9\.8\.7/);
  assert.doesNotMatch(result.stderr, /CLI .* and Registry .* do not match/);
});

test("authenticated Registry reads stay on one HTTPS origin and never expose credentials", async (context) => {
  const previousFetch = globalThis.fetch;
  const previousToken = process.env.ACME_REGISTRY_TOKEN;
  const secret = "do-not-print-this-secret";
  context.after(() => {
    globalThis.fetch = previousFetch;
    if (previousToken === undefined) delete process.env.ACME_REGISTRY_TOKEN;
    else process.env.ACME_REGISTRY_TOKEN = previousToken;
  });
  process.env.ACME_REGISTRY_TOKEN = secret;
  const services = registryServices(process.cwd());
  const authenticated = config({
    auth: {
      headers: [
        {
          name: "Authorization",
          environment: "ACME_REGISTRY_TOKEN",
          scheme: "Bearer",
        },
      ],
    },
  });
  const apiKeyAuthenticated = config({
    auth: {
      headers: [{ name: "X-API-Key", environment: "ACME_REGISTRY_TOKEN" }],
    },
  });
  process.env.ACME_REGISTRY_TOKEN = ` ${secret} `;
  let whitespaceCredentialRequests = 0;
  globalThis.fetch = async () => {
    whitespaceCredentialRequests += 1;
    return jsonResponse(manifest());
  };
  const whitespaceCredential = await services
    .readManifest(services.registryLocation(apiKeyAuthenticated))
    .then(
      () => "",
      (error) => error.message,
    );
  assert.match(whitespaceCredential, /contains an invalid credential value/);
  assert.equal(whitespaceCredential.includes(secret), false);
  assert.equal(whitespaceCredentialRequests, 0);
  process.env.ACME_REGISTRY_TOKEN = "do not print this secret";
  const internalWhitespaceCredential = await services
    .readManifest(services.registryLocation(apiKeyAuthenticated))
    .then(
      () => "",
      (error) => error.message,
    );
  assert.match(internalWhitespaceCredential, /contains an invalid credential value/);
  assert.equal(internalWhitespaceCredential.includes("do not print this secret"), false);
  assert.equal(whitespaceCredentialRequests, 0);
  process.env.ACME_REGISTRY_TOKEN = "true";
  const shortCredential = await services
    .readManifest(services.registryLocation(apiKeyAuthenticated))
    .then(
      () => "",
      (error) => error.message,
    );
  assert.match(shortCredential, /contains an invalid credential value/);
  assert.equal(shortCredential.includes("true"), false);
  assert.equal(whitespaceCredentialRequests, 0);
  process.env.ACME_REGISTRY_TOKEN = "header-credential-€";
  const unsupportedHeaderCredential = await services
    .readManifest(services.registryLocation(apiKeyAuthenticated))
    .then(
      () => "",
      (error) => error.message,
    );
  assert.match(unsupportedHeaderCredential, /contains an invalid credential value/);
  assert.equal(unsupportedHeaderCredential.includes("€"), false);
  assert.equal(whitespaceCredentialRequests, 0);
  process.env.ACME_REGISTRY_TOKEN = secret;
  const requests = [];
  globalThis.fetch = async (url, init) => {
    requests.push({ url, headers: init.headers });
    if (url.endsWith("manifest.json")) return jsonResponse(manifest());
    return new globalThis.Response(source, {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
  };

  const loaded = await services.readManifest(services.registryLocation(authenticated));
  const sourceLocation = services.resolveSource(loaded.__registryLocation, "./button.ts");
  assert.equal(await services.readText(sourceLocation), source);
  assert.equal(requests.length, 2);
  assert.equal(requests[0].headers.Authorization, `Bearer ${secret}`);
  assert.equal(requests[1].headers.Authorization, `Bearer ${secret}`);
  assert.equal(JSON.stringify(loaded).includes(secret), false);
  assert.equal(JSON.stringify(loaded).includes("ACME_REGISTRY_TOKEN"), false);

  let credentialPathRequests = 0;
  globalThis.fetch = async () => {
    credentialPathRequests += 1;
    return jsonResponse(manifest());
  };
  const credentialPathAuthenticated = config({
    source: `https://registry.acme.test/%64${secret.slice(1)}/manifest.json`,
    auth: authenticated.registry.auth,
  });
  const credentialPath = await services
    .readManifest(services.registryLocation(credentialPathAuthenticated))
    .then(
      () => "",
      (error) => error.message,
    );
  assert.match(credentialPath, /source contained a credential value/);
  assert.equal(credentialPath.includes(secret), false);
  assert.equal(credentialPathRequests, 0);

  globalThis.fetch = async () =>
    new globalThis.Response("{}", {
      status: 200,
      headers: { "content-type": secret },
    });
  const reflectedContentType = await services
    .readManifest(services.registryLocation(authenticated))
    .then(
      () => "",
      (error) => error.message,
    );
  assert.match(reflectedContentType, /unsupported content type \(redacted\)/);
  assert.equal(reflectedContentType.includes(secret), false);

  let deeplyEncodedSecret = `%64${secret.slice(1)}`;
  for (let depth = 0; depth < 4; depth += 1) {
    deeplyEncodedSecret = deeplyEncodedSecret.replaceAll("%", "%25");
  }
  const reflectedManifest = manifest();
  reflectedManifest.items[0].title = `Button ${secret}`;
  globalThis.fetch = async () => jsonResponse(reflectedManifest);
  const reflectedMetadata = await services
    .readManifest(services.registryLocation(authenticated))
    .then(
      () => "",
      (error) => error.message,
    );
  assert.match(reflectedMetadata, /response contained a credential value/);
  assert.equal(reflectedMetadata.includes(secret), false);

  const encodedReflectedManifest = manifest();
  encodedReflectedManifest.items[0].title = `Button %FF${deeplyEncodedSecret}`;
  globalThis.fetch = async () => jsonResponse(encodedReflectedManifest);
  const encodedReflectedMetadata = await services
    .readManifest(services.registryLocation(authenticated))
    .then(
      () => "",
      (error) => error.message,
    );
  assert.match(encodedReflectedMetadata, /response contained a credential value/);
  assert.equal(encodedReflectedMetadata.includes(secret), false);

  const mixedReflectedManifest = manifest();
  mixedReflectedManifest.items[0].title = "MIXED_REFLECTION";
  const mixedReflectedBody = JSON.stringify(mixedReflectedManifest).replace(
    "MIXED_REFLECTION",
    `%64\\u006f${secret.slice(2)}`,
  );
  globalThis.fetch = async () =>
    new globalThis.Response(mixedReflectedBody, {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  const mixedReflectedMetadata = await services
    .readManifest(services.registryLocation(authenticated))
    .then(
      () => "",
      (error) => error.message,
    );
  assert.match(mixedReflectedMetadata, /manifest contained a credential value/);
  assert.equal(mixedReflectedMetadata.includes(secret), false);

  const percentSequenceCredential = "prefix%64-secret-123456";
  process.env.ACME_REGISTRY_TOKEN = percentSequenceCredential;
  const collapsedReflectedManifest = manifest();
  collapsedReflectedManifest.items[0].title = percentSequenceCredential.replace("%", "%25");
  globalThis.fetch = async () => jsonResponse(collapsedReflectedManifest);
  const collapsedReflectedMetadata = await services
    .readManifest(services.registryLocation(authenticated))
    .then(
      () => "",
      (error) => error.message,
    );
  assert.match(collapsedReflectedMetadata, /response contained a credential value/);
  assert.equal(collapsedReflectedMetadata.includes(percentSequenceCredential), false);
  process.env.ACME_REGISTRY_TOKEN = secret;

  let reflectedRedirectRequests = 0;
  globalThis.fetch = async () => {
    reflectedRedirectRequests += 1;
    return new globalThis.Response(null, {
      status: 302,
      headers: { location: `/malformed-%zz-${deeplyEncodedSecret}` },
    });
  };
  const reflectedRedirect = await services
    .readManifest(services.registryLocation(authenticated))
    .then(
      () => "",
      (error) => error.message,
    );
  assert.match(reflectedRedirect, /redirect contained a credential value/);
  assert.equal(reflectedRedirect.includes(secret), false);
  assert.equal(reflectedRedirectRequests, 1);

  const crossOriginSource = manifest();
  crossOriginSource.items[0].files[0].source = "https://evil.example/button.ts";
  let crossOriginSourceRequests = 0;
  globalThis.fetch = async () => {
    crossOriginSourceRequests += 1;
    return jsonResponse(crossOriginSource);
  };
  await assert.rejects(
    services.readManifest(services.registryLocation(authenticated)),
    /authenticated source must stay on origin https:\/\/registry\.acme\.test/,
  );
  assert.equal(crossOriginSourceRequests, 1);

  let redirectRequests = 0;
  globalThis.fetch = async () => {
    redirectRequests += 1;
    return new globalThis.Response(null, {
      status: 302,
      headers: { location: "https://evil.example/manifest.json" },
    });
  };
  await assert.rejects(
    services.readManifest(services.registryLocation(authenticated)),
    /redirect changed origin/,
  );
  assert.equal(redirectRequests, 1);

  globalThis.fetch = async () => jsonResponse({}, { status: 401 });
  const unauthorized = await services.readManifest(services.registryLocation(authenticated)).then(
    () => "",
    (error) => error.message,
  );
  assert.match(unauthorized, /Registry namespace default request failed \(401\)/);
  assert.equal(unauthorized.includes(secret), false);

  delete process.env.ACME_REGISTRY_TOKEN;
  let missingSecretRequests = 0;
  globalThis.fetch = async () => {
    missingSecretRequests += 1;
    return jsonResponse(manifest());
  };
  await assert.rejects(
    services.readManifest(services.registryLocation(authenticated)),
    /requires environment variable ACME_REGISTRY_TOKEN/,
  );
  assert.equal(missingSecretRequests, 0);
});
