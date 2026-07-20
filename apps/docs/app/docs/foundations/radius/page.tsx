import { Badge, Code, Table, TableContainer } from "@nerio-ui/ui";
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
  ["Extra small", "--n-radius-xs", "Checkboxes and semantic geometry exceptions.", "4px"],
  ["Small", "--n-radius-sm", "Compact tags and small local details.", "12px"],
  ["Medium", "--n-radius-md", "Compact popup and item geometry.", "16px"],
  ["Large", "--n-radius-lg", "Control geometry.", "20px"],
  ["Extra large", "--n-radius-xl", "Container geometry.", "28px"],
  ["2× extra large", "--n-radius-2xl", "Dialog, Sheet, and task-surface geometry.", "32px"],
  ["Full", "--n-radius-full", "Circular avatars, pills, progress marks, and spinners.", "999rem"],
] as const;

const radiusRoles = [
  ["Control", "--n-radius-control", "--n-radius-lg"],
  ["Container", "--n-radius-container", "--n-radius-xl"],
  ["Overlay", "--n-radius-overlay", "--n-radius-2xl"],
  ["Pill", "--n-radius-pill", "--n-radius-full"],
] as const;

const usage = `:root {
  --n-radius-sm: 0.75rem;
  --n-radius-md: 1rem;
  --n-radius-lg: 1.25rem;
  --n-radius-xl: 1.75rem;
  --n-radius-2xl: 2rem;
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
          Radius tokens create Nerio's soft shape language while role aliases preserve semantic
          recognition: compact popups remain tighter, task surfaces become rounder, and Checkbox
          keeps its dedicated small-radius exception.
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
