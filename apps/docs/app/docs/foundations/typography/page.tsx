import { Badge, Card, Separator, Table } from "@nerio/ui";
import { CodeExample } from "../../../../components/code-example";

const scale = [
  ["xs", "--n-font-size-xs", "12px", "Metadata, badges, dense captions"],
  ["sm", "--n-font-size-sm", "13px", "Labels, helper text, table cells"],
  ["md", "--n-font-size-md", "14px", "Default UI body and controls"],
  ["lg", "--n-font-size-lg", "16px", "Lead copy and compact section intros"],
  ["xl", "--n-font-size-xl", "18px", "Small headings"],
  ["2xl", "--n-font-size-2xl", "20px", "Metric values and page sections"],
  ["3xl", "--n-font-size-3xl", "24px", "Editorial headings"],
];

const semanticRoles = [
  ["Body size", "--n-body-font-size", "--n-font-size-md"],
  ["Body line height", "--n-body-line-height", "--n-line-height-normal"],
  ["Control size", "--n-control-font-size", "--n-font-size-md"],
  ["Control weight", "--n-control-font-weight", "--n-font-weight-medium"],
  ["Label size", "--n-label-font-size", "--n-font-size-sm"],
  ["Label weight", "--n-label-font-weight", "--n-font-weight-medium"],
  ["Helper size", "--n-helper-font-size", "--n-font-size-xs"],
  ["Helper line height", "--n-helper-line-height", "--n-line-height-normal"],
] as const;

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
          <h2 id="font-contract">Font contract</h2>
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
        <h2 id="type-scale">Type scale</h2>
        <div className="type-scale">
          {scale.map(([name, token, value, purpose]) => (
            <div key={token}>
              <span style={{ fontSize: `var(${token})` }}>Nerio {name}</span>
              <code>{token}</code>
              <strong>{value}</strong>
              <p>{purpose}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2 id="rhythm">Rhythm</h2>
        <Table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Purpose</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>--n-line-height-tight</code>
              </td>
              <td>Compact headings and stat values.</td>
              <td>1.2</td>
            </tr>
            <tr>
              <td>
                <code>--n-line-height-normal</code>
              </td>
              <td>Default UI body and component copy.</td>
              <td>1.4</td>
            </tr>
            <tr>
              <td>
                <code>--n-line-height-relaxed</code>
              </td>
              <td>Longer documentation or editorial passages.</td>
              <td>1.55</td>
            </tr>
            <tr>
              <td>
                <code>--n-font-weight-medium</code>
              </td>
              <td>Labels, table headers, tabs, and quiet emphasis.</td>
              <td>500</td>
            </tr>
          </tbody>
        </Table>
      </section>

      <section className="doc-section">
        <h2 id="semantic-roles">Semantic roles</h2>
        <Table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Alias</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            {semanticRoles.map(([label, token, primitive]) => (
              <tr key={token}>
                <td>{label}</td>
                <td>
                  <code>{token}</code>
                </td>
                <td>
                  <code>{primitive}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      <section className="doc-section">
        <h2 id="usage-preview">Usage preview</h2>
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
        <h2 id="override-safely">Override safely</h2>
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
