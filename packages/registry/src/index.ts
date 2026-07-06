import manifest from "./manifest.json";

export interface RegistryItem {
  name: string;
  title: string;
  description: string;
  category: string;
  dependencies: string[];
  registryDependencies: string[];
  files: Array<{ source: string; target: string }>;
  baseUiPrimitives: string[];
  slots: string[];
  variants: string[];
  requiredTokens: string[];
  accessibility: string[];
  usage: string;
}

export const registry = manifest.items as RegistryItem[];

export function getRegistryItem(name: string) {
  return registry.find((item) => item.name === name);
}
