import { Code, Table, TableContainer } from "@nerio-ui/ui";
import { CodeExample } from "../../../../components/code-example";
import { createPageMetadata } from "../../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Motion",
  description:
    "Apply Nerio motion tokens and Tailwind recipes for restrained, accessible interaction feedback with reduced-motion support.",
  path: "/docs/foundations/motion",
});

type TokenRow = readonly [label: string, token: string, value: string, use: string];

const durationTokens: TokenRow[] = [
  ["Instant", "--n-duration-instant", "80ms", "Reduced-motion and technical synchronization."],
  ["Fast", "--n-duration-fast", "140ms", "Press, focus, and compact acknowledgement."],
  ["Normal", "--n-duration-normal", "220ms", "Hover, reveals, overlays, and feedback."],
  ["Slow", "--n-duration-slow", "360ms", "Page-level reveals used sparingly."],
];

const easingTokens: TokenRow[] = [
  ["Standard", "--n-easing-standard", "cubic-bezier(0.2, 0, 0, 1)", "Default state changes."],
  ["Enter", "--n-easing-enter", "cubic-bezier(0, 0, 0.2, 1)", "Content appearing."],
  ["Exit", "--n-easing-exit", "cubic-bezier(0.4, 0, 1, 1)", "Content leaving."],
  [
    "Expressive",
    "--n-easing-expressive",
    "cubic-bezier(0.16, 1, 0.3, 1)",
    "Success feedback and larger reveals.",
  ],
];

const semanticTokens = [
  "--n-motion-hover-duration",
  "--n-motion-press-duration",
  "--n-motion-focus-duration",
  "--n-motion-reveal-duration",
  "--n-motion-collapse-duration",
  "--n-motion-overlay-enter-duration",
  "--n-motion-overlay-exit-duration",
  "--n-motion-page-enter-duration",
  "--n-motion-data-refresh-duration",
  "--n-motion-success-feedback-duration",
  "--n-motion-error-feedback-duration",
];

const utilityRows: TokenRow[] = [
  [
    "Hover",
    "motionClasses.hover",
    "Static Tailwind recipe",
    "Background, border, color, and opacity transitions.",
  ],
  [
    "Press",
    "motionClasses.press",
    "Static Tailwind recipe",
    "Subtle press scale with reduced-motion fallback.",
  ],
  ["Focus", "motionClasses.focus", "Static Tailwind recipe", "Focus ring and border transitions."],
  [
    "Overlay enter",
    "motionClasses.overlayEnter",
    "Static Tailwind recipe",
    "Opacity plus small translate/scale.",
  ],
  [
    "Disclosure",
    "motionClasses.disclosure",
    "Static Tailwind recipe",
    "Height and opacity for open/close content.",
  ],
  [
    "Tab indicator",
    "motionClasses.tabIndicator",
    "Static Tailwind recipe",
    "Active indicator movement.",
  ],
  [
    "Skeleton",
    "motionClasses.skeleton",
    "Static Tailwind recipe",
    "Calm loading pulse with reduced-motion fallback.",
  ],
];

const usage = `import { cn, motionClasses } from "@nerio-ui/ui";

<button
  type="button"
  className={cn(
    "rounded-n-control border border-n-border bg-n-surface px-n-4 py-n-2 text-n-text focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring)",
    motionClasses.hover,
    motionClasses.press,
    motionClasses.focus,
  )}
>
  Save changes
</button>`;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Motion</h1>
        <p className="doc-lede">
          Motion is a tokenized interaction contract for hover, press, focus, overlays, disclosure,
          tabs, toasts, loading, feedback, and reduced-motion behavior.
        </p>
      </header>

      <section className="doc-section">
        <h2 id="duration-tokens">Duration tokens</h2>
        <TokenTable rows={durationTokens} />
      </section>

      <section className="doc-section">
        <h2 id="easing-tokens">Easing tokens</h2>
        <TokenTable rows={easingTokens} />
      </section>

      <section className="doc-section">
        <h2 id="semantic-motion">Semantic motion</h2>
        <p>
          Semantic motion variables describe intent and point to duration and easing tokens.
          Component source should use these aliases instead of repeating raw timing values. Hover
          feedback always transitions with the semantic hover pair; instant timing is not used for
          ordinary pointer interaction.
        </p>
        <TableContainer aria-label="Semantic motion aliases">
          <Table>
            <thead>
              <tr>
                <th>Token</th>
              </tr>
            </thead>
            <tbody>
              {semanticTokens.map((token) => (
                <tr key={token}>
                  <td>
                    <Code>{token}</Code>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="tailwind-motion-recipes">Tailwind motion recipes</h2>
        <p>
          <Code>motionClasses</Code> exposes complete, statically detectable Tailwind class strings.
          The former <Code>n-motion-*</Code> visual utility classes are not part of the
          post-migration contract.
        </p>
        <TokenTable rows={utilityRows} valueHeader="Authoring" />
      </section>

      <section className="doc-section">
        <h2 id="reduced-motion">Reduced motion</h2>
        <TableContainer aria-label="Motion accessibility behavior">
          <Table>
            <thead>
              <tr>
                <th>Preference</th>
                <th>Behavior</th>
                <th>Examples</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Default</td>
                <td>Core components use short durations and avoid layout-heavy motion.</td>
                <td>Hover, focus, overlays, and skeleton loading resolve through CSS variables.</td>
              </tr>
              <tr>
                <td>Reduced motion</td>
                <td>Large movement collapses to opacity or immediate state changes.</td>
                <td>
                  Press scale, overlay translation, and repeated skeleton movement are removed or
                  minimized.
                </td>
              </tr>
            </tbody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="usage">Usage</h2>
        <CodeExample code={usage} label="Motion utility usage" />
        <ul className="doc-list">
          <li>Use shared motion recipes before adding component-specific Tailwind transitions.</li>
          <li>
            Keep Core motion subtle; expressive motion belongs in product compositions and Pro
            examples.
          </li>
          <li>
            Do not add animation libraries for basic hover, focus, overlay, or loading behavior.
          </li>
        </ul>
      </section>
    </article>
  );
}

function TokenTable({ rows, valueHeader = "Value" }: { rows: TokenRow[]; valueHeader?: string }) {
  return (
    <TableContainer aria-label="Motion token reference">
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Token</th>
            <th>{valueHeader}</th>
            <th>Use</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, token, value, use]) => (
            <tr key={token}>
              <td>{label}</td>
              <td>
                <Code>{token}</Code>
              </td>
              <td>
                <Code>{value}</Code>
              </td>
              <td>{use}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}
