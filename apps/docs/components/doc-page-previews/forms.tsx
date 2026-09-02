"use client";

import {
  Checkbox,
  Field,
  FileInput,
  FormGroup,
  FormMessage,
  Input,
  Label,
  LabelContent,
  LabelHint,
  LabelRequired,
  LabelRow,
  RadioGroup,
  RadioGroupItem,
  Select,
  Switch,
  Textarea,
} from "@nerio-ui/ui/client";
import { PreviewFrame, type PreviewProps } from "./shared";

export function FormsPreview({ kind, snippet }: PreviewProps) {
  return (
    <PreviewFrame kind={kind} snippet={snippet}>
      {kind === "input" ? (
        <div className="form-preview-stack">
          <Field
            label="Collection name"
            description="Use a short name that your team will recognize."
          >
            <Input placeholder="Launch materials" required />
          </Field>
          <Field label="Disabled input" description="Shown when editing is unavailable.">
            <Input placeholder="Archived collection" disabled />
          </Field>
        </div>
      ) : null}
      {kind === "file-input" ? (
        <Field label="Attachment" description="Choose one PDF or image file.">
          <FileInput name="attachment" accept=".pdf,image/*" />
        </Field>
      ) : null}
      {kind === "textarea" ? (
        <Field
          label="Notes"
          description="Add context that helps collaborators understand this item."
        >
          <Textarea placeholder="Add launch context, decisions, or open questions." />
        </Field>
      ) : null}
      {kind === "label" ? (
        <div className="form-preview-stack">
          <LabelRow>
            <LabelContent>
              <Label htmlFor="preview-project-name">Project name</Label>
              <LabelRequired />
              <LabelHint label="Choose a recognizable name for collaborators." />
            </LabelContent>
          </LabelRow>
          <Input id="preview-project-name" placeholder="Roadmap refresh" readOnly required />
        </div>
      ) : null}
      {kind === "field" ? (
        <Field label="Project name">
          <Input placeholder="Launch workspace" />
        </Field>
      ) : null}
      {kind === "form-message" ? (
        <div className="form-preview-stack">
          <FormMessage>Use at least 3 characters.</FormMessage>
          <FormMessage tone="neutral">This will be visible to collaborators.</FormMessage>
          <FormMessage tone="success">Looks good.</FormMessage>
        </div>
      ) : null}
      {kind === "form-group" ? (
        <FormGroup
          title="Notifications"
          description="Choose which updates should be sent by email."
        >
          <Field label="Product updates">
            <Checkbox aria-label="Product updates" />
          </Field>
          <Field label="Security alerts">
            <Checkbox aria-label="Security alerts" defaultChecked />
          </Field>
        </FormGroup>
      ) : null}
      {kind === "checkbox" ? (
        <div className="form-preview-stack">
          <label className="inline-control">
            <Checkbox defaultChecked />
            <span>Include archived collections</span>
          </label>
          <label className="inline-control">
            <Checkbox indeterminate />
            <span>Some collections are archived</span>
          </label>
          <label className="inline-control">
            <Checkbox disabled />
            <span>Archived collections are unavailable</span>
          </label>
        </div>
      ) : null}
      {kind === "radio-group" ? (
        <RadioGroup
          label="Visibility"
          description="Choose who can access this project."
          message="Select the visibility that matches the project."
          name="visibility-preview"
          defaultValue="team"
        >
          <RadioGroupItem value="private" description="Only invited members.">
            Private
          </RadioGroupItem>
          <RadioGroupItem value="team" description="Visible to the workspace.">
            Team
          </RadioGroupItem>
          <RadioGroupItem value="public" disabled description="Not available.">
            Public
          </RadioGroupItem>
        </RadioGroup>
      ) : null}
      {kind === "switch" ? (
        <div className="form-preview-stack">
          <label className="inline-control">
            <Switch defaultChecked />
            <span>Notify collaborators</span>
          </label>
          <label className="inline-control">
            <Switch readOnly />
            <span>Automatic updates are managed by your workspace</span>
          </label>
        </div>
      ) : null}
      {kind === "select" ? (
        <div className="form-preview-stack">
          <Select
            label="Status"
            placeholder="Choose status"
            message="Choose the closest workflow state."
            options={[
              { label: "Draft", value: "draft" },
              { label: "In review", value: "review" },
              { label: "Published", value: "published" },
              { label: "Archived", value: "archived", disabled: true },
            ]}
          />
        </div>
      ) : null}
    </PreviewFrame>
  );
}
