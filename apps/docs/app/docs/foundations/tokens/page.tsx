import { Badge, Card, Input, Progress, Separator, Table } from "@nerio/ui";
import { Button } from "@nerio/ui/client";
import { CodeExample } from "../../../../components/code-example";

const tokenLayers = [
  {
    name: "Primitive",
    examples: ["--n-purple-600", "--n-gray-950", "--n-space-4", "--n-radius-md"],
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
  ["purple-600", "--n-purple-600"],
  ["blue-600", "--n-blue-600"],
  ["green-600", "--n-green-600"],
  ["orange-600", "--n-orange-600"],
  ["red-600", "--n-red-600"],
];

const primitiveScales = [
  ["Spacing", "--n-space-4", "16px on the comfortable scale"],
  ["Control size", "--n-size-control-md", "32px default control height"],
  ["Radius", "--n-radius-md", "10px primitive corner"],
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
];

const semanticAliases = [
  ["Control radius", "--n-radius-control", "--n-radius-md"],
  ["Container radius", "--n-radius-container", "--n-radius-lg"],
  ["Overlay radius", "--n-radius-overlay", "--n-radius-xl"],
  ["Raised elevation", "--n-shadow-surface-raised", "--n-shadow-sm"],
  ["Floating elevation", "--n-shadow-surface-floating", "--n-shadow-md"],
  ["Body type", "--n-body-font-size", "--n-font-size-md"],
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

const usage = `/* Product CSS: add a theme without changing component source. */
:root[data-theme="acme"] {
  --n-color-surface-selected: #ecfdf5;
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
        <div className="foundation-grid">
          {tokenLayers.map((layer) => (
            <Card key={layer.name} className="foundation-card">
              <Badge variant="info">{layer.name}</Badge>
              <p>{layer.purpose}</p>
              <div className="token-chip-row">
                {layer.examples.map((token) => (
                  <code key={token}>{token}</code>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2 id="primitive-tokens">Primitive tokens</h2>
        <div className="swatch-grid">
          {primitiveColors.map(([label, token]) => (
            <div key={token} className="swatch">
              <span style={{ background: `var(${token})` }} />
              <strong>{label}</strong>
              <code>{token}</code>
            </div>
          ))}
        </div>
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
                  <code>{token}</code>
                </td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      <section className="doc-section">
        <h2 id="semantic-tokens">Semantic tokens</h2>
        <div className="token-table">
          {semanticTokens.map(([label, token]) => (
            <div key={token}>
              <span className="semantic-swatch" style={{ background: `var(${token})` }} />
              <strong>{label}</strong>
              <code>{token}</code>
            </div>
          ))}
        </div>
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
                  <code>{token}</code>
                </td>
                <td>
                  <code>{primitive}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      <section className="doc-section">
        <h2 id="component-tokens">Component tokens</h2>
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
                  <code>{token}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      <section className="doc-section">
        <h2 id="live-component-readout">Live component readout</h2>
        <Card className="token-preview">
          <div>
            <Badge variant="success">Semantic</Badge>
            <h3>Project intake</h3>
            <p>
              This surface uses Nerio semantic and component tokens for color, spacing, radius,
              typography, and density.
            </p>
          </div>
          <Separator />
          <Input placeholder="Search projects" aria-label="Search projects" />
          <Progress label="Completion" value={68} />
          <Button size="sm">Save changes</Button>
        </Card>
      </section>

      <section className="doc-section">
        <h2 id="usage">Usage</h2>
        <CodeExample code={usage} label="Token usage" />
        <ul className="doc-list">
          <li>Use primitive tokens only when defining semantic or component tokens.</li>
          <li>Use semantic tokens for product layout, copy, borders, actions, and status.</li>
          <li>Use component tokens to adjust a component contract without forking source.</li>
          <li>Use runtime sets to remap tokens; do not encode mode or density into theme names.</li>
        </ul>
      </section>
    </article>
  );
}
