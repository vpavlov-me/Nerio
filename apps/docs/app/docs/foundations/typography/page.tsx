import {
  Badge,
  Code,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@nerio-ui/ui";
import { CodeExample } from "../../../../components/code-example";
import { foundationMetadata } from "../../../../lib/generated/foundation-metadata";
import { createPageMetadata } from "../../../../lib/seo";

function projectedValue(mapping: { value: string; reference: string | null }) {
  return mapping.reference ?? mapping.value;
}

export const metadata = createPageMetadata({
  title: "Typography",
  description:
    "Understand Nerio typography tokens, semantic roles, resilience requirements, and font overrides for readable product interfaces.",
  path: "/docs/foundations/typography",
});

const { scale, presets, semanticRoles, lineHeights } = foundationMetadata.typography;
const scalePurpose: Record<(typeof scale)[number]["token"], string> = {
  "--n-font-size-2xs": "Internal component-scale input; not for product UI text",
  "--n-font-size-xs": "Metadata, badges, and dense captions",
  "--n-font-size-sm": "Labels, helper text, and table cells",
  "--n-font-size-md": "Default UI body and controls",
  "--n-font-size-lg": "Lead copy and compact section intros",
  "--n-font-size-xl": "Small headings",
  "--n-font-size-2xl": "Metric values and page sections",
  "--n-font-size-3xl": "Subsection headings",
  "--n-font-size-4xl": "Section headings",
  "--n-font-size-5xl": "Page headings",
};
const semanticRoleLabels: Record<(typeof semanticRoles)[number]["token"], string> = {
  "--n-body-font-size": "Body size",
  "--n-body-line-height": "Body line height",
  "--n-control-font-size": "Control size",
  "--n-control-font-weight": "Control weight",
  "--n-label-font-size": "Label size",
  "--n-label-font-weight": "Label weight",
  "--n-helper-font-size": "Helper size",
  "--n-helper-line-height": "Helper line height",
};
const lineHeightGuidance: Record<(typeof lineHeights)[number]["token"], string> = {
  "--n-line-height-tight": "Large headings and short display text",
  "--n-line-height-normal": "Default product UI and controls",
  "--n-line-height-relaxed": "Longer descriptions and reading surfaces",
};
const lineHeightLabels: Record<(typeof lineHeights)[number]["token"], string> = {
  "--n-line-height-tight": "Tight",
  "--n-line-height-normal": "Normal",
  "--n-line-height-relaxed": "Relaxed",
};

const validationChecks = [
  [
    "Text resize",
    "Resize text to 200% without clipping, overlap, hidden controls, or loss of information.",
  ],
  [
    "Narrow reflow",
    "Verify equivalent 320 CSS pixel content width; only content requiring two-dimensional layout for usage or meaning may require two-axis scrolling.",
  ],
  [
    "Text spacing",
    "Override line height, paragraph, letter, and word spacing to WCAG 2.2 values without truncation or overlap.",
  ],
  [
    "Localization",
    "Test long translated strings, target scripts, plural forms, and bidirectional content before approving fixed geometry.",
  ],
  [
    "Truncation",
    "Confirm essential content remains available through wrapping, expansion, or an accessible full-value disclosure.",
  ],
  [
    "Numeric data",
    "Check decimal alignment, signs, currencies, percentages, and tabular numerals in dense data surfaces.",
  ],
] as const;

const systemInstall = `@import "@nerio-ui/tokens/styles.css";`;

const geistInstall = `@font-face {
  font-family: "Geist";
  src: url("/fonts/geist-variable.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

/* The font file is supplied by your product. */`;

const geistRecipe = `<div className="n-typography-geist">
  <App />
</div>`;

const customOverride = `:root {
  --n-font-sans: "IBM Plex Sans", var(--n-font-sans-system);
}

.my-product-surface {
  --n-font-sans: "IBM Plex Sans", var(--n-font-sans-system);
}`;

const numericRecipe = `.numeric-column {
  text-align: end;
  font-variant-numeric: tabular-nums;
}`;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Typography</h1>
        <p className="doc-lede">
          Nerio Core defaults to platform System UI so products stay native, neutral, and usable
          without a font request. The typography contract also defines how text survives resize,
          localization, narrow containers, and data-heavy interfaces.
        </p>
      </header>

      <section className="doc-section">
        <div className="section-heading">
          <h2 id="font-contract">Font contract</h2>
          <Badge>System UI by default</Badge>
        </div>
        <TableContainer aria-label="Default font tokens">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Default token</TableHead>
                <TableHead>Use</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Sans</TableCell>
                <TableCell>
                  <Code>--n-font-sans → --n-font-sans-system</Code>
                </TableCell>
                <TableCell>Product UI and body copy</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mono</TableCell>
                <TableCell>
                  <Code>--n-font-mono → --n-font-mono-system</Code>
                </TableCell>
                <TableCell>Code and technical identifiers</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          Native consistency means a product uses each platform&apos;s familiar UI family; it does
          not mean pixels are identical across operating systems. Font family changes remain CSS
          token overrides, not a fourth runtime axis beside theme, mode, and density.
        </p>
        <p>
          A consumer-provided family must cover the scripts and symbols required by the product.
          Keep the system stack as a fallback, then test real target locales rather than assuming a
          Latin-focused family has complete language coverage.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="presets">Typography presets</h2>
        <TableContainer aria-label="Typography preset tokens">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preset</TableHead>
                <TableHead>Sans token</TableHead>
                <TableHead>Mono token</TableHead>
                <TableHead>Font loading</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {presets.map((preset) => (
                <TableRow key={preset.value}>
                  <TableCell>{preset.label}</TableCell>
                  <TableCell>
                    <Code>{projectedValue(preset.sans)}</Code>
                  </TableCell>
                  <TableCell>
                    <Code>{projectedValue(preset.mono)}</Code>
                  </TableCell>
                  <TableCell>{preset.value === "system" ? "None" : "Consumer-owned"}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Custom</TableCell>
                <TableCell colSpan={2}>
                  Override <Code>--n-font-sans</Code> at root or on a product surface.
                </TableCell>
                <TableCell>Consumer-owned</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          The <code>n-typography-*</code> classes are scoped token recipes. They can style an app
          root, preview, or product area, but Nerio intentionally has no <code>data-font</code>{" "}
          axis. Presets change family selection while preserving the shared scale, line heights,
          control geometry, and semantic roles.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="font-loading">Font loading</h2>
        <h3>System</h3>
        <CodeExample code={systemInstall} label="No font setup required" />
        <h3>Optional font families</h3>
        <p>
          Load non-system families in the consuming product. Nerio does not bundle font files or
          download fonts from a remote provider. A Next.js app may use <code>next/font</code>{" "}
          locally; the same consumer-ownership rule applies.
        </p>
        <CodeExample code={geistInstall} label="Consumer-provided Geist font" />
        <CodeExample code={geistRecipe} label="Scoped Geist recipe" />
        <p>
          Load Inter, IBM Plex, Manrope, Source Sans 3, or Space Grotesk the same way, then apply
          the matching <code>n-typography-*</code> recipe. IBM Plex may also load IBM Plex Mono;
          every other preset intentionally keeps the system mono stack.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="type-scale">Type scale</h2>
        <p>
          Scale tokens are raw typographic values. Components should consume established semantic
          roles when one exists. Product composition may use a scale step directly for headings or
          metrics, but repeated cross-component meaning should become a reviewed semantic alias.
        </p>
        <TableContainer aria-label="Type scale tokens">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Size</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Use</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scale.map(({ name, token, value, pixels }) => (
                <TableRow key={token}>
                  <TableCell>{name}</TableCell>
                  <TableCell>
                    <Code>{token}</Code>
                  </TableCell>
                  <TableCell>{pixels ?? value}</TableCell>
                  <TableCell>{scalePurpose[token]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          <Code>--n-font-size-2xs</Code> is listed for source completeness because existing
          component recipes may resolve through it. Do not consume it directly for product UI text;
          the public UI-text floor remains 12px. Text must remain available through browser zoom and
          user-controlled text resizing at every supported step.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="semantic-roles">Semantic roles</h2>
        <TableContainer aria-label="Semantic typography roles">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Alias</TableHead>
                <TableHead>Default</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semanticRoles.map(({ token, reference, value }) => (
                <TableRow key={token}>
                  <TableCell>{semanticRoleLabels[token]}</TableCell>
                  <TableCell>
                    <Code>{token}</Code>
                  </TableCell>
                  <TableCell>
                    <Code>{reference ?? value}</Code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <h3>Line height</h3>
        <TableContainer aria-label="Line-height tokens">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Use</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineHeights.map(({ token, value }) => (
                <TableRow key={token}>
                  <TableCell>{lineHeightLabels[token]}</TableCell>
                  <TableCell>
                    <Code>{token}</Code>
                  </TableCell>
                  <TableCell>{value}</TableCell>
                  <TableCell>{lineHeightGuidance[token]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          Use tight leading only for short display text. Labels, controls, helper text, and wrapped
          body copy need enough vertical room for diacritics, mixed scripts, and user spacing
          overrides. Avoid fixed block heights around content that may wrap.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="customization">Custom typography</h2>
        <CodeExample code={customOverride} label="Root and scoped font overrides" />
        <ul className="doc-list">
          <li>
            Keep the existing type scale, line-height tokens, and control heights across presets.
          </li>
          <li>
            Components consume semantic font tokens, never hard-coded Geist, Inter, or system
            stacks.
          </li>
          <li>Use relative sizing and allow text containers to grow in the block direction.</li>
          <li>
            Wrap by default. Truncate only when the content hierarchy permits it and provide an
            accessible way to reach the complete value.
          </li>
          <li>
            Keep long-form prose within a readable measure instead of stretching it across the full
            width of a dashboard or settings surface.
          </li>
          <li>Do not scale type with viewport width inside compact product surfaces.</li>
        </ul>

        <h3>Numeric and data typography</h3>
        <p>
          Use tabular numerals for columns and metrics that users compare vertically. A mono family
          is appropriate for code, hashes, addresses, and identifiers; ordinary financial values do
          not require mono when the selected sans family supports tabular figures. Align numeric
          cells to the logical end and format values to consistent decimal places when decimal
          separators need to line up.
        </p>
        <CodeExample code={numericRecipe} label="Aligned numeric values" />

        <h3>Resilience validation</h3>
        <TableContainer aria-label="Typography resilience validation">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Check</TableHead>
                <TableHead>Expected result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validationChecks.map(([check, expectation]) => (
                <TableRow key={check}>
                  <TableCell>{check}</TableCell>
                  <TableCell>{expectation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          Automated snapshots can reveal regressions, but approval still requires browser-level
          review with real content. Typography is complete only when information and operation
          remain available after resize, reflow, spacing overrides, and localization.
        </p>
      </section>
    </article>
  );
}
