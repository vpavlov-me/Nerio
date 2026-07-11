import { CodeExample } from "../../../components/code-example";

const packageImports = `import { Alert, Card, Field, FormGroup, Table } from "@nerio/ui";
import { Button, Checkbox, Dialog, RadioGroup, Select, Switch, ToastProvider } from "@nerio/ui/client";
import "@nerio/ui/styles.css";`;

const sourceInstall = `nerio init
nerio list
nerio info button
nerio add button --dry-run
nerio add button
nerio doctor`;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Start</p>
        <h1>Getting started</h1>
        <p className="doc-lede">
          Use Nerio through package entrypoints while building the foundation, or install editable
          source components into an application through the registry CLI.
        </p>
      </header>

      <section className="doc-section" id="install">
        <h2>Install</h2>
        <CodeExample code={packageImports} label="Package imports" />
        <p>
          <code>@nerio/ui</code> is the server-safe entrypoint for static Core components and
          utilities, including Field and FormGroup. <code>@nerio/ui/client</code> contains
          interactive Base UI-backed components such as Checkbox, RadioGroup, Switch, Select, and
          Dialog. <code>@nerio/ui/styles.css</code> imports tokens and component styles.
        </p>
      </section>

      <section className="doc-section" id="project-shape">
        <h2>Project shape</h2>
        <CodeExample code={sourceInstall} label="Source install" />
        <p>
          The CLI writes editable source files into the consuming app. Use <code>list</code> and{" "}
          <code>info</code> to inspect registry contents, <code>add --dry-run</code> to preview
          files, and <code>doctor</code> to validate configuration.
        </p>
      </section>

      <section className="doc-section" id="principles">
        <h2>Principles</h2>
        <ul className="doc-list">
          <li>Keep Core universal, source-first, and independent from Pro packages.</li>
          <li>Use semantic and component tokens before product-specific CSS.</li>
          <li>Keep interactive components in client boundaries.</li>
        </ul>
      </section>
    </article>
  );
}
