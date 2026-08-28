const INSPECTION_OUTPUT_SCHEMA_VERSION = "1.0.0";

function createDiscoveryCommand(services) {
  const {
    positionalArguments,
    option,
    hasFlag,
    readConfig,
    registryLocation,
    readManifest,
    registryMetadata,
    formatList,
  } = services;

  async function load() {
    const config = readConfig(false);
    return readManifest(registryLocation(config));
  }

  async function one(command) {
    if (positionalArguments.length !== 1) {
      throw new Error(
        `Usage: nerio ${command} <component> [--registry <path-or-url>]${
          command === "info" ? "" : " [--json]"
        } [--allow-insecure-http]`,
      );
    }
    const manifest = await load();
    const item = manifest.items.find(({ name }) => name === positionalArguments[0]);
    if (!item) throw new Error(`Unknown registry item: ${positionalArguments[0]}`);
    return { manifest, item };
  }

  function json(command, manifest, item) {
    console.log(
      JSON.stringify(
        {
          schemaVersion: INSPECTION_OUTPUT_SCHEMA_VERSION,
          command,
          registry: registryMetadata(manifest),
          item,
        },
        null,
        2,
      ),
    );
  }

  async function list() {
    for (const item of (await load()).items) {
      console.log(`${item.name}\t${item.title}\t${item.category}`);
    }
  }

  async function info() {
    const { item } = await one("info");
    console.log(`${item.title} (${item.name})`);
    console.log(`Description: ${item.description}`);
    console.log(`Category: ${item.category}`);
    console.log(`Dependencies: ${formatList(item.dependencies)}`);
    if (item.optionalPeerDependencies?.length) {
      console.log(`Optional peer dependencies: ${formatList(item.optionalPeerDependencies)}`);
    }
    if (item.docsPath) console.log(`Documentation: ${item.docsPath}`);
    console.log(`Registry dependencies: ${formatList(item.registryDependencies)}`);
    console.log(
      `Files: ${item.files.length} (${item.files.map(({ target }) => target).join(", ")})`,
    );
    console.log(`Variants: ${formatList(item.variants)}`);
    console.log(`Required tokens: ${formatList(item.requiredTokens)}`);
    console.log(`Accessibility: ${formatList(item.accessibility)}`);
    console.log("\nUsage:");
    console.log(item.usage);
  }

  async function search() {
    const query = positionalArguments.join(" ").trim();
    if (!query) {
      throw new Error(
        "Usage: nerio search <query...> [--limit <1-50>] [--registry <path-or-url>] [--json] [--allow-insecure-http]",
      );
    }
    const rawLimit = option("--limit");
    const limit = hasFlag("--limit") ? Number(rawLimit) : 20;
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      throw new Error("--limit must be an integer from 1 to 50.");
    }
    const manifest = await load();
    const terms = query.toLowerCase().split(/\s+/);
    const matches = manifest.items
      .filter((item) => {
        const { files: _files, ...metadata } = item;
        const text = JSON.stringify(Object.values(metadata)).toLowerCase();
        return terms.every((term) => text.includes(term));
      })
      .sort((left, right) => left.name.localeCompare(right.name));
    const items = matches
      .slice(0, limit)
      .map(({ name, title, description, category, docsPath }) => ({
        name,
        title,
        description,
        category,
        docsPath: docsPath || null,
      }));
    if (hasFlag("--json")) {
      console.log(
        JSON.stringify(
          {
            schemaVersion: INSPECTION_OUTPUT_SCHEMA_VERSION,
            command: "search",
            query,
            limit,
            total: matches.length,
            count: items.length,
            items,
          },
          null,
          2,
        ),
      );
      return;
    }
    for (const item of items) {
      console.log(`${item.name}\t${item.title}\t${item.category}\t${item.description}`);
    }
    console.log(`Showing ${items.length} of ${matches.length} matching Registry item(s).`);
  }

  async function view() {
    const { manifest, item } = await one("view");
    if (hasFlag("--json")) return json("view", manifest, item);
    console.log(`${item.title} (${item.name})`);
    for (const [label, value] of [
      ["Description", item.description],
      ["Category", item.category],
      ["Dependencies", formatList(item.dependencies)],
      ["Optional peer dependencies", formatList(item.optionalPeerDependencies || [])],
      ["Registry dependencies", formatList(item.registryDependencies)],
      ["Base UI primitives", formatList(item.baseUiPrimitives)],
      ["Slots", formatList(item.slots)],
      ["Variants", formatList(item.variants)],
      ["States", formatList(item.states || [])],
      ["Required tokens", formatList(item.requiredTokens)],
      ["Documentation", item.docsPath || "not declared in Registry metadata"],
    ])
      console.log(`${label}: ${value}`);
    console.log("Files:");
    for (const { role, target, source, integrity } of item.files) {
      console.log(`  ${role}\t${target}\t${source}\t${integrity || "none"}`);
    }
  }

  async function docs() {
    const { manifest, item } = await one("docs");
    const documented = {
      name: item.name,
      title: item.title,
      description: item.description,
      docsPath: item.docsPath || null,
      usage: item.usage,
      accessibility: item.accessibility,
    };
    if (hasFlag("--json")) return json("docs", manifest, documented);
    console.log(`${item.title} (${item.name})`);
    console.log(`Description: ${item.description}`);
    console.log(`Documentation: ${documented.docsPath || "not declared in Registry metadata"}`);
    console.log("\nUsage:");
    console.log(item.usage);
    console.log("\nAccessibility:");
    for (const note of item.accessibility) console.log(`- ${note}`);
    if (!item.accessibility.length) console.log("None documented.");
  }

  return { docs, info, list, search, view };
}

module.exports = { INSPECTION_OUTPUT_SCHEMA_VERSION, createDiscoveryCommand };
