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
  title: "Themes",
  description:
    "Configure Nerio brand themes, color modes, and density through CSS variables without changing component source.",
  path: "/docs/foundations/themes",
});

const themes = [
  ["Purple", "purple", "--n-purple-600"],
  ["Blue", "blue", "--n-blue-600"],
  ["Green", "green", "--n-green-600"],
  ["Orange", "orange", "--n-orange-600"],
  ["Red", "red", "--n-red-600"],
  ["Neutral", "neutral", "--n-gray-950"],
];

const themeValidation = [
  [
    "Text contrast",
    "Normal text reaches 4.5:1; the 3:1 exception is reserved for text that qualifies as large under WCAG 2.2.",
  ],
  [
    "Non-text contrast",
    "Control boundaries, meaningful graphics, and focus indicators reach 3:1 where WCAG 2.2 applies.",
  ],
  [
    "State communication",
    "Selection, status, validation, and urgency remain understandable without relying on color alone.",
  ],
  [
    "Mode coverage",
    "Review light, dark, and both operating-system preferences while data-mode is system.",
  ],
  [
    "System preferences",
    "Verify forced colors, reduced motion, text resize, and zoom/reflow without losing state or operation.",
  ],
] as const;

const customTheme = `<html data-theme="purple" data-mode="system" data-density="comfortable">

:root[data-theme="acme"] {
  --n-color-surface-selected: var(--n-gray-a-8);
  --n-color-border-focus: #0f766e;
  --n-color-action-primary: #0f766e;
  --n-color-action-primary-hover: #115e59;
  --n-color-action-primary-active: #134e4a;
  --n-color-action-on-primary: #ffffff;
  --n-color-focus-ring: #0f766e;
  --n-color-focus-ring-soft: rgb(15 118 110 / 0.24);
  --n-chart-primary: #0f766e;
}

:root[data-theme="acme"][data-mode="dark"] {
  --n-color-surface-selected: var(--n-white-a-10);
  --n-color-border-focus: #5eead4;
  --n-color-action-primary: #5eead4;
  --n-color-action-primary-hover: #2dd4bf;
  --n-color-action-primary-active: #14b8a6;
  --n-color-action-on-primary: #042f2e;
  --n-color-focus-ring: #5eead4;
  --n-color-focus-ring-soft: rgb(94 234 212 / 0.3);
  --n-chart-primary: #5eead4;
}

@media (prefers-color-scheme: dark) {
  :root[data-theme="acme"][data-mode="system"] {
    --n-color-surface-selected: var(--n-white-a-10);
    --n-color-border-focus: #5eead4;
    --n-color-action-primary: #5eead4;
    --n-color-action-primary-hover: #2dd4bf;
    --n-color-action-primary-active: #14b8a6;
    --n-color-action-on-primary: #042f2e;
    --n-color-focus-ring: #5eead4;
    --n-color-focus-ring-soft: rgb(94 234 212 / 0.3);
    --n-chart-primary: #5eead4;
  }
}`;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Themes</h1>
        <p className="doc-lede">
          Nerio separates brand theme, color mode, and density so one component API can work across
          many products without creating combined theme names.
        </p>
      </header>

      <section className="doc-section">
        <h2 id="runtime-axes">Runtime axes</h2>
        <TableContainer aria-label="Runtime appearance axes">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Axis</TableHead>
                <TableHead>Attribute</TableHead>
                <TableHead>Values</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Theme</TableCell>
                <TableCell>
                  <Code>data-theme</Code>
                </TableCell>
                <TableCell>purple, blue, green, orange, red, neutral, or custom</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mode</TableCell>
                <TableCell>
                  <Code>data-mode</Code>
                </TableCell>
                <TableCell>system, light, dark</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Density</TableCell>
                <TableCell>
                  <Code>data-density</Code>
                </TableCell>
                <TableCell>comfortable, compact</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <div className="section-heading">
          <h2 id="preset-themes">Preset themes</h2>
          <Badge>brand accents</Badge>
        </div>
        <TableContainer aria-label="Preset theme contracts">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Theme</TableHead>
                <TableHead>Attribute value</TableHead>
                <TableHead>Primary accent token</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {themes.map(([label, value, token]) => (
                <TableRow key={value}>
                  <TableCell>{label}</TableCell>
                  <TableCell>
                    <Code>data-theme="{value}"</Code>
                  </TableCell>
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
        <h2 id="mode-behavior">Mode behavior</h2>
        <p>
          Light mode uses opaque white foundations with cool dark alpha neutrals for adaptive
          controls, grouping, borders, and interaction states. Dark mode maps the canvas, default,
          sunken, raised, and overlay surface roles to <Code>--n-gray-1000</Code>, then uses white
          alpha neutrals for controls, borders, selected layers, and other adaptive surfaces.
        </p>
        <p>
          Text, focus, actions, statuses, and charts remap through their own semantic roles. Purple
          and neutral use lighter primary actions in dark and system-dark modes where the light-mode
          accent would lose contrast. Product code consumes semantic roles and does not depend on a
          resolved gray or alpha primitive.
        </p>
        <p>
          The appearance control exposes System, Light, and Dark explicitly. System follows live OS
          preference changes, and theme, mode, and density selections are restored independently
          before hydration.
        </p>
        <TableContainer aria-label="Mode-mapped semantic tokens">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Token</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["Canvas", "--n-color-surface-canvas"],
                ["Control", "--n-color-surface-control"],
                ["Raised surface", "--n-color-surface-raised"],
                ["Primary action", "--n-color-action-primary"],
                ["Action foreground", "--n-color-action-on-primary"],
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
        <h2 id="density">Density</h2>
        <TableContainer aria-label="Density contracts">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Value</TableHead>
                <TableHead>Use</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Code>comfortable</Code>
                </TableCell>
                <TableCell>Default spacing for mixed product and documentation surfaces.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Code>compact</Code>
                </TableCell>
                <TableCell>
                  Remaps semantic density aliases and component tokens for dense operational
                  interfaces without changing primitive spacing values.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="custom-themes">Custom themes</h2>
        <CodeExample code={customTheme} label="Custom theme" />
        <ul className="doc-list">
          <li>Override semantic roles and stable component contracts, not primitive palettes.</li>
          <li>Do not create combined names such as purple-light or neutral-dark.</li>
          <li>Do not use vertical-specific preset names such as fintech-blue.</li>
          <li>Keep brand color as an accent for primary action, selection, focus, and charts.</li>
          <li>Provide dark-mode accent overrides when the light accent loses contrast.</li>
          <li>Test real component states and content rather than approving isolated swatches.</li>
        </ul>

        <h3>Theme validation</h3>
        <TableContainer aria-label="Custom theme validation">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Check</TableHead>
                <TableHead>Expected result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {themeValidation.map(([check, expectation]) => (
                <TableRow key={check}>
                  <TableCell>{check}</TableCell>
                  <TableCell>{expectation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="do-do-not">Do / do not</h2>
        <TableContainer aria-label="Theme guidance">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guidance</TableHead>
                <TableHead>Recommendation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Do</TableCell>
                <TableCell>
                  Use generic brand theme names and let mode handle light or dark rendering.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Do</TableCell>
                <TableCell>
                  Validate action, focus, status, chart, and selected-state pairs in every supported
                  mode.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Do not</TableCell>
                <TableCell>
                  Fork component source to hard-code a product color into a button or field.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Do not</TableCell>
                <TableCell>
                  communicate status, selection, or validation through hue alone.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </article>
  );
}
