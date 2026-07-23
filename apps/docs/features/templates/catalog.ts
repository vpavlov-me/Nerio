export type TemplateStatus = "Preview" | "Experimental";

export type TemplateDefinition = {
  slug: string;
  title: string;
  description: string;
  category: string;
  status: TemplateStatus;
  previewRoute: `/views/${string}`;
  detailRoute: `/templates/${string}`;
  audience: string;
  scenarios: readonly string[];
  runtimeCoverage: readonly string[];
  componentsUsed: readonly string[];
  limitations: readonly string[];
  indexable: boolean;
};

export const templateCatalog = [
  {
    slug: "operations-workspace",
    title: "Operations Workspace",
    description:
      "A realistic operational workspace for projects, collaborators, activity, and delivery signals.",
    category: "SaaS and operations",
    status: "Preview",
    previewRoute: "/views/operations-workspace",
    detailRoute: "/templates/operations-workspace",
    audience: "SaaS products, internal tools, admin systems, and operations teams.",
    scenarios: [
      "Workspace overview and local navigation",
      "Project search and status filtering",
      "Delivery progress and collaborator context",
      "Loading, empty, error, success, and transient feedback states",
    ],
    runtimeCoverage: [
      "Purple, blue, green, orange, red, and neutral themes",
      "System, light, and dark modes",
      "Comfortable and compact density",
      "LTR and RTL direction",
      "Desktop, tablet, and mobile navigation",
      "Reduced motion, forced colors, and safe-area behavior",
    ],
    componentsUsed: [
      "Alert",
      "Avatar",
      "Badge",
      "Button",
      "Card",
      "Command",
      "EmptyState",
      "Field",
      "Input",
      "Popover",
      "Progress",
      "Select",
      "Sheet",
      "Sidebar",
      "Skeleton",
      "Stat",
      "Table",
      "Toast",
      "Tooltip",
    ],
    limitations: [
      "Deterministic mock data only",
      "No backend, authentication, persistence, or permissions",
      "Template-local composition is not a released Pro package",
    ],
    indexable: true,
  },
] as const satisfies readonly TemplateDefinition[];

export const templateSlugs = templateCatalog.map((template) => template.slug);

export function getTemplate(slug: string) {
  return templateCatalog.find((template) => template.slug === slug);
}
