import type { RegistryItem, RegistryMetadata } from "@nerio-ui/registry";

export type RegistryComponentSummary = Pick<
  RegistryItem,
  "name" | "title" | "description" | "category"
>;

export type RegistryComponentUsage = Pick<
  RegistryItem,
  | "name"
  | "title"
  | "description"
  | "category"
  | "docsPath"
  | "usage"
  | "dependencies"
  | "registryDependencies"
  | "files"
  | "baseUiPrimitives"
  | "slots"
  | "variants"
  | "requiredTokens"
  | "accessibility"
> & {
  optionalPeerDependencies: string[];
  states: string[];
};

export function get_registry(): RegistryMetadata;
export function list_components(): RegistryComponentSummary[];
export function get_component(name: string): RegistryItem;
export function get_component_usage(name: string): RegistryComponentUsage;
