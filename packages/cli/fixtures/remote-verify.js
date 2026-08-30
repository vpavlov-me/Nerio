const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const https = require("node:https");
const os = require("node:os");
const path = require("node:path");
const { Buffer } = require("node:buffer");
const { execFileSync, spawn } = require("node:child_process");
const { setTimeout } = require("node:timers");

const cli = path.resolve(__dirname, "..", process.env.NERIO_TEST_CLI_PATH || "src/index.js");
const source = "export const remoteButton = true;\n";
const sourceIntegrity = `sha256-${crypto.createHash("sha256").update(source).digest("hex")}`;
const authenticatedToken = "fixture-authenticated-token";

function item(files) {
  return {
    name: "button",
    title: "Button",
    description: "Remote Registry fixture.",
    category: "actions",
    dependencies: ["react"],
    registryDependencies: [],
    files,
    baseUiPrimitives: [],
    slots: [],
    variants: [],
    requiredTokens: [],
    accessibility: [],
    usage: "import { remoteButton } from '@/components/nerio/components/button';",
  };
}

function manifest(files) {
  return JSON.stringify({
    schemaVersion: "1.1.0",
    name: "nerio-remote-fixture",
    version: "1.0.0-beta.0",
    sourceRevision: "remote-fixture",
    styleContractVersion: "tailwind-v1",
    items: [item(files)],
  });
}

function schemaTwoManifest(files) {
  const current = JSON.parse(manifest(files));
  current.schemaVersion = "2.0.0";
  current.registryId = "com.nerio.fixture.authenticated";
  return JSON.stringify(current);
}

const validFiles = [
  {
    source: "./button.ts",
    target: "components/button.ts",
    role: "component",
    integrity: sourceIntegrity,
  },
];

function respondJson(response, payload) {
  response.writeHead(200, { "content-type": "application/json" });
  response.end(payload);
}

function requestHandler(request, response) {
  const url = new URL(request.url, "http://registry.test");
  if (url.pathname === "/valid/manifest.json") {
    respondJson(response, manifest(validFiles));
  } else if (url.pathname === "/authenticated/manifest.json") {
    if (request.headers.authorization !== `Bearer ${authenticatedToken}`) {
      response.writeHead(401, { "content-type": "application/json" });
      response.end("{}");
      return;
    }
    respondJson(response, schemaTwoManifest(validFiles));
  } else if (url.pathname === "/invalid-docs-path/manifest.json") {
    const invalid = JSON.parse(manifest(validFiles));
    invalid.items[0].docsPath = { path: "/docs/components/button" };
    respondJson(response, JSON.stringify(invalid));
  } else if (url.pathname === "/redirect-valid") {
    response.writeHead(302, { location: "/valid/manifest.json" });
    response.end();
  } else if (url.pathname === "/valid/button.ts") {
    response.writeHead(200, { "content-type": "text/plain" });
    response.end(source);
  } else if (url.pathname === "/timeout") {
    setTimeout(() => response.end(), 500);
  } else if (url.pathname === "/body-timeout") {
    response.writeHead(200, { "content-type": "application/json" });
    response.write('{"schemaVersion":');
    setTimeout(() => response.end('"1.1.0"}'), 500);
  } else if (url.pathname === "/oversize") {
    response.writeHead(200, {
      "content-type": "application/json",
      "content-length": String(2 * 1024 * 1024 + 1),
    });
    response.end("{}");
  } else if (url.pathname === "/oversize-stream") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(Buffer.alloc(2 * 1024 * 1024 + 1, " "));
  } else if (url.pathname.startsWith("/redirect-")) {
    const count = Number(url.pathname.slice("/redirect-".length));
    response.writeHead(302, { location: `/redirect-${count + 1}` });
    response.end();
  } else if (url.pathname === "/malformed") {
    respondJson(response, "{not-json");
  } else if (url.pathname === "/wrong-content") {
    response.writeHead(200, { "content-type": "text/html" });
    response.end("<html></html>");
  } else if (url.pathname === "/missing") {
    response.writeHead(404, { "content-type": "application/json" });
    response.end("{}");
  } else if (url.pathname === "/mismatch/manifest.json") {
    respondJson(
      response,
      manifest([
        { ...validFiles[0], source: "./button.ts", integrity: `sha256-${"0".repeat(64)}` },
      ]),
    );
  } else if (url.pathname === "/mismatch/button.ts") {
    response.writeHead(200, { "content-type": "text/plain" });
    response.end(source);
  } else if (url.pathname === "/duplicates/manifest.json") {
    respondJson(response, manifest([validFiles[0], { ...validFiles[0] }]));
  } else if (url.pathname === "/escape/manifest.json") {
    respondJson(
      response,
      manifest([{ ...validFiles[0], source: "../valid/button.ts", target: "../outside.ts" }]),
    );
  } else if (url.pathname === "/partial/manifest.json") {
    respondJson(
      response,
      manifest([
        { ...validFiles[0], source: "../valid/button.ts" },
        {
          ...validFiles[0],
          source: "./broken.ts",
          target: "components/broken.ts",
        },
      ]),
    );
  } else if (url.pathname === "/partial/broken.ts") {
    response.destroy();
  } else if (url.pathname === "/source-oversize/manifest.json") {
    respondJson(
      response,
      manifest([{ ...validFiles[0], source: "./button.ts", integrity: sourceIntegrity }]),
    );
  } else if (url.pathname === "/source-missing/manifest.json") {
    respondJson(
      response,
      manifest([{ ...validFiles[0], source: "./not-found.ts", integrity: sourceIntegrity }]),
    );
  } else if (url.pathname === "/source-oversize/button.ts") {
    response.writeHead(200, {
      "content-type": "text/plain",
      "content-length": String(4 * 1024 * 1024 + 1),
    });
    response.end(source);
  } else {
    response.writeHead(404, { "content-type": "text/plain" });
    response.end("Not found");
  }
}

function listen(server) {
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve(address.port);
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
    server.closeAllConnections?.();
  });
}

function execute(cwd, env, ...args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], {
      cwd,
      stdio: "pipe",
      env: { ...process.env, ...env },
    });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("close", (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(output));
    });
  });
}

async function failure(cwd, env, ...args) {
  try {
    await execute(cwd, env, ...args);
  } catch (error) {
    return error.message;
  }
  throw new Error(`nerio ${args.join(" ")} unexpectedly succeeded`);
}

function assertUntouched(target, description) {
  if (
    fs.existsSync(path.join(target, "nerio.lock.json")) ||
    fs.existsSync(path.join(target, "components")) ||
    fs.readdirSync(target).some((entry) => entry.startsWith(".nerio-transaction-"))
  ) {
    throw new Error(`${description} touched consumer-owned source or lock state.`);
  }
}

async function verify() {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "nerio-remote-fixture-"));
  const httpServer = http.createServer(requestHandler);
  let httpsServer;
  try {
    const httpPort = await listen(httpServer);
    const httpUrl = `http://127.0.0.1:${httpPort}`;
    const policyTarget = path.join(temporary, "policy");
    fs.mkdirSync(policyTarget);
    const secret = "do-not-print-this-token";
    const insecure = await failure(
      policyTarget,
      {},
      "list",
      "--registry",
      `${httpUrl}/missing?token=${secret}`,
    );
    if (!insecure.includes("must use HTTPS") || insecure.includes(secret)) {
      throw new Error("HTTP policy did not reject insecure access with a secret-safe error.");
    }

    for (const [route, message, env = {}] of [
      ["/timeout", "timed out", { NERIO_TEST_REMOTE_TIMEOUT_MS: "50" }],
      ["/body-timeout", "timed out", { NERIO_TEST_REMOTE_TIMEOUT_MS: "50" }],
      ["/oversize", "response limit"],
      ["/oversize-stream", "response limit"],
      ["/redirect-0", "redirect limit"],
      ["/malformed", "not valid JSON"],
      ["/wrong-content", "unsupported content type"],
      ["/missing", "request failed (404)"],
      ["/duplicates/manifest.json", "duplicate target"],
      ["/invalid-docs-path/manifest.json", "docsPath as a non-empty string"],
    ]) {
      const output = await failure(
        policyTarget,
        env,
        "list",
        "--registry",
        `${httpUrl}${route}`,
        "--allow-insecure-http",
      );
      if (!output.includes(message)) {
        throw new Error(`Remote ${route} failure did not report ${message}:\n${output}`);
      }
    }

    const remoteSearch = JSON.parse(
      await execute(
        policyTarget,
        {},
        "search",
        "remote",
        "--limit",
        "1",
        "--json",
        "--registry",
        `${httpUrl}/valid/manifest.json`,
        "--allow-insecure-http",
      ),
    );
    const remoteNullSearch = JSON.parse(
      await execute(
        policyTarget,
        {},
        "search",
        "null",
        "--json",
        "--registry",
        `${httpUrl}/valid/manifest.json`,
        "--allow-insecure-http",
      ),
    );
    const remoteView = JSON.parse(
      await execute(
        policyTarget,
        {},
        "view",
        "button",
        "--json",
        "--registry",
        `${httpUrl}/valid/manifest.json`,
        "--allow-insecure-http",
      ),
    );
    const remoteDocs = JSON.parse(
      await execute(
        policyTarget,
        {},
        "docs",
        "button",
        "--json",
        "--registry",
        `${httpUrl}/valid/manifest.json`,
        "--allow-insecure-http",
      ),
    );
    if (
      remoteSearch.count !== 1 ||
      remoteNullSearch.total !== 0 ||
      remoteView.item.files[0].integrity !== sourceIntegrity ||
      !remoteDocs.item.usage.includes("remoteButton")
    ) {
      throw new Error("Remote read-only inspection did not preserve validated Registry metadata.");
    }
    assertUntouched(policyTarget, "Remote read-only inspection");

    for (const [route, message] of [
      ["/mismatch/manifest.json", "integrity mismatch"],
      ["/escape/manifest.json", "unsafe target"],
      ["/partial/manifest.json", "request failed"],
      ["/source-oversize/manifest.json", "response limit"],
      ["/source-missing/manifest.json", "request failed (404)"],
    ]) {
      const target = path.join(temporary, route.split("/")[1]);
      fs.mkdirSync(target);
      await execute(
        target,
        {},
        "init",
        "--registry",
        `${httpUrl}${route}`,
        "--allow-insecure-http",
      );
      const output = await failure(target, {}, "add", "button", "--allow-insecure-http");
      if (!output.toLowerCase().includes(message.toLowerCase())) {
        throw new Error(`Remote ${route} failure did not report ${message}:\n${output}`);
      }
      assertUntouched(target, route);
    }

    const httpTarget = path.join(temporary, "valid-http");
    fs.mkdirSync(httpTarget);
    await execute(
      httpTarget,
      {},
      "init",
      "--registry",
      `${httpUrl}/valid/manifest.json`,
      "--allow-insecure-http",
    );
    await execute(httpTarget, {}, "add", "button", "--allow-insecure-http");
    if (
      fs.readFileSync(path.join(httpTarget, "components/nerio/components/button.ts"), "utf8") !==
      source
    ) {
      throw new Error("Explicit insecure-HTTP opt-in did not install verified source.");
    }
    const redirectTarget = path.join(temporary, "valid-redirect");
    fs.mkdirSync(redirectTarget);
    await execute(
      redirectTarget,
      {},
      "init",
      "--registry",
      `${httpUrl}/redirect-valid`,
      "--allow-insecure-http",
    );
    await execute(redirectTarget, {}, "add", "button", "--allow-insecure-http");
    if (!fs.existsSync(path.join(redirectTarget, "components/nerio/components/button.ts"))) {
      throw new Error("Bounded Registry redirect did not preserve the final manifest source base.");
    }

    const keyPath = path.join(temporary, "localhost-key.pem");
    const certificatePath = path.join(temporary, "localhost-cert.pem");
    execFileSync(
      "openssl",
      [
        "req",
        "-x509",
        "-newkey",
        "rsa:2048",
        "-nodes",
        "-keyout",
        keyPath,
        "-out",
        certificatePath,
        "-subj",
        "/CN=127.0.0.1",
        "-days",
        "1",
      ],
      { stdio: "ignore" },
    );
    httpsServer = https.createServer(
      {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certificatePath),
      },
      requestHandler,
    );
    const httpsPort = await listen(httpsServer);
    const httpsTarget = path.join(temporary, "valid-https");
    fs.mkdirSync(httpsTarget);
    const testTls = { NODE_TLS_REJECT_UNAUTHORIZED: "0" };
    await execute(
      httpsTarget,
      testTls,
      "init",
      "--registry",
      `https://127.0.0.1:${httpsPort}/valid/manifest.json`,
    );
    await execute(httpsTarget, testTls, "add", "button");
    if (!fs.existsSync(path.join(httpsTarget, "nerio.lock.json"))) {
      throw new Error("Valid HTTPS Registry install did not commit source and lock metadata.");
    }

    const authenticatedTarget = path.join(temporary, "authenticated-https");
    fs.mkdirSync(authenticatedTarget);
    fs.writeFileSync(
      path.join(authenticatedTarget, "nerio.json"),
      `${JSON.stringify(
        {
          schemaVersion: "2.0.0",
          registry: {
            alias: "fixture",
            source: `https://127.0.0.1:${httpsPort}/authenticated/manifest.json`,
            expectedId: "com.nerio.fixture.authenticated",
            auth: {
              headers: [
                {
                  name: "Authorization",
                  environment: "NERIO_FIXTURE_REGISTRY_TOKEN",
                  scheme: "Bearer",
                },
              ],
            },
          },
          registries: {},
          components: "components/nerio",
        },
        null,
        2,
      )}\n`,
    );
    const authenticatedList = await execute(
      authenticatedTarget,
      { ...testTls, NERIO_FIXTURE_REGISTRY_TOKEN: authenticatedToken },
      "list",
    );
    if (!authenticatedList.includes("button\tButton\tactions")) {
      throw new Error("Authenticated HTTPS Registry discovery did not load schema 2 metadata.");
    }
    const unauthorized = await failure(
      authenticatedTarget,
      { ...testTls, NERIO_FIXTURE_REGISTRY_TOKEN: "wrong-secret-value" },
      "list",
    );
    if (!unauthorized.includes("request failed (401)") || unauthorized.includes("wrong-secret")) {
      throw new Error("Authenticated HTTPS Registry failure was not stable and secret-safe.");
    }
  } finally {
    await close(httpServer);
    if (httpsServer) await close(httpsServer);
    fs.rmSync(temporary, { recursive: true, force: true });
  }
  console.log(
    "CLI remote fixture passed HTTPS and authenticated schema 2 policy, bounds, redirects, integrity, rollback, and secret-safe errors.",
  );
}

verify().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
