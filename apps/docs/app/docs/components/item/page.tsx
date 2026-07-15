import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
  X,
} from "@nerio-ui/adapters/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  Skeleton,
} from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { StandardDocPage } from "../../../../components/doc-page";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";
import { ItemAvatarExample } from "../../../../components/item-avatar-example";

export const metadata: Metadata = {
  title: "Item component",
  description: "Compose compact content, media, and actions without imposing list semantics.",
};

function ProductItem({
  action,
  children,
  description,
  title,
  variant = "plain",
}: {
  action: string;
  children: ReactNode;
  description: string;
  title: string;
  variant?: "plain" | "outline" | "soft";
}) {
  return (
    <Item variant={variant}>
      <ItemMedia variant="icon">{children}</ItemMedia>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="secondary">
          {action}
        </Button>
      </ItemActions>
    </Item>
  );
}

function ItemPreview() {
  return (
    <section id="preview" className="component-example" aria-label="Item preview">
      <div className="component-example__preview">
        <ProductItem
          action="Open"
          description="Updated today · 12 collaborators have access."
          title="Research brief"
          variant="outline"
        >
          <FileText aria-hidden />
        </ProductItem>
      </div>
      <CodeExample
        className="component-example__code"
        label="Item live preview code"
        code={
          'import { FileText } from "@nerio-ui/adapters/icons";\nimport { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@nerio-ui/ui";\nimport { Button } from "@nerio-ui/ui/client";\n\n<Item variant="outline">\n  <ItemMedia variant="icon"><FileText /></ItemMedia>\n  <ItemContent>\n    <ItemTitle>Research brief</ItemTitle>\n    <ItemDescription>Updated today · 12 collaborators have access.</ItemDescription>\n  </ItemContent>\n  <ItemActions><Button size="sm" variant="secondary">Open</Button></ItemActions>\n</Item>'
        }
      />
    </section>
  );
}

export default function ItemPage() {
  return (
    <StandardDocPage
      kind="item"
      lede="A flexible composition primitive for compact product content, media, metadata, and independent actions."
      title="Item"
      preview={<ItemPreview />}
      sectionContent={{
        anatomy: (
          <section className="component-example" aria-label="Item anatomy preview">
            <div className="component-example__preview">
              <pre>{`ItemGroup
└── Item
    ├── ItemHeader
    ├── ItemMedia
    ├── ItemContent
    │   ├── ItemTitle
    │   └── ItemDescription
    ├── ItemActions
    └── ItemFooter`}</pre>
            </div>
          </section>
        ),
        variants: (
          <section className="component-example" aria-label="Item variants preview">
            <div className="component-example__preview item-doc-preview">
              <ProductItem
                action="Open"
                description="Updated today · 12 collaborators have access."
                title="Research brief"
              >
                <FileText aria-hidden />
              </ProductItem>
              <ProductItem
                action="Manage"
                description="Billing, access, and workspace preferences."
                title="Team workspace"
                variant="outline"
              >
                <LayoutDashboard aria-hidden />
              </ProductItem>
              <ProductItem
                action="View"
                description="Three suggestions are ready for review."
                title="Product updates"
                variant="soft"
              >
                <Sparkles aria-hidden />
              </ProductItem>
            </div>
          </section>
        ),
        states: (
          <section className="component-example" aria-label="Item states preview">
            <div className="component-example__preview item-doc-preview">
              <Item data-selected>
                <ItemContent>
                  <ItemTitle>Selected workspace</ItemTitle>
                  <ItemDescription>
                    Uses a neutral selected surface without owning selection state.
                  </ItemDescription>
                </ItemContent>
              </Item>
              <Item aria-disabled="true" variant="outline">
                <ItemContent>
                  <ItemTitle>Archived integration</ItemTitle>
                  <ItemDescription>
                    This static item communicates unavailable content.
                  </ItemDescription>
                </ItemContent>
              </Item>
              <Item data-loading variant="outline">
                <ItemMedia>
                  <Skeleton aria-label="Loading media" className="item-loading-media" />
                </ItemMedia>
                <ItemContent>
                  <Skeleton aria-label="Loading title" className="item-loading-title" />
                  <Skeleton aria-label="Loading description" className="item-loading-description" />
                </ItemContent>
              </Item>
            </div>
          </section>
        ),
        api: (
          <DocumentationTable
            headers={["Part", "API", "Purpose"]}
            rows={[
              [
                "Item",
                "variant | size | render",
                "Root composition; render a native interactive element when needed. Existing render refs compose with the forwarded ref.",
              ],
              [
                "ItemMedia",
                "default | icon | image",
                "Supports visual media. Compose Avatar directly instead of adding an avatar mode.",
              ],
              [
                "ItemGroup / ItemSeparator",
                "children",
                "Groups related items without list semantics or automatic dividers.",
              ],
              [
                "Content slots",
                "ItemContent | ItemTitle | ItemDescription | ItemActions | ItemHeader | ItemFooter",
                "Independent layout regions with native props, refs, className, and stable data slots.",
              ],
            ]}
          />
        ),
        guidance: (
          <div className="doc-guidance-cards">
            <Card>
              <CardHeader>
                <Icon icon={Check} />
                <CardTitle>Use Item</CardTitle>
              </CardHeader>
              <CardContent>
                For settings rows, integrations, results, files, people, and compact content inside
                overlays.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not use Item</CardTitle>
              </CardHeader>
              <CardContent>
                For form-control labels, selectable listbox behavior, data tables, or a
                product-specific activity feed.
              </CardContent>
            </Card>
          </div>
        ),
        implementation: (
          <DocumentationTable
            headers={["Contract", "Value"]}
            codeColumns={1}
            rows={[
              ["Registry item", "item installs Item with the Separator registry dependency."],
              ["Base UI", "No interactive primitive required."],
              ["Registry dependencies", "separator"],
              ["Package dependencies", "@nerio-ui/adapters, clsx, react"],
            ]}
          />
        ),
        related: (
          <div className="doc-related-cards">
            {[
              [
                "List",
                "Add semantic list structure when a collection needs it.",
                "/docs/components/list",
              ],
              [
                "Card",
                "Use a container when grouped content needs its own surface.",
                "/docs/components/card",
              ],
              [
                "Separator",
                "Divide adjacent content regions without changing their meaning.",
                "/docs/components/separator",
              ],
            ].map(([title, description, href]) => (
              <Card key={title} className="doc-related-card" href={href} variant="secondary">
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        ),
      }}
      sectionPreviews={{
        api: (
          <section className="component-example" aria-label="Item composition preview">
            <div className="component-example__preview">
              <ItemGroup>
                <Item render={<a href="#workspace" />}>
                  <ItemMedia variant="icon">
                    <Settings aria-hidden />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Workspace settings</ItemTitle>
                    <ItemDescription>Members, billing, and security.</ItemDescription>
                  </ItemContent>
                  <ItemActions aria-hidden>
                    <ArrowRight />
                  </ItemActions>
                </Item>
                <ItemSeparator />
                <ItemAvatarExample />
              </ItemGroup>
            </div>
          </section>
        ),
        usage: (
          <section className="component-example" aria-label="Rich Item usage preview">
            <div className="component-example__preview">
              <Item size="lg" variant="outline">
                <ItemHeader>Shared resource</ItemHeader>
                <ItemMedia variant="image">
                  <FileText aria-hidden />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Q3 research brief</ItemTitle>
                  <ItemDescription>
                    Interview synthesis, customer themes, and decisions for the next planning cycle.
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button size="sm" variant="secondary">
                    Configure
                  </Button>
                  <Button size="sm" variant="ghost">
                    Remove
                  </Button>
                </ItemActions>
                <ItemFooter>Last edited by Maya Chen · Shared with Product</ItemFooter>
              </Item>
            </div>
          </section>
        ),
      }}
    />
  );
}
