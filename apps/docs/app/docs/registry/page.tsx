import { registry, registryMetadata } from "@nerio-ui/registry";
import { Badge } from "@nerio-ui/ui";
import { CodeExample } from "../../../components/code-example";
import {
  bootstrapCommands,
  localCliInstall,
  localCliWorkflow,
  oneOffCliWorkflow,
} from "../../../lib/public-commands";
import { createPageMetadata } from "../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Registry and CLI",
  description:
    "Use the Nerio CLI to create maintained package projects or discover, validate, and install editable component source.",
  path: "/docs/registry",
});

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
          manifest, or bounded HTTPS mirror without shadcn formats or tooling.
        </p>
      </header>

      <section className="doc-section">
        <h2>Quick start</h2>
        <CodeExample code={bootstrapCommands} label="Create a package-mode project" />
        <p>
          <code>create</code> bootstraps one new package-mode project with the maintained current
          Next.js or Vite profile. It pins the tested stack, writes deterministic files atomically,
          and configures Tailwind, tokens, residual styles, compiled source scanning, and the
          server/client entrypoint boundary. It does not guess unsupported frameworks or generate
          backend, authentication, database, deployment, or product code. Source mode remains the
          existing <code>init</code> and <code>add</code> lifecycle inside an application.
        </p>
        <CodeExample code={localCliInstall} label="Install the local CLI" />
        <CodeExample code={localCliWorkflow} label="CLI quick start" />
        <p>
          <code>init</code> creates configuration, <code>doctor</code> validates the manifest, and{" "}
          <code>add</code> writes the selected component and source dependencies. Use{" "}
          <code>search</code> to discover documented metadata, <code>view</code> to inspect source
          and integrity metadata, <code>docs</code> to read usage and accessibility guidance, and{" "}
          <code>add --dry-run</code> to review the initial install plan. The compatible{" "}
          <code>list</code> and <code>info</code> commands remain available. Use <code>diff</code>{" "}
          and <code>update --dry-run</code> before applying an upstream source update, or{" "}
          <code>remove --dry-run</code> before pruning directly installed source.
        </p>
        <p>
          Pass multiple names to install one dependency union, or use <code>add --all</code> to
          select every Registry item. Both paths preflight the complete set and commit one source
          and lock transaction. Add <code>--json</code> for the stable structured result and combine
          it with <code>--dry-run</code> for automation-safe planning.
        </p>
        <p>
          Read-only discovery uses the same validated immutable manifest without fetching source.
          Search returns at most 20 name-sorted matches by default and accepts a limit from 1 to 50.
          Search, view, and docs support a bounded JSON schema for automation.
        </p>
        <p>
          <code>migrate config 0.1.0 1.0.0</code> previews the only reviewed configuration
          migration. Add <code>--apply</code> to write through the project lock with durable backup,
          rollback, and crash recovery. The CLI never reads or executes Registry migration scripts.
        </p>
        <p>
          For a one-off initialization or component install, invoke the real package name. Keep the
          local installation above as the default for repeatable lifecycle work.
        </p>
        <CodeExample code={oneOffCliWorkflow} label="One-off CLI commands" />
      </section>

      <section className="doc-section">
        <h2>Project configuration</h2>
        <CodeExample code={config} label="nerio.json" />
        <p>
          The default package specifier resolves the immutable Registry shipped with the installed
          CLI-compatible release. Relative registry paths resolve from the target project. HTTPS
          manifests resolve every source file relative to the final manifest URL. Plain HTTP is
          rejected unless each command supplies <code>--allow-insecure-http</code>; reserve that
          opt-in for a trusted local Registry. Remote requests enforce a 10-second request/body
          timeout, a 2 MiB manifest limit, a 4 MiB per-source limit, at most three redirects,
          content-type handling, schema/path validation, and SHA-256 integrity.
        </p>
      </section>

      <section className="doc-section">
        <h2>Installed source lifecycle</h2>
        <p>
          A successful install writes <code>nerio.lock.json</code> beside <code>nerio.json</code>.
          The portable record contains Registry schema and release metadata, exact source revision,
          style contract version, requested items, dependency closure, installed paths, and original
          SHA-256 hashes and Registry integrity metadata. It contains no source content, secrets, or
          absolute machine paths.
        </p>
        <ul className="doc-list">
          <li>
            <code>add button card</code> resolves the explicit roots and their shared dependencies
            once, then updates source and <code>nerio.lock.json</code> atomically.
          </li>
          <li>
            <code>add --all</code> selects every Registry item in name order. It cannot be combined
            with explicit item names.
          </li>
          <li>
            <code>add --dry-run --json</code> emits schema <code>1.0.0</code> with a deterministic
            planned, applied, or blocked status, portable file actions and owners, dependency
            unions, and summary counts. Exit code 0 means the plan or transaction succeeded; exit
            code 1 means input, conflict, Registry, or transaction failure.
          </li>
          <li>
            <code>remove button card</code> accepts direct items only and removes their source plus
            dependencies no longer referenced by another direct item. Shared files remain installed
            with narrowed owner metadata.
          </li>
          <li>
            <code>remove --dry-run --json</code> emits its bounded schema <code>1.0.0</code> without
            writes. Locally modified or ambiguous tracked source blocks the complete operation;
            <code>--force</code> is an explicit opt-in for every reported modified-file deletion and
            never bypasses ownership or path validation.
          </li>
          <li>
            <code>migrate config 0.1.0 1.0.0</code> preserves additive configuration fields and
            previews by default. <code>--apply</code> changes only the schema marker in one
            recoverable transaction; unsupported routes fail before writes.
          </li>
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
          <li>
            Add and update fetch and validate the complete plan before writing; remove validates the
            recorded source and ownership graph. Registry mutations stage a complete plan, commit
            source before lock metadata, and restore both after any handled failure. Migration uses
            the same project lock with a dedicated configuration backup. A durable local journal
            recovers an interrupted process on the next state-sensitive command (<code>add</code>,{" "}
            <code>remove</code>, <code>migrate</code>, <code>diff</code>, <code>update</code>, or{" "}
            <code>doctor</code>); already-committed state is retained. The process lock serializes
            mutations, validation, and recovery so parallel commands cannot lose state;{" "}
            <code>list</code>, <code>info</code>, <code>search</code>, <code>view</code>, and{" "}
            <code>docs</code> remain read-only inspection commands. An owner heartbeat also makes
            locks reclaimable after process death, restart, or PID reuse.
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
          <li>
            Metadata declares dependencies, files, SHA-256 integrity, Base UI primitives, slots, and
            variants.
          </li>
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
          <li>
            <code>search &lt;query&gt;</code> matches documented metadata with a bounded name-sorted
            result set.
          </li>
          <li>
            <code>view &lt;component&gt;</code> prints source paths, targets, roles, integrity,
            dependencies, and component metadata without fetching source content.
          </li>
          <li>
            <code>docs &lt;component&gt;</code> prints Registry usage, accessibility guidance, and
            the optional canonical documentation path.
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
