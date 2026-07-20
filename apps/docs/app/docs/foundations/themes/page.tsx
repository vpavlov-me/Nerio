import { Badge, Code, Table, TableContainer } from "@nerio-ui/ui";
import { CodeExample } from "../../../../components/code-example";
import { createPageMetadata } from "../../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Themes",
  description:
    "Configure Nerio brand themes, color modes, and density through CSS variables without changing component source.",
  path: "/docs/foundations/themes",
});

const themes = [
  ["Purple", "purple", "--n-purple-600"],
  ["Blue", "blue", "--n-blue-600"],
  ["Green", "green", "--n-green-600"],
  ["Orange", "orange", "--n-orange-600"],
  ["Red", "red", "--n-red-600"],
  ["Neutral", "neutral", "--n-gray-950"],
];

const customTheme = `<html data-theme="purple" data-mode="system" data-density="comfortable">

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

:root[data-theme="acme"][data-mode="dark"] {
  --n-color-surface-selected: var(--n-white-a-10);
  --n-color-border-focus: #5eead4;
  --n-color-action-primary: #5eead4;
  --n-color-action-primary-hover: #2dd4bf;
  --n-color-action-primary-active: #14b8a6;
  --n-color-action-on-primary: #042f2e;
  --n-color-focus-ring: #5eead4;
  --n-color-focus-ring-soft: rgb(94 234 212 / 0.3);
  --n-chart-primary: #5eead4;
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
    --n-color-focus-ring-soft: rgb(94 234 212 / 0.3);
    --n-chart-primary: #5eead4;
  }
}`;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Themes</h1>
        <p className="doc-lede">
          Nerio separates brand theme, color mode, and density so one component API can work across
          many products without creating combined theme names.
        </p>
      </header>

      <section className="doc-section">
        <h2 id="runtime-axes">Runtime axes</h2>
        <TableContainer aria-label="Runtime appearance axes">
          <Table>
            <thead>
              <tr>
                <th>Axis</th>
                <th>Attribute</th>
                <th>Values</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Theme</td>
                <td>
                  <Code>data-theme</Code>
                </td>
                <td>purple, blue, green, orange, red, neutral, or custom</td>
              </tr>
              <tr>
                <td>Mode</td>
                <td>
                  <Code>data-mode</Code>
                </td>
                <td>system, light, dark</td>
              </tr>
              <tr>
                <td>Density</td>
                <td>
                  <Code>data-density</Code>
                </td>
                <td>comfortable, compact</td>
              </tr>
            </tbody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <div className="section-heading">
          <h2 id="preset-themes">Preset themes</h2>
          <Badge>brand accents</Badge>
        </div>
        <TableContainer aria-label="Preset theme contracts">
          <Table>
            <thead>
              <tr>
                <th>Theme</th>
                <th>Attribute value</th>
                <th>Primary accent token</th>
              </tr>
            </thead>
            <tbody>
              {themes.map(([label, value, token]) => (
                <tr key={value}>
                  <td>{label}</td>
                  <td>
                    <Code>data-theme="{value}"</Code>
                  </td>
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
        <h2 id="mode-behavior">Mode behavior</h2>
        <p>
          Light mode uses a white canvas, gray control surfaces, and white raised surfaces. Dark
          mode remaps the same roles to gray-950, gray-900, and gray-800. Purple and neutral also
          use lighter primary actions in dark and system-dark modes to preserve contrast.
        </p>
        <p>
          The appearance control exposes System, Light, and Dark explicitly. System follows live OS
          preference changes, and theme, mode, and density selections are restored independently
          before hydration.
        </p>
        <TableContainer aria-label="Mode-mapped semantic tokens">
          <Table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Token</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Canvas", "--n-color-surface-canvas"],
                ["Control", "--n-color-surface-control"],
                ["Raised surface", "--n-color-surface-raised"],
                ["Primary action", "--n-color-action-primary"],
                ["Action foreground", "--n-color-action-on-primary"],
              ].map(([label, token]) => (
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
        <h2 id="density">Density</h2>
        <TableContainer aria-label="Density contracts">
          <Table>
            <thead>
              <tr>
                <th>Value</th>
                <th>Use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Code>comfortable</Code>
                </td>
                <td>Default spacing for mixed product and documentation surfaces.</td>
              </tr>
              <tr>
                <td>
                  <Code>compact</Code>
                </td>
                <td>
                  Remaps semantic density aliases and component tokens for dense operational
                  interfaces without changing primitive spacing values.
                </td>
              </tr>
            </tbody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="custom-themes">Custom themes</h2>
        <CodeExample code={customTheme} label="Custom theme" />
        <ul className="doc-list">
          <li>Do not create combined names such as purple-light or neutral-dark.</li>
          <li>Do not use vertical-specific preset names such as fintech-blue.</li>
          <li>Keep brand color as an accent for primary action, selection, focus, and charts.</li>
          <li>Provide dark-mode accent overrides when the light accent loses contrast.</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2 id="do-do-not">Do / do not</h2>
        <TableContainer aria-label="Theme guidance">
          <Table>
            <thead>
              <tr>
                <th>Guidance</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Do</td>
                <td>Use generic brand theme names and let mode handle light or dark rendering.</td>
              </tr>
              <tr>
                <td>Do not</td>
                <td>Fork component source to hard-code a product color into a button or field.</td>
              </tr>
            </tbody>
          </Table>
        </TableContainer>
      </section>
    </article>
  );
}
