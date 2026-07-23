import { Badge } from "@nerio-ui/ui";
import { CodeExample } from "../../../components/code-example";
import {
  mcpInstall,
  mcpLocalConfiguration,
  mcpOneOffConfiguration,
} from "../../../lib/public-commands";
import { createPageMetadata } from "../../../lib/seo";

export const metadata = createPageMetadata({
  title: "AI tooling",
  description:
    "Use Nerio's llms.txt and read-only MCP server to give people and AI agents the same component registry contract.",
  path: "/docs/ai",
});

const packageImports = `import { Alert, Card, Table } from "@nerio-ui/ui";
import { Button, Dialog, Select, ToastProvider } from "@nerio-ui/ui/client";
import "@nerio-ui/ui/styles.css";`;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Agent interface</p>
        <h1>AI tooling</h1>
        <p className="doc-lede">
          Nerio exposes the same registry contract to people and agents through llms.txt and a
          read-only Model Context Protocol server.
        </p>
      </header>

      <section className="doc-section">
        <div className="section-heading">
          <h2>MCP server</h2>
          <Badge variant="success">stdio</Badge>
        </div>
        <p>
          The server uses the official MCP TypeScript SDK and reads component metadata directly from
          the version-aligned Nerio Registry. Install it in the consuming project and run its public
          bin through pnpm; no monorepo checkout or internal source path is required.
        </p>
        <CodeExample code={mcpInstall} label="Install the MCP server" />
        <CodeExample code={mcpLocalConfiguration} label="Recommended MCP configuration" />
        <p>
          Clients that intentionally prefer one-off package execution may use the package-qualified
          configuration below. A persistent local install is easier to pin and diagnose.
        </p>
        <CodeExample code={mcpOneOffConfiguration} label="One-off MCP configuration" />
      </section>

      <section className="doc-section">
        <h2>Read-only tools</h2>
        <div className="anatomy-list">
          <div>
            <code>list_components</code>
            <span>Discover names, categories, and purposes.</span>
          </div>
          <div>
            <code>get_component</code>
            <span>Read the complete registry item and token contract.</span>
          </div>
          <div>
            <code>get_component_usage</code>
            <span>
              Read usage, source files, tokens, primitives, slots, variants, and accessibility
              guidance.
            </span>
          </div>
          <div>
            <code>get_registry</code>
            <span>Read the coordinated Registry and MCP release metadata.</span>
          </div>
        </div>
      </section>

      <section className="doc-section">
        <h2>Import model</h2>
        <CodeExample code={packageImports} label="Package imports" />
        <p>
          Agents should keep static components on the server-safe <code>@nerio-ui/ui</code>{" "}
          entrypoint and use <code>@nerio-ui/ui/client</code> only for interactive Base UI-backed
          components.
        </p>
      </section>

      <section className="doc-section">
        <h2>Composition rules</h2>
        <ul className="doc-list">
          <li>Select the smallest component set that expresses the workflow.</li>
          <li>Preserve semantic tokens, slots, and accessible names.</li>
          <li>Use requiredTokens before inventing new product CSS variables.</li>
          <li>Prefer source installation when a product needs to customize component behavior.</li>
          <li>Never introduce an overlapping primitive library into a Nerio composition.</li>
        </ul>
        <p>
          The concise machine-readable overview is available at{" "}
          <a className="text-link" href="/llms.txt">
            /llms.txt
          </a>
          .
        </p>
      </section>
    </article>
  );
}
