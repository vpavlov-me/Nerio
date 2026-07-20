import { Badge, Code, Table, TableContainer } from "@nerio-ui/ui";
import { CodeExample } from "../../../../components/code-example";
import { createPageMetadata } from "../../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Design tokens",
  description:
    "Learn how Nerio primitive, semantic, and component tokens support adaptable themes, modes, density, and product overrides.",
  path: "/docs/foundations/tokens",
});

const tokenLayers = [
  {
    name: "Primitive",
    examples: ["--n-purple-600", "--n-gray-a-8", "--n-space-4", "--n-radius-md"],
    purpose:
      "Raw values without product meaning. Use them to build semantic tokens, not product UI directly.",
  },
  {
    name: "Semantic",
    examples: [
      "--n-color-surface-control",
      "--n-color-text-primary",
      "--n-color-action-primary",
      "--n-radius-container",
    ],
    purpose: "Intent-based values remapped by theme, mode, density, and product overrides.",
  },
  {
    name: "Component",
    examples: [
      "--n-button-height-md",
      "--n-input-height-md",
      "--n-form-group-gap",
      "--n-dialog-width-md",
      "--n-overlay-z-index",
    ],
    purpose: "Scoped contracts for component customization without editing component source.",
  },
  {
    name: "Runtime sets",
    examples: ["data-theme", "data-mode", "data-density"],
    purpose:
      "Composable selectors that remap semantic and component tokens without rebuilding source.",
  },
];

const primitiveColors = [
  ["gray-0", "--n-gray-0"],
  ["gray-100", "--n-gray-100"],
  ["gray-500", "--n-gray-500"],
  ["gray-950", "--n-gray-950"],
  ["cool gray alpha 8%", "--n-gray-a-8"],
  ["white alpha 10%", "--n-white-a-10"],
  ["purple-600", "--n-purple-600"],
  ["blue-600", "--n-blue-600"],
  ["green-600", "--n-green-600"],
  ["orange-600", "--n-orange-600"],
  ["red-600", "--n-red-600"],
] as const;

const primitiveScales = [
  ["Spacing", "--n-space-4", "16px on the comfortable scale"],
  ["Control size", "--n-size-control-md", "32px default control height"],
  ["Radius", "--n-radius-md", "16px primitive corner"],
  ["Icon size", "--n-icon-size-md", "16px default icon size"],
  ["Border width", "--n-border-width-default", "1px default border"],
  ["Elevation", "--n-shadow-sm", "Restrained raised-surface shadow"],
] as const;

const semanticTokens = [
  ["Canvas", "--n-color-surface-canvas"],
  ["Default surface", "--n-color-surface-default"],
  ["Control", "--n-color-surface-control"],
  ["Control hover", "--n-color-surface-control-hover"],
  ["Subtle", "--n-color-surface-subtle"],
  ["Sunken", "--n-color-surface-sunken"],
  ["Raised", "--n-color-surface-raised"],
  ["Overlay", "--n-color-surface-overlay"],
  ["Primary text", "--n-color-text-primary"],
  ["Secondary text", "--n-color-text-secondary"],
  ["Subtle border", "--n-color-border-subtle"],
  ["Primary action", "--n-color-action-primary"],
] as const;

const semanticAliases = [
  ["Adaptive control", "--n-color-surface-control", "--n-gray-a-6 / --n-white-a-8"],
  ["Adaptive border", "--n-color-border-default", "--n-gray-a-10 / --n-white-a-10"],
  ["Density spacing", "--n-density-space-md", "--n-space-3"],
  ["Density spacing", "--n-density-space-lg", "--n-space-4"],
  ["Density spacing", "--n-density-space-xl", "--n-space-5"],
  ["Control radius", "--n-radius-control", "--n-radius-lg"],
  ["Container radius", "--n-radius-container", "--n-radius-xl"],
  ["Overlay radius", "--n-radius-overlay", "--n-radius-2xl"],
  ["Raised elevation", "--n-shadow-surface-raised", "--n-shadow-sm"],
  ["Floating elevation", "--n-shadow-surface-floating", "--n-shadow-md"],
  ["Body type", "--n-body-font-size", "--n-font-size-md"],
] as const;

const contrastTokens = [
  [
    "Primary and secondary text",
    "--n-contrast-text-primary / --n-contrast-text-secondary",
    "4.5:1",
  ],
  ["Tertiary and status text", "--n-contrast-text-tertiary / --n-contrast-status", "3:1"],
  ["Action and inverse text", "--n-contrast-action / --n-contrast-text-inverse", "4.5:1"],
  ["Focus indication", "--n-contrast-focus-ring", "3:1"],
] as const;

const componentTokens = [
  ["Button height", "--n-button-height-md"],
  ["Button radius", "--n-button-radius"],
  ["Button padding", "--n-button-padding-inline-md"],
  ["Icon button glyph", "--n-icon-button-icon-size-md"],
  ["Input height", "--n-input-height-md"],
  ["Input background", "--n-input-background"],
  ["Badge height", "--n-badge-height"],
  ["Card radius", "--n-card-radius"],
  ["Card elevation", "--n-card-shadow"],
  ["Dialog width", "--n-dialog-width-md"],
  ["Overlay layer", "--n-overlay-z-index"],
];

const tailwindBridge = [
  ["bg-n-surface", "--n-color-surface", "Default product and component surface."],
  ["text-n-text", "--n-color-text-primary", "Primary foreground."],
  ["border-n-border", "--n-color-border-default", "Default border color."],
  ["rounded-n-control", "--n-radius-control", "Control shape role."],
  ["p-n-4", "--n-space-4", "Token-backed spacing."],
] as const;

const usage = `/* Product CSS: add a theme without changing component source. */
:root[data-theme="acme"] {
  --n-color-surface-selected: var(--n-gray-a-8);
  --n-color-border-focus: #0f766e;
  --n-color-action-primary: #0f766e;
  --n-color-action-primary-hover: #115e59;
  --n-color-action-primary-active: #134e4a;
  --n-color-action-on-primary: #ffffff;
  --n-color-focus-ring: #0f766e;
  --n-color-focus-ring-soft: rgb(15 118 110 / 0.24);
  --n-chart-primary: #0f766e;
}

.project-search {
  min-block-size: var(--n-input-height-md);
  border-radius: var(--n-input-radius);
  background: var(--n-input-background);
}`;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Tokens</h1>
        <p className="doc-lede">
          Nerio uses primitive, semantic, and component tokens plus composable runtime sets so
          visual decisions remain portable across themes, products, and source-installed components.
        </p>
      </header>

      <section className="doc-section">
        <div className="section-heading">
          <h2 id="token-architecture">Token architecture</h2>
          <Badge>CSS variables</Badge>
        </div>
        <TableContainer className="token-architecture-table">
          <Table>
            <thead>
              <tr>
                <th>Layer</th>
                <th>Purpose</th>
                <th>Examples</th>
              </tr>
            </thead>
            <tbody>
              {tokenLayers.map((layer) => (
                <tr key={layer.name}>
                  <td>
                    <Badge variant="info">{layer.name}</Badge>
                  </td>
                  <td>{layer.purpose}</td>
                  <td>
                    <div className="token-chip-row">
                      {layer.examples.map((token) => (
                        <Code key={token}>{token}</Code>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="primitive-tokens">Primitive tokens</h2>
        <p>
          Primitive tokens are immutable raw values. Theme, mode, and density selectors never
          redefine them; runtime changes remap semantic and component aliases instead.
        </p>
        <p>
          Nerio uses a hybrid neutral foundation. Opaque grays anchor canvas, primary surfaces,
          text, actions, and contrast-critical roles. Cool dark alpha neutrals in light mode and
          white alpha neutrals in dark mode drive adaptive controls, hover and pressed states,
          selected surfaces, subdued borders, and grid lines. Their compositing is intentional: the
          same semantic layer remains legible when it is placed on white or on a muted group
          surface.
        </p>
        <TableContainer className="token-color-table">
          <Table>
            <thead>
              <tr>
                <th>Color</th>
                <th>Token</th>
              </tr>
            </thead>
            <tbody>
              {primitiveColors.map(([label, token]) => (
                <tr key={token}>
                  <td>{label}</td>
                  <td>
                    <Code>{token}</Code>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Scale</th>
                <th>Token</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              {primitiveScales.map(([label, token, value]) => (
                <tr key={token}>
                  <td>{label}</td>
                  <td>
                    <Code>{token}</Code>
                  </td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="semantic-tokens">Semantic tokens</h2>
        <p>
          Components consume semantic roles, never alpha primitives directly. Mode selectors map
          adaptive roles to <Code>--n-gray-a-*</Code> or <Code>--n-white-a-*</Code>, while opaque
          canvas, foreground, primary action, status, and chart-series roles retain predictable
          contrast.
        </p>
        <TableContainer className="token-color-table">
          <Table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Token</th>
              </tr>
            </thead>
            <tbody>
              {semanticTokens.map(([label, token]) => (
                <tr key={token}>
                  <td>{label}</td>
                  <td>
                    <Code>{token}</Code>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Alias</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              {semanticAliases.map(([label, token, primitive]) => (
                <tr key={token}>
                  <td>{label}</td>
                  <td>
                    <Code>{token}</Code>
                  </td>
                  <td>
                    <Code>{primitive}</Code>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="contrast">Contrast contract</h2>
        <p>
          Contrast targets document the minimum intended ratio for Core roles. Customize contrast by
          overriding semantic color variables such as <Code>--n-color-text-primary</Code> and{" "}
          <Code>--n-color-action-primary</Code>; contrast targets are documentation tokens, not a
          runtime axis.
        </p>
        <TableContainer aria-label="Contrast targets">
          <Table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Target</th>
                <th>Minimum</th>
              </tr>
            </thead>
            <tbody>
              {contrastTokens.map(([role, token, target]) => (
                <tr key={role}>
                  <td>{role}</td>
                  <td>
                    <Code>{token}</Code>
                  </td>
                  <td>{target}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="tailwind-bridge">Tailwind bridge</h2>
        <p>
          Tailwind CSS v4 is the Core component authoring engine. The bridge exposes stable Nerio
          foundation and semantic variables as utilities without copying their values into Tailwind.
          Component recipes may reference narrower component variables directly with static
          arbitrary utilities.
        </p>
        <TableContainer aria-label="Tailwind token bridge">
          <Table>
            <thead>
              <tr>
                <th>Utility</th>
                <th>Value source</th>
                <th>Use</th>
              </tr>
            </thead>
            <tbody>
              {tailwindBridge.map(([utility, token, use]) => (
                <tr key={utility}>
                  <td>
                    <Code>{utility}</Code>
                  </td>
                  <td>
                    <Code>{token}</Code>
                  </td>
                  <td>{use}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="component-tokens">Component tokens</h2>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Use</th>
              </tr>
            </thead>
            <tbody>
              {componentTokens.map(([label, token]) => (
                <tr key={token}>
                  <td>{label}</td>
                  <td>
                    <Code>{token}</Code>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="usage">Usage</h2>
        <CodeExample code={usage} label="Token usage" />
        <ul className="doc-list">
          <li>Use primitive tokens only when defining semantic or component tokens.</li>
          <li>Keep primitive values unchanged across theme, mode, and density selectors.</li>
          <li>Use semantic tokens for product layout, copy, borders, actions, and status.</li>
          <li>Use component tokens to adjust a component contract without forking source.</li>
          <li>
            Keep Tailwind recipes static and use the Nerio bridge instead of raw palette utilities.
          </li>
          <li>Use runtime sets to remap tokens; do not encode mode or density into theme names.</li>
        </ul>
      </section>
    </article>
  );
}
