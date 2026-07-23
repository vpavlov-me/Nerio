import { CodeExample } from "../../../components/code-example";
import {
  localCliInstall,
  localCliWorkflow,
  oneOffCliWorkflow,
  packageInstall,
} from "../../../lib/public-commands";
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

const tailwindSetup = `/* app/globals.css */
@import "tailwindcss";
@import "@nerio-ui/tokens/tailwind.css";
@import "@nerio-ui/ui/styles.css";
@source "../node_modules/@nerio-ui/ui/src";`;

const nextConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@nerio-ui/adapters", "@nerio-ui/tokens", "@nerio-ui/ui"],
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
          Nerio Core <code>0.1.0-alpha.1</code> is published under the npm <code>alpha</code> tag.
          Install only the packages and peers used by your application; the stable 1.0 release is
          not published yet.
        </p>
        <CodeExample code={packageInstall} label="Package installation" />
        <CodeExample code={tailwindSetup} label="Tailwind CSS v4 package setup" />
        <CodeExample code={packageImports} label="Package imports" />
        <p>
          <code>@nerio-ui/ui</code> is the server-safe entrypoint for static Core components and
          utilities, including Field and FormGroup. <code>@nerio-ui/ui/client</code> contains
          interactive Base UI-backed components such as Checkbox, RadioGroup, Switch, Select, and
          Dialog. <code>@nerio-ui/ui/styles.css</code> imports tokens, named keyframes, and the
          scoped no-Preflight compatibility rules; component visuals compile from their Tailwind
          recipes. Tailwind Preflight remains consumer-owned, and package source must be registered
          explicitly because Tailwind ignores <code>node_modules</code> by default. Adjust the{" "}
          <code>@source</code> path relative to your global stylesheet for other package-manager
          layouts.
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
        <p>
          The supported baseline is Node.js 20.9 or newer, React 19, Next.js 16.2, TypeScript 5.9,
          and Tailwind CSS v4. Automated browser evidence covers current Chromium, Firefox, and
          WebKit engine lines. See the repository&apos;s{" "}
          <a href="https://github.com/vpavlov-me/Nerio/blob/main/docs/platform-support.md">
            platform support policy
          </a>{" "}
          for exact ranges and manual assistive-technology limitations.
        </p>
      </section>

      <section className="doc-section" id="project-shape">
        <h2>Editable source installation</h2>
        <p>
          The recommended workflow installs the version-aligned Registry and CLI in the consuming
          project, then invokes the local <code>nerio</code> bin through pnpm.
        </p>
        <CodeExample code={localCliInstall} label="Install the local CLI" />
        <CodeExample code={localCliWorkflow} label="Local CLI workflow" />
        <p>
          The CLI writes editable source files into the consuming app. Use <code>list</code> and{" "}
          <code>info</code> to inspect registry contents, <code>add --dry-run</code> to preview
          files, <code>diff</code> and <code>update --dry-run</code> to review local/upstream drift,
          and <code>doctor</code> to validate configuration. The default Registry is version-aligned
          with the installed CLI instead of a moving branch. Successful installs record portable
          file hashes and dependency closure in <code>nerio.lock.json</code>; locally modified files
          are never overwritten by a normal update. Tailwind-first source installs include{" "}
          <code>styles/tailwind.css</code>; import it from a Tailwind-processed global stylesheet
          alongside the installed token and residual styles.
        </p>
        <h3>One-off CLI execution</h3>
        <p>
          Use the package-qualified one-off form for a quick initialization or install. Prefer the
          local workflow above for repeatable updates and version alignment.
        </p>
        <CodeExample code={oneOffCliWorkflow} label="One-off CLI commands" />
      </section>

      <section className="doc-section" id="troubleshooting">
        <h2>Troubleshooting</h2>
        <ul className="doc-list">
          <li>
            Missing styles usually mean the Tailwind bridge import or package <code>@source</code>{" "}
            path is absent. Run <code>pnpm exec nerio doctor</code> and verify the path relative to
            the global stylesheet.
          </li>
          <li>
            Next.js syntax or module errors from package source usually mean a used Nerio package is
            missing from <code>transpilePackages</code>.
          </li>
          <li>
            Server Component errors mean an interactive primitive was imported from the wrong
            entrypoint. Keep static components on <code>@nerio-ui/ui</code> and add a client
            boundary for <code>@nerio-ui/ui/client</code>.
          </li>
          <li>
            Adapter import failures require the peer for that exact subpath. Install Motion,
            TanStack Table, Recharts, React Hook Form, or Zod only when the matching adapter is
            used.
          </li>
          <li>
            CLI/Registry incompatibility requires coordinated local versions. Reinstall{" "}
            <code>@nerio-ui/cli</code> and <code>@nerio-ui/registry</code> together.
          </li>
          <li>
            Source drift is never silently overwritten. Run <code>pnpm exec nerio diff</code>,
            review <code>update --dry-run</code>, and resolve conflicts before applying an update.
          </li>
          <li>
            If pnpm cannot resolve the <code>nerio</code> or <code>nerio-mcp</code> bin, confirm the
            package is installed in the project and use <code>pnpm exec</code>; do not call an
            internal package file.
          </li>
          <li>
            MCP clients must run command <code>pnpm</code> with arguments{" "}
            <code>[&quot;exec&quot;, &quot;nerio-mcp&quot;]</code> from the project containing the
            local package install.
          </li>
        </ul>
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
