import { resolve } from "node:path";

export const defaultDocsRouteReportPath = "artifacts/docs-route-bundle-report.json";

export function resolveDocsRouteReportOutput(args, root) {
  const equalsOptions = args
    .filter((argument) => argument.startsWith("--output="))
    .map((argument) => argument.slice("--output=".length));
  const separateIndexes = args.flatMap((argument, index) =>
    argument === "--output" ? [index] : [],
  );
  if (equalsOptions.length + separateIndexes.length > 1) {
    throw new Error("Usage error: pass --output only once.");
  }

  let configuredPath = equalsOptions[0];
  if (separateIndexes.length === 1) {
    configuredPath = args[separateIndexes[0] + 1];
    if (!configuredPath || configuredPath.startsWith("--")) {
      throw new Error("Usage error: --output requires a path value.");
    }
  }
  if (configuredPath === "") {
    throw new Error("Usage error: --output requires a path value.");
  }

  const writeReport = args.includes("--write") || configuredPath !== undefined;
  return {
    writeReport,
    outputPath: resolve(root, configuredPath ?? defaultDocsRouteReportPath),
  };
}
