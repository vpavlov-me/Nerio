"use client";

import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  Copy,
  Plus,
  Save,
  Search,
  Settings,
  X,
} from "@nerio/adapters";
import { Badge, Card, Icon, Table } from "@nerio/ui";
import type { IconComponent } from "@nerio/ui";
import { CodeExample } from "../../../../components/code-example";

const icons: Array<[string, IconComponent]> = [
  ["Search", Search],
  ["Settings", Settings],
  ["Bell", Bell],
  ["Copy", Copy],
  ["Check", Check],
  ["Save", Save],
  ["Plus", Plus],
  ["ArrowRight", ArrowRight],
  ["Close", X],
  ["ChevronDown", ChevronDown],
];

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

function CustomLogoIcon({
  strokeWidth = 2,
  ...props
}: {
  className?: string;
  "aria-hidden"?: boolean;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5 17V7l7 10V7l7 10V7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

const usage = `import { Search } from '@nerio/adapters';
import { Icon } from '@nerio/ui';
import { Button } from '@nerio/ui/client';

<Icon icon={Search} />
<Button icon={Search} aria-label="Search workspace" tooltip="Search workspace" />`;

const custom = `function CustomLogoIcon({ strokeWidth = 2, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5 17V7l7 10V7l7 10V7" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

<Icon icon={CustomLogoIcon} />`;

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
          <h2 id="icon-adapter-preview">Icon adapter preview</h2>
          <Badge>@nerio/adapters</Badge>
        </div>
        <div className="icon-grid">
          {icons.map(([label, icon]) => (
            <Card key={label as string} className="icon-card">
              <Icon icon={icon} />
              <span>{label}</span>
            </Card>
          ))}
          <Card className="icon-card">
            <Icon icon={CustomLogoIcon} />
            <span>Custom SVG</span>
          </Card>
        </div>
      </section>

      <section className="doc-section">
        <h2 id="size-contract">Size contract</h2>
        <Table>
          <thead>
            <tr>
              <th>Size</th>
              <th>Token</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            {iconSizes.map(([label, token, value]) => (
              <tr key={token}>
                <td>{label}</td>
                <td>
                  <code>{token}</code>
                </td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="token-chip-row">
          {componentSizes.map(([label, token, value]) => (
            <code key={token} title={`${label}: ${value}`}>
              {token}
            </code>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2 id="contract">Contract</h2>
        <Table>
          <thead>
            <tr>
              <th>Rule</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pass React icon components through the icon prop.</td>
              <td>Components stay independent from Lucide implementation details.</td>
            </tr>
            <tr>
              <td>Icon-only controls require an accessible label.</td>
              <td>The visible icon is decorative; the label names the action.</td>
            </tr>
            <tr>
              <td>Use semantic color tokens around icons.</td>
              <td>Icons inherit text color and stay theme-aware.</td>
            </tr>
            <tr>
              <td>Let component aliases set icon size.</td>
              <td>Buttons and icon-only controls keep glyphs proportional to their hit area.</td>
            </tr>
            <tr>
              <td>Use the adapter’s 2px absolute stroke default.</td>
              <td>
                Lucide glyphs stay legible at small sizes without becoming heavy at larger sizes.
              </td>
            </tr>
          </tbody>
        </Table>
      </section>

      <section className="doc-section">
        <h2 id="usage">Usage</h2>
        <CodeExample code={usage} label="Icon usage" />
        <CodeExample code={custom} label="Custom icon usage" />
      </section>

      <section className="doc-section">
        <h2 id="do-do-not">Do / do not</h2>
        <div className="grid">
          <Card>
            <Badge variant="success">Do</Badge>
            <p>Use icons to clarify compact actions and metadata when text would be repetitive.</p>
          </Card>
          <Card>
            <Badge variant="danger">Do not</Badge>
            <p>Use brand color for routine icons or rely on an icon without an accessible name.</p>
          </Card>
        </div>
      </section>
    </article>
  );
}
