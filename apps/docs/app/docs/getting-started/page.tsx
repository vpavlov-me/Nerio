import { CodeExample } from "../../../components/code-example";
import { createPageMetadata } from "../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Getting started",
  description:
    "Install Nerio packages or editable source components, then use the registry CLI to build accessible product interfaces.",
  path: "/docs/getting-started",
});

const packageImports = `import { Alert, Card, Field, FormGroup, Table } from "@nerio/ui";
import { Button, Checkbox, Dialog, RadioGroup, Select, Switch, ToastProvider } from "@nerio/ui/client";
import "@nerio/ui/styles.css";`;

const packageInstall = `pnpm add @nerio/tokens @nerio/adapters @nerio/ui
pnpm add -D @nerio/registry @nerio/cli @nerio/mcp`;

const sourceInstall = `nerio init
nerio list
nerio info button
nerio add button --dry-run
nerio add button
nerio doctor`;

const nextConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@nerio/adapters", "@nerio/registry", "@nerio/tokens", "@nerio/ui"],
};

export default nextConfig;`;

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
        <p>
          After the manually approved public alpha is available, install the packages needed by your
          application. No npm release exists while the package manifests remain private.
        </p>
        <CodeExample code={packageInstall} label="Package installation" />
        <CodeExample code={packageImports} label="Package imports" />
        <p>
          <code>@nerio/ui</code> is the server-safe entrypoint for static Core components and
          utilities, including Field and FormGroup. <code>@nerio/ui/client</code> contains
          interactive Base UI-backed components such as Checkbox, RadioGroup, Switch, Select, and
          Dialog. <code>@nerio/ui/styles.css</code> imports tokens and component styles.
        </p>
        <p>
          Core packages ship TypeScript source. Add the Nerio packages used by your application to
          Next.js <code>transpilePackages</code>.
        </p>
        <CodeExample code={nextConfig} label="next.config.ts" />
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

      <section className="doc-section" id="project-lifecycle">
        <h2>Contributing and releases</h2>
        <p>
          Read the repository&apos;s{" "}
          <a href="https://github.com/vpavlov-me/Nerio/blob/main/CONTRIBUTING.md">
            contribution guide
          </a>{" "}
          before proposing changes. Releases follow the{" "}
          <a href="https://github.com/vpavlov-me/Nerio/blob/main/RELEASE.md">
            manual release runbook
          </a>
          ; CI validates readiness but never publishes packages, creates tags, or creates GitHub
          Releases.
        </p>
      </section>
    </article>
  );
}
