import { Badge, Button, Card, Input, Progress, Separator, Table } from "@nerio/ui";
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
      "--n-color-surface",
      "--n-color-text-primary",
      "--n-color-action-primary",
      "--n-font-sans",
    ],
    purpose: "Intent-based values remapped by theme, mode, density, and product overrides.",
  },
  {
    name: "Component",
    examples: [
      "--n-button-height-md",
      "--n-input-height-md",
      "--n-dialog-width-md",
      "--n-overlay-z-index",
    ],
    purpose: "Scoped contracts for component customization without editing component source.",
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

const semanticTokens = [
  ["Canvas", "--n-color-canvas"],
  ["Surface", "--n-color-surface"],
  ["Raised", "--n-color-surface-raised"],
  ["Muted", "--n-color-surface-muted"],
  ["Primary text", "--n-color-text-primary"],
  ["Secondary text", "--n-color-text-secondary"],
  ["Subtle border", "--n-color-border-subtle"],
  ["Action", "--n-color-action-primary"],
  ["Danger", "--n-color-danger"],
  ["Success", "--n-color-success"],
];

const componentTokens = [
  ["Button height", "--n-button-height-md"],
  ["Button radius", "--n-button-radius"],
  ["Input height", "--n-input-height-md"],
  ["Badge height", "--n-badge-height"],
  ["Avatar size", "--n-avatar-size-md"],
  ["Progress height", "--n-progress-height"],
  ["Dialog width", "--n-dialog-width-md"],
  ["Overlay layer", "--n-overlay-z-index"],
];

const usage = `/* Product CSS */
:root[data-theme="acme"] {
  --n-color-action-primary: #0f766e;
  --n-color-action-primary-hover: #115e59;
  --n-chart-primary: #0f766e;
}

.project-search {
  min-block-size: var(--n-input-height-md);
  border-color: var(--n-color-border-strong);
}`;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Tokens</h1>
        <p className="doc-lede">
          Nerio uses primitive, semantic, and component tokens so visual decisions remain portable
          across themes, products, and source-installed components.
        </p>
      </header>

      <section className="doc-section">
        <div className="section-heading">
          <h2>Three-layer contract</h2>
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
        <h2>Primitive palette</h2>
        <div className="swatch-grid">
          {primitiveColors.map(([label, token]) => (
            <div key={token} className="swatch">
              <span style={{ background: `var(${token})` }} />
              <strong>{label}</strong>
              <code>{token}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2>Semantic tokens</h2>
        <div className="token-table">
          {semanticTokens.map(([label, token]) => (
            <div key={token}>
              <span className="semantic-swatch" style={{ background: `var(${token})` }} />
              <strong>{label}</strong>
              <code>{token}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2>Component tokens</h2>
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
        <h2>Live component readout</h2>
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
        <h2>Usage</h2>
        <CodeExample code={usage} label="Token usage" />
        <ul className="doc-list">
          <li>Use primitive tokens only when defining semantic or component tokens.</li>
          <li>Use semantic tokens for product layout, copy, borders, actions, and status.</li>
          <li>Use component tokens to adjust a component contract without forking source.</li>
        </ul>
      </section>
    </article>
  );
}
