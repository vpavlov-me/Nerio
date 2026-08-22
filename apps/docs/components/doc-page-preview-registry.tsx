"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { PreviewProps } from "./doc-page-previews/shared";

const DisplayPreview = dynamic(() =>
  import("./doc-page-previews/display").then((module) => module.DisplayPreview),
);
const FormsPreview = dynamic(() =>
  import("./doc-page-previews/forms").then((module) => module.FormsPreview),
);
const OverlaysPreview = dynamic(() =>
  import("./doc-page-previews/overlays").then((module) => module.OverlaysPreview),
);
const AlertDialogPreview = dynamic(() =>
  import("./doc-page-previews/alert-dialog").then((module) => module.AlertDialogPreview),
);

const previewRegistry = {
  button: DisplayPreview,
  "toggle-group": DisplayPreview,
  "button-group": DisplayPreview,
  typography: DisplayPreview,
  kbd: DisplayPreview,
  badge: DisplayPreview,
  spinner: DisplayPreview,
  skeleton: DisplayPreview,
  "empty-state": DisplayPreview,
  alert: DisplayPreview,
  card: DisplayPreview,
  separator: DisplayPreview,
  avatar: DisplayPreview,
  progress: DisplayPreview,
  stat: DisplayPreview,
  "key-value": DisplayPreview,
  table: DisplayPreview,
  list: DisplayPreview,
  breadcrumbs: DisplayPreview,
  pagination: DisplayPreview,
  input: FormsPreview,
  "file-input": FormsPreview,
  textarea: FormsPreview,
  label: FormsPreview,
  field: FormsPreview,
  "form-message": FormsPreview,
  "form-group": FormsPreview,
  checkbox: FormsPreview,
  "checkbox-group": FormsPreview,
  "radio-group": FormsPreview,
  switch: FormsPreview,
  select: FormsPreview,
  combobox: FormsPreview,
  "search-field": FormsPreview,
  "number-field": FormsPreview,
  "otp-field": FormsPreview,
  dialog: OverlaysPreview,
  "alert-dialog": AlertDialogPreview,
  "alert-dialog-confirmation": AlertDialogPreview,
  sheet: OverlaysPreview,
  toast: OverlaysPreview,
  tabs: OverlaysPreview,
  tooltip: OverlaysPreview,
  popover: OverlaysPreview,
  "dropdown-menu": OverlaysPreview,
} as const satisfies Record<string, ComponentType<PreviewProps>>;

export type PreviewKind = keyof typeof previewRegistry;

export function PreviewIsland({ kind, snippet }: PreviewProps) {
  const Preview = previewRegistry[kind as PreviewKind];
  return Preview ? <Preview kind={kind} snippet={snippet} /> : null;
}
