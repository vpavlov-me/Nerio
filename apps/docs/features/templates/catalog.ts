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
  {
    slug: "finance-assets",
    title: "Finance & Assets",
    description:
      "A consolidated financial workspace for portfolio overview, holdings, transactions, transfer review, and security controls.",
    category: "Finance and assets",
    status: "Preview",
    previewRoute: "/views/finance-assets",
    detailRoute: "/templates/finance-assets",
    audience:
      "Treasury, wealth, fintech, and crypto-adjacent products that need one neutral asset workspace.",
    scenarios: [
      "Consolidated portfolio overview and period movement",
      "Searchable holdings with selected asset detail",
      "Completed, pending, and failed transaction review",
      "Validated local transfer flow and sensitive balance controls",
    ],
    runtimeCoverage: [
      "System, light, and dark modes",
      "Comfortable and compact density",
      "LTR and RTL direction",
      "Desktop table and mobile list navigation",
      "Reduced motion, forced colors, and safe-area behavior",
    ],
    componentsUsed: [
      "Alert",
      "Badge",
      "Button",
      "Card",
      "Dialog",
      "EmptyState",
      "Field",
      "Input",
      "KeyValue",
      "Progress",
      "Select",
      "Sheet",
      "Sidebar",
      "Skeleton",
      "Stat",
      "Switch",
      "Table",
      "Toast",
      "Tooltip",
    ],
    limitations: [
      "Deterministic local balances, prices, and transactions only",
      "No backend, payments, market data, wallet connection, or persistence",
      "Template-local financial patterns are not released Core or Pro components",
    ],
    indexable: true,
  },
] as const satisfies readonly TemplateDefinition[];

export const templateSlugs = templateCatalog.map((template) => template.slug);

export function getTemplate(slug: string) {
  return templateCatalog.find((template) => template.slug === slug);
}
