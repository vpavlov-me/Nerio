import { Badge, Code, Table, TableContainer } from "@nerio/ui";
import { CodeExample } from "../../../../components/code-example";
import { createPageMetadata } from "../../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Radius",
  description:
    "Use Nerio radius tokens and role aliases to maintain a consistent shape language across controls, containers, and overlays.",
  path: "/docs/foundations/radius",
});

const radiusTokens = [
  ["None", "--n-radius-none", "Square edges and opt-out cases.", "0"],
  ["Small", "--n-radius-sm", "Compact tags and small local details.", "8px"],
  ["Medium", "--n-radius-md", "Default primitive for controls.", "10px"],
  ["Large", "--n-radius-lg", "Default primitive for containers.", "14px"],
  ["Extra large", "--n-radius-xl", "Default primitive for overlays.", "18px"],
  ["Full", "--n-radius-full", "Circular avatars, pills, progress marks, and spinners.", "999rem"],
] as const;

const radiusRoles = [
  ["Control", "--n-radius-control", "--n-radius-md"],
  ["Container", "--n-radius-container", "--n-radius-lg"],
  ["Overlay", "--n-radius-overlay", "--n-radius-xl"],
  ["Pill", "--n-radius-pill", "--n-radius-full"],
] as const;

const usage = `:root {
  --n-radius-sm: 0.5rem;
  --n-radius-md: 0.625rem;
  --n-radius-lg: 0.875rem;
  --n-radius-xl: 1.125rem;
}

.project-card {
  border-radius: var(--n-radius-container);
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
        <TableContainer aria-label="Radius primitive scale">
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Token</th>
                <th>Default</th>
                <th>Use</th>
              </tr>
            </thead>
            <tbody>
              {radiusTokens.map(([label, token, description, value]) => (
                <tr key={token}>
                  <td>{label}</td>
                  <td>
                    <Code>{token}</Code>
                  </td>
                  <td>{value}</td>
                  <td>{description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="role-aliases">Role aliases</h2>
        <p>
          Components consume role-based aliases so the primitive scale can change without editing
          component source.
        </p>
        <TableContainer aria-label="Radius role aliases">
          <Table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Alias</th>
                <th>Default primitive</th>
              </tr>
            </thead>
            <tbody>
              {radiusRoles.map(([label, token, primitive]) => (
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
        <h2 id="usage">Usage</h2>
        <CodeExample code={usage} label="Radius tokens" />
        <ul className="doc-list">
          <li>Use role aliases in product and component styles.</li>
          <li>Override primitives to change the entire scale consistently.</li>
          <li>Keep controls, containers, and overlays visibly related but distinct.</li>
        </ul>
      </section>
    </article>
  );
}
