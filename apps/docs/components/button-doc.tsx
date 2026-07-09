"use client";

import { ArrowRight, Save } from "@nerio/adapters";
import { Badge, Button, Card } from "@nerio/ui";
import { CodeExample } from "./code-example";

const usage = `import { Button } from "@nerio/ui";
import { Save } from "@nerio/adapters";

<Button leadingIcon={Save}>Save changes</Button>`;

const sourceInstall = `nerio add button

// Then import the editable source.
import { Button } from "@/components/nerio/components/button";`;

export function ButtonDoc() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Actions</p>
        <h1>Button</h1>
        <p className="doc-lede">
          Triggers an action or advances a workflow. Built on Base UI with explicit intent, size,
          icon, disabled, and loading contracts.
        </p>
      </header>

      <section className="preview" aria-labelledby="preview">
        <div className="preview-heading">
          <div>
            <h2 id="preview">Preview</h2>
            <p>Switch theme and density in the header to test the runtime token contract.</p>
          </div>
          <Badge>Base UI</Badge>
        </div>
        <div className="preview-row">
          <Button leadingIcon={Save}>Save project</Button>
          <Button variant="secondary">Preview</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </section>

      <section className="doc-section">
        <h2 id="purpose">Purpose</h2>
        <p>
          Use Button for explicit actions that submit, save, create, continue, or trigger a product
          workflow. Use a semantic link for navigation.
        </p>
      </section>

      <section className="doc-section">
        <h2 id="usage">Usage</h2>
        <CodeExample code={usage} label="Button usage" />
      </section>

      <section className="doc-section">
        <h2 id="anatomy">Anatomy</h2>
        <div className="anatomy-list">
          <div>
            <code>root</code>
            <span>Base UI Button primitive and interaction boundary.</span>
          </div>
          <div>
            <code>icon</code>
            <span>Optional leading or trailing icon through Nerio&apos;s adapter.</span>
          </div>
          <div>
            <code>label</code>
            <span>Concise action text that remains visible during loading.</span>
          </div>
        </div>
      </section>

      <section className="doc-section">
        <h2 id="variants">Variants</h2>
        <div className="state-grid">
          <Card>
            <strong>Primary</strong>
            <p>The single strongest action in a local context.</p>
            <Button trailingIcon={ArrowRight}>Continue</Button>
          </Card>
          <Card>
            <strong>Secondary</strong>
            <p>Supporting actions with similar availability.</p>
            <Button variant="secondary">Open preview</Button>
          </Card>
          <Card>
            <strong>Ghost</strong>
            <p>Low-emphasis actions in toolbars and compact surfaces.</p>
            <Button variant="ghost">Dismiss</Button>
          </Card>
          <Card>
            <strong>Destructive</strong>
            <p>Irreversible actions that need explicit intent.</p>
            <Button variant="destructive">Remove project</Button>
          </Card>
        </div>
      </section>

      <section className="doc-section">
        <h2 id="states-and-sizes">States and sizes</h2>
        <div className="preview-row">
          <Button size="sm">Small</Button>
          <Button>Medium</Button>
          <Button size="lg">Large</Button>
          <Button loading loadingLabel="Saving project">
            Saving
          </Button>
          <Button disabled>Unavailable</Button>
        </div>
      </section>

      <section className="doc-section">
        <h2 id="accessibility">Accessibility</h2>
        <ul className="doc-list">
          <li>
            Renders a native button through Base UI unless a custom render element is supplied.
          </li>
          <li>
            Loading prevents repeat activation and exposes <code>aria-busy</code>.
          </li>
          <li>
            Visible focus uses the shared <code>--n-focus-ring</code> token in every theme.
          </li>
          <li>Use IconButton when the action has no visible label.</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2 id="source-install">Source install</h2>
        <p>
          The registry installs Button with only Icon, Spinner, <code>cn</code>, and scoped styles.
          Existing files are preserved unless <code>--overwrite</code> is provided.
        </p>
        <CodeExample code={sourceInstall} label="Source install" />
      </section>

      <section className="doc-section">
        <h2 id="tokens">Tokens</h2>
        <p>
          Button reads semantic and component tokens so products can tune height, radius, color,
          focus, and spacing without editing component source.
        </p>
        <div className="token-chip-row">
          <code>--n-button-height-md</code>
          <code>--n-button-radius</code>
          <code>--n-color-action-primary</code>
          <code>--n-color-action-primary-hover</code>
          <code>--n-focus-ring</code>
        </div>
      </section>

      <section className="doc-section">
        <h2 id="do-do-not">Do / do not</h2>
        <div className="guidance-grid">
          <div data-tone="positive">
            <strong>Do</strong>
            <p>Use an action verb and keep one primary action per local decision.</p>
          </div>
          <div data-tone="negative">
            <strong>Do not</strong>
            <p>Use Button for navigation when a semantic link describes the interaction.</p>
          </div>
        </div>
      </section>
    </article>
  );
}
