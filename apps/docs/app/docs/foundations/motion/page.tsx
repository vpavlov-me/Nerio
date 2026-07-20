import { Code, Table, TableContainer } from "@nerio-ui/ui";
import { CodeExample } from "../../../../components/code-example";
import { MotionAdapterExamples } from "../../../../components/motion-adapter-examples";
import { createPageMetadata } from "../../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Motion",
  description:
    "Apply CSS-first Nerio motion tokens or opt into the Motion adapter for advanced, accessible product animation.",
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

const adapterUsage = `"use client";

import {
  NerioMotionConfig,
  motionTransitions,
  motionVariants,
  useNerioReducedMotion,
} from "@nerio-ui/adapters/motion";
import { AnimatePresence, LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";

export function Presence({ visible }: { visible: boolean }) {
  return (
    <NerioMotionConfig>
      <LazyMotion features={domAnimation} strict>
        <AnimatePresence initial={false}>
          {visible ? (
            <m.div
              key="panel"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={motionVariants.fadeScale}
              transition={motionTransitions.normal}
            />
          ) : null}
        </AnimatePresence>
      </LazyMotion>
    </NerioMotionConfig>
  );
}`;

const sourceInstall = `pnpm add motion
pnpm nerio add motion-adapter

import {
  NerioMotionConfig,
  motionTransitions,
  motionVariants,
  useNerioReducedMotion,
} from "@/components/nerio/lib/motion-adapter";`;

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
        <h2 id="optional-motion-adapter">Optional Motion adapter</h2>
        <p>
          Install <Code>motion</Code> only when a composition needs presence, interruption,
          coordinated sequencing, gestures, or layout continuity that would make CSS state
          orchestration fragile. Nerio Core never imports Motion, and unrelated adapter subpaths do
          not resolve the optional peer.
        </p>
        <CodeExample code="pnpm add motion @nerio-ui/adapters" label="Package installation" />
        <CodeExample code={adapterUsage} label="LazyMotion package usage" />
        <p>
          The adapter entrypoint is client-only. Keep the <Code>use client</Code> boundary at the
          smallest interactive composition. <Code>NerioMotionConfig</Code> always sets{" "}
          <Code>reducedMotion=&quot;user&quot;</Code>. Use <Code>initial=&#123;false&#125;</Code>{" "}
          when server-rendered state is already visible so hydration does not replay an entrance.{" "}
          <Code>useNerioReducedMotion</Code> provides a server-stable snapshot and updates mounted
          compositions when the operating-system preference changes.
        </p>
        <p>
          <Code>domAnimation</Code> covers variants, presence, and tap, hover, and focus gestures.
          Load <Code>domMax</Code> only for layout, pan, or drag capabilities. Strict mode catches
          an accidental full <Code>motion</Code> component inside a <Code>LazyMotion</Code>{" "}
          boundary; use <Code>m</Code> from <Code>motion/react-m</Code> there.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="motion-examples">Focused examples</h2>
        <p>
          These examples keep animation restrained and expose stable end states for browser
          verification. They do not replace existing Core component motion.
        </p>
        <MotionAdapterExamples />
      </section>

      <section className="doc-section">
        <h2 id="decision-boundary">Choose the smallest motion layer</h2>
        <TableContainer aria-label="CSS, Motion, and View Transitions decision guide">
          <Table>
            <thead>
              <tr>
                <th>Layer</th>
                <th>Use for</th>
                <th>Avoid when</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CSS and Tailwind</td>
                <td>
                  Hover, press, focus, color, opacity, small transforms, and reliable Base UI
                  states.
                </td>
                <td>The change requires coordinated presence, interruption, or shared layout.</td>
              </tr>
              <tr>
                <td>Optional Motion adapter</td>
                <td>
                  Presence, interruption, layout continuity, gestures, and product-level sequences.
                </td>
                <td>A shared CSS recipe already expresses the complete interaction.</td>
              </tr>
              <tr>
                <td>View Transitions API</td>
                <td>
                  Browser-owned page or route transitions with stable old and new document states.
                </td>
                <td>The interaction is gesture-driven or needs element-level interruption.</td>
              </tr>
            </tbody>
          </Table>
        </TableContainer>
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

      <section className="doc-section">
        <h2 id="source-install-and-removal">Source installation and removal</h2>
        <CodeExample code={sourceInstall} label="Source-installed adapter" />
        <p>
          Removing the adapter does not change Core components: replace Motion compositions with CSS
          recipes or static end states, remove the copied adapter file, then uninstall{" "}
          <Code>motion</Code>. No hidden provider or Core migration is required.
        </p>
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
