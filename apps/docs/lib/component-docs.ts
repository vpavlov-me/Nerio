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
  spinner:
    "Spinners indicate short indeterminate loading activity without changing surrounding layout.",
  skeleton:
    "Skeletons reserve space for loading content and reduce layout shift in product surfaces.",
  "empty-state":
    "Empty states explain missing content and offer a clear next action when one is available.",
  textarea: "Textareas collect longer notes, descriptions, and collaborative product content.",
  input:
    "Input is a thin native control for text-like, numeric, and platform temporal values; Field owns labels, descriptions, and validation messages.",
  "file-input":
    "FileInput preserves native file selection, FileList access, picker security, and form behavior without owning an upload workflow.",
  "input-group":
    "InputGroup composes an Input with explicit inline addons without changing native form semantics.",
  label: "Labels provide accessible names and stable form hierarchy.",
  checkbox:
    "Checkboxes select zero or more options in a visible group and support checked, unchecked, indeterminate, invalid, disabled, and read-only states.",
  "radio-group":
    "Radio groups let people choose one option from a short visible set through options or RadioGroupItem composition.",
  switch:
    "Switches toggle immediate settings with clear on and off affordances, including read-only and invalid states.",
  dialog: "Dialogs focus a short decision or task above the current product surface.",
  sheet:
    "Sheets present a focused modal panel from an explicit side while leaving product workflows to the consumer.",
  select:
    "Select controls choose one option from a compact set such as status, owner, or view mode.",
  slider:
    "Slider chooses one numeric value within a known bounded range through keyboard, pointer, or touch input.",
  calendar:
    "Calendar selects one timezone-safe ISO date in a localizable month grid with complete keyboard navigation and explicit constraints.",
  toast: "Toasts acknowledge short-lived product events without interrupting the current workflow.",
  field: "Fields compose labels, controls, descriptions, and validation messages.",
  "form-message":
    "Form messages communicate validation, help, and error states close to their controls.",
  "form-group":
    "Form groups collect related controls with fieldset semantics, optional context, and stack or inline layout.",
  card: "Cards group related product information without creating nested or decorative panels.",
  separator: "Separators divide related sections while keeping the layout quiet and scannable.",
  avatar: "Avatars identify people, teams, or entities through initials or supplied imagery.",
  progress: "Progress communicates the completion status of one task that takes time.",
  stat: "Stats summarize key product metrics with restrained hierarchy and optional trend context.",
  "key-value": "Key-value pairs present compact metadata for objects, settings, and records.",
  table:
    "Tables present structured records for scanning, comparison, and repeated operational use.",
  list: "Lists present simple structured items with descriptions, metadata, and native links.",
  item: "Items compose compact content, media, and actions while leaving semantics and interactions to the consumer.",
  tabs: "Tabs switch between related panels without leaving the current product context.",
  breadcrumbs:
    "Breadcrumbs show hierarchy navigation with ordered list semantics and current page support.",
  pagination:
    "Pagination provides basic previous, next, and page links without owning data or page state.",
  "sidebar-primitive":
    "Sidebar provides a low-level collapsible layout primitive while navigation data and product behavior remain consumer-owned.",
  tooltip: "Tooltips clarify controls or compact metadata without carrying essential meaning.",
  popover: "Popovers reveal contextual controls or supporting details near a trigger.",
  "dropdown-menu": "Dropdown menus group secondary commands behind a compact trigger.",
  "command-primitive":
    "Command provides an accessible action-result primitive with label-only selection queries and separate keyword matching while product workflows remain consumer-owned.",
};

const componentTitles: Record<string, string> = {
  "button-group": "ButtonGroup",
  "command-primitive": "Command",
  "dropdown-menu": "DropdownMenu",
  "empty-state": "EmptyState",
  "form-group": "FormGroup",
  "form-message": "FormMessage",
  "input-group": "InputGroup",
  "file-input": "FileInput",
  "key-value": "KeyValue",
  "radio-group": "RadioGroup",
  "sidebar-primitive": "Sidebar",
};

function getComponentTitle(slug: string) {
  return (
    componentTitles[slug] ??
    componentMetadata[slug]?.name ??
    slug.charAt(0).toUpperCase() + slug.slice(1)
  );
}

export const componentDocs: Record<string, ComponentDoc> = Object.fromEntries(
  Object.entries(componentLedes).map(([slug, description]) => [
    slug,
    {
      title: getComponentTitle(slug),
      description,
      indexable: true,
    },
  ]),
);

export const componentDocSlugs = Object.keys(componentDocs);

export function getComponentDoc(slug: string) {
  return componentDocs[slug];
}
