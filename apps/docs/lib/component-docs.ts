import { componentMetadata } from "../components/component-reference";

export type ComponentDoc = {
  title: string;
  description: string;
  indexable: boolean;
};

const componentLedes: Record<string, string> = {
  kbd: "Kbd displays quiet, native keyboard shortcut notation beside actions and commands.",
  typography:
    "Semantic heading, text, and inline code primitives keep content hierarchy token-driven.",
  "button-group": "ButtonGroup joins related actions into a compact, accessible control set.",
  button:
    "Buttons trigger user actions with clear intent, accessible focus treatment, loading states, and icon support.",
  badge: "Badges label status, category, or lightweight metadata without becoming primary actions.",
  alert: "Alerts communicate inline feedback with clear tone, text, and accessible semantics.",
  spinner: "Spinners communicate short loading moments while preserving layout stability.",
  skeleton:
    "Skeletons reserve space for loading content and reduce layout shift in product surfaces.",
  "empty-state":
    "Empty states explain missing content and offer a clear next action when one is available.",
  textarea: "Textareas collect longer notes, descriptions, and collaborative product content.",
  input:
    "Inputs collect short text values with labels, descriptions, validation messages, and visible focus treatment.",
  label: "Labels provide accessible names and stable form hierarchy.",
  checkbox:
    "Checkboxes toggle independent options and support clear checked, unchecked, and disabled states.",
  "radio-group": "Radio groups let people choose one option from a short visible set.",
  switch: "Switches toggle immediate settings with clear on and off affordances.",
  dialog: "Dialogs focus a short decision or task above the current product surface.",
  select:
    "Select controls choose one option from a compact set such as status, owner, or view mode.",
  toast: "Toasts acknowledge short-lived product events without interrupting the current workflow.",
  field: "Fields compose labels, controls, descriptions, and validation messages.",
  "form-message":
    "Form messages communicate validation, help, and error states close to their controls.",
  "form-group":
    "Form groups collect related controls with fieldset semantics, optional context, and stack or inline layout.",
  card: "Cards group related product information without creating nested or decorative panels.",
  separator: "Separators divide related sections while keeping the layout quiet and scannable.",
  avatar: "Avatars identify people, teams, or entities through initials or supplied imagery.",
  progress: "Progress indicators show completion for tasks, uploads, and product workflows.",
  stat: "Stats summarize key product metrics with restrained hierarchy and optional trend context.",
  "key-value": "Key-value pairs present compact metadata for objects, settings, and records.",
  table:
    "Tables present structured records for scanning, comparison, and repeated operational use.",
  list: "Lists present simple structured items with descriptions, metadata, and native links.",
  tabs: "Tabs switch between related panels without leaving the current product context.",
  breadcrumbs:
    "Breadcrumbs show hierarchy navigation with ordered list semantics and current page support.",
  pagination:
    "Pagination provides basic previous, next, and page links without owning data or page state.",
  tooltip: "Tooltips clarify controls or compact metadata without carrying essential meaning.",
  popover: "Popovers reveal contextual controls or supporting details near a trigger.",
  "dropdown-menu": "Dropdown menus group secondary commands behind a compact trigger.",
};

export const componentDocs: Record<string, ComponentDoc> = Object.fromEntries(
  Object.entries(componentLedes).map(([slug, description]) => [
    slug,
    {
      title: componentMetadata[slug]?.name ?? slug,
      description,
      indexable: true,
    },
  ]),
);

export const componentDocSlugs = Object.keys(componentDocs);

export function getComponentDoc(slug: string) {
  return componentDocs[slug];
}
