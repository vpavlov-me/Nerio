export type TemplateStatus = "Preview" | "Experimental";

export type TemplateDefinition = {
  slug: string;
  title: string;
  description: string;
  category: string;
  status: TemplateStatus;
  previewRoute: `/views/${string}`;
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
      "A focused single-page operations dashboard for delivery health, initiatives, owners, and activity.",
    category: "SaaS and operations",
    status: "Preview",
    previewRoute: "/views/operations-workspace",
    audience: "SaaS products, internal tools, admin systems, and operations teams.",
    scenarios: [
      "Single-page workspace overview with a representative product navigation hierarchy",
      "Command search across workspace pages and initiatives with segmented status filtering",
      "Delivery, capacity, operational risk, milestone, cycle-time, and activity context",
      "Status filtering and transient feedback states",
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
      "Avatar",
      "Badge",
      "Button",
      "Card",
      "Command",
      "Dialog",
      "Item",
      "Kbd",
      "Select",
      "Sheet",
      "Sidebar",
      "Stat",
      "Table",
      "Tabs",
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
    audience:
      "Treasury, wealth, fintech, and crypto-adjacent products that need one neutral asset workspace.",
    scenarios: [
      "Consolidated portfolio overview and period movement",
      "Allocation overview with selected asset detail",
      "Completed and pending transaction review",
      "Static transfer preview and sensitive balance controls",
    ],
    runtimeCoverage: [
      "System, light, and dark modes",
      "Comfortable and compact density",
      "LTR and RTL direction",
      "Desktop sidebar and mobile Sheet navigation",
      "Reduced motion, forced colors, and safe-area behavior",
    ],
    componentsUsed: [
      "Alert",
      "Badge",
      "Button",
      "Card",
      "Dialog",
      "Icon",
      "Item",
      "KeyValue",
      "Select",
      "Sheet",
      "Sidebar",
      "Stat",
      "Toggle",
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
