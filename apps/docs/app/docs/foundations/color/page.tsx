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
import { getFoundationPage } from "../../../../lib/foundations";
import { createPageMetadata } from "../../../../lib/seo";

export const metadata = createPageMetadata(getFoundationPage("/docs/foundations/color"));

const { color, runtimeAxes } = foundationMetadata;
const representativeModeTokens = [
  "--n-color-surface-control",
  "--n-color-text-primary",
  "--n-color-border-default",
  "--n-color-status-success",
  "--n-chart-grid",
] as const;
const representativeComponentAliases = [
  "--n-button-background-primary",
  "--n-button-foreground-primary",
  "--n-button-background-destructive",
  "--n-button-foreground-destructive",
  "--n-input-background",
  "--n-input-border",
  "--n-badge-background-success",
  "--n-badge-foreground-success",
] as const;

const colorExample = `import { Badge } from "@nerio-ui/ui";

<div className="status-row">
  <Badge tone="primary-soft">Selected</Badge>
  <Badge tone="success">Published</Badge>
  <Badge tone="danger">Blocked</Badge>
</div>`;

const customTheme = `:root[data-theme="acme"] {
  --n-color-surface-selected: var(--n-gray-a-8);
  --n-color-border-focus: #0f766e;
  --n-color-action-primary: #0f766e;
  --n-color-action-primary-hover: #115e59;
  --n-color-action-primary-active: #134e4a;
  --n-color-action-on-primary: #ffffff;
  --n-color-focus-ring: #0f766e;
  --n-color-focus-ring-soft: rgb(15 118 110 / 0.24);
  --n-chart-primary: #0f766e;
  --n-chart-categorical-1: #0f766e;
}

:root[data-theme="acme"][data-mode="dark"] {
  --n-color-surface-selected: var(--n-white-a-10);
  --n-color-border-focus: #5eead4;
  --n-color-action-primary: #5eead4;
  --n-color-action-primary-hover: #2dd4bf;
  --n-color-action-primary-active: #14b8a6;
  --n-color-action-on-primary: #042f2e;
  --n-color-focus-ring: #5eead4;
  --n-color-focus-ring-soft: rgb(94 234 212 / 0.32);
  --n-chart-primary: #5eead4;
  --n-chart-categorical-1: #5eead4;
}

@media (prefers-color-scheme: dark) {
  :root[data-theme="acme"][data-mode="system"] {
    --n-color-surface-selected: var(--n-white-a-10);
    --n-color-border-focus: #5eead4;
    --n-color-action-primary: #5eead4;
    --n-color-action-primary-hover: #2dd4bf;
    --n-color-action-primary-active: #14b8a6;
    --n-color-action-on-primary: #042f2e;
    --n-color-focus-ring: #5eead4;
    --n-color-focus-ring-soft: rgb(94 234 212 / 0.32);
    --n-chart-primary: #5eead4;
    --n-chart-categorical-1: #5eead4;
  }
}`;

const architectureRows = [
  [
    "Primitive",
    "Raw opaque and alpha color scales. They are immutable across theme, mode, and density selectors and are inputs to semantic roles, not product UI choices.",
  ],
  [
    "Semantic",
    "Reusable intent such as canvas, primary text, focus ring, danger status, or primary action. Product composition consumes this layer.",
  ],
  [
    "Component",
    "Local contracts such as Button background or Input border. Components consume semantic or component aliases, never primitive palette values directly.",
  ],
  [
    "Runtime",
    "Theme changes accent personality, mode changes light/dark color mappings, and density changes spacing only. Density never redefines color primitives.",
  ],
] as const;

const pairingRows = [
  [
    "Primary action",
    "--n-color-action-primary + --n-color-action-on-primary",
    "Review the foreground on default, hover, and active backgrounds; keep one clear local primary action.",
  ],
  [
    "Neutral control",
    "--n-color-text-primary + --n-color-surface-control",
    "Alpha-neutral control layers intentionally composite over supported surfaces. Test the pair on canvas, default, and grouped surfaces.",
  ],
  [
    "Status treatment",
    "--n-color-status-*-soft + neutral text + icon or label",
    "Use soft backgrounds for routine feedback. Keep visible wording or iconography so hue is not the only carrier of meaning.",
  ],
  [
    "Invalid control",
    "--n-color-border-danger + associated error text",
    "Combine the visual boundary with aria-invalid and a programmatically associated error message.",
  ],
  [
    "Focus",
    "--n-color-focus-ring + --n-color-focus-offset",
    "Check the complete indicator against adjacent colors, including selected and invalid states.",
  ],
] as const;

const stateRows = [
  ["Default", "Establish the stable foreground/background pair and control boundary."],
  ["Hover", "Indicate pointer affordance without becoming the only discoverable state."],
  ["Active", "Make the pressed state distinct from hover while preserving foreground contrast."],
  [
    "Focus-visible",
    "Keep a visible ring and offset even when hover, selected, or invalid also applies.",
  ],
  [
    "Disabled",
    "Preserve recognizability and semantics; reduced opacity is not a substitute for disabled behavior.",
  ],
  ["Selected", "Pair the selected surface with text, indicator, icon, or state semantics."],
  ["Invalid", "Pair danger styling with an accessible error relationship and actionable copy."],
] as const;

const accessibilityRows = [
  [
    "Text contrast",
    "Primary, secondary, inverse, and action text target 4.5:1. A 3:1 exception applies only when text qualifies as large under WCAG 2.2.",
  ],
  [
    "Non-text contrast",
    "Meaningful control boundaries, graphics, and focus indicators target 3:1 where WCAG 2.2 applies.",
  ],
  [
    "Color-independent meaning",
    "Status, selection, validation, trend, and chart meaning require text, position, shape, iconography, pattern, or programmatic state in addition to hue.",
  ],
  [
    "Forced colors",
    "Core preserves representative boundaries, state, and focus with system colors. Product compositions must still be tested with forced colors active.",
  ],
  [
    "Increased contrast",
    "Review real states with the platform preference enabled; the current contrast targets are tokens, not a data-contrast runtime axis.",
  ],
  [
    "Color vision",
    "No categorical palette works for every user, display, background, or data task. Add redundant encoding and test the real visualization.",
  ],
] as const;

const customThemeMatrix = [
  ["Themes", "Default purple plus the custom data-theme value."],
  ["Modes", "Explicit light, explicit dark, system with OS light, and system with OS dark."],
  [
    "Density",
    "Comfortable and compact; density must not change color primitives or semantic meaning.",
  ],
  [
    "States",
    "Default, hover, active, focus-visible, disabled, selected, invalid, and loading where applicable.",
  ],
  [
    "Components",
    "Buttons, links, fields, selection controls, overlays, status treatments, and representative chart surfaces.",
  ],
  [
    "Preferences",
    "Forced colors, increased contrast, reduced motion where color changes accompany motion, and real display settings.",
  ],
  [
    "Content",
    "Long labels, errors, real data, icons, meaningful graphics, and empty or dense states.",
  ],
] as const;

const reviewChecklist = [
  "Choose a semantic role by intent; never select a primitive because its swatch looks close.",
  "Review the foreground/background pair on every surface where it can appear.",
  "Exercise default, hover, active, focus-visible, disabled, selected, and invalid states together.",
  "Confirm status, validation, selection, trend, and chart meaning remains available without color.",
  "Test light, dark, system-light, and system-dark modes in the default and custom themes.",
  "Check focus visibility, text and non-text contrast, forced colors, and increased contrast.",
  "Validate alpha-neutral layers over every supported underlying surface; use opaque roles when isolation or predictable contrast is required.",
  "Record product-specific and visualization-specific evidence instead of treating Core token targets as a compliance guarantee.",
] as const;

function shownValue(mapping: { value: string; reference: string | null }) {
  return mapping.reference ?? mapping.value;
}

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Color</h1>
        <p className="doc-lede">
          Nerio color starts with immutable primitives, resolves through semantic intent, and
          reaches components through local aliases. Choose complete foreground, background, state,
          and accessibility contracts—not isolated swatches.
        </p>
      </header>

      <section className="doc-section">
        <h2 id="color-architecture">Color architecture</h2>
        <TableContainer aria-label="Color architecture">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Layer</TableHead>
                <TableHead>Responsibility</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {architectureRows.map(([layer, responsibility]) => (
                <TableRow key={layer}>
                  <TableCell>
                    <Badge>{layer}</Badge>
                  </TableCell>
                  <TableCell>{responsibility}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          The generated inventories below come from <Code>packages/tokens/src/styles.css</Code> via
          the accepted <a href="/docs/foundations/tokens">foundation metadata contract</a>.
          Editorial recommendations remain hand-authored. See{" "}
          <a href="/docs/foundations/themes">Themes</a> for runtime-axis composition.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="primitive-families">Primitive families</h2>
        <p>
          Opaque neutral and accent scales provide predictable raw values. Dark alpha neutrals adapt
          light-mode layers; light alpha neutrals adapt dark-mode layers. Alpha primitives composite
          with the surface below them, so a swatch alone cannot establish the final color or
          contrast.
        </p>
        {color.primitiveFamilies.map((family) => (
          <div key={family.value} className="token-preview">
            <h3>{family.label}</h3>
            <div className="swatch-grid">
              {family.tokens.map((entry) => (
                <div className="swatch" key={entry.token}>
                  <span
                    aria-label={`${entry.token} swatch`}
                    style={{ backgroundColor: `var(${entry.token})` }}
                  />
                  <Code>{entry.token}</Code>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="doc-section">
        <h2 id="semantic-roles">Semantic role families</h2>
        <p>
          Product UI consumes semantic roles. The inventory includes canvas, default, subtle,
          sunken, raised, overlay, control, selected, hover, and active surfaces; text and borders;
          complete action and focus roles; status and trend roles; and the general chart boundary.
        </p>
        <p>
          The shared action family implements a primary default/hover/active sequence, secondary
          default/hover roles, a transparent tertiary role, and an on-primary foreground. The
          destructive Button sequence is a component contract backed by danger status and on-danger
          text roles; do not invent a parallel primitive or undocumented semantic role.
        </p>
        <TableContainer aria-label="Source-backed semantic color families">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Family</TableHead>
                <TableHead>Canonical roles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {color.semanticFamilies.map((family) => (
                <TableRow key={family.value}>
                  <TableCell>{family.label}</TableCell>
                  <TableCell>
                    <div className="token-chip-row">
                      {family.tokens.map((entry) => (
                        <Code key={entry.token}>{entry.token}</Code>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <h3>Representative mode mappings</h3>
        <TableContainer aria-label="Representative mode color mappings">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                {runtimeAxes.mode.mappings.map((mapping) => (
                  <TableHead key={mapping.value}>
                    {mapping.value === "system" ? "System dark" : mapping.value}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {representativeModeTokens.map((token) => (
                <TableRow key={token}>
                  <TableCell>
                    <Code>{token}</Code>
                  </TableCell>
                  {runtimeAxes.mode.mappings.map((mode) => {
                    const mapping = mode.colorMappings.find((entry) => entry.token === token)!;
                    return (
                      <TableCell key={mode.value}>
                        <Code>{shownValue(mapping)}</Code>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <h3>Representative component aliases</h3>
        <TableContainer aria-label="Representative component color aliases">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component contract</TableHead>
                <TableHead>Semantic source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {representativeComponentAliases.map((token) => {
                const alias = color.componentAliases.find((entry) => entry.token === token)!;
                return (
                  <TableRow key={token}>
                    <TableCell>
                      <Code>{token}</Code>
                    </TableCell>
                    <TableCell>
                      <Code>{shownValue(alias)}</Code>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          Chart series, axes, grids, tooltips, cursors, and data-specific fallback policy belong to
          the <a href="https://github.com/vpavlov-me/Nerio/issues/424">Chart foundation issue</a>.
          This page documents only the shared color-role boundary.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="pairing-and-states">Pairing and interaction states</h2>
        <p>
          Evaluate the rendered pair and its context. Use translucent roles for adaptive control,
          hover, selected, border, and grouping layers on supported surfaces. Use opaque roles when
          the foreground needs isolation, the background is unknown, or compositing would make the
          result unpredictable.
        </p>
        <TableContainer aria-label="Foreground and background pairing guidance">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Composition</TableHead>
                <TableHead>Pair</TableHead>
                <TableHead>Review</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pairingRows.map(([composition, pair, review]) => (
                <TableRow key={composition}>
                  <TableCell>{composition}</TableCell>
                  <TableCell>
                    <Code>{pair}</Code>
                  </TableCell>
                  <TableCell>{review}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer aria-label="Interaction color state sequence">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>Review expectation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stateRows.map(([state, expectation]) => (
                <TableRow key={state}>
                  <TableCell>{state}</TableCell>
                  <TableCell>{expectation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="applied-example">Applied example</h2>
        <p>
          Real components resolve semantic roles through their component aliases. Visible labels
          keep action and status meaning available when color is unavailable or altered.
        </p>
        <section className="component-example" aria-label="Color foundation example preview">
          <div className="component-example__preview">
            <div className="preview-row">
              <Badge tone="primary-soft">Selected</Badge>
              <Badge tone="success">Published</Badge>
              <Badge tone="danger">Blocked</Badge>
            </div>
          </div>
          <CodeExample
            className="component-example__code"
            code={colorExample}
            label="Color foundation example code"
          />
        </section>
        <p>
          Use the <a href="/docs/components/button">Button</a> and{" "}
          <a href="/docs/components/badge">Badge</a> component contracts for their full state,
          anatomy, and token guidance.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="accessibility">Accessibility</h2>
        <p>
          Contrast is a relationship between rendered foreground and background colors at a specific
          size and state. A token target cannot prove the final product composition. Review the full
          evidence boundary in the{" "}
          <a href="/docs/foundations/accessibility">Accessibility foundation</a>.
        </p>
        <TableContainer aria-label="Color accessibility guidance">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concern</TableHead>
                <TableHead>Contract</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessibilityRows.map(([concern, contract]) => (
                <TableRow key={concern}>
                  <TableCell>{concern}</TableCell>
                  <TableCell>{contract}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="token-chip-row" aria-label="Source-backed contrast targets">
          {color.contrastTargets.map((target) => (
            <Code key={target.token}>
              {target.token}: {target.value}
            </Code>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2 id="custom-themes">Custom themes</h2>
        <p>
          A custom theme supplies the same accent contract as every built-in theme. Coordinate
          selected surface, focus border and ring, the primary action sequence, on-primary
          foreground, and the primary chart role. Status colors remain semantic unless the product
          has separately validated replacements.
        </p>
        <CodeExample code={customTheme} label="Custom color theme" />

        <h3>Built-in accent projection</h3>
        <TableContainer aria-label="Built-in theme color mappings">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Theme</TableHead>
                <TableHead>Light action</TableHead>
                <TableHead>Dark action</TableHead>
                <TableHead>System-dark action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runtimeAxes.theme.presets.map((preset) => (
                <TableRow key={preset.value}>
                  <TableCell>{preset.label}</TableCell>
                  {(["light", "dark", "systemDark"] as const).map((mode) => {
                    const mapping = preset.colorMappings[mode].find(
                      (entry) => entry.token === "--n-color-action-primary",
                    )!;
                    return (
                      <TableCell key={mode}>
                        <span
                          className="semantic-swatch"
                          aria-label={`${preset.label} ${mode} primary action swatch`}
                          style={{ backgroundColor: mapping.value }}
                        />
                        <Code>{shownValue(mapping)}</Code>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <h3>Validation matrix</h3>
        <TableContainer aria-label="Custom theme validation matrix">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dimension</TableHead>
                <TableHead>Coverage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customThemeMatrix.map(([dimension, coverage]) => (
                <TableRow key={dimension}>
                  <TableCell>{dimension}</TableCell>
                  <TableCell>{coverage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          Treat changed roles as a migration: document the new owner, compare before and after in
          real components, preserve aliases during compatibility windows, and rerun token, docs,
          browser, visual, and product accessibility evidence.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="do-do-not">Do / do not</h2>
        <TableContainer aria-label="Color do and do not guidance">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guidance</TableHead>
                <TableHead>Recommendation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Do</TableCell>
                <TableCell>Choose --n-color-surface-selected for selected product UI.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Do</TableCell>
                <TableCell>
                  Pair a danger border with an error message and invalid semantics.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Do not</TableCell>
                <TableCell>
                  Use --n-purple-600 directly because it resembles the desired accent.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Do not</TableCell>
                <TableCell>
                  Copy a light-mode action or chart value into dark mode without testing its pair
                  and states.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Do not</TableCell>
                <TableCell>
                  Assume categorical hue alone makes a chart or status understandable.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="review-checklist">Review checklist</h2>
        <ul className="doc-list">
          {reviewChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          Known boundary: Nerio provides shared roles, mappings, targets, forced-colors fallbacks,
          and representative evidence. The consumer owns brand values, custom-theme validation,
          product meaning, real content, and product-level compliance. Nerio does not currently
          expose a contrast runtime axis, theme editor, or complete visualization color policy.
        </p>
      </section>
    </article>
  );
}
