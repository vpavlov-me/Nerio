import { notFound } from "next/navigation";
import { StandardDocPage } from "../../../../components/doc-page";

const componentDocs: Record<string, { title: string; lede: string }> = {
  "icon-button": {
    title: "IconButton",
    lede: "Icon buttons expose compact actions with accessible labels and tokenized focus states.",
  },
  link: {
    title: "Link",
    lede: "Links style native anchors for inline navigation and text destinations.",
  },
  badge: {
    title: "Badge",
    lede: "Badges label status, category, or lightweight metadata without becoming primary actions.",
  },
  alert: {
    title: "Alert",
    lede: "Alerts communicate inline feedback with clear tone, text, and accessible semantics.",
  },
  spinner: {
    title: "Spinner",
    lede: "Spinners communicate short loading moments while preserving layout stability.",
  },
  skeleton: {
    title: "Skeleton",
    lede: "Skeletons reserve space for loading content and reduce layout shift in product surfaces.",
  },
  "empty-state": {
    title: "EmptyState",
    lede: "Empty states explain missing content and offer a clear next action when one is available.",
  },
  textarea: {
    title: "Textarea",
    lede: "Textareas collect longer notes, descriptions, and collaborative product content.",
  },
  label: {
    title: "Label",
    lede: "Labels provide accessible names and stable form hierarchy.",
  },
  checkbox: {
    title: "Checkbox",
    lede: "Checkboxes toggle independent options and support clear checked, unchecked, and disabled states.",
  },
  "radio-group": {
    title: "RadioGroup",
    lede: "Radio groups let people choose one option from a short visible set.",
  },
  switch: {
    title: "Switch",
    lede: "Switches toggle immediate settings with clear on and off affordances.",
  },
  field: {
    title: "Field",
    lede: "Fields compose labels, controls, descriptions, and validation messages.",
  },
  "form-message": {
    title: "FormMessage",
    lede: "Form messages communicate validation, help, and error states close to their controls.",
  },
  card: {
    title: "Card",
    lede: "Cards group related product information without creating nested or decorative panels.",
  },
  separator: {
    title: "Separator",
    lede: "Separators divide related sections while keeping the layout quiet and scannable.",
  },
  avatar: {
    title: "Avatar",
    lede: "Avatars identify people, teams, or entities through initials or supplied imagery.",
  },
  progress: {
    title: "Progress",
    lede: "Progress indicators show completion for tasks, uploads, and product workflows.",
  },
  stat: {
    title: "Stat",
    lede: "Stats summarize key product metrics with restrained hierarchy and optional trend context.",
  },
  "key-value": {
    title: "KeyValue",
    lede: "Key-value pairs present compact metadata for objects, settings, and records.",
  },
  table: {
    title: "Table",
    lede: "Tables present structured records for scanning, comparison, and repeated operational use.",
  },
  list: {
    title: "List",
    lede: "Lists present simple structured items with descriptions, metadata, and native links.",
  },
  tabs: {
    title: "Tabs",
    lede: "Tabs switch between related panels without leaving the current product context.",
  },
  breadcrumbs: {
    title: "Breadcrumbs",
    lede: "Breadcrumbs show hierarchy navigation with ordered list semantics and current page support.",
  },
  pagination: {
    title: "Pagination",
    lede: "Pagination provides basic previous, next, and page links without owning data or page state.",
  },
  tooltip: {
    title: "Tooltip",
    lede: "Tooltips clarify controls or compact metadata without carrying essential meaning.",
  },
  popover: {
    title: "Popover",
    lede: "Popovers reveal contextual controls or supporting details near a trigger.",
  },
  "dropdown-menu": {
    title: "DropdownMenu",
    lede: "Dropdown menus group secondary commands behind a compact trigger.",
  },
};

export function generateStaticParams() {
  return Object.keys(componentDocs).map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = componentDocs[slug];

  if (!doc) {
    notFound();
  }

  return <StandardDocPage title={doc.title} lede={doc.lede} kind={slug} />;
}
