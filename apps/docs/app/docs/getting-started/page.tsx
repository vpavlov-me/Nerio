import { CodeExample } from "../../../components/code-example";
import { createPageMetadata } from "../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Getting started",
  description:
    "Install Nerio packages or editable source components, then use the registry CLI to build accessible product interfaces.",
  path: "/docs/getting-started",
});

const packageImports = `import { Settings } from "@nerio-ui/adapters/icons";
import { Alert, Card, Field, FormGroup, Table } from "@nerio-ui/ui";
import { Button, Checkbox, Dialog, RadioGroup, Select, Switch, ToastProvider } from "@nerio-ui/ui/client";
import "@nerio-ui/ui/styles.css";`;

const packageInstall = `pnpm add @nerio-ui/tokens @nerio-ui/adapters @nerio-ui/ui
pnpm add tailwindcss
pnpm add -D @tailwindcss/postcss postcss @nerio-ui/registry @nerio-ui/cli @nerio-ui/mcp`;

const tailwindSetup = `/* app/globals.css */
@import "tailwindcss";
@import "@nerio-ui/tokens/tailwind.css";
@import "@nerio-ui/ui/styles.css";
@source "../node_modules/@nerio-ui/ui/src";`;

const sourceInstall = `nerio init
nerio list
nerio info button
nerio add button --dry-run
nerio add button
nerio doctor`;

const nextConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@nerio-ui/adapters", "@nerio-ui/registry", "@nerio-ui/tokens", "@nerio-ui/ui"],
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
        <CodeExample code={tailwindSetup} label="Tailwind CSS v4 package setup" />
        <CodeExample code={packageImports} label="Package imports" />
        <p>
          <code>@nerio-ui/ui</code> is the server-safe entrypoint for static Core components and
          utilities, including Field and FormGroup. <code>@nerio-ui/ui/client</code> contains
          interactive Base UI-backed components such as Checkbox, RadioGroup, Switch, Select, and
          Dialog. <code>@nerio-ui/ui/styles.css</code> imports tokens and component styles. Tailwind
          Preflight remains consumer-owned; package source must be registered explicitly because
          Tailwind ignores <code>node_modules</code> by default. Adjust the <code>@source</code>{" "}
          path relative to your global stylesheet for other package-manager layouts.
        </p>
        <p>
          Consumers may omit Preflight by importing only Tailwind&apos;s theme and utilities layers.
          Nerio&apos;s residual stylesheet remains limited to named keyframes plus scoped box-sizing
          and native-control typography compatibility for that mode; component visuals remain owned
          by static Tailwind recipes.
        </p>
        <p>
          Import icons and icon types from <code>@nerio-ui/adapters/icons</code>. The adapter
          package has no aggregating root entrypoint: table, chart, form, and schema integrations
          use their dedicated subpaths and require only their matching optional peer.
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
          files, and <code>doctor</code> to validate configuration. Tailwind-first source installs
          include <code>styles/tailwind.css</code>; import it from a Tailwind-processed global
          stylesheet alongside the installed token and residual styles.
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
