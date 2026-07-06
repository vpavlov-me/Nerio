"use client";

import * as React from "react";
import { Badge, Button, Card, Dialog, Field, Input, Select, Toast } from "@nerio/ui";

const snippets: Record<string, string> = {
  button: "import { Button } from '@nerio/ui';\n\n<Button>Save project</Button>",
  input:
    'import { Field, Input } from \'@nerio/ui\';\n\n<Field label="Project name"><Input placeholder="Q3 planning" /></Field>',
  dialog:
    'import { Dialog } from \'@nerio/ui\';\n\n<Dialog trigger="Open dialog" title="Share collection">...</Dialog>',
  select:
    "import { Select } from '@nerio/ui';\n\n<Select label=\"Status\" options={[{ label: 'Active', value: 'active' }]} />",
  toast:
    'import { Toast } from \'@nerio/ui\';\n\n<Toast title="Saved" description="Your changes are ready." />',
};

export function StandardDocPage({
  title,
  lede,
  kind,
}: {
  title: string;
  lede: string;
  kind?: keyof typeof snippets;
}) {
  return (
    <article className="doc-page">
      <header>
        <h1>{title}</h1>
        <p className="doc-lede">{lede}</p>
      </header>
      {kind ? <Preview kind={kind} /> : null}
      <section className="doc-section">
        <h2>Anatomy</h2>
        <p>
          Components expose clear slots with `data-slot`, semantic tokens, visible focus states, and
          small composable APIs.
        </p>
      </section>
      <section className="doc-section">
        <h2>Variants and states</h2>
        <p>
          Use variants to express intent. Disabled, loading, empty, focus, selected, hover, and
          error states are part of the default contract.
        </p>
      </section>
      <section className="doc-section">
        <h2>Accessibility</h2>
        <p>
          Prefer semantic HTML, accessible names, keyboard-reachable controls, and tokenized
          contrast that remains stable across themes.
        </p>
      </section>
      <section className="doc-section">
        <h2>Do / do not</h2>
        <div className="grid">
          <Card>
            <Badge variant="success">Do</Badge>
            <p>Compose small components around real product workflows.</p>
          </Card>
          <Card>
            <Badge variant="danger">Do not</Badge>
            <p>
              Fork visual values into one-off colors, spacing, or typography inside product code.
            </p>
          </Card>
        </div>
      </section>
    </article>
  );
}

function Preview({ kind }: { kind: keyof typeof snippets }) {
  const [copied, setCopied] = React.useState(false);
  const snippet = snippets[kind] ?? "";

  const copySnippet = async () => {
    try {
      await navigator.clipboard?.writeText(snippet);
    } catch {
      // Clipboard can be blocked in automation or non-secure contexts.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <section className="preview" aria-label={`${kind} preview`}>
      <div className="preview-row">
        {kind === "button" ? (
          <>
            <Button>Save project</Button>
            <Button variant="secondary">Preview</Button>
            <Button variant="ghost">Cancel</Button>
            <Button loading>Saving</Button>
          </>
        ) : null}
        {kind === "input" ? (
          <Field
            label="Collection name"
            description="Use a short name that your team will recognize."
          >
            <Input placeholder="Launch materials" />
          </Field>
        ) : null}
        {kind === "dialog" ? (
          <Dialog trigger="Open dialog" title="Share collection">
            <p>Choose collaborators and permissions before sharing this workspace collection.</p>
            <Button>Send invite</Button>
          </Dialog>
        ) : null}
        {kind === "select" ? (
          <Select
            label="Status"
            options={[
              { label: "Active", value: "active" },
              { label: "Draft", value: "draft" },
              { label: "Archived", value: "archived" },
            ]}
          />
        ) : null}
        {kind === "toast" ? (
          <Toast
            title="Collection saved"
            description="The update is visible to your team."
            tone="success"
          />
        ) : null}
      </div>
      <div className="preview-row">
        <Button variant="secondary" size="sm" onClick={copySnippet}>
          {copied ? "Copied" : "Copy code"}
        </Button>
      </div>
      <pre className="code-block">
        <code>{snippet}</code>
      </pre>
    </section>
  );
}
