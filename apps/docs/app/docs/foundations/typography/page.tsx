import { Badge, Card, Input, Kbd, Table } from "@nerio/ui";
import { Button } from "@nerio/ui/client";
import { CodeExample } from "../../../../components/code-example";
import { createPageMetadata } from "../../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Typography",
  description:
    "Understand Nerio typography tokens, semantic roles, and font overrides for readable, adaptable product interfaces.",
  path: "/docs/foundations/typography",
});

const scale = [
  ["xs", "--n-font-size-xs", "12px", "Metadata, badges, dense captions"],
  ["sm", "--n-font-size-sm", "13px", "Labels, helper text, table cells"],
  ["md", "--n-font-size-md", "14px", "Default UI body and controls"],
  ["lg", "--n-font-size-lg", "16px", "Lead copy and compact section intros"],
  ["xl", "--n-font-size-xl", "18px", "Small headings"],
  ["2xl", "--n-font-size-2xl", "20px", "Metric values and page sections"],
  ["3xl", "--n-font-size-3xl", "24px", "Editorial headings"],
];

const semanticRoles = [
  ["Body size", "--n-body-font-size", "--n-font-size-md"],
  ["Body line height", "--n-body-line-height", "--n-line-height-normal"],
  ["Control size", "--n-control-font-size", "--n-font-size-md"],
  ["Control weight", "--n-control-font-weight", "--n-font-weight-medium"],
  ["Label size", "--n-label-font-size", "--n-font-size-md"],
  ["Label weight", "--n-label-font-weight", "--n-font-weight-medium"],
  ["Helper size", "--n-helper-font-size", "--n-font-size-xs"],
  ["Helper line height", "--n-helper-line-height", "--n-line-height-normal"],
] as const;

const systemInstall = `@import "@nerio/tokens/styles.css";`;

const geistInstall = `@font-face {
  font-family: "Geist";
  src: url("/fonts/geist-variable.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

/* The font file is supplied by your product. */`;

const geistRecipe = `<div className="n-typography-geist">
  <App />
</div>`;

const customOverride = `:root {
  --n-font-sans: "IBM Plex Sans", var(--n-font-sans-system);
}

.my-product-surface {
  --n-font-sans: "IBM Plex Sans", var(--n-font-sans-system);
}`;

type TypographyPreset = {
  label: string;
  className: string;
  note: string;
};

const presets: TypographyPreset[] = [
  {
    label: "System",
    className: "n-typography-system",
    note: "No font loading is required. The operating system chooses the native UI family.",
  },
  {
    label: "Geist",
    className: "n-typography-geist",
    note: "The docs load Geist locally; products must load it themselves before using this recipe.",
  },
  {
    label: "Inter",
    className: "n-typography-inter",
    note: "Products load Inter themselves. Mono intentionally remains the system stack.",
  },
  {
    label: "IBM Plex",
    className: "n-typography-ibm-plex",
    note: "A practical product-system pairing. Products load IBM Plex Sans and IBM Plex Mono.",
  },
  {
    label: "Manrope",
    className: "n-typography-manrope",
    note: "A contemporary, open sans direction with the system mono stack retained.",
  },
  {
    label: "Source Sans 3",
    className: "n-typography-source-sans",
    note: "A readable editorial and operational UI direction with system mono retained.",
  },
  {
    label: "Space Grotesk",
    className: "n-typography-space-grotesk",
    note: "A more expressive product direction that preserves the system mono stack.",
  },
];

function PresetPreview({ preset }: { preset: TypographyPreset }) {
  return (
    <Card className={`typography-preset-preview ${preset.className}`}>
      <div className="typography-preset-heading">
        <div>
          <Badge>{preset.label}</Badge>
          <h3>Revenue workspace</h3>
        </div>
        <strong>$48,320.00</strong>
      </div>
      <p>{preset.note}</p>
      <div className="typography-preset-controls">
        <Input
          aria-label={`${preset.label} project search`}
          placeholder="A long project label can wrap"
        />
        <Button size="sm">Create report</Button>
      </div>
      <div
        aria-label={`${preset.label} report tabs`}
        className="typography-preset-tabs"
        role="tablist"
      >
        <button aria-selected="true" role="tab" type="button">
          Overview
        </button>
        <button aria-selected="false" role="tab" type="button">
          Activity
        </button>
      </div>
      <div className="typography-preset-table" role="table">
        <div role="row">
          <span role="cell">Enterprise plan renewal</span>
          <span role="cell">12,840</span>
          <span role="cell">+18.4%</span>
        </div>
      </div>
      <div className="typography-preset-footer">
        <span>
          Press <Kbd>⌘K</Kbd> to search
        </span>
        <code>--n-font-sans</code>
      </div>
      <div className="typography-preset-compact" data-density="compact">
        Compact density · 32px controls · Accurate values
      </div>
    </Card>
  );
}

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Typography</h1>
        <p className="doc-lede">
          Nerio Core defaults to platform System UI so products stay native, neutral, and usable
          without a font request. The documentation brand uses Geist independently.
        </p>
      </header>

      <section className="doc-section">
        <div className="section-heading">
          <h2 id="font-contract">Font contract</h2>
          <Badge>System UI by default</Badge>
        </div>
        <div className="foundation-grid">
          <Card className="type-card">
            <Badge variant="info">Sans</Badge>
            <p className="type-specimen type-specimen-sans">
              Build calm, precise product surfaces.
            </p>
            <code>--n-font-sans → --n-font-sans-system</code>
          </Card>
          <Card className="type-card">
            <Badge variant="info">Mono</Badge>
            <p className="type-specimen type-specimen-mono">--n-color-action-primary</p>
            <code>--n-font-mono → --n-font-mono-system</code>
          </Card>
        </div>
        <p>
          Native consistency means a product uses each platform&apos;s familiar UI family; it does
          not mean pixels are identical across operating systems. Font family changes remain CSS
          token overrides, not a fourth runtime axis beside theme, mode, and density.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="presets">Typography presets</h2>
        <Table>
          <thead>
            <tr>
              <th>Preset</th>
              <th>Sans token</th>
              <th>Mono token</th>
              <th>Font loading</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>System</td>
              <td>
                <code>--n-font-sans-system</code>
              </td>
              <td>
                <code>--n-font-mono-system</code>
              </td>
              <td>None</td>
            </tr>
            <tr>
              <td>Geist</td>
              <td>
                <code>--n-font-sans-geist</code>
              </td>
              <td>
                <code>--n-font-mono-geist</code>
              </td>
              <td>Consumer-owned</td>
            </tr>
            <tr>
              <td>Inter</td>
              <td>
                <code>--n-font-sans-inter</code>
              </td>
              <td>
                <code>--n-font-mono-system</code>
              </td>
              <td>Consumer-owned</td>
            </tr>
            <tr>
              <td>IBM Plex</td>
              <td>
                <code>--n-font-sans-ibm-plex</code>
              </td>
              <td>
                <code>--n-font-mono-ibm-plex</code>
              </td>
              <td>Consumer-owned</td>
            </tr>
            <tr>
              <td>Manrope</td>
              <td>
                <code>--n-font-sans-manrope</code>
              </td>
              <td>
                <code>--n-font-mono-system</code>
              </td>
              <td>Consumer-owned</td>
            </tr>
            <tr>
              <td>Source Sans 3</td>
              <td>
                <code>--n-font-sans-source-sans</code>
              </td>
              <td>
                <code>--n-font-mono-system</code>
              </td>
              <td>Consumer-owned</td>
            </tr>
            <tr>
              <td>Space Grotesk</td>
              <td>
                <code>--n-font-sans-space-grotesk</code>
              </td>
              <td>
                <code>--n-font-mono-system</code>
              </td>
              <td>Consumer-owned</td>
            </tr>
            <tr>
              <td>Custom</td>
              <td colSpan={2}>
                Override <code>--n-font-sans</code> at root or on a product surface.
              </td>
              <td>Consumer-owned</td>
            </tr>
          </tbody>
        </Table>
        <p>
          The <code>n-typography-*</code> classes are scoped token recipes. They can style an app
          root, preview, or product area, but Nerio intentionally has no <code>data-font</code>{" "}
          axis.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="preset-preview">Preset comparison</h2>
        <p>
          Every preview uses the same realistic UI content. It does not switch the docs application.
        </p>
        <div className="typography-preset-grid">
          {presets.map((preset) => (
            <PresetPreview key={preset.label} preset={preset} />
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2 id="font-loading">Font loading</h2>
        <h3>System</h3>
        <CodeExample code={systemInstall} label="No font setup required" />
        <h3>Optional font families</h3>
        <p>
          Load non-system families in the consuming product. Nerio does not bundle font files or
          download fonts from a remote provider. A Next.js app may use <code>next/font</code>{" "}
          locally; the same consumer-ownership rule applies.
        </p>
        <CodeExample code={geistInstall} label="Consumer-provided Geist font" />
        <CodeExample code={geistRecipe} label="Scoped Geist recipe" />
        <p>
          Load Inter, IBM Plex, Manrope, Source Sans 3, or Space Grotesk the same way, then apply
          the matching <code>n-typography-*</code> recipe. IBM Plex may also load IBM Plex Mono;
          every other preset intentionally keeps the system mono stack.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="type-scale">Type scale</h2>
        <div className="type-scale">
          {scale.map(([name, token, value, purpose]) => (
            <div key={token}>
              <span style={{ fontSize: `var(${token})` }}>Nerio {name}</span>
              <code>{token}</code>
              <strong>{value}</strong>
              <p>{purpose}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2 id="semantic-roles">Semantic roles</h2>
        <Table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Alias</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            {semanticRoles.map(([label, token, primitive]) => (
              <tr key={token}>
                <td>{label}</td>
                <td>
                  <code>{token}</code>
                </td>
                <td>
                  <code>{primitive}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      <section className="doc-section">
        <h2 id="customization">Custom typography</h2>
        <CodeExample code={customOverride} label="Root and scoped font overrides" />
        <ul className="doc-list">
          <li>
            Keep the existing type scale, line-height tokens, and control heights across presets.
          </li>
          <li>
            Components consume semantic font tokens, never hard-coded Geist, Inter, or system
            stacks.
          </li>
          <li>Do not scale type with viewport width inside compact product surfaces.</li>
        </ul>
      </section>
    </article>
  );
}
