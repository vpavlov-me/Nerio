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

const systemInstall = `@import "@nerio-ui/tokens/styles.css";`;

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
        <TableContainer aria-label="Default font tokens">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Default token</TableHead>
                <TableHead>Use</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Sans</TableCell>
                <TableCell>
                  <Code>--n-font-sans → --n-font-sans-system</Code>
                </TableCell>
                <TableCell>Product UI and body copy</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mono</TableCell>
                <TableCell>
                  <Code>--n-font-mono → --n-font-mono-system</Code>
                </TableCell>
                <TableCell>Code and numeric values</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          Native consistency means a product uses each platform&apos;s familiar UI family; it does
          not mean pixels are identical across operating systems. Font family changes remain CSS
          token overrides, not a fourth runtime axis beside theme, mode, and density.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="presets">Typography presets</h2>
        <TableContainer aria-label="Typography preset tokens">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preset</TableHead>
                <TableHead>Sans token</TableHead>
                <TableHead>Mono token</TableHead>
                <TableHead>Font loading</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>System</TableCell>
                <TableCell>
                  <Code>--n-font-sans-system</Code>
                </TableCell>
                <TableCell>
                  <Code>--n-font-mono-system</Code>
                </TableCell>
                <TableCell>None</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Geist</TableCell>
                <TableCell>
                  <Code>--n-font-sans-geist</Code>
                </TableCell>
                <TableCell>
                  <Code>--n-font-mono-geist</Code>
                </TableCell>
                <TableCell>Consumer-owned</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Inter</TableCell>
                <TableCell>
                  <Code>--n-font-sans-inter</Code>
                </TableCell>
                <TableCell>
                  <Code>--n-font-mono-system</Code>
                </TableCell>
                <TableCell>Consumer-owned</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>IBM Plex</TableCell>
                <TableCell>
                  <Code>--n-font-sans-ibm-plex</Code>
                </TableCell>
                <TableCell>
                  <Code>--n-font-mono-ibm-plex</Code>
                </TableCell>
                <TableCell>Consumer-owned</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Manrope</TableCell>
                <TableCell>
                  <Code>--n-font-sans-manrope</Code>
                </TableCell>
                <TableCell>
                  <Code>--n-font-mono-system</Code>
                </TableCell>
                <TableCell>Consumer-owned</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Source Sans 3</TableCell>
                <TableCell>
                  <Code>--n-font-sans-source-sans</Code>
                </TableCell>
                <TableCell>
                  <Code>--n-font-mono-system</Code>
                </TableCell>
                <TableCell>Consumer-owned</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Space Grotesk</TableCell>
                <TableCell>
                  <Code>--n-font-sans-space-grotesk</Code>
                </TableCell>
                <TableCell>
                  <Code>--n-font-mono-system</Code>
                </TableCell>
                <TableCell>Consumer-owned</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Custom</TableCell>
                <TableCell colSpan={2}>
                  Override <Code>--n-font-sans</Code> at root or on a product surface.
                </TableCell>
                <TableCell>Consumer-owned</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <p>
          The <code>n-typography-*</code> classes are scoped token recipes. They can style an app
          root, preview, or product area, but Nerio intentionally has no <code>data-font</code>{" "}
          axis.
        </p>
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
        <TableContainer aria-label="Type scale tokens">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Size</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Use</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scale.map(([name, token, value, purpose]) => (
                <TableRow key={token}>
                  <TableCell>{name}</TableCell>
                  <TableCell>
                    <Code>{token}</Code>
                  </TableCell>
                  <TableCell>{value}</TableCell>
                  <TableCell>{purpose}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="semantic-roles">Semantic roles</h2>
        <TableContainer aria-label="Semantic typography roles">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Alias</TableHead>
                <TableHead>Default</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semanticRoles.map(([label, token, primitive]) => (
                <TableRow key={token}>
                  <TableCell>{label}</TableCell>
                  <TableCell>
                    <Code>{token}</Code>
                  </TableCell>
                  <TableCell>
                    <Code>{primitive}</Code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
