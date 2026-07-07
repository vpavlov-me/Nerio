import { Badge } from "@nerio/ui";
import { CodeExample } from "../../../components/code-example";

const mcpConfig = `{
  "mcpServers": {
    "nerio": {
      "command": "node",
      "args": ["packages/mcp/src/server.js"]
    }
  }
}`;

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
          the Nerio registry.
        </p>
        <CodeExample code={mcpConfig} label="MCP configuration" />
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
            <span>Read usage, slots, variants, and accessibility guidance.</span>
          </div>
        </div>
      </section>

      <section className="doc-section">
        <h2>Composition rules</h2>
        <ul className="doc-list">
          <li>Select the smallest component set that expresses the workflow.</li>
          <li>Preserve semantic tokens, slots, and accessible names.</li>
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
