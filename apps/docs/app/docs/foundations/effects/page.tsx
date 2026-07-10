import { Badge, Card, Separator, Table } from "@nerio/ui";
import { Button } from "@nerio/ui/client";
import { CodeExample } from "../../../../components/code-example";

type TokenExample = readonly [label: string, token: string, description: string];
type TokenContract = readonly [label: string, token: string];

const effectTokens: TokenExample[] = [
  ["Subtle shadow", "--n-shadow-sm", "Default low-emphasis surface separation."],
  ["Raised shadow", "--n-shadow-md", "Overlays, dialogs, toasts, and floating controls."],
  ["Focus ring", "--n-focus-ring", "Visible keyboard focus for interactive controls."],
  [
    "Overlay layer",
    "--n-overlay-z-index",
    "Portal stacking contract for menus, popovers, dialogs, and toasts.",
  ],
];

const componentContracts: TokenContract[] = [
  ["Dialog width", "--n-dialog-width-md"],
  ["Overlay layer", "--n-overlay-z-index"],
  ["Spinner radius", "--n-radius-full"],
  ["Card radius", "--n-radius-lg"],
];

const usage = `:root {
  --n-shadow-sm: none;
  --n-shadow-md: none;
  --n-focus-ring: 0 0 0 2px rgb(109 40 217 / 0.26);
}

.project-card {
  box-shadow: var(--n-shadow-sm);
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
          <h2>Effect styles</h2>
          <Badge variant="info">Tokenized</Badge>
        </div>
        <div className="effect-grid">
          {effectTokens.map(([label, token, description]) => (
            <Card key={token} className="effect-card">
              <span
                className="effect-sample"
                style={
                  token.includes("shadow")
                    ? { boxShadow: `var(${token})` }
                    : token === "--n-focus-ring"
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
        <h2>Live surface preview</h2>
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
        <h2>Component contracts</h2>
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
        <h2>Usage</h2>
        <CodeExample code={usage} label="Radius and effect tokens" />
        <ul className="doc-list">
          <li>Use radius tokens for shape consistency instead of hard-coded pixel values.</li>
          <li>Keep shadows restrained; borders and spacing should carry most hierarchy.</li>
          <li>Never remove visible focus styles from interactive surfaces.</li>
          <li>Use overlay z-index tokens for portal-based components and stacked UI.</li>
        </ul>
      </section>
    </article>
  );
}
