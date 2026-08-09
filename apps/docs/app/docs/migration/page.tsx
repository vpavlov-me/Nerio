import {
  Code,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@nerio-ui/ui";
import { CodeExample } from "../../../components/code-example";
import { createPageMetadata } from "../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Migration",
  description: "Migrate Nerio 1.0.0-beta.0 consumers to the coordinated 1.0.0-beta.1 public beta.",
  path: "/docs/migration",
});

const sourceWorkflow = `pnpm exec nerio doctor
pnpm exec nerio diff
pnpm exec nerio update --dry-run
pnpm exec nerio update
pnpm exec nerio diff`;

const packageChecks = `pnpm install
pnpm typecheck
pnpm build`;

const betaChanges = [
  [
    "Runtime support",
    "Node.js 22 or 24 and Tailwind CSS 4.1 or newer",
    "Update the consumer toolchain before installing the coordinated packages.",
  ],
  [
    "Calendar and DatePicker",
    "Deterministic initial month and current-day behavior",
    "Pass a consumer-owned today value when the product needs the current month or day marker.",
  ],
  [
    "Interactive types",
    "Nerio-owned event and state contracts",
    "Replace Base UI type imports and use stable string values for Tabs.",
  ],
  [
    "Registry",
    "Source integrity and HTTPS-first remote access",
    "Use HTTPS for production registries and declare SHA-256 integrity for custom sources.",
  ],
  [
    "CLI updates",
    "Atomic source and lock-file transactions",
    "Run doctor, diff, and update --dry-run before applying an editable-source update.",
  ],
  [
    "MCP",
    "Declared output schemas and structuredContent",
    "Prefer structured output when supported; existing JSON text consumers remain compatible.",
  ],
] as const;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <h1>Migration</h1>
        <p className="doc-lede">
          Upgrade coordinated package and editable-source consumers to the current Nerio beta
          without treating it as a stable Core 1.0 release.
        </p>
      </header>

      <section className="doc-section" id="status">
        <h2>Current status</h2>
        <p className="doc-decision-boundary">
          <Code>1.0.0-beta.1</Code> is the current public beta. It is not a stable release; external
          feedback and manual accessibility/device evidence remain required before 1.0.
        </p>
        <p>
          Keep all six public Nerio packages aligned. Package and source-install consumers should
          upgrade the coordinated set together.
        </p>
      </section>

      <section className="doc-section" id="beta-changes">
        <h2>Beta.0 to beta.1 changes</h2>
        <p>
          Review the consumer-visible changes below, update the coordinated package set together,
          and then run the package verification commands.
        </p>
        <TableContainer aria-label="Beta.0 to beta.1 migration changes">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>What changed</TableHead>
                <TableHead>Required action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {betaChanges.map(([area, change, action]) => (
                <TableRow key={area}>
                  <TableHead scope="row">{area}</TableHead>
                  <TableCell>{change}</TableCell>
                  <TableCell>{action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CodeExample code={packageChecks} label="Package verification" />
      </section>

      <section className="doc-section" id="source-installs">
        <h2>Editable source installs</h2>
        <p>
          Inspect the update before writing. Unchanged files can advance automatically; a normal
          update preserves locally modified files so the product owner can port that intent onto the
          new upstream source.
        </p>
        <CodeExample code={sourceWorkflow} label="Safe source update" />
      </section>

      <section className="doc-section" id="alpha-consumers">
        <h2>Consumers still on alpha</h2>
        <p>
          The temporary alpha aliases were removed when the beta baseline was established. If a
          product still uses alpha packages, complete the{" "}
          <a href="https://github.com/vpavlov-me/Nerio/blob/main/docs/migrations/alpha-to-beta.md">
            alpha-to-beta migration
          </a>{" "}
          first, then return to the beta.0-to-beta.1 changes above.
        </p>
      </section>

      <section className="doc-section" id="compatibility">
        <h2>Compatibility contract</h2>
        <p>
          Public package exports and types, tokens, Registry data, CLI/MCP contracts, support
          ranges, and public documentation routes are snapshot-protected. Defaults, DOM and ARIA
          structure, events, and source-update behavior can also be breaking even when the visual
          change is small.
        </p>
        <p>
          Read the complete{" "}
          <a href="https://github.com/vpavlov-me/Nerio/blob/main/docs/public-api-stability.md">
            public API stability policy
          </a>
          .
        </p>
      </section>
    </article>
  );
}
