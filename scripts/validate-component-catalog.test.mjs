import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { basename, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const validator = resolve(root, "scripts/validate-component-catalog.mjs");
const catalog = resolve(root, "data/component-catalog.json");
const manifest = resolve(root, "packages/registry/src/manifest.json");
const components = resolve(root, "COMPONENTS.md");
const docsChrome = resolve(root, "apps/docs/components/docs-chrome.tsx");
const componentDocs = resolve(root, "apps/docs/lib/component-docs.ts");

function run(...args) {
  return spawnSync(process.execPath, [validator, ...args], { cwd: root, encoding: "utf8" });
}

function fixture(source, update = (value) => value) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-catalog-"));
  const target = resolve(directory, basename(source));
  cpSync(source, target);
  const original = readFileSync(target, "utf8");
  const next = update(source.endsWith(".json") ? JSON.parse(original) : original);
  writeFileSync(target, typeof next === "string" ? next : `${JSON.stringify(next, null, 2)}\n`);
  return { directory, target };
}

function withFixture(source, update, option, assertion) {
  const value = fixture(source, update);
  try {
    const result = run(option, value.target);
    assert.notEqual(result.status, 0);
    assert.doesNotMatch(result.stderr, /TypeError|ERR_INVALID_ARG_TYPE/);
    assertion(result.stderr);
  } finally {
    rmSync(value.directory, { recursive: true, force: true });
  }
}

test("catalog validator accepts the repository inventory", () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
});

test("catalog validator reports a missing CLI option value", () => {
  for (const args of [["--catalog"], ["--catalog", "--manifest", manifest]]) {
    const result = run(...args);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Usage error: --catalog requires a path value/);
    assert.doesNotMatch(result.stderr, /TypeError|ERR_INVALID_ARG_TYPE/);
  }
});

test("catalog validator reports missing and non-string names without throwing", () => {
  for (const name of [undefined, 42]) {
    withFixture(
      catalog,
      (value) => {
        if (name === undefined) delete value.components[0].name;
        else value.components[0].name = name;
        return value;
      },
      "--catalog",
      (stderr) => assert.match(stderr, /Catalog component <missing name> has an invalid name/),
    );
  }
});

test("catalog validator reports duplicate names and slugs", () => {
  withFixture(
    catalog,
    (value) => {
      value.components.push({ ...value.components[0] });
      value.components.push({ ...value.components[0], name: "tokens" });
      return value;
    },
    "--catalog",
    (stderr) => {
      assert.match(stderr, /Duplicate catalog component name: Tokens/);
      assert.match(stderr, /Duplicate catalog component slug: tokens/);
    },
  );
});

test("catalog validator reports invalid tier, category, package, status, runtime, and entrypoint", () => {
  withFixture(
    catalog,
    (value) => {
      Object.assign(
        value.components.find((component) => component.name === "Button"),
        {
          tier: "community",
          category: "controls",
          package: "@nerio-ui/unknown",
          status: "released",
        },
      );
      Object.assign(
        value.registryIdentities.find((identity) => identity.name === "button"),
        {
          runtime: "edge",
          entrypoint: "@nerio-ui/ui/server",
        },
      );
      return value;
    },
    "--catalog",
    (stderr) => {
      for (const field of ["tier", "category", "package", "status"]) {
        assert.match(stderr, new RegExp(`Catalog component Button has invalid ${field}`));
      }
      assert.match(stderr, /Catalog registry identity button has invalid runtime/);
      assert.match(stderr, /Catalog registry identity button has invalid entrypoint/);
    },
  );
});

test("catalog validator reports deprecated components without a valid replacement", () => {
  withFixture(
    catalog,
    (value) => {
      value.components.find((component) => component.name === "IconButton").replacement =
        "Missing Button";
      return value;
    },
    "--catalog",
    (stderr) => assert.match(stderr, /IconButton is deprecated but has no valid replacement/),
  );
});

test("catalog validator reports matrix tier, status, and package drift", () => {
  withFixture(
    components,
    (source) =>
      source
        .replace("| Button", "| Button")
        .replace(
          /\| Button\s+\| stable-core\s+\| `@nerio-ui\/ui\/client`/,
          "| Button | polished | `@nerio-ui/ui`",
        ),
    "--components",
    (stderr) => {
      assert.match(stderr, /COMPONENTS\.md status differs for Button/);
      assert.match(stderr, /COMPONENTS\.md package differs for Button/);
    },
  );
  withFixture(
    components,
    (source) => source.replace("## Core components", "## Pro components"),
    "--components",
    (stderr) => assert.match(stderr, /COMPONENTS\.md tier differs for Button/),
  );
});

test("catalog validator reports docs index and navigation drift", () => {
  withFixture(
    docsChrome,
    (source) =>
      source.replace(
        'href: "/docs/components/button", label: "Button"',
        'href: "/docs/components/unknown-button", label: "Button"',
      ),
    "--docs-chrome",
    (stderr) => assert.match(stderr, /Docs navigation references unknown catalog component/),
  );
  withFixture(
    componentDocs,
    (source) => source.replace("  kbd:", '  "unknown-kbd":'),
    "--component-docs",
    (stderr) => assert.match(stderr, /Docs component index references unknown catalog component/),
  );
});

test("catalog validator reports entrypoint and runtime drift from canonical catalog data", () => {
  withFixture(
    catalog,
    (value) => {
      const button = value.components.find((component) => component.name === "Button");
      const identity = value.registryIdentities.find((item) => item.name === "button");
      identity.runtime = "client";
      identity.entrypoint = "@nerio-ui/ui";
      return value;
    },
    "--catalog",
    (stderr) => {
      assert.match(stderr, /Catalog component Button entrypoint differs from package/);
      assert.match(stderr, /Catalog component Button runtime differs from entrypoint/);
    },
  );
});

test("catalog validator requires registry items for installable Foundation components", () => {
  withFixture(
    manifest,
    (value) => {
      value.items = value.items.filter((item) => item.name !== "kbd");
      return value;
    },
    "--manifest",
    (stderr) =>
      assert.match(stderr, /Installable catalog component has no registry item: Kbd \(kbd\)/),
  );
});

test("catalog validator reports registry components without catalog entries", () => {
  withFixture(
    manifest,
    (value) => {
      value.items.push({
        ...value.items[0],
        name: "unknown-component",
        title: "Unknown Component",
      });
      return value;
    },
    "--manifest",
    (stderr) => assert.match(stderr, /Registry component has no catalog entry: unknown-component/),
  );
});
