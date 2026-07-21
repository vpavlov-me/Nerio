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
  title: "Icons",
  description:
    "Use the Nerio icon adapter to keep icons accessible, consistent, and independent from individual component APIs.",
  path: "/docs/foundations/icons",
});

const iconSizes = [
  ["Extra small", "--n-icon-size-xs", "12px"],
  ["Small", "--n-icon-size-sm", "14px"],
  ["Medium", "--n-icon-size-md", "16px"],
  ["Large", "--n-icon-size-lg", "18px"],
  ["Extra large", "--n-icon-size-xl", "20px"],
] as const;

const componentSizes = [
  ["Inline icon", "--n-icon-inline-size", "1em"],
  ["Button icon", "--n-button-icon-size", "--n-icon-size-md"],
  ["Small icon-only Button", "--n-icon-button-icon-size-sm", "--n-icon-size-md"],
  ["Medium icon-only Button", "--n-icon-button-icon-size-md", "--n-icon-size-lg"],
  ["Large icon-only Button", "--n-icon-button-icon-size-lg", "--n-icon-size-xl"],
] as const;

const usage = `import { Search } from '@nerio-ui/adapters/icons';
import { Icon } from '@nerio-ui/ui';
import { Button } from '@nerio-ui/ui/client';

<Icon icon={Search} />
<Icon icon={Search} lucideAbsoluteStrokeWidth />
<Button icon={Search} aria-label="Search workspace" tooltip="Search workspace" />`;

const custom = `import type { IconSvgProps } from '@nerio-ui/adapters/icons';

function CustomLogoIcon({ strokeWidth = 2, ...props }: IconSvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5 17V7l7 10V7l7 10V7" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

<Icon decorative={false} icon={CustomLogoIcon} label="Nerio logo" />`;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Icons</h1>
        <p className="doc-lede">
          Nerio components consume icons through a small adapter API. Lucide is the default source,
          but custom SVG React components use the same contract.
        </p>
      </header>

      <section className="doc-section">
        <div className="section-heading">
          <h2 id="icon-adapter-contract">Icon adapter contract</h2>
          <Badge>@nerio-ui/adapters/icons</Badge>
        </div>
        <TableContainer aria-label="Adapter sources">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Contract</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Lucide</TableCell>
                <TableCell>
                  Default icon source via <Code>@nerio-ui/adapters/icons</Code>.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Custom SVG</TableCell>
                <TableCell>
                  React SVG components implement <Code>IconSvgProps</Code> and use the same{" "}
                  <Code>Icon</Code> contract.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="size-contract">Size contract</h2>
        <TableContainer aria-label="Icon size tokens">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Size</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Default</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {iconSizes.map(([label, token, value]) => (
                <TableRow key={token}>
                  <TableCell>{label}</TableCell>
                  <TableCell>
                    <Code>{token}</Code>
                  </TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer aria-label="Component icon size aliases">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Default</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {componentSizes.map(([label, token, value]) => (
                <TableRow key={token}>
                  <TableCell>{label}</TableCell>
                  <TableCell>
                    <Code>{token}</Code>
                  </TableCell>
                  <TableCell>
                    <Code>{value}</Code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="contract">Contract</h2>
        <TableContainer aria-label="Icon implementation rules">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Pass React icon components through the icon prop.</TableCell>
                <TableCell>
                  Components stay independent from Lucide implementation details.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Use the default decorative mode inside named controls and labelled content.
                </TableCell>
                <TableCell>
                  The renderer sets <Code>aria-hidden</Code> and prevents the SVG from receiving
                  keyboard focus, so the surrounding text remains the accessible name.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Set <Code>decorative={"{false}"}</Code> and provide <Code>label</Code> for a
                  standalone meaningful icon.
                </TableCell>
                <TableCell>
                  The renderer exposes an image role and the supplied accessible name.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Icon-only controls require an accessible label.</TableCell>
                <TableCell>The visible icon is decorative; the label names the action.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Use semantic color tokens around icons.</TableCell>
                <TableCell>Icons inherit text color and stay theme-aware.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Let component aliases set icon size.</TableCell>
                <TableCell>
                  Buttons and icon-only controls keep glyphs proportional to their hit area.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Opt into Lucide fixed strokes explicitly.</TableCell>
                <TableCell>
                  Use <Code>lucideAbsoluteStrokeWidth</Code> only with Lucide icons. Generic{" "}
                  <Code>IconSvgProps</Code> never includes the Lucide-only property, so ordinary
                  custom SVG prop spreads stay warning-free.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="doc-section">
        <h2 id="usage">Usage</h2>
        <CodeExample code={usage} label="Icon usage" />
        <CodeExample code={custom} label="Custom icon usage" />
      </section>

      <section className="doc-section">
        <h2 id="migration">Migration</h2>
        <p>
          Import <Code>IconComponent</Code> and <Code>IconSvgProps</Code> from{" "}
          <Code>@nerio-ui/adapters/icons</Code> for icon props and custom SVG implementations. The
          same type names remain re-exported from <Code>@nerio-ui/ui</Code> as compatible aliases,
          but new component APIs should use the adapter boundary. Existing <Code>LucideIcon</Code>{" "}
          imports remain compatible while Lucide is the default source. During the Core 0.1 alpha,
          replace an explicit <Code>absoluteStrokeWidth</Code> Icon prop with{" "}
          <Code>lucideAbsoluteStrokeWidth</Code>; the old name remains as a deprecated alias until
          the next major version. Custom SVG components should accept and spread only{" "}
          <Code>IconSvgProps</Code>.
        </p>
        <p>
          The previous <Code>@nerio-ui/adapters</Code> root import is intentionally unsupported
          during the pre-release alpha. Use the explicit icons subpath so UI consumers do not
          resolve unrelated table, chart, form, or schema integrations.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="do-do-not">Do / do not</h2>
        <TableContainer aria-label="Icon guidance">
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
                  Use icons to clarify compact actions and metadata when text would be repetitive.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Do not</TableCell>
                <TableCell>
                  Use brand color for routine icons or rely on an icon without an accessible name.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </article>
  );
}
