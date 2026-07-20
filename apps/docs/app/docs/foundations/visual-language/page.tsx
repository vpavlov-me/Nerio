import type { CSSProperties } from "react";
import { Badge, Code } from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { createPageMetadata } from "../../../../lib/seo";
import styles from "./visual-language.module.css";

export const metadata = createPageMetadata({
  title: "Visual language",
  description:
    "Reference the Nerio 1.0 surface, color, typography, geometry, density, focus, and motion foundations.",
  path: "/docs/foundations/visual-language",
});

const themes = [
  ["Purple", "--n-purple-600", "--n-purple-500"],
  ["Blue", "--n-blue-600", "--n-blue-500"],
  ["Green", "--n-green-600", "--n-green-600"],
  ["Orange", "--n-orange-700", "--n-orange-700"],
  ["Red", "--n-red-600", "--n-red-500"],
  ["Neutral", "--n-gray-950", "--n-gray-50"],
] as const;

const radii = [
  ["Control", "--n-radius-control"],
  ["Container", "--n-radius-container"],
  ["Task surface", "--n-radius-overlay"],
  ["Pill", "--n-radius-pill"],
] as const;

const spaces = ["--n-space-1", "--n-space-2", "--n-space-3", "--n-space-4", "--n-space-6"];

export default function VisualLanguagePage() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation reference</p>
        <h1>Visual language</h1>
        <p className="doc-lede">
          Nerio is compact, soft, and neutral-first. This reference maps the approved visual
          direction to public tokens; component pages remain the source for individual APIs.
        </p>
      </header>

      <section className="doc-section">
        <h2 id="surfaces">Surface hierarchy</h2>
        <p>
          White and black are the foundations. Cool alpha-neutral layers create grouping and
          interaction without enclosing every region in a border.
        </p>
        <div className={styles.modeGrid}>
          {(["light", "dark"] as const).map((mode) => (
            <div className={styles.mode} data-reference-mode={mode} key={mode}>
              <div className={styles.modeHeader}>
                <strong>{mode === "light" ? "Light" : "Dark"}</strong>
                <Code>{mode === "light" ? "pure white" : "pure black"}</Code>
              </div>
              <div className={styles.surfaceDefault}>Default</div>
              <div className={styles.surfaceSubtle}>Subtle group field</div>
              <div className={styles.surfaceControl}>Control / hover layer</div>
              <div className={styles.surfaceOverlay}>Inverted glass overlay</div>
            </div>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2 id="color">Accent and semantic color</h2>
        <p>
          Theme color is constrained to primary action, focus, links, progress, selection
          indicators, and intentional brand moments.
        </p>
        <div className={styles.themeGrid}>
          {themes.map(([label, lightToken, darkToken]) => (
            <div className={styles.theme} key={label}>
              <strong>{label}</strong>
              <div className={styles.themeSwatches}>
                <span
                  data-reference-mode="light"
                  style={{ "--reference-accent": `var(${lightToken})` } as CSSProperties}
                >
                  Light
                </span>
                <span
                  data-reference-mode="dark"
                  style={{ "--reference-accent": `var(${darkToken})` } as CSSProperties}
                >
                  Dark
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.statusRow}>
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>
      </section>

      <section className="doc-section">
        <h2 id="typography">Typography hierarchy</h2>
        <div className={styles.typeScale}>
          <p className={styles.display}>Product heading</p>
          <p className={styles.heading}>Section heading</p>
          <p className={styles.body}>Body text stays compact, regular, and readable at 14px.</p>
          <p className={styles.metadata}>Metadata and supporting text use quieter contrast.</p>
          <Code>const theme = "nerio"</Code>
        </div>
      </section>

      <section className="doc-section">
        <h2 id="geometry">Geometry and spacing</h2>
        <div className={styles.radiusGrid}>
          {radii.map(([label, token]) => (
            <div className={styles.radius} key={token} style={{ borderRadius: `var(${token})` }}>
              <strong>{label}</strong>
              <Code>{token}</Code>
            </div>
          ))}
        </div>
        <div className={styles.spaceScale} aria-label="Spacing scale">
          {spaces.map((token) => (
            <div key={token}>
              <span style={{ inlineSize: `var(${token})` }} />
              <Code>{token}</Code>
            </div>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2 id="interaction">Focus and interaction</h2>
        <div className={styles.actionRow}>
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button className={styles.focusExample} variant="outline">
            Focus reference
          </Button>
        </div>
        <p>
          Hover and focus feedback use shared motion aliases. Link actions underline on hover and
          focus-visible; icon-only actions require both an accessible name and a Tooltip.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="density">Density comparison</h2>
        <div className={styles.densityGrid}>
          <div>
            <strong>Comfortable</strong>
            <Code>data-density="comfortable"</Code>
            <span className={styles.comfortableControl}>32px default control</span>
          </div>
          <div>
            <strong>Compact</strong>
            <Code>data-density="compact"</Code>
            <span className={styles.compactControl}>28px compact control</span>
          </div>
        </div>
        <p>
          Density remaps semantic and component aliases only. Primitive spacing, type, radius, icon,
          and motion scales remain immutable.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="motion">Motion</h2>
        <div className={styles.motionRow}>
          <span />
          <div>
            <strong>Calm and causal</strong>
            <p>
              Hover uses <Code>--n-motion-hover-duration</Code>; overlays use the shared enter and
              exit families and remove nonessential travel under reduced motion.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
