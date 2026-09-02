import type * as React from "react";
import { Check, X } from "@nerio-ui/adapters/icons";
import { getRegistryItem } from "@nerio-ui/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { CodeExample } from "./code-example";
import { sourceInstallCommand } from "../lib/public-commands";
import { DocumentationTable } from "./documentation-table";
import {
  anatomyFromSlots,
  componentMetadata,
  componentReference,
  sharedTokens,
  snippets,
  variantsFromRegistry,
} from "./component-reference";
import type { ReferenceSection } from "./component-reference";
import { PreviewIsland } from "./doc-page-preview-registry";

export function StandardDocPage({
  title,
  lede,
  kind,
  preview,
  sectionContent,
}: {
  title: string;
  lede: string;
  kind?: string;
  preview?: React.ReactNode;
  sectionContent?: Partial<
    Record<
      | "variants"
      | "anatomy"
      | "states"
      | "api"
      | "implementation"
      | "guidance"
      | "related"
      | "tokens",
      React.ReactNode
    >
  >;
}) {
  const reference = kind ? componentReference[kind] : undefined;
  const metadata = kind ? componentMetadata[kind] : undefined;
  const registryItem = kind ? getRegistryItem(kind) : undefined;
  const usage = kind ? snippets[kind] : undefined;
  const fallbackAnatomy = reference?.anatomy ?? [
    {
      title: "root",
      description:
        "Component root with data-slot attributes, semantic tokens, and visible focus states.",
    },
  ];
  const fallbackVariants = reference?.variants ?? [
    {
      title: "Default",
      description: "Default variant uses semantic tokens and adapts across themes.",
    },
  ];
  const anatomy = anatomyFromSlots(registryItem?.slots ?? [], fallbackAnatomy);
  const variants = variantsFromRegistry(registryItem?.variants ?? [], fallbackVariants);
  const accessibility = registryItem?.accessibility ?? reference?.accessibility;
  const tokens = registryItem?.requiredTokens ?? reference?.tokens ?? sharedTokens;
  const packageImports = usage
    ?.split("\n")
    .filter((line) => line.startsWith("import "))
    .join("\n");
  const installation = kind
    ? [sourceInstallCommand(kind), packageImports].filter(Boolean).join("\n\n")
    : undefined;

  return (
    <article className="doc-page">
      <header>
        <h1>{title}</h1>
        <p className="doc-lede">{lede}</p>
      </header>
      <section className="doc-section">
        <h2 id="overview">Overview and decision boundary</h2>
        <p>{reference?.purpose ?? lede}</p>
        {reference?.guidance.dont[0] ? (
          <p className="doc-decision-boundary">{reference.guidance.dont[0]}</p>
        ) : null}
      </section>
      {preview ?? (kind ? <PreviewIsland kind={kind} snippet={usage ?? ""} /> : null)}
      {installation ? (
        <section className="doc-section">
          <h2 id="installation">Installation and imports</h2>
          <p>
            Install the editable registry source, or use the matching package entrypoint when the
            product keeps Nerio as a workspace dependency.
          </p>
          <CodeExample code={installation} label={`${title} installation and import`} />
        </section>
      ) : null}
      <section className="doc-section">
        <h2 id="usage">Usage</h2>
        {usage ? <CodeExample code={usage} label={`${title} usage`} /> : null}
      </section>
      <section className="doc-section">
        <h2 id="variants">Variants</h2>
        {sectionContent?.variants ?? <ReferenceTable firstColumn="Variant" items={variants} />}
      </section>
      <section className="doc-section">
        <h2 id="anatomy">Anatomy</h2>
        {sectionContent?.anatomy ?? <ReferenceTable firstColumn="Slot" items={anatomy} />}
      </section>
      <section className="doc-section">
        <h2 id="states">States</h2>
        {sectionContent?.states ?? (
          <ReferenceTable
            firstColumn="State"
            items={
              reference?.states ?? [
                {
                  title: "Default",
                  description:
                    "Default, hover, focus, disabled, and error states follow Nerio tokens.",
                },
              ]
            }
          />
        )}
      </section>
      <section className="doc-section">
        <h2 id="motion">Motion</h2>
        <ul className="doc-list">
          {(
            reference?.motion ??
            metadata?.motion ?? [
              "State changes should use shared motion tokens and preserve reduced-motion behavior.",
            ]
          ).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="doc-section">
        <h2 id="accessibility">Accessibility</h2>
        <ul className="doc-list">
          {(
            accessibility ?? [
              "Prefer semantic HTML, accessible names, keyboard-reachable controls, and tokenized contrast that remains stable across themes.",
            ]
          ).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          Review the shared responsibility and evidence boundaries in the{" "}
          <a href="/docs/foundations/accessibility">Accessibility foundation</a> alongside this
          component-specific contract. Use the{" "}
          <a href="/docs/foundations/spacing-layout">Spacing &amp; layout foundation</a> for shared
          density, wrapping, overflow, reflow, and component-versus-product ownership guidance. The{" "}
          <a href="/docs/foundations/color">Color foundation</a> and{" "}
          <a href="/docs/foundations/typography">Typography foundation</a> define the shared
          visual-role and text-resilience boundaries used by component examples. Component pages
          document any direction-sensitive or localizable behavior that belongs to their stable
          contract.
        </p>
      </section>
      <section className="doc-section">
        <h2 id="api">API</h2>
        {sectionContent?.api ?? (
          <ReferenceTable
            firstColumn="Prop"
            items={
              reference?.api ?? [
                {
                  title: "className",
                  description:
                    "Extends the component root while preserving Nerio tokenized defaults.",
                },
              ]
            }
          />
        )}
      </section>
      {registryItem ? (
        <section className="doc-section">
          <h2 id="implementation-contract">Implementation contract</h2>
          {sectionContent?.implementation ?? (
            <DocumentationTable
              headers={["Contract", "Value"]}
              rows={[
                [
                  "Registry item",
                  `${registryItem.name} installs ${registryItem.files.length} source file${registryItem.files.length === 1 ? "" : "s"} into the configured components directory.`,
                ],
                [
                  "Base UI",
                  registryItem.baseUiPrimitives.length
                    ? registryItem.baseUiPrimitives.join(", ")
                    : "No interactive primitive required.",
                ],
                [
                  "Registry dependencies",
                  registryItem.registryDependencies.length
                    ? registryItem.registryDependencies.join(", ")
                    : "None.",
                ],
                [
                  "Package dependencies",
                  registryItem.dependencies.length
                    ? registryItem.dependencies.join(", ")
                    : "No external package dependency.",
                ],
              ]}
              codeColumns={1}
            />
          )}
        </section>
      ) : null}
      <section className="doc-section">
        <h2 id="styling-contract">Styling contract</h2>
        <DocumentationTable
          headers={["Contract", "Value"]}
          rows={[
            [
              "Authoring",
              "Complete, statically detectable Tailwind CSS v4 recipes own component visuals.",
            ],
            [
              "Values",
              "Semantic and component --n-* variables remain the canonical customization layer.",
            ],
            [
              "Overrides",
              "Customizable slots merge consumer className values with tailwindCn so conflicting utilities resolve deterministically.",
            ],
            [
              "Residual CSS",
              "Only shared keyframes and scoped no-Preflight compatibility rules remain; there is no parallel visual selector layer.",
            ],
          ]}
        />
      </section>
      <section className="doc-section">
        <h2 id="design-notes">Design notes</h2>
        <ul className="doc-list">
          {(
            reference?.designNotes ?? [
              reference?.purpose ??
                "Use this component as a token-driven Nerio building block inside product workflows.",
            ]
          ).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="doc-section">
        <h2 id="do-do-not">Do / do not</h2>
        {sectionContent?.guidance ?? (
          <div className="doc-guidance-cards">
            <GuidanceCard
              icon={Check}
              title="Do"
              items={
                reference?.guidance.do ?? [
                  "Compose small components around real product workflows.",
                ]
              }
            />
            <GuidanceCard
              icon={X}
              title="Do not"
              items={
                reference?.guidance.dont ?? [
                  "Fork visual values into one-off colors, spacing, or typography inside product code.",
                ]
              }
            />
          </div>
        )}
      </section>
      <section className="doc-section">
        <h2 id="related-components">Related components</h2>
        {sectionContent?.related ?? (
          <div className="doc-related-cards">
            {(reference?.related ?? metadata?.related ?? ["Tokens"]).map((item) => {
              const related = getRelatedComponent(item);

              return (
                <Card
                  key={item}
                  className="doc-related-card"
                  href={related.href}
                  variant="secondary"
                >
                  <CardHeader>
                    <CardTitle>{item}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{related.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
      <section className="doc-section">
        <h2 id="tokens">Tokens</h2>
        {sectionContent?.tokens ?? (
          <>
            <p>
              These are the primary customization points. Override semantic or component tokens
              instead of changing component source.
            </p>
            <DocumentationTable
              headers={["Token", "Purpose"]}
              rows={tokens.map((token) => [
                token,
                "Public customization point for this component contract.",
              ])}
              codeColumns={1}
            />
          </>
        )}
      </section>
    </article>
  );
}

function ReferenceTable({
  firstColumn,
  items,
}: {
  firstColumn: string;
  items: ReferenceSection[];
}) {
  return (
    <DocumentationTable
      headers={[firstColumn, "Purpose"]}
      rows={items.map((item) => [item.title, item.description])}
      codeColumns={1}
    />
  );
}

function GuidanceCard({
  icon,
  title,
  items,
}: {
  icon: React.ComponentProps<typeof Icon>["icon"];
  title: string;
  items: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <Icon icon={icon} />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </CardContent>
    </Card>
  );
}

const relatedRouteAliases: Record<string, string> = {
  "Command Primitive": "command-primitive",
  "Empty State": "empty-state",
  "Sidebar Primitive": "sidebar-primitive",
};

const relatedFoundationRoutes: Record<string, string> = {
  Accessibility: "/docs/foundations/accessibility",
  Color: "/docs/foundations/color",
  Effects: "/docs/foundations/effects",
  Heading: "/docs/foundations/typography",
  "Icon Adapter": "/docs/foundations/icons",
  Motion: "/docs/foundations/motion",
  Radius: "/docs/foundations/radius",
  "Spacing & layout": "/docs/foundations/spacing-layout",
  Text: "/docs/foundations/typography",
  Themes: "/docs/foundations/themes",
  Tokens: "/docs/foundations/tokens",
};

function getRelatedComponent(name: string) {
  const foundationHref = relatedFoundationRoutes[name];
  const alias = relatedRouteAliases[name];

  if (foundationHref) {
    return {
      href: foundationHref,
      description: `Customize ${name.toLowerCase()} through the shared Nerio foundation.`,
    };
  }

  const slug =
    alias ??
    name
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/\s+/g, "-")
      .toLowerCase();
  const relatedReference = componentReference[slug];
  const relatedMetadata = componentMetadata[slug];

  return {
    href: `/docs/components/${slug}`,
    description:
      relatedReference?.purpose ??
      relatedMetadata?.description ??
      `Use ${name} alongside this component when the product context calls for it.`,
  };
}
