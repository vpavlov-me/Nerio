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
  description:
    "Prepare a coordinated Nerio 1.0.0-beta.1 to 1.0.0 migration while stable remains unpublished.",
  path: "/docs/migration",
});

const stablePackageInstall = `pnpm add @nerio-ui/tokens@1.0.0 @nerio-ui/adapters@1.0.0 @nerio-ui/ui@1.0.0 tailwindcss
pnpm add -D @tailwindcss/postcss postcss`;

const stableSourceInstall = "pnpm add -D @nerio-ui/registry@1.0.0 @nerio-ui/cli@1.0.0";

const sourceWorkflow = `pnpm exec nerio doctor
pnpm exec nerio diff
pnpm exec nerio update --dry-run
pnpm exec nerio update
pnpm exec nerio diff`;

const packageChecks = `pnpm install
pnpm typecheck
pnpm build`;

const stableChanges = [
  [
    "Release identity",
    "Six coordinated packages at 1.0.0 and immutable Registry revision v1.0.0",
    "Wait for public verification, then update every Nerio package already used by the product in one change.",
  ],
  [
    "Public contract",
    "The frozen beta.1 Core contract remains compatible, with additive docs, tokens, and corrections",
    "No beta.1 source rewrite is expected; typecheck, build, and review affected visual snapshots.",
  ],
  [
    "Dependencies",
    "Base UI 1.7 and Lucide 1.31, with Nerio-owned types and the Github adapter preserved",
    "Review consumer overrides or resolutions; normal consumers should use the coordinated Nerio manifests.",
  ],
  [
    "Editable source",
    "Version-aligned stable Registry content may produce a non-empty source diff",
    "Run doctor, diff, and update --dry-run before writing, and preserve local ownership.",
  ],
] as const;

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
          Prepare coordinated package and editable-source consumers for stable Core 1.0 without
          presenting the candidate as an already published release.
        </p>
      </header>

      <section className="doc-section" id="status">
        <h2>Current status</h2>
        <p className="doc-decision-boundary">
          <Code>1.0.0</Code> is the prepared stable candidate. It is not a stable release available
          from npm yet. Until separately approved publication and public verification, npm{" "}
          <Code>latest</Code> and <Code>beta</Code> resolve to <Code>1.0.0-beta.1</Code>; the
          protected <Code>alpha</Code> tag remains on <Code>0.1.0-alpha.2</Code>.
        </p>
        <p>
          Do not update production lockfiles to <Code>1.0.0</Code> or resolve Registry source from{" "}
          <Code>v1.0.0</Code> until the packages, tag, Registry revision, and GitHub Release are
          public from the same exact candidate.
        </p>
      </section>

      <section className="doc-section" id="stable-changes">
        <h2>Beta.1 to stable 1.0</h2>
        <p>
          The stable candidate keeps the frozen beta.1 Core contract compatible. Consumers already
          on beta.1 do not need to repeat the earlier Calendar, Tabs, interactive-type, Registry,
          CLI, or MCP migration.
        </p>
        <TableContainer aria-label="Beta.1 to stable 1.0 migration changes">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>What changed</TableHead>
                <TableHead>Required action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stableChanges.map(([area, change, action]) => (
                <TableRow key={area}>
                  <TableHead scope="row">{area}</TableHead>
                  <TableCell>{change}</TableCell>
                  <TableCell>{action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          After stable is publicly verified, upgrade every Nerio package already used by the
          consumer to <Code>1.0.0</Code> in one change. Do not mix stable and beta package versions.
        </p>
        <CodeExample code={stablePackageInstall} label="After publication: package upgrade" />
        <CodeExample code={packageChecks} label="Package verification" />
        <p>
          The supported baseline remains Node.js 22 or 24, React 19, Next.js 16.2, TypeScript 5.9,
          and Tailwind CSS 4.1 or newer within v4. Consumers with dependency overrides should review
          their Base UI and Lucide pins; normal consumers should use the coordinated Nerio
          manifests.
        </p>
        <p>
          Read the complete{" "}
          <a href="https://github.com/vpavlov-me/Nerio/blob/main/docs/migrations/beta-1-to-1-0.md">
            beta.1-to-stable migration guide
          </a>
          .
        </p>
      </section>

      <section className="doc-section" id="beta-changes">
        <h2>Beta.0 to beta.1 changes</h2>
        <p>
          This historical step still applies to consumers on beta.0. Complete it before following
          the stable transition above.
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
        <p>
          Read the detailed{" "}
          <a href="https://github.com/vpavlov-me/Nerio/blob/main/docs/migrations/beta-0-to-beta-1.md">
            beta.0-to-beta.1 migration guide
          </a>
          .
        </p>
      </section>

      <section className="doc-section" id="source-installs">
        <h2>Editable source installs</h2>
        <p>
          After publication, update the local Registry and CLI together. Inspect the complete source
          plan before writing. Unchanged files can advance automatically; a normal update preserves
          locally modified files so the product owner can port that intent onto the new upstream
          source.
        </p>
        <CodeExample
          code={stableSourceInstall}
          label="After publication: stable Registry and CLI"
        />
        <CodeExample code={sourceWorkflow} label="Safe source update" />
      </section>

      <section className="doc-section" id="evidence-boundary">
        <h2>Human evidence boundary</h2>
        <p>
          The bounded maintainer-run smoke in{" "}
          <a href="https://github.com/vpavlov-me/Nerio/issues/143">issue #143 Phase A</a> remains a
          prerequisite for publishing the exact stable candidate. Any P0/P1 or accepted
          stable-blocking defect found before publication still stops the release.
        </p>
        <p>
          The broad 22-scenario, eight-environment accessibility and real-device matrix in{" "}
          <a href="https://github.com/vpavlov-me/Nerio/issues/143">#143 Phase B</a> and the
          independent external-consumer cohort in{" "}
          <a href="https://github.com/vpavlov-me/Nerio/issues/146">#146</a> continue after stable
          publication. Missing completion of either broad program is not a stable 1.0 publication
          blocker; findings feed a patch or Core 1.1 as appropriate.
        </p>
      </section>

      <section className="doc-section" id="alpha-consumers">
        <h2>Earlier prerelease consumers</h2>
        <p>
          Consumers on beta.0 must first complete the{" "}
          <a href="https://github.com/vpavlov-me/Nerio/blob/main/docs/migrations/beta-0-to-beta-1.md">
            beta.0-to-beta.1 migration
          </a>
          . The temporary alpha aliases were removed when the beta baseline was established. If a
          product still uses alpha packages, begin with the{" "}
          <a href="https://github.com/vpavlov-me/Nerio/blob/main/docs/migrations/alpha-to-beta.md">
            alpha-to-beta migration
          </a>{" "}
          and then complete the beta and stable transitions in order.
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
