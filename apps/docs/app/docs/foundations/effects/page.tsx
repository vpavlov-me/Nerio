import {
  Badge,
  Code,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@nerio-ui/ui";
import { CodeExample } from "../../../../components/code-example";
import { createPageMetadata } from "../../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Effects",
  description:
    "Use Nerio shadow, focus, and layering tokens to create calm, accessible visual hierarchy across product surfaces.",
  path: "/docs/foundations/effects",
});

type TokenExample = readonly [label: string, token: string, description: string];
type TokenContract = readonly [label: string, token: string];

const effectTokens: TokenExample[] = [
  ["None", "--n-shadow-none", "Flat surfaces and controls that do not need elevation."],
  ["Extra subtle", "--n-shadow-xs", "The lightest available depth primitive."],
  ["Raised", "--n-shadow-sm", "Restrained separation for raised containers."],
  ["Floating", "--n-shadow-md", "Overlays, dialogs, toasts, and floating controls."],
];

const semanticEffects: TokenExample[] = [
  ["Flat surface", "--n-shadow-surface-flat", "Resolves to no shadow by default."],
  ["Control surface", "--n-shadow-surface-control", "Keeps default controls shadow-free."],
  ["Raised surface", "--n-shadow-surface-raised", "Resolves to the restrained raised shadow."],
  ["Floating surface", "--n-shadow-surface-floating", "Resolves to the strongest Core elevation."],
  ["Focus ring", "--n-focus-ring", "Two-stage visible keyboard focus treatment."],
  [
    "Overlay layer",
    "--n-overlay-z-index",
    "Portal stacking contract for menus, popovers, dialogs, and toasts.",
  ],
];

const componentContracts: TokenContract[] = [
  ["Card elevation", "--n-card-shadow"],
  ["Card radius", "--n-card-radius"],
  ["Overlay elevation", "--n-overlay-shadow"],
  ["Overlay backdrop", "--n-overlay-backdrop"],
  ["Overlay layer", "--n-overlay-z-index"],
];

const usage = `:root {
  --n-shadow-surface-raised: var(--n-shadow-sm);
  --n-shadow-surface-floating: var(--n-shadow-md);
  --n-color-focus-ring-soft: rgb(109 40 217 / 0.26);
}

.project-card {
  box-shadow: var(--n-shadow-surface-raised);
}

.project-card:focus-visible {
  box-shadow: var(--n-focus-ring);
}`;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Effects</h1>
        <p className="doc-lede">
          Shadow, focus, and layering tokens keep Nerio surfaces precise without tying the system to
          decorative depth or a specific product category.
        </p>
      </header>

      <section className="doc-section">
        <div className="section-heading">
          <h2 id="elevation-scale">Elevation scale</h2>
          <Badge variant="info">Tokenized</Badge>
        </div>
        <EffectTable label="Elevation primitive tokens" rows={effectTokens} />
      </section>

      <section className="doc-section">
        <h2 id="semantic-effects">Semantic effects</h2>
        <EffectTable label="Semantic effect tokens" rows={semanticEffects} />
      </section>

      <section className="doc-section">
        <h2 id="focus">Focus</h2>
        <p>
          <Code>--n-focus-ring</Code> combines a 2px surface-colored offset with a 4px soft outer
          ring. Theme and mode selectors remap the ring colors while controls share the same focus
          geometry.
        </p>
        <TableContainer aria-label="Focus ring tokens">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Token</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["Offset", "--n-color-focus-offset"],
                ["Soft ring", "--n-color-focus-ring-soft"],
                ["Inner width", "--n-focus-ring-inner-width"],
                ["Outer width", "--n-focus-ring-outer-width"],
              ].map(([label, token]) => (
                <TableRow key={token}>
                  <TableCell>{label}</TableCell>
                  <TableCell>
                    <Code>{token}</Code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="component-contracts">Component contracts</h2>
        <TableContainer aria-label="Component effect contracts">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract</TableHead>
                <TableHead>Token</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {componentContracts.map(([label, token]) => (
                <TableRow key={token}>
                  <TableCell>{label}</TableCell>
                  <TableCell>
                    <Code>{token}</Code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="usage">Usage</h2>
        <CodeExample code={usage} label="Radius and effect tokens" />
        <ul className="doc-list">
          <li>Use semantic elevation aliases in product and component styles.</li>
          <li>
            Keep shadows restrained; spacing and surface contrast should carry most hierarchy.
          </li>
          <li>Never remove visible focus styles from interactive surfaces.</li>
          <li>Use overlay z-index tokens for portal-based components and stacked UI.</li>
        </ul>
      </section>
    </article>
  );
}

function EffectTable({ label, rows }: { label: string; rows: TokenExample[] }) {
  return (
    <TableContainer aria-label={label}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Token</TableHead>
            <TableHead>Use</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([name, token, use]) => (
            <TableRow key={token}>
              <TableCell>{name}</TableCell>
              <TableCell>
                <Code>{token}</Code>
              </TableCell>
              <TableCell>{use}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
