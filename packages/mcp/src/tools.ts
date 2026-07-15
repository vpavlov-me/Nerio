import { getRegistryItem, registry } from "@nerio-ui/registry";

export function list_components() {
  return registry.map(({ name, title, description, category }) => ({
    name,
    title,
    description,
    category,
  }));
}

export function get_component(name: string) {
  const item = getRegistryItem(name);
  if (!item) {
    throw new Error(`Component not found: ${name}`);
  }
  return item;
}

export function get_component_usage(name: string) {
  const item = get_component(name);
  return {
    name: item.name,
    title: item.title,
    description: item.description,
    category: item.category,
    usage: item.usage,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    files: item.files,
    baseUiPrimitives: item.baseUiPrimitives,
    slots: item.slots,
    variants: item.variants,
    states: item.states ?? [],
    requiredTokens: item.requiredTokens,
    accessibility: item.accessibility,
  };
}
