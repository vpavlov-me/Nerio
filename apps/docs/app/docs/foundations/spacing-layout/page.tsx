import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Code,
  Field,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";
import { foundationMetadata } from "../../../../lib/generated/foundation-metadata";
import { getFoundationPage } from "../../../../lib/foundations";
import { createPageMetadata } from "../../../../lib/seo";

export const metadata = createPageMetadata(getFoundationPage("/docs/foundations/spacing-layout"));

const { spacing, runtimeAxes } = foundationMetadata;

const spacingLayoutExample = `import { Button } from "@nerio-ui/ui/client";
import { Field, Input } from "@nerio-ui/ui";

<section className="settings-section">
  <Field label="Workspace name">
    <Input defaultValue="Northstar operations" />
  </Field>
  <div className="settings-actions">
    <Button variant="secondary">Cancel</Button>
    <Button>Save changes</Button>
  </div>
</section>

/* Product composition: Core tokens, consumer-owned layout. */
.settings-section {
  display: grid;
  min-inline-size: 0;
  gap: var(--n-density-space-lg);
}

.settings-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--n-density-space-md);
}`;

const responsibilityRows = [
  [
    "Nerio Core",
    "The primitive spacing scale, comfortable and compact density aliases, component-internal geometry, logical-property guidance, and resilient behavior for component-owned content and overflow.",
  ],
  [
    "Product team",
    "Application shells, page grids, breakpoints, container strategy, route layouts, content priority, table or chart overflow policy, and product-specific spacing aliases.",
  ],
  [
    "Nerio Pro",
    "Reusable product shells, dashboard sections, domain layouts, templates, and advanced composition systems built from Core contracts.",
  ],
] as const;

const selectionRows = [
  [
    "Component contract",
    "Use the component's existing gap, padding, size, and geometry aliases first. They preserve anatomy and can respond to density without product code duplicating the recipe.",
  ],
  [
    "Semantic density alias",
    "Use --n-density-space-md, --n-density-space-lg, or --n-density-space-xl for recurring product composition that should intentionally tighten in compact density.",
  ],
  [
    "Primitive step",
    "Use an immutable --n-space-* step for a local product relationship only when no reviewed component or semantic role exists.",
  ],
  [
    "Local semantic token",
    "Promote a repeated product relationship into a product-owned alias when its meaning is stable across several independent screens. Do not add it to Core without shared evidence.",
  ],
] as const;

const rhythmRows = [
  ["Inside one control", "Keep the component's own padding and internal gap contract."],
  [
    "Related controls",
    "Use a small repeatable gap and keep labels, help, and errors with their field.",
  ],
  [
    "Repeated rows",
    "Preserve scanning alignment; let density tighten row geometry without hiding content.",
  ],
  [
    "Sections",
    "Use stronger separation than inside a group. Prefer whitespace before another card or border.",
  ],
  ["Page composition", "Let the product define grid, breakpoint, hierarchy, and container policy."],
] as const;

const resilienceRows = [
  [
    "Intrinsic sizing",
    "Give flex and grid children min-inline-size: 0 where content must shrink. Avoid fixed block sizes for labels, descriptions, errors, and translated content.",
  ],
  [
    "Wrapping",
    "Wrap labels and action groups by default. Treat truncation as a product decision and keep essential full content available.",
  ],
  [
    "Zoom and reflow",
    "Keep information and operation available at 200% and 400% zoom and at 320 CSS pixels without page-level two-dimensional scrolling.",
  ],
  [
    "Long localization",
    "Test expanded labels, helper and error text, mixed scripts, and realistic translated strings. Content-driven block growth is expected.",
  ],
  [
    "Overflow ownership",
    "A component owns overflow created by its anatomy. The product owns unbounded application data and content-priority policy.",
  ],
  [
    "Tables and charts",
    "Keep genuinely two-dimensional content in a labeled horizontal scroll container instead of forcing the whole page to scroll sideways.",
  ],
  [
    "Viewport edges",
    "Safe-area and dynamic-viewport behavior belongs to a component only when it owns a viewport edge; otherwise the application shell owns it.",
  ],
] as const;

const directionRows = [
  ["Spacing", "Prefer margin-inline, padding-inline, margin-block, padding-block, and gap."],
  ["Placement", "Prefer inset-inline and logical alignment. Inherit the document dir value."],
  [
    "Physical sides",
    "Use left or right only when the public API deliberately describes a physical side, then test the result in both LTR and RTL.",
  ],
] as const;

const checklist = [
  "Start with the existing component geometry contract before choosing a density alias or primitive step.",
  "Use proximity, alignment, and whitespace for hierarchy before adding another surface or border.",
  "Review comfortable and compact density without shrinking text, focus, targets, or available content arbitrarily.",
  "Exercise narrow containers, 320 CSS pixel reflow, 200% zoom, text spacing, and long localized content.",
  "Confirm flex and grid children can shrink, actions wrap, and essential text remains available.",
  "Keep tables and charts in bounded horizontal scroll containers when their two-dimensional structure requires it.",
  "Repeat direction-sensitive compositions in RTL and use logical properties by default.",
  "Keep page grids, breakpoints, application shells, routing layouts, and domain hierarchy consumer- or Pro-owned.",
] as const;

function shownValue(mapping: { value: string; reference: string | null }) {
  return mapping.reference ?? mapping.value;
}

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Spacing &amp; layout</h1>
        <p className="doc-lede">
          Nerio owns spacing values, density-aware component geometry, and resilient component
          behavior. Products compose those contracts into grids, shells, routes, and domain
          hierarchy without turning application layout into a Core primitive.
        </p>
      </header>

      <section className="doc-section">
        <h2 id="responsibility-model">Responsibility model</h2>
        <TableContainer aria-label="Spacing and layout responsibility model">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Owner</TableHead>
                <TableHead>Responsibility</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responsibilityRows.map(([owner, responsibility]) => (
                <TableRow key={owner}>
                  <TableCell>{owner}</TableCell>
                  <TableCell>{responsibility}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="spacing-architecture">Spacing architecture</h2>
        <p>
          Choose the most specific durable contract. Components use their own aliases; product
          composition may use semantic density aliases or immutable primitive steps without creating
          a parallel spacing source.
        </p>
        <TableContainer aria-label="Spacing token selection order">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Layer</TableHead>
                <TableHead>Selection rule</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectionRows.map(([layer, rule]) => (
                <TableRow key={layer}>
                  <TableCell>{layer}</TableCell>
                  <TableCell>{rule}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="primitive-scale">Source-backed primitive scale</h2>
        <p>
          These values render from <Code>spacing.primitiveScale</Code>, projected from the canonical
          token CSS. Primitive spacing stays unchanged across theme, mode, and density.
        </p>
        <TableContainer aria-label="Source-backed primitive spacing scale">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>16 px equivalent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spacing.primitiveScale.map((step) => (
                <TableRow key={step.token}>
                  <TableCell>{step.name.replace("-", ".")}</TableCell>
                  <TableCell>
                    <Code>{step.token}</Code>
                  </TableCell>
                  <TableCell>
                    <Code>{step.value}</Code>
                  </TableCell>
                  <TableCell>{step.pixels ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="density">Density and component geometry</h2>
        <p>
          Comfortable is the default. Compact remaps semantic and component contracts; it does not
          redefine primitive spacing or automatically reduce text size, visible focus, content, or
          usable interaction targets.
        </p>
        <TableContainer aria-label="Source-backed density spacing aliases">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Density</TableHead>
                <TableHead>Alias</TableHead>
                <TableHead>Mapping</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runtimeAxes.density.mappings.flatMap((mapping) =>
                mapping.aliases.map((alias) => (
                  <TableRow key={`${mapping.value}-${alias.token}`}>
                    <TableCell>
                      {mapping.value === runtimeAxes.density.defaultValue
                        ? `${mapping.value} (default)`
                        : mapping.value}
                    </TableCell>
                    <TableCell>
                      <Code>{alias.token}</Code>
                    </TableCell>
                    <TableCell>
                      <Code>{shownValue(alias)}</Code>
                    </TableCell>
                  </TableRow>
                )),
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer aria-label="Source-backed component spacing aliases">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component contract</TableHead>
                <TableHead>Default mapping</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spacing.componentAliases.map((alias) => (
                <TableRow key={alias.token}>
                  <TableCell>
                    <Code>{alias.token}</Code>
                  </TableCell>
                  <TableCell>
                    <Code>{shownValue(alias)}</Code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="applied-examples">Applied examples</h2>
        <p>
          The preview composes existing public components. The narrow settings panel, field group,
          wrapping action toolbar, section spacing, repeated table rows, and horizontal overflow
          policy remain product composition rather than a new Grid, Stack, Container, application
          shell, or breakpoint API.
        </p>
        <section className="component-example" aria-label="Spacing and layout examples">
          <div className="component-example__preview spacing-layout-preview">
            <Card className="spacing-layout-panel" aria-label="Workspace settings example">
              <CardHeader>
                <CardTitle as="h3">Workspace settings</CardTitle>
                <CardDescription>
                  Keep long labels, helper text, and translated content available in narrow panels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="spacing-layout-fields">
                  <Field
                    label="Workspace name for regional operations"
                    description="This name appears in navigation, invitations, and audit exports."
                  >
                    <Input defaultValue="Northstar operations" />
                  </Field>
                  <Field label="Support contact">
                    <Input type="email" defaultValue="operations@example.com" />
                  </Field>
                </div>
                <div className="spacing-layout-toolbar" aria-label="Workspace settings actions">
                  <Button variant="secondary">Cancel</Button>
                  <Button>Save changes</Button>
                </div>
              </CardContent>
            </Card>

            <Card
              className="spacing-layout-panel"
              variant="secondary"
              aria-label="Team access example"
            >
              <CardHeader>
                <CardTitle as="h3">Team access</CardTitle>
                <CardDescription>
                  Repeated rows keep scanning alignment while compact density tightens component
                  contracts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TableContainer
                  className="spacing-layout-table"
                  aria-label="Team access with horizontal overflow"
                  focusable
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workspace member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Last active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Alex Morgan</TableCell>
                        <TableCell>Administrator</TableCell>
                        <TableCell>Today</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Samira Okafor</TableCell>
                        <TableCell>Operations analyst</TableCell>
                        <TableCell>Yesterday</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </div>
          <CodeExample
            className="component-example__code"
            label="Spacing and layout example code"
            code={spacingLayoutExample}
          />
        </section>
      </section>

      <section className="doc-section">
        <h2 id="rhythm-and-hierarchy">Rhythm and hierarchy</h2>
        <p>
          Proximity establishes hierarchy before decorative containers. Use consistent
          relationships, not one rigid page grid, so dense operational interfaces and quieter
          editorial surfaces can share the same Core primitives.
        </p>
        <TableContainer aria-label="Spacing rhythm hierarchy">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Relationship</TableHead>
                <TableHead>Guidance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rhythmRows.map(([relationship, guidance]) => (
                <TableRow key={relationship}>
                  <TableCell>{relationship}</TableCell>
                  <TableCell>{guidance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="resilient-layout">Resilient layout</h2>
        <TableContainer aria-label="Resilient layout expectations">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk</TableHead>
                <TableHead>Expectation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resilienceRows.map(([risk, expectation]) => (
                <TableRow key={risk}>
                  <TableCell>{risk}</TableCell>
                  <TableCell>{expectation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          The <a href="/docs/foundations/accessibility">Accessibility foundation</a> defines the
          complete reflow, zoom, text-spacing, target, focus, and evidence boundary. Product teams
          still validate their real content and workflows.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="direction">Direction and logical properties</h2>
        <TableContainer aria-label="Logical property guidance">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concern</TableHead>
                <TableHead>Guidance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {directionRows.map(([concern, guidance]) => (
                <TableRow key={concern}>
                  <TableCell>{concern}</TableCell>
                  <TableCell>{guidance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          See the <a href="/docs/foundations/localization">Localization foundation</a> for the
          inherited <Code>dir</Code> contract, DirectionProvider boundary, deterministic locale
          output, and consumer-owned translation policy.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="review-checklist">Review checklist</h2>
        <ul className="doc-list">
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          Run <Code>pnpm validate:foundation-metadata</Code>, <Code>pnpm validate:docs</Code>,{" "}
          <Code>pnpm test:a11y</Code>, <Code>pnpm test:browser:pr</Code>,{" "}
          <Code>pnpm validate:route-budgets</Code>, and the production build. Automated checks do
          not replace manual review at narrow widths, browser zoom, text-spacing overrides, long
          localization, LTR/RTL, and both density values.
        </p>
        <p>
          Known limitations: Nerio does not expose a public Grid, Stack, Container, breakpoint,
          container-query abstraction, application shell, dashboard layout, or a density value
          beyond comfortable and compact. Those remain consumer, Pro, or separately reviewed future
          work.
        </p>
      </section>
    </article>
  );
}
