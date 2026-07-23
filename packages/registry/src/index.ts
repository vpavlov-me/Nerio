import manifest from "./manifest.json";

export interface RegistryItem {
  name: string;
  title: string;
  description: string;
  category: string;
  docsPath?: string;
  dependencies: string[];
  optionalPeerDependencies?: string[];
  registryDependencies: string[];
  files: Array<{
    source: string;
    target: string;
    role: "component" | "style" | "utility";
  }>;
  baseUiPrimitives: string[];
  slots: string[];
  variants: string[];
  states?: string[];
  requiredTokens: string[];
  accessibility: string[];
  usage: string;
}

export interface RegistryMetadata {
  schemaVersion: string;
  name: string;
  version: string;
  sourceRevision: string;
  styleContractVersion: string;
}

export const registry = manifest.items as RegistryItem[];
export const registryMetadata: RegistryMetadata = {
  schemaVersion: manifest.schemaVersion,
  name: manifest.name,
  version: manifest.version,
  sourceRevision: manifest.sourceRevision,
  styleContractVersion: manifest.styleContractVersion,
};

export function getRegistryItem(name: string) {
  return registry.find((item) => item.name === name);
}
