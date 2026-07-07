import { getRegistryItem } from "@nerio/registry";
import { Badge } from "@nerio/ui";
import { CodeExample } from "../../../components/code-example";

const init = `nerio init \\
  --registry https://raw.githubusercontent.com/vpavlov-me/Nerio/main/packages/registry/src/manifest.json

nerio doctor
nerio add button`;

const config = `{
  "schemaVersion": "0.1.0",
  "registry": "./registry/manifest.json",
  "components": "components/nerio"
}`;

export default function Page() {
  const button = getRegistryItem("button");

  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Distribution</p>
        <h1>Registry and CLI</h1>
        <p className="doc-lede">
          Install editable Nerio source from a local manifest or HTTP registry without shadcn
          formats or tooling.
        </p>
      </header>

      <section className="doc-section">
        <h2>Quick start</h2>
        <CodeExample code={init} label="CLI quick start" />
        <p>
          <code>init</code> creates configuration, <code>doctor</code> validates the manifest, and
          <code>add</code> writes the selected component and direct source dependencies.
        </p>
      </section>

      <section className="doc-section">
        <h2>Project configuration</h2>
        <CodeExample code={config} label="nerio.json" />
        <p>
          Relative registry paths resolve from the target project. HTTP manifests resolve every
          source file relative to the manifest URL.
        </p>
      </section>

      <section className="doc-section">
        <div className="section-heading">
          <h2>Button installation</h2>
          <Badge>{button?.files.length ?? 0} files</Badge>
        </div>
        <div className="anatomy-list">
          {button?.files.map((file) => (
            <div key={file.target}>
              <code>{file.target}</code>
              <span>{file.role}</span>
            </div>
          ))}
        </div>
        <p>
          The CLI refuses to replace changed files by default. Use <code>--overwrite</code> only
          when replacement is intentional.
        </p>
      </section>

      <section className="doc-section">
        <h2>Registry contract</h2>
        <ul className="doc-list">
          <li>Metadata declares dependencies, files, Base UI primitives, slots, and variants.</li>
          <li>Required tokens make styling dependencies explicit for products and AI agents.</li>
          <li>Registry dependencies are traversed before the requested component is installed.</li>
          <li>Target paths are constrained to the configured component directory.</li>
        </ul>
      </section>
    </article>
  );
}
