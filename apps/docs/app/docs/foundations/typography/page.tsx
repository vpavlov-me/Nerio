import { Badge, Card, Separator, Table } from "@nerio/ui";
import { CodeExample } from "../../../../components/code-example";

const scale = [
  ["xs", "--n-font-size-xs", "Metadata, badges, dense captions"],
  ["sm", "--n-font-size-sm", "Labels, helper text, table cells"],
  ["md", "--n-font-size-md", "Default UI body"],
  ["lg", "--n-font-size-lg", "Lead copy and compact section intros"],
  ["xl", "--n-font-size-xl", "Small headings"],
  ["2xl", "--n-font-size-2xl", "Metric values and page sections"],
  ["3xl", "--n-font-size-3xl", "Editorial headings"],
];

const fontOverride = `:root {
  --n-font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --n-font-mono: "JetBrains Mono", "SFMono-Regular", monospace;
}`;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Typography</h1>
        <p className="doc-lede">
          Geist Sans and Geist Mono are loaded through Next.js font variables, then exposed through
          semantic font tokens that product teams can override.
        </p>
      </header>

      <section className="doc-section">
        <div className="section-heading">
          <h2>Font contract</h2>
          <Badge>Geist by default</Badge>
        </div>
        <div className="foundation-grid">
          <Card className="type-card">
            <Badge variant="info">Sans</Badge>
            <p className="type-specimen type-specimen-sans">
              Build calm, precise product surfaces.
            </p>
            <code>--n-font-sans</code>
          </Card>
          <Card className="type-card">
            <Badge variant="info">Mono</Badge>
            <p className="type-specimen type-specimen-mono">--n-color-action-primary</p>
            <code>--n-font-mono</code>
          </Card>
        </div>
      </section>

      <section className="doc-section">
        <h2>Scale</h2>
        <div className="type-scale">
          {scale.map(([name, token, purpose]) => (
            <div key={token}>
              <span style={{ fontSize: `var(${token})` }}>Nerio {name}</span>
              <code>{token}</code>
              <p>{purpose}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2>Rhythm</h2>
        <Table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>--n-line-height-tight</code>
              </td>
              <td>Compact headings and stat values.</td>
            </tr>
            <tr>
              <td>
                <code>--n-line-height-normal</code>
              </td>
              <td>Default UI body and component copy.</td>
            </tr>
            <tr>
              <td>
                <code>--n-line-height-relaxed</code>
              </td>
              <td>Longer documentation or editorial passages.</td>
            </tr>
            <tr>
              <td>
                <code>--n-font-weight-medium</code>
              </td>
              <td>Labels, table headers, tabs, and quiet emphasis.</td>
            </tr>
          </tbody>
        </Table>
      </section>

      <section className="doc-section">
        <h2>Usage preview</h2>
        <Card className="typography-preview">
          <Badge>Workspace</Badge>
          <h3>Activity summary</h3>
          <p>
            Typography should make dense product information easy to scan without turning every
            panel into a marketing page.
          </p>
          <Separator />
          <code>data-theme="purple" data-mode="system" data-density="comfortable"</code>
        </Card>
      </section>

      <section className="doc-section">
        <h2>Override safely</h2>
        <CodeExample code={fontOverride} label="Font token override" />
        <ul className="doc-list">
          <li>Components use semantic font tokens, not hard-coded Geist class names.</li>
          <li>Use Geist Mono for code snippets, token names, commands, and technical values.</li>
          <li>Do not scale type with viewport width inside compact UI surfaces.</li>
        </ul>
      </section>
    </article>
  );
}
