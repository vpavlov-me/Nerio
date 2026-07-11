import { Badge, Card, Field, FormGroup, Progress, Table } from "@nerio/ui";
import { Button, Checkbox, Switch } from "@nerio/ui/client";
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

:root[data-theme="acme"][data-mode="dark"] {
  --n-color-surface-selected: #052e2b;
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
    --n-color-surface-selected: #052e2b;
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
                <code>data-theme</code>
              </td>
              <td>purple, blue, green, orange, red, neutral, or custom</td>
            </tr>
            <tr>
              <td>Mode</td>
              <td>
                <code>data-mode</code>
              </td>
              <td>system, light, dark</td>
            </tr>
            <tr>
              <td>Density</td>
              <td>
                <code>data-density</code>
              </td>
              <td>comfortable, compact</td>
            </tr>
          </tbody>
        </Table>
      </section>

      <section className="doc-section">
        <div className="section-heading">
          <h2 id="preset-themes">Preset themes</h2>
          <Badge>brand accents</Badge>
        </div>
        <div className="theme-grid">
          {themes.map(([label, value, token]) => (
            <Card key={value} className="theme-card">
              <span className="theme-swatch" style={{ background: `var(${token})` }} />
              <strong>{label}</strong>
              <code>data-theme="{value}"</code>
            </Card>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2 id="mode-behavior">Mode behavior</h2>
        <p>
          Light mode uses a white canvas, gray control surfaces, and white raised surfaces. Dark
          mode remaps the same roles to gray-950, gray-900, and gray-800. Purple and neutral also
          use lighter primary actions in dark and system-dark modes to preserve contrast.
        </p>
        <div className="token-chip-row">
          <code>--n-color-surface-canvas</code>
          <code>--n-color-surface-control</code>
          <code>--n-color-surface-raised</code>
          <code>--n-color-action-primary</code>
          <code>--n-color-action-on-primary</code>
        </div>
      </section>

      <section className="doc-section">
        <h2 id="live-theme-behavior">Live theme behavior</h2>
        <Card className="token-preview">
          <div>
            <Badge variant="info">Themed surface</Badge>
            <h3>Collection health</h3>
            <p>
              Use the header controls to switch theme, mode, and density. The component source stays
              the same while semantic and component tokens remap.
            </p>
          </div>
          <Progress label="Shared context" value={72} />
          <FormGroup title="Notification theme check" layout="inline">
            <Field label="Product updates">
              <Checkbox aria-label="Product updates" defaultChecked />
            </Field>
            <label className="inline-control">
              <Switch aria-label="Notify collaborators" defaultChecked />
              <span>Notify collaborators</span>
            </label>
          </FormGroup>
          <div className="preview-row">
            <Button>Primary action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Quiet</Button>
          </div>
        </Card>
      </section>

      <section className="doc-section">
        <h2 id="density">Density</h2>
        <div className="density-grid">
          <Card className="density-card">
            <Badge>Comfortable</Badge>
            <p>Default spacing for mixed product and documentation surfaces.</p>
            <Button size="sm">Review item</Button>
          </Card>
          <Card className="density-card" data-density-preview="compact">
            <Badge>Compact</Badge>
            <p>Reduced control heights and spacing for dense operational interfaces.</p>
            <Button size="sm">Review item</Button>
          </Card>
        </div>
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
        <div className="grid">
          <Card>
            <Badge variant="success">Do</Badge>
            <p>Use generic brand theme names and let mode handle light or dark rendering.</p>
          </Card>
          <Card>
            <Badge variant="danger">Do not</Badge>
            <p>Fork component source to hard-code a product color into a button or field.</p>
          </Card>
        </div>
      </section>
    </article>
  );
}
