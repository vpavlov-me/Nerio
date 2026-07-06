#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const manifest = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../registry/src/manifest.json"), "utf8"),
);

const tools = {
  list_components() {
    return manifest.items.map(({ name, title, description, category }) => ({
      name,
      title,
      description,
      category,
    }));
  },
  get_component({ name }) {
    return manifest.items.find((item) => item.name === name) ?? null;
  },
  get_component_usage({ name }) {
    const item = manifest.items.find((entry) => entry.name === name);
    return item ? { name: item.name, usage: item.usage, variants: item.variants } : null;
  },
};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  for (const line of chunk.trim().split("\n")) {
    if (!line) continue;
    const request = JSON.parse(line);
    const result = tools[request.tool]?.(request.arguments ?? {});
    process.stdout.write(`${JSON.stringify({ id: request.id, result })}\n`);
  }
});
