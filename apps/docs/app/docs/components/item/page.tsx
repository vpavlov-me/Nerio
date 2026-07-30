import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Check, FileText, X } from "@nerio-ui/adapters/icons";
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
  ItemMedia,
  ItemTitle,
} from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { StandardDocPage } from "../../../../components/doc-page";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";

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
    />
  );
}
