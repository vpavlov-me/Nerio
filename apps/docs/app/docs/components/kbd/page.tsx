import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon, Kbd } from "@nerio-ui/ui";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const kbdDoc = getComponentDoc("kbd");

export const metadata = createPageMetadata({
  title: "Kbd component",
  description: kbdDoc!.description,
  path: "/docs/components/kbd",
});

const previewCode = `import { Kbd } from '@nerio-ui/ui';

<Kbd>Esc</Kbd>
<Kbd>⌘K</Kbd>
<Kbd>⇧⌘P</Kbd>
<Kbd>⌥←</Kbd>
<Kbd>⌘↵</Kbd>`;

const variantRows = [["Default", "Neutral shortcut notation that adapts through tokens."]] as const;

const anatomyRows = [["kbd", "Native kbd element with quiet shortcut styling."]] as const;

const stateRows = [
  ["Default", "Static supplementary notation with no interactive state."],
] as const;

const apiRows = [
  ["children", "ReactNode", "Shortcut notation such as ⌘S, ⇧⌘P, or Esc."],
  ["className", "string", "Extends the root while preserving tokenized defaults."],
  ["HTML attributes", "HTMLAttributes<HTMLElement>", "Passes native kbd attributes through."],
] as const;

const implementationRows = [
  ["Registry item", "kbd installs 3 source files into the configured components directory."],
  ["Base UI", "No interactive primitive required."],
  ["Registry dependencies", "None."],
  ["Package dependencies", "clsx, react"],
] as const;

const tokenRows = [
  ["Surface", "--n-kbd-background / --n-kbd-border-color", "Quiet key surface and boundary."],
  ["Shape", "--n-kbd-border-width / --n-kbd-radius", "Border weight and corner radius."],
  [
    "Typography",
    "--n-kbd-foreground / --n-kbd-font-family / --n-kbd-font-size / --n-kbd-font-weight",
    "Shortcut legibility and tone.",
  ],
  ["Spacing", "--n-kbd-padding-block / --n-kbd-padding-inline", "Inner key spacing."],
] as const;

function KbdPreview() {
  return (
    <section id="preview" className="component-example" aria-label="Kbd preview">
      <div className="component-example__preview">
        <div className="preview-row">
          <Kbd>Esc</Kbd>
          <Kbd>⌘K</Kbd>
          <Kbd>⇧⌘P</Kbd>
          <Kbd>⌥←</Kbd>
          <Kbd>⌘↵</Kbd>
        </div>
      </div>
      <CodeExample
        className="component-example__code"
        code={previewCode}
        label="Kbd live preview code"
      />
    </section>
  );
}

function KbdSectionPreview({ children }: { children: React.ReactNode }) {
  return <div className="kbd-section-preview">{children}</div>;
}

export default function Page() {
  return (
    <StandardDocPage
      title="Kbd"
      lede="Kbd displays quiet, native keyboard shortcut notation beside actions and commands."
      kind="kbd"
      preview={<KbdPreview />}
      sectionPreviews={{
        anatomy: (
          <KbdSectionPreview>
            <Kbd>⌘K</Kbd>
          </KbdSectionPreview>
        ),
        states: (
          <KbdSectionPreview>
            <Kbd>Esc</Kbd>
          </KbdSectionPreview>
        ),
      }}
      sectionContent={{
        variants: (
          <DocumentationTable headers={["Variant", "Use"]} rows={variantRows} codeColumns={1} />
        ),
        anatomy: (
          <DocumentationTable headers={["Element", "Purpose"]} rows={anatomyRows} codeColumns={1} />
        ),
        states: (
          <DocumentationTable headers={["State", "Behavior"]} rows={stateRows} codeColumns={1} />
        ),
        api: <DocumentationTable headers={["Prop", "Type", "Purpose"]} rows={apiRows} />,
        implementation: (
          <DocumentationTable
            headers={["Contract", "Value"]}
            rows={implementationRows}
            codeColumns={1}
          />
        ),
        guidance: (
          <div className="doc-guidance-cards">
            <Card>
              <CardHeader>
                <Icon icon={Check} />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                Use beside familiar commands when a keyboard shortcut is available.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Use Kbd as an interactive control or a replacement for visible command labels.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards">
            {[
              [
                "Button",
                "Show a shortcut beside a clearly named action.",
                "/docs/components/button",
              ],
              [
                "Tooltip",
                "Provide supplementary help for compact controls.",
                "/docs/components/tooltip",
              ],
              [
                "Tokens",
                "Customize Kbd surface, type, shape, and spacing.",
                "/docs/foundations/tokens",
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
        tokens: <DocumentationTable headers={["Group", "Tokens", "Controls"]} rows={tokenRows} />,
      }}
    />
  );
}
