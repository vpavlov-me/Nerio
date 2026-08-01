import { CodeExample } from "../../../components/code-example";
import { createPageMetadata } from "../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Migration",
  description: "Migrate Core alpha consumers to the frozen Nerio 1.0 API.",
  path: "/docs/migration",
});

const sourceWorkflow = `pnpm exec nerio doctor
pnpm exec nerio diff
pnpm exec nerio update --dry-run
pnpm exec nerio update
pnpm exec nerio diff`;

const packageChecks = `pnpm install
pnpm typecheck
pnpm build`;

const replacements = [
  ["IconButton", 'Button icon={Settings} aria-label="Settings"'],
  ['Button variant="subtle"', 'Button variant="secondary"'],
  ['Button variant="destructive"', 'Button variant="danger"'],
  ["Button loadingLabel", "Remove it; keep the visible action name stable"],
  ["Badge variant / icon", "Badge tone / leadingIcon"],
  ["BadgeVariant", "BadgeTone"],
  ["Select or RadioGroup onChange", "onValueChange"],
  ['Pagination item "aria-label"', "ariaLabel"],
  ["Icon absoluteStrokeWidth", "lucideAbsoluteStrokeWidth"],
  ["LucideIcon adapter type", "IconComponent or a direct Lucide type"],
  ["List ordered", 'marker="decimal"'],
] as const;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Core 1.0</p>
        <h1>Migration</h1>
        <p className="doc-lede">
          Move alpha package and editable-source consumers onto the frozen Core 1.0 API before
          adopting a beta candidate.
        </p>
      </header>

      <section className="doc-section" id="package-api">
        <h2>Package API replacements</h2>
        <p>
          Upgrade the six Nerio packages together, use React 19, and replace every temporary alpha
          alias with its canonical API.
        </p>
        <div className="doc-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Alpha API</th>
                <th>Frozen API</th>
              </tr>
            </thead>
            <tbody>
              {replacements.map(([from, to]) => (
                <tr key={from}>
                  <td>
                    <code>{from}</code>
                  </td>
                  <td>
                    <code>{to}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeExample code={packageChecks} label="Package verification" />
      </section>

      <section className="doc-section" id="source-installs">
        <h2>Editable source installs</h2>
        <p>
          Inspect the update before writing. Unchanged files can advance automatically; a normal
          update preserves locally modified files so the product owner can port that intent onto the
          new upstream source.
        </p>
        <CodeExample code={sourceWorkflow} label="Safe source update" />
      </section>

      <section className="doc-section" id="compatibility">
        <h2>Compatibility contract</h2>
        <p>
          Public package exports and types, tokens, Registry data, CLI/MCP contracts, support
          ranges, and public documentation routes are snapshot-protected. Defaults, DOM and ARIA
          structure, events, and source-update behavior can also be breaking even when the visual
          change is small.
        </p>
        <p>
          Read the complete{" "}
          <a href="https://github.com/vpavlov-me/Nerio/blob/main/docs/public-api-stability.md">
            public API stability policy
          </a>
          .
        </p>
      </section>
    </article>
  );
}
