import { Badge, Card } from "@nerio/ui";
import { CodeExample } from "../../../../components/code-example";

const radiusTokens = [
  ["Small", "--n-radius-sm", "Compact controls, tags, and subtle containers."],
  ["Medium", "--n-radius-md", "Default component corners for buttons, inputs, and menus."],
  ["Large", "--n-radius-lg", "Cards, dialogs, popovers, and larger surfaces."],
  ["Extra large", "--n-radius-xl", "Large documentation actions and elevated panels."],
  ["Full", "--n-radius-full", "Circular avatars, pills, progress marks, and spinners."],
] as const;

const usage = `:root {
  --n-radius-sm: 0.25rem;
  --n-radius-md: 0.375rem;
  --n-radius-lg: 0.5rem;
}

.project-card {
  border-radius: var(--n-radius-lg);
}`;

export default function RadiusPage() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Radius</h1>
        <p className="doc-lede">
          Radius tokens create a consistent shape language across compact controls, containers, and
          overlays without prescribing a product-specific visual style.
        </p>
      </header>

      <section className="doc-section">
        <div className="section-heading">
          <h2 id="radius-scale">Radius scale</h2>
          <Badge>Primitive tokens</Badge>
        </div>
        <div className="radius-grid">
          {radiusTokens.map(([label, token, description]) => (
            <Card key={token} className="radius-card">
              <span className="radius-sample" style={{ borderRadius: `var(${token})` }} />
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
        <h2 id="usage">Usage</h2>
        <CodeExample code={usage} label="Radius tokens" />
      </section>
    </article>
  );
}
