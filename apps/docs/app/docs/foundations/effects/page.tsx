import { Badge, Card, Separator, Table } from "@nerio/ui";
import { Button } from "@nerio/ui/client";
import { CodeExample } from "../../../../components/code-example";
import { createPageMetadata } from "../../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Effects",
  description:
    "Use Nerio shadow, focus, and layering tokens to create calm, accessible visual hierarchy across product surfaces.",
  path: "/docs/foundations/effects",
});

type TokenExample = readonly [label: string, token: string, description: string];
type TokenContract = readonly [label: string, token: string];

const effectTokens: TokenExample[] = [
  ["None", "--n-shadow-none", "Flat surfaces and controls that do not need elevation."],
  ["Extra subtle", "--n-shadow-xs", "The lightest available depth primitive."],
  ["Raised", "--n-shadow-sm", "Restrained separation for raised containers."],
  ["Floating", "--n-shadow-md", "Overlays, dialogs, toasts, and floating controls."],
];

const semanticEffects: TokenExample[] = [
  ["Flat surface", "--n-shadow-surface-flat", "Resolves to no shadow by default."],
  ["Control surface", "--n-shadow-surface-control", "Keeps default controls shadow-free."],
  ["Raised surface", "--n-shadow-surface-raised", "Resolves to the restrained raised shadow."],
  ["Floating surface", "--n-shadow-surface-floating", "Resolves to the strongest Core elevation."],
  ["Focus ring", "--n-focus-ring", "Two-stage visible keyboard focus treatment."],
  [
    "Overlay layer",
    "--n-overlay-z-index",
    "Portal stacking contract for menus, popovers, dialogs, and toasts.",
  ],
];

const componentContracts: TokenContract[] = [
  ["Card elevation", "--n-card-shadow"],
  ["Card radius", "--n-card-radius"],
  ["Overlay elevation", "--n-overlay-shadow"],
  ["Overlay backdrop", "--n-overlay-backdrop"],
  ["Overlay layer", "--n-overlay-z-index"],
];

const usage = `:root {
  --n-shadow-surface-raised: var(--n-shadow-sm);
  --n-shadow-surface-floating: var(--n-shadow-md);
  --n-color-focus-ring-soft: rgb(109 40 217 / 0.26);
}

.project-card {
  box-shadow: var(--n-shadow-surface-raised);
}

.project-card:focus-visible {
  box-shadow: var(--n-focus-ring);
}`;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Effects</h1>
        <p className="doc-lede">
          Shadow, focus, and layering tokens keep Nerio surfaces precise without tying the system to
          decorative depth or a specific product category.
        </p>
      </header>

      <section className="doc-section">
        <div className="section-heading">
          <h2 id="elevation-scale">Elevation scale</h2>
          <Badge variant="info">Tokenized</Badge>
        </div>
        <div className="effect-grid">
          {effectTokens.map(([label, token, description]) => (
            <Card key={token} className="effect-card">
              <span
                className="effect-sample"
                style={token.includes("shadow") ? { boxShadow: `var(${token})` } : undefined}
              />
              <div>
                <strong>{label}</strong>
                <code>{token}</code>
              </div>
              <p>{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2 id="semantic-effects">Semantic effects</h2>
        <div className="effect-grid">
          {semanticEffects.map(([label, token, description]) => (
            <Card key={token} className="effect-card">
              <span
                className="effect-sample"
                style={
                  token.includes("shadow") || token === "--n-focus-ring"
                    ? { boxShadow: `var(${token})` }
                    : undefined
                }
              />
              <div>
                <strong>{label}</strong>
                <code>{token}</code>
              </div>
              <p>{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2 id="focus">Focus</h2>
        <p>
          <code>--n-focus-ring</code> combines a 2px surface-colored offset with a 4px soft outer
          ring. Theme and mode selectors remap the ring colors while controls share the same focus
          geometry.
        </p>
        <div className="token-chip-row">
          <code>--n-color-focus-offset</code>
          <code>--n-color-focus-ring-soft</code>
          <code>--n-focus-ring-inner-width</code>
          <code>--n-focus-ring-outer-width</code>
        </div>
      </section>

      <section className="doc-section">
        <h2 id="live-surface-preview">Live surface preview</h2>
        <Card className="effect-preview" tabIndex={0}>
          <div>
            <Badge variant="success">Focusable</Badge>
            <h3>Collection review</h3>
            <p>
              This surface uses radius, border, focus, and effect tokens while keeping depth calm by
              default.
            </p>
          </div>
          <Separator />
          <div className="preview-row">
            <Button size="sm">Approve</Button>
            <Button size="sm" variant="secondary">
              Save draft
            </Button>
          </div>
        </Card>
      </section>

      <section className="doc-section">
        <h2 id="component-contracts">Component contracts</h2>
        <Table>
          <thead>
            <tr>
              <th>Contract</th>
              <th>Token</th>
            </tr>
          </thead>
          <tbody>
            {componentContracts.map(([label, token]) => (
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
        <h2 id="usage">Usage</h2>
        <CodeExample code={usage} label="Radius and effect tokens" />
        <ul className="doc-list">
          <li>Use semantic elevation aliases in product and component styles.</li>
          <li>
            Keep shadows restrained; spacing and surface contrast should carry most hierarchy.
          </li>
          <li>Never remove visible focus styles from interactive surfaces.</li>
          <li>Use overlay z-index tokens for portal-based components and stacked UI.</li>
        </ul>
      </section>
    </article>
  );
}
