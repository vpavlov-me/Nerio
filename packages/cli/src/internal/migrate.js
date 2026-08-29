const path = require("node:path");

const CONFIG_MIGRATION_ID = "config:0.1.0-to-1.0.0";
const MIGRATION_OUTPUT_SCHEMA_VERSION = "1.0.0";

function migrateSchemaVersion(source) {
  const marker = /("schemaVersion"\s*:\s*)"0\.1\.0"/g;
  if (source.match(marker)?.length !== 1) throw new Error("Invalid migration source.");
  const migrated = source.replace(marker, '$1"1.0.0"');
  if (JSON.parse(migrated).schemaVersion !== "1.0.0") throw new Error("Invalid migration source.");
  return migrated;
}

function createMigrationCommand(services) {
  const {
    cwd,
    migrationArguments,
    hasFlag,
    help,
    readConfig,
    hashContent,
    applyMigrationTransaction,
  } = services;

  function migrate() {
    if (migrationArguments.length !== 3) {
      throw new Error(help("migrate"));
    }
    if (hasFlag("--apply") && hasFlag("--dry-run")) {
      throw new Error("--dry-run conflicts with --apply.");
    }
    if (migrationArguments.join(":") !== "config:0.1.0:1.0.0") throw new Error(help("migrate"));

    const target = path.join(cwd, "nerio.json");
    const [config, raw] = readConfig(true, true);
    if (config?.schemaVersion !== "0.1.0") {
      throw new Error(`Expected 0.1.0; found ${config?.schemaVersion || "unknown"}.`);
    }
    if (
      ![config.registry, config.components].every(
        (value) => typeof value === "string" && value.trim(),
      )
    ) {
      throw new Error("Legacy nerio.json requires non-empty registry and components strings.");
    }

    const apply = hasFlag("--apply");
    const result = {
      schemaVersion: MIGRATION_OUTPUT_SCHEMA_VERSION,
      command: "migrate",
      status: apply ? "applied" : "planned",
      migration: CONFIG_MIGRATION_ID,
      files: ["nerio.json"],
    };
    if (apply) {
      applyMigrationTransaction({
        id: CONFIG_MIGRATION_ID,
        target,
        content: migrateSchemaVersion(raw),
        expectedHash: hashContent(raw),
      });
    }
    console.log(
      hasFlag("--json")
        ? JSON.stringify(result, null, 2)
        : `${apply ? "Applied" : "Planned"} ${CONFIG_MIGRATION_ID}.`,
    );
  }

  return { migrate };
}

module.exports = { createMigrationCommand };
