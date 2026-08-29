import { CodeExample } from "../../../components/code-example";
import { FoundationDirectory } from "../../../components/foundation-directory";
import {
  bootstrapCommands,
  localCliInstall,
  localCliWorkflow,
  oneOffCliWorkflow,
  packageInstall,
} from "../../../lib/public-commands";
import { createPageMetadata } from "../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Getting started",
  description:
    "Create a maintained project or install Nerio packages and editable source components for accessible product interfaces.",
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
@source "../node_modules/@nerio-ui/ui/dist";`;

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
          Nerio Core <code>1.0.0-beta.1</code> is the current public beta. Unqualified installs and
          the <code>beta</code> dist-tag both resolve to this coordinated version.
        </p>
        <CodeExample code={bootstrapCommands} label="Create a package-mode project" />
        <p>
          <code>nerio create</code> writes one new project directory from the maintained current
          Next.js or Vite profile. The generated package versions, Tailwind bridge, compiled source
          scan, and server/client entrypoints match the clean consumer matrix. Existing directories,
          unsupported frameworks, and unsupported profiles fail before project files are written.
          Use the editable source lifecycle below when you already have an application or need
          source ownership.
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
          recipes. Tailwind Preflight remains consumer-owned, and compiled package output must be
          registered explicitly because Tailwind ignores <code>node_modules</code> by default.
          Adjust the <code>@source</code> path relative to your global stylesheet for other
          package-manager layouts.
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
          Runtime packages ship unbundled JavaScript plus declarations. Supported Next.js consumers
          use the package exports directly and do not add Nerio packages to{" "}
          <code>transpilePackages</code>. Editable TypeScript source remains available through the
          Registry and CLI workflow below.
        </p>
        <p>
          The supported baseline is Node.js 22 or newer, React 19, Next.js 16.2, TypeScript 5.9, and
          Tailwind CSS 4.1 or newer within the v4 line. Automated browser evidence covers current
          Chromium, Firefox, and WebKit engine lines. See the repository&apos;s{" "}
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
          are never overwritten by a normal update. <code>nerio init</code> detects the conventional{" "}
          <code>src/app</code> or <code>src/pages</code> project shape and defaults to{" "}
          <code>src/components/nerio</code>, so the documented <code>@/components/nerio/...</code>{" "}
          imports work with the standard Next.js <code>@/*</code> alias. Projects without a{" "}
          <code>src</code> application directory keep the <code>components/nerio</code> default; use{" "}
          <code>--components</code> to choose another location. Tailwind-first source installs
          include <code>styles/tailwind.css</code>; import it from a Tailwind-processed global
          stylesheet alongside the installed token and residual styles.
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
            Next.js module errors usually mean package versions are misaligned or an unsupported
            adapter root was imported. Reinstall the coordinated packages and use documented subpath
            exports; Nerio does not require <code>transpilePackages</code>.
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

      <section className="doc-section" id="foundations">
        <h2>Foundations</h2>
        <p>
          Use the canonical foundation sequence to move from token architecture and visual roles to
          composition, runtime behavior, accessibility, localization, and focused visual details.
          Every destination below is shared by documentation navigation, search, adjacent-page
          links, the sitemap, and the public <code>llms.txt</code> index.
        </p>
        <FoundationDirectory />
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
