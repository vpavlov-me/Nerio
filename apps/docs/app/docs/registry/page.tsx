import { registry, registryMetadata } from "@nerio-ui/registry";
import { Badge } from "@nerio-ui/ui";
import { CodeExample } from "../../../components/code-example";
import { createPageMetadata } from "../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Registry and CLI",
  description:
    "Configure the Nerio registry and CLI to discover, validate, and install editable component source into an application.",
  path: "/docs/registry",
});

const init = `nerio init
nerio doctor
nerio list
nerio info button
nerio info form-group
nerio add button
nerio add form-group
nerio add input --dry-run
nerio diff button
nerio update button --dry-run`;

const config = `{
  "schemaVersion": "1.0.0",
  "registry": "@nerio-ui/registry/manifest.json",
  "components": "components/nerio"
}`;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Distribution</p>
        <h1>Registry and CLI</h1>
        <p className="doc-lede">
          Install and update editable Nerio source from an immutable package Registry, local
          manifest, or explicit HTTP override without shadcn formats or tooling.
        </p>
      </header>

      <section className="doc-section">
        <h2>Quick start</h2>
        <CodeExample code={init} label="CLI quick start" />
        <p>
          <code>init</code> creates configuration, <code>doctor</code> validates the manifest, and{" "}
          <code>add</code> writes the selected component and source dependencies. Use{" "}
          <code>list</code> to discover components, <code>info</code> to inspect metadata, and{" "}
          <code>add --dry-run</code> to review the initial install plan. Use <code>diff</code> and{" "}
          <code>update --dry-run</code> before applying an upstream source update.
        </p>
      </section>

      <section className="doc-section">
        <h2>Project configuration</h2>
        <CodeExample code={config} label="nerio.json" />
        <p>
          The default package specifier resolves the immutable Registry shipped with the installed
          CLI-compatible release. Relative registry paths resolve from the target project. HTTP
          manifests resolve every source file relative to the manifest URL. Explicit local and HTTP
          overrides are intended for development, migration testing, or controlled mirrors.
        </p>
      </section>

      <section className="doc-section">
        <h2>Installed source lifecycle</h2>
        <p>
          A successful install writes <code>nerio.lock.json</code> beside <code>nerio.json</code>.
          The portable record contains Registry schema and release metadata, exact source revision,
          style contract version, requested items, dependency closure, installed paths, and original
          SHA-256 hashes. It contains no source content, secrets, or absolute machine paths.
        </p>
        <ul className="doc-list">
          <li>
            <code>diff [component]</code> reports unchanged, locally modified, upstream changed,
            added, removed, and combined conflict states.
          </li>
          <li>
            <code>update [component] --dry-run</code> prints the complete deterministic plan without
            writing.
          </li>
          <li>
            <code>update [component]</code> applies added and upstream-only changes, removes only
            unchanged obsolete files, and preserves local-only edits.
          </li>
          <li>
            When local and upstream changes overlap, the update stops before writing. Resolve the
            source manually or use <code>--force</code> only when intentional replacement is
            acceptable.
          </li>
          <li>
            Shared tokens and utilities are tracked independently from leaf components, so
            dependency closures update without duplicate files.
          </li>
        </ul>
        <p>
          To adopt a pre-metadata alpha install, commit or back up local changes, point{" "}
          <code>nerio.json</code> at the intended release Registry, and rerun{" "}
          <code>add &lt;component&gt;</code>. Files that still match the release are adopted into
          the new metadata without replacement; customized token source remains local and is
          reported as drift. The CLI accepts the legacy <code>nerio.json</code> 0.1.0 schema during
          adoption and diagnoses the move to schema 1.0.0. Resolve other pre-existing differences
          explicitly before the first managed update. Use the same diff-first sequence for
          prerelease-to-prerelease and prerelease-to-1.0 migrations.
        </p>
      </section>

      <section className="doc-section">
        <div className="section-heading">
          <h2>Available source items</h2>
          <Badge>{registry.length} items</Badge>
        </div>
        <div className="anatomy-list">
          {registry.map((item) => (
            <div key={item.name}>
              <code>{item.name}</code>
              <span>
                {item.category} - {item.files.length} files -{" "}
                {item.baseUiPrimitives.join(", ") || "no primitive"}
              </span>
            </div>
          ))}
        </div>
        <p>
          This page reads Registry {registryMetadata.version} ({registryMetadata.sourceRevision})
          using schema {registryMetadata.schemaVersion} and style contract{" "}
          {registryMetadata.styleContractVersion}. Initial <code>add</code> refuses to replace
          changed files by default. Use <code>--overwrite</code> only for intentional reinstall;
          normal upgrades use the non-destructive update workflow.
        </p>
      </section>

      <section className="doc-section">
        <h2>Registry contract</h2>
        <ul className="doc-list">
          <li>Metadata declares dependencies, files, Base UI primitives, slots, and variants.</li>
          <li>
            Top-level metadata pins the Registry release, exact source revision, schema, and style
            contract.
          </li>
          <li>
            Server-safe form items such as <code>form-group</code> declare no Base UI primitive;
            interactive controls such as <code>checkbox</code>, <code>radio-group</code>, and{" "}
            <code>switch</code> declare their Base UI primitive contracts.
          </li>
          <li>Required tokens make styling dependencies explicit for products and AI agents.</li>
          <li>
            <code>list</code> prints component name, title, and category from the configured
            registry.
          </li>
          <li>
            <code>info &lt;component&gt;</code> prints dependencies, registry dependencies, files,
            tokens, and usage.
          </li>
          <li>Registry dependencies are traversed before the requested component is installed.</li>
          <li>
            <code>--dry-run</code> prints every target file without writing to the project.
          </li>
          <li>Target paths are constrained to the configured component directory.</li>
          <li>
            <code>doctor</code> distinguishes blocking version, schema, dependency, metadata, and
            setup errors from informational local source drift.
          </li>
        </ul>
      </section>
    </article>
  );
}
