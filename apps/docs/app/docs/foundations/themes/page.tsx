import { Badge, Card, Progress, Table } from "@nerio/ui";
import { Button } from "@nerio/ui/client";
import { CodeExample } from "../../../../components/code-example";

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
  --n-color-action-primary: #0f766e;
  --n-color-action-primary-hover: #115e59;
  --n-chart-primary: #0f766e;
  --n-focus-ring: 0 0 0 2px rgb(15 118 110 / 0.24);
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
        <h2>Runtime axes</h2>
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
          <h2>Preset themes</h2>
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
        <h2>Live theme behavior</h2>
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
          <div className="preview-row">
            <Button>Primary action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Quiet</Button>
          </div>
        </Card>
      </section>

      <section className="doc-section">
        <h2>Density</h2>
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
        <h2>Custom themes</h2>
        <CodeExample code={customTheme} label="Custom theme" />
        <ul className="doc-list">
          <li>Do not create combined names such as purple-light or neutral-dark.</li>
          <li>Do not use vertical-specific preset names such as fintech-blue.</li>
          <li>Keep brand color as an accent for primary action, selection, focus, and charts.</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>Do / do not</h2>
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
