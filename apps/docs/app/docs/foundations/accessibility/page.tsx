import {
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
import { CodeExample } from "../../../../components/code-example";
import { createPageMetadata } from "../../../../lib/seo";
import { getFoundationPage } from "../../../../lib/foundations";

export const metadata = createPageMetadata(getFoundationPage("/docs/foundations/accessibility"));

const accessibleFieldExample = `import { Field, Input } from "@nerio-ui/ui";

<Field
  label="Project name"
  description="Use a short name that collaborators will recognize."
>
  <Input name="projectName" autoComplete="organization" required />
</Field>`;

const responsibilityRows = [
  [
    "Nerio Core",
    "Component semantics, names and state exposure where Core owns them, keyboard and focus behavior, reduced-motion and forced-colors support, tokenized focus and contrast contracts, and representative automated and manual test infrastructure.",
  ],
  [
    "Product team",
    "Page landmarks, heading order, workflow semantics, product copy and errors, routing and permissions, live announcements for product data, custom-theme contrast, local source changes, and end-to-end assistive-technology and device validation.",
  ],
  [
    "Nerio Pro",
    "Accessibility contracts and evidence for Pro-only components, templates, and domain workflows, using the Core foundation as the minimum baseline.",
  ],
] as const;

const invariantRows = [
  [
    "Semantics and native behavior",
    "Start with semantic HTML or the corresponding Base UI primitive. Preserve native relationships, roles, states, and form behavior when composing or changing the render target.",
  ],
  [
    "Names, descriptions, and errors",
    "Every interactive element needs a stable accessible name. Associate help and errors with the correct control; do not use placeholder text or a Tooltip as the only label.",
  ],
  [
    "Keyboard and focus",
    "Follow native or established WAI-ARIA keyboard conventions. Keep focus visible, move it deliberately for modal and composite widgets, and restore it to a logical target after dismissal.",
  ],
  [
    "Contrast and non-color communication",
    "Use semantic tokens for text, controls, meaningful graphics, and focus. Pair status, selection, validation, and urgency colors with text, shape, iconography, or state semantics.",
  ],
  [
    "Pointer and touch",
    "Provide a usable hit area without overlapping adjacent targets. Pointer and touch support must not remove keyboard access or change the control's semantic role.",
  ],
  [
    "Dynamic feedback",
    "Expose loading, success, error, and empty states in persistent content when practical. Use concise polite announcements for routine updates and reserve assertive announcements for genuine urgency.",
  ],
] as const;

const resilienceRows = [
  [
    "Zoom and reflow",
    "Keep information and operation available at 200% and 400% zoom and in a 320 CSS pixel-wide viewport. Avoid two-dimensional page scrolling except where the content itself requires it, such as a data table.",
  ],
  [
    "Text resize and spacing",
    "Allow browser text resizing and user text-spacing overrides without clipping labels, descriptions, errors, or actions. Do not use fixed heights for content-bearing regions.",
  ],
  [
    "Long and localized content",
    "Wrap by default. Treat truncation as an explicit product decision and provide access to essential full content. Test realistic expansion, narrow containers, mixed-direction identifiers, and long messages.",
  ],
  [
    "Direction and locale",
    "Set or inherit the document direction intentionally. Test direction-sensitive layout and keyboard behavior in RTL; keep language, locale, direction, and product formatting as separate decisions.",
  ],
  [
    "Viewport edges",
    "Components that own viewport edges define dynamic-viewport and safe-area behavior. The application shell owns those concerns for ordinary page content.",
  ],
] as const;

const preferenceRows = [
  [
    "Reduced motion",
    "Remove nonessential travel and preserve the final state, information, order, and operation when prefers-reduced-motion is active.",
  ],
  [
    "Forced colors",
    "Preserve control boundaries, state, selection, and visible focus without depending on authored background colors or shadows.",
  ],
  [
    "Increased contrast",
    "Review real component states with the platform preference enabled. Do not claim automated equivalence for operating-system rendering that CI cannot reproduce.",
  ],
  [
    "Custom themes and source changes",
    "Re-run contrast, focus, forced-colors, motion, zoom, and assistive-technology checks after overriding tokens, changing component source, or integrating third-party content.",
  ],
] as const;

const evidenceRows = [
  [
    "Type contracts",
    <Code key="types">pnpm typecheck</Code>,
    "Public TypeScript contracts, server and client entrypoint boundaries, and strict consumer-facing types.",
  ],
  [
    "Component contracts",
    <Code key="ui">pnpm test:ui</Code>,
    "Semantics, relationships, state, keyboard behavior, focus handling, and source-install contracts in the tested surface.",
  ],
  [
    "Automated accessibility",
    <Code key="a11y">pnpm test:a11y</Code>,
    "Representative roles, names, descriptions, state exposure, focus behavior, announcements, and automated axe rules.",
  ],
  [
    "Browser behavior",
    <Code key="browser">pnpm test:browser:pr</Code>,
    "Chromium page health and representative keyboard, focus, responsive, RTL, reduced-motion, overlay, and form behavior for a development PR.",
  ],
  [
    "Documentation contracts",
    <Code key="docs">pnpm validate:docs</Code>,
    "Route discovery, documented public contracts, examples, and source-backed documentation alignment.",
  ],
  [
    "Manual evidence",
    "Issue #143",
    "VoiceOver, NVDA, TalkBack, physical iOS and Android devices, keyboard-only use, 200%/400% zoom and reflow, reduced motion, and increased or high contrast. This evidence is pending until recorded against one locked candidate.",
  ],
] as const;

const checklist = [
  "Choose native HTML or the matching Base UI primitive before adding custom behavior.",
  "Verify the accessible name, description, error relationship, role, state, and reading order.",
  "Complete the interaction with keyboard alone and confirm focus remains visible and logical.",
  "Check hover, focus, selected, disabled, read-only, loading, invalid, success, error, and empty states where they apply.",
  "Review text and non-text contrast and make every state understandable without color alone.",
  "Test pointer and touch targets without weakening keyboard operation.",
  "Exercise zoom, text resize, text spacing, 320 CSS pixel reflow, long content, and narrow containers.",
  "Repeat direction-sensitive behavior in RTL and review reduced motion, forced colors, and increased contrast.",
  "Run the automated checks, then record the remaining assistive-technology and physical-device evidence separately.",
] as const;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Accessibility</h1>
        <p className="doc-lede">
          Accessibility is a system invariant shared by Nerio Core and the product that composes it.
          Components provide bounded guarantees; the complete product still requires its own
          content, composition, assistive-technology, and device evidence.
        </p>
      </header>

      <section className="doc-section">
        <h2 id="responsibility-model">Responsibility model</h2>
        <p>
          Using Nerio does not automatically make a product conform to WCAG. Core can preserve the
          contract it owns, but it cannot infer product semantics, workflow order, custom-theme
          contrast, application announcements, or the effect of local source changes.
        </p>
        <TableContainer aria-label="Accessibility responsibility model">
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
        <h2 id="applied-example">Applied example</h2>
        <p>
          Start with a visible label and keep supporting text programmatically associated with the
          control. Native form semantics remain available while Field supplies stable ids and
          relationships.
        </p>
        <section className="component-example" aria-label="Accessibility example preview">
          <div className="component-example__preview form-component-preview form-component-preview--input">
            <div className="form-preview-stack form-component-preview__stack">
              <Field
                label="Project name"
                description="Use a short name that collaborators will recognize."
              >
                <Input name="projectName" autoComplete="organization" required />
              </Field>
            </div>
          </div>
          <CodeExample
            className="component-example__code"
            code={accessibleFieldExample}
            label="Accessibility example code"
          />
        </section>
      </section>

      <section className="doc-section">
        <h2 id="system-invariants">System invariants</h2>
        <TableContainer aria-label="Accessibility system invariants">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invariant</TableHead>
                <TableHead>Contract</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invariantRows.map(([invariant, contract]) => (
                <TableRow key={invariant}>
                  <TableCell>{invariant}</TableCell>
                  <TableCell>{contract}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          Component pages remain authoritative for component-specific roles, keyboard commands, and
          author requirements. This foundation defines the shared review model rather than
          duplicating every component keyboard table.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="resilient-content">Resilient content and layout</h2>
        <TableContainer aria-label="Accessible content and layout resilience">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pressure</TableHead>
                <TableHead>Expected result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resilienceRows.map(([pressure, result]) => (
                <TableRow key={pressure}>
                  <TableCell>{pressure}</TableCell>
                  <TableCell>{result}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          Consumer applications own translation catalogs, routing, product copy, currencies, time
          zones, and domain formatting. Component pages document the stable localizable labels and
          direction-sensitive behavior that Core owns.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="platform-preferences">Platform preferences and customization</h2>
        <p>
          Apply these checks to every foreground/background pair and interaction sequence described
          in the <a href="/docs/foundations/color">Color foundation</a>, especially after custom
          theme overrides.
        </p>
        <TableContainer aria-label="Accessibility platform preferences">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Context</TableHead>
                <TableHead>Review requirement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preferenceRows.map(([context, requirement]) => (
                <TableRow key={context}>
                  <TableCell>{context}</TableCell>
                  <TableCell>{requirement}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          The <a href="/docs/foundations/themes">Themes foundation</a> defines custom-theme review,
          and the <a href="/docs/foundations/motion">Motion foundation</a> defines the shared
          reduced-motion contract. The{" "}
          <a href="/docs/foundations/spacing-layout">Spacing &amp; layout foundation</a> applies the
          reflow, text-growth, overflow, density, and logical-property boundary to product
          composition.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="evidence-model">Automated and manual evidence</h2>
        <p>
          Automated checks are repeatable preparation evidence. They do not prove screen-reader
          speech, touch gestures, native picker usability, operating-system contrast behavior, or
          whether a complete workflow is understandable on a physical device.
        </p>
        <TableContainer aria-label="Accessibility evidence model">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evidence</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>What it establishes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evidenceRows.map(([evidence, source, result]) => (
                <TableRow key={evidence}>
                  <TableCell>{evidence}</TableCell>
                  <TableCell>{source}</TableCell>
                  <TableCell>{result}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          The manual audit is tracked in{" "}
          <a href="https://github.com/vpavlov-me/Nerio/issues/143">GitHub issue #143</a>. Do not
          combine observations from different commits or treat an automated pass as a substitute for
          VoiceOver, NVDA, TalkBack, physical-device, zoom, or high-contrast evidence.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="review-checklist">Implementation and review checklist</h2>
        <ul className="doc-list">
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="doc-section">
        <h2 id="known-limitations">Known limitations</h2>
        <ul className="doc-list">
          <li>
            Nerio targets WCAG 2.2 AA requirements in the contracts it owns, but neither the library
            nor this documentation certifies a consuming product's conformance.
          </li>
          <li>
            The Core 1.0 assistive-technology and real-device evidence remains pending until issue
            #143 records results against one locked candidate.
          </li>
          <li>
            Development PR browser smoke is Chromium-focused. The release gate adds Firefox and
            WebKit, while operating-system assistive technologies and physical mobile devices remain
            manual.
          </li>
          <li>
            Custom themes, local styling, source edits, third-party integrations, product copy, and
            application composition can invalidate a component-level guarantee and must be
            revalidated by the product team.
          </li>
        </ul>
      </section>
    </article>
  );
}
