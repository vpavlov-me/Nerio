export type ReferenceSection = {
  title: string;
  description: string;
};

export type ComponentReference = {
  category: string;
  purpose: string;
  anatomy: ReferenceSection[];
  variants: ReferenceSection[];
  states: ReferenceSection[];
  accessibility: string[];
  guidance: {
    do: string[];
    dont: string[];
  };
  tokens: string[];
};

export const snippets: Record<string, string> = {
  button: "import { Button } from '@nerio/ui';\n\n<Button>Save project</Button>",
  "icon-button":
    "import { Search } from '@nerio/adapters';\nimport { IconButton } from '@nerio/ui';\n\n<IconButton icon={Search} label=\"Search\" />",
  badge: "import { Badge } from '@nerio/ui';\n\n<Badge variant=\"success\">Published</Badge>",
  spinner: "import { Spinner } from '@nerio/ui';\n\n<Spinner label=\"Loading activity\" />",
  skeleton: "import { Skeleton } from '@nerio/ui';\n\n<Skeleton aria-label=\"Loading\" />",
  "empty-state":
    'import { Button, EmptyState } from \'@nerio/ui\';\n\n<EmptyState title="No collections" description="Create one to start organizing work." action={<Button>Create collection</Button>} />',
  input:
    'import { Field, Input } from \'@nerio/ui\';\n\n<Field label="Project name" description="Use a short recognizable name."><Input placeholder="Launch materials" required /></Field>',
  textarea:
    'import { Field, Textarea } from \'@nerio/ui\';\n\n<Field label="Notes" description="Add context for collaborators."><Textarea placeholder="Add launch context" /></Field>',
  label:
    'import { Input, Label } from \'@nerio/ui\';\n\n<Label htmlFor="project-name">Project name</Label>\n<Input id="project-name" />',
  field:
    'import { Field, Input } from \'@nerio/ui\';\n\n<Field label="Project name" description="Shown in workspace navigation." message="Use at least 3 characters." invalid><Input /></Field>',
  "form-message":
    "import { FormMessage } from '@nerio/ui';\n\n<FormMessage>Use at least 3 characters.</FormMessage>",
  checkbox: "import { Checkbox } from '@nerio/ui';\n\n<Checkbox aria-label=\"Include archived\" />",
  switch: "import { Switch } from '@nerio/ui';\n\n<Switch aria-label=\"Enable notifications\" />",
  dialog:
    'import { Dialog } from \'@nerio/ui\';\n\n<Dialog trigger="Open dialog" title="Share collection">...</Dialog>',
  select:
    'import { Select } from \'@nerio/ui\';\n\n<Select label="Status" name="status" placeholder="Choose status" message="Choose the closest workflow state." options={[{ label: \'Active\', value: \'active\' }]} />',
  toast:
    "import { Button, ToastProvider, ToastViewport, useToastManager } from '@nerio/ui';\n\nfunction Example() {\n  const toasts = useToastManager();\n  return <Button onClick={() => toasts.add({ title: \"Saved\" })}>Show toast</Button>;\n}\n\n<ToastProvider><Example /><ToastViewport /></ToastProvider>",
  tabs: 'import { Tabs } from \'@nerio/ui\';\n\n<Tabs tabs={[{ label: "Overview", value: "overview", content: "..." }]} />',
  tooltip:
    "import { Button, Tooltip } from '@nerio/ui';\n\n<Tooltip label=\"Copies the share link\"><Button>Copy link</Button></Tooltip>",
  popover:
    'import { Popover } from \'@nerio/ui\';\n\n<Popover trigger="Filters" title="View filters">...</Popover>',
  "dropdown-menu":
    'import { DropdownMenu } from \'@nerio/ui\';\n\n<DropdownMenu trigger="Actions" items={[{ label: "Rename" }]} />',
  card: "import { Card } from '@nerio/ui';\n\n<Card>Project summary</Card>",
  separator: "import { Separator } from '@nerio/ui';\n\n<Separator />",
  avatar: "import { Avatar } from '@nerio/ui';\n\n<Avatar name=\"Maya Chen\" />",
  progress: "import { Progress } from '@nerio/ui';\n\n<Progress label=\"Completion\" value={68} />",
  stat: 'import { Stat } from \'@nerio/ui\';\n\n<Stat label="Active projects" value="12" trend="+3 this week" />',
  "key-value":
    'import { KeyValue } from \'@nerio/ui\';\n\n<KeyValue label="Owner" value="Product team" />',
  table:
    "import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@nerio/ui';\n\n<Table><TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Roadmap</TableCell></TableRow></TableBody></Table>",
};

export const sharedTokens = [
  "--n-color-surface",
  "--n-color-text-primary",
  "--n-color-border-subtle",
  "--n-focus-ring",
];

const variantDescriptions: Record<string, string> = {
  primary: "Strongest action or selection in the local context.",
  secondary: "Supporting action with a visible control boundary.",
  ghost: "Low-emphasis action for dense or repeated surfaces.",
  destructive: "Risky action that needs explicit intent.",
  neutral: "Low-emphasis status or message.",
  success: "Positive completion or validation state.",
  danger: "Error, destructive, or blocking state.",
  info: "Informational state that should stay calm.",
  sm: "Compact size for dense layouts and inline use.",
  md: "Default size for most product surfaces.",
  lg: "Larger size for prominent local actions.",
  default: "Default variant using semantic Nerio tokens.",
  error: "Validation or failure state with recovery text.",
};

function titleFromRegistryValue(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function anatomyFromSlots(slots: string[], fallback: ReferenceSection[]) {
  if (slots.length === 0) return fallback;

  return slots.map((slot) => ({
    title: slot,
    description:
      fallback.find((item) => item.title === slot)?.description ??
      `${titleFromRegistryValue(slot)} slot exposed through data-slot="${slot}".`,
  }));
}

export function variantsFromRegistry(variants: string[], fallback: ReferenceSection[]) {
  if (variants.length === 0) return fallback;

  return variants.map((variant) => ({
    title: variant,
    description:
      variantDescriptions[variant] ??
      `${titleFromRegistryValue(variant)} is part of the public component contract.`,
  }));
}

export const componentReference: Record<string, ComponentReference> = {
  "icon-button": {
    category: "Actions and feedback",
    purpose:
      "Use IconButton for compact actions where surrounding context or an accessible label supplies the meaning.",
    anatomy: [
      {
        title: "root",
        description: "Interactive button boundary with size, variant, disabled, and focus states.",
      },
      {
        title: "icon",
        description:
          "Icon rendered through Nerio's icon adapter so Lucide and custom SVGs share one contract.",
      },
    ],
    variants: [
      {
        title: "Primary",
        description: "Use sparingly for the strongest compact action in a toolbar.",
      },
      {
        title: "Secondary",
        description: "Use for common actions that need a visible control boundary.",
      },
      {
        title: "Ghost",
        description: "Use inside dense surfaces where the icon should stay visually quiet.",
      },
    ],
    states: [
      { title: "Default", description: "Renders a compact square target with tokenized sizing." },
      {
        title: "Hover and focus",
        description: "Shows surface feedback and the shared focus ring.",
      },
      {
        title: "Disabled",
        description: "Removes activation while keeping the control discoverable.",
      },
    ],
    accessibility: [
      "Always provide a label because the visible icon is not an accessible name.",
      "Use familiar icons and pair unfamiliar actions with Tooltip.",
      "Keep destructive icon-only actions close to confirming context.",
    ],
    guidance: {
      do: ["Use for toolbar actions, command rows, and compact page chrome."],
      dont: ["Do not use an icon-only control when the action needs explanation to be safe."],
    },
    tokens: ["--n-icon-button-size-md", "--n-icon-button-radius", ...sharedTokens],
  },
  badge: {
    category: "Actions and feedback",
    purpose:
      "Use Badge to label status, category, or lightweight metadata without creating another action.",
    anatomy: [
      {
        title: "root",
        description: "Inline status container with tone, size, and tokenized radius.",
      },
      { title: "label", description: "Short text that names the status or metadata value." },
    ],
    variants: [
      { title: "Neutral", description: "Default metadata with low visual priority." },
      {
        title: "Success, info, danger",
        description: "Intent tones for positive, informational, or blocking states.",
      },
    ],
    states: [
      { title: "Static", description: "Badges are labels, not controls." },
      { title: "Dense", description: "Compact density reduces padding without changing meaning." },
    ],
    accessibility: ["Do not rely on color alone; the badge label must carry the status meaning."],
    guidance: {
      do: ["Use concise labels such as Draft, Ready, Shared, or Blocked."],
      dont: ["Do not use badges as buttons or navigation targets."],
    },
    tokens: ["--n-badge-radius", "--n-badge-height", ...sharedTokens],
  },
  spinner: {
    category: "Actions and feedback",
    purpose: "Use Spinner for short loading moments when progress cannot be measured.",
    anatomy: [
      { title: "root", description: "Inline loading indicator with an accessible label." },
      { title: "track", description: "Tokenized circular motion using semantic action color." },
    ],
    variants: [
      {
        title: "Size",
        description:
          "Use small inline spinners inside controls and medium spinners in empty surfaces.",
      },
    ],
    states: [
      {
        title: "Loading",
        description: "Communicates temporary work without shifting surrounding layout.",
      },
    ],
    accessibility: ["Provide a label when the spinner is the only loading announcement."],
    guidance: {
      do: ["Use for quick work such as saving, filtering, or refreshing."],
      dont: ["Do not use Spinner for long tasks where determinate Progress is available."],
    },
    tokens: ["--n-spinner-size-md", "--n-duration-normal", "--n-color-action-primary"],
  },
  skeleton: {
    category: "Actions and feedback",
    purpose: "Use Skeleton to reserve space for content while data loads.",
    anatomy: [
      {
        title: "root",
        description: "Block placeholder with tokenized radius and subdued surface color.",
      },
      { title: "shape", description: "Width and height are controlled by layout context." },
    ],
    variants: [
      { title: "Block", description: "Use repeated blocks to mirror the final content rhythm." },
    ],
    states: [
      { title: "Loading", description: "Keeps layout stable until real content replaces it." },
    ],
    accessibility: ["Mark the surrounding region busy when skeletons represent loading content."],
    guidance: {
      do: ["Match the approximate dimensions of the content that will load."],
      dont: ["Do not show skeletons after data has failed; switch to an error or empty state."],
    },
    tokens: ["--n-color-surface-muted", "--n-radius-md", "--n-duration-normal"],
  },
  "empty-state": {
    category: "Actions and feedback",
    purpose:
      "Use EmptyState when a surface has no content and the user needs context or a next step.",
    anatomy: [
      {
        title: "root",
        description: "Centered or inline message area that adapts to the parent surface.",
      },
      { title: "title", description: "Names the empty condition in human language." },
      {
        title: "description",
        description: "Explains why the space is empty or what can happen next.",
      },
      { title: "action", description: "Optional primary action when there is a clear next move." },
    ],
    variants: [
      { title: "Informational", description: "Use when there is nothing to fix." },
      { title: "Actionable", description: "Use when the next step is obvious and safe." },
    ],
    states: [
      { title: "Empty", description: "Default state for no records or no matching filters." },
      { title: "Filtered", description: "Pair with a reset action when filters hide all results." },
    ],
    accessibility: ["Keep the action reachable after the explanatory text in reading order."],
    guidance: {
      do: ["Use product language like projects, collections, collaborators, or activity."],
      dont: ["Do not blame users or use domain-specific assumptions."],
    },
    tokens: ["--n-empty-state-gap", "--n-color-text-secondary", ...sharedTokens],
  },
  input: {
    category: "Forms",
    purpose: "Use Input for short text values such as names, filters, URLs, and settings.",
    anatomy: [
      {
        title: "root",
        description: "Native input element with tokenized height, radius, border, and focus state.",
      },
      { title: "value", description: "User-entered short text value." },
      { title: "placeholder", description: "Optional hint that never replaces a visible label." },
    ],
    variants: [
      { title: "Default", description: "General text entry." },
      { title: "Invalid", description: "Pair with Field and FormMessage for validation." },
    ],
    states: [
      { title: "Default and focus", description: "Focus uses the shared Nerio focus ring." },
      { title: "Disabled", description: "Prevents editing while preserving layout." },
      { title: "Required", description: "Use native required attributes and visible helper text." },
      { title: "Invalid", description: "Use semantic error color and nearby text." },
    ],
    accessibility: [
      "Pair every input with Label or Field label.",
      "Use aria-describedby for helper text and validation messages.",
      "Use aria-invalid only when the value is actually invalid.",
      "Use autocomplete and input type where appropriate.",
    ],
    guidance: {
      do: ["Use Field for production forms so labels and messages stay connected."],
      dont: ["Do not use placeholder text as the only label."],
    },
    tokens: [
      "--n-input-height-md",
      "--n-input-radius",
      "--n-input-background",
      "--n-input-border-focus",
      "--n-input-placeholder",
    ],
  },
  textarea: {
    category: "Forms",
    purpose: "Use Textarea for longer notes, descriptions, comments, and collaborative content.",
    anatomy: [
      {
        title: "root",
        description: "Native textarea with tokenized border, radius, padding, and focus.",
      },
      { title: "value", description: "Multiline text content." },
    ],
    variants: [{ title: "Default", description: "Flexible multiline content entry." }],
    states: [
      { title: "Focus", description: "Visible focus treatment remains consistent with Input." },
      { title: "Disabled", description: "Keeps content visible while preventing edits." },
      {
        title: "Required",
        description: "Use native required attributes for mandatory long-form values.",
      },
      { title: "Invalid", description: "Pair with Field and FormMessage." },
    ],
    accessibility: [
      "Use a visible label and helpful description for long-form fields.",
      "Use aria-describedby for helper text and validation messages.",
      "Use aria-invalid only when the value is actually invalid.",
    ],
    guidance: {
      do: ["Use for content that benefits from multiple lines."],
      dont: ["Do not use Textarea for single-line values like titles or search."],
    },
    tokens: [
      "--n-textarea-min-height",
      "--n-input-radius",
      "--n-input-background",
      "--n-input-border-focus",
      "--n-input-placeholder",
    ],
  },
  label: {
    category: "Forms",
    purpose: "Use Label to provide an accessible name for a form control.",
    anatomy: [
      {
        title: "root",
        description: "Text label associated with a control through htmlFor or composition.",
      },
      { title: "text", description: "Concise name for the expected value." },
    ],
    variants: [{ title: "Default", description: "Standard form label text." }],
    states: [
      { title: "Default", description: "Associates visible text with a matching control id." },
      {
        title: "Required context",
        description: "Explain requirements in nearby text rather than symbol-only labels.",
      },
    ],
    accessibility: [
      "Connect labels to controls with htmlFor and matching id when they are separate.",
      "Label forwards native label attributes and refs.",
    ],
    guidance: {
      do: ["Use concrete labels such as Project name or Notification email."],
      dont: ["Do not rely on placeholders or icons alone."],
    },
    tokens: ["--n-font-size-sm", "--n-font-weight-medium", "--n-color-text-primary"],
  },
  field: {
    category: "Forms",
    purpose:
      "Use Field to compose a label, description, control, and message into one accessible form unit.",
    anatomy: [
      { title: "root", description: "Field container that controls spacing and state." },
      { title: "label", description: "Accessible name for the control." },
      { title: "description", description: "Optional helper text before interaction." },
      { title: "control", description: "Input, Select, Textarea, Checkbox, or Switch." },
      { title: "message", description: "Validation or help text after interaction." },
    ],
    variants: [
      { title: "Default", description: "General field composition." },
      { title: "Error", description: "Use for failed validation with a clear message." },
    ],
    states: [
      { title: "Neutral", description: "Description and message can provide helper text." },
      { title: "Invalid", description: "Message explains how to recover." },
    ],
    accessibility: [
      "Keep label, description, and message programmatically associated with the control.",
      "Field sets invalid attributes only when the field is actually invalid.",
      "Existing child ids and aria-describedby values are preserved and merged.",
      'Error messages use role="alert" when invalid so updates are announced.',
      "Field supports one form control child; compose custom markup directly for multiple controls.",
    ],
    guidance: {
      do: ["Use Field as the default wrapper for production form rows."],
      dont: ["Do not scatter messages away from the control they describe."],
    },
    tokens: [
      "--n-field-gap",
      "--n-color-text-secondary",
      "--n-color-text-tertiary",
      "--n-color-status-danger",
    ],
  },
  "form-message": {
    category: "Forms",
    purpose:
      "Use FormMessage for validation, confirmation, or contextual help inside a form field.",
    anatomy: [
      { title: "root", description: "Message text with tone and compact spacing." },
      { title: "tone", description: "Neutral, success, or error communication." },
    ],
    variants: [
      { title: "Neutral", description: "General helper text." },
      { title: "Success", description: "Confirmation after valid input." },
      { title: "Error", description: "Clear recovery message for invalid input." },
    ],
    states: [{ title: "Visible", description: "Appears close to the relevant control." }],
    accessibility: [
      "Use clear text; do not depend on color alone to convey validation status.",
      "Associate messages with controls through aria-describedby.",
      'Use role="alert" only for active validation errors.',
    ],
    guidance: {
      do: ["Tell users how to fix an error."],
      dont: ["Do not use vague messages like Invalid value."],
    },
    tokens: ["--n-color-text-tertiary", "--n-color-status-danger", "--n-color-status-success"],
  },
  checkbox: {
    category: "Forms",
    purpose: "Use Checkbox for independent options that can be checked or unchecked.",
    anatomy: [
      { title: "root", description: "Base UI checkbox control with checked and disabled states." },
      { title: "indicator", description: "Icon adapter based visual check indicator." },
      { title: "label", description: "Visible text that explains the option." },
    ],
    variants: [{ title: "Default", description: "Independent binary option." }],
    states: [
      { title: "Unchecked", description: "Option is available but not selected." },
      { title: "Checked", description: "Option is selected." },
      { title: "Disabled", description: "Option is unavailable." },
    ],
    accessibility: ["Use visible label text and keep the clickable target comfortable."],
    guidance: {
      do: ["Use for independent choices and multi-select filters."],
      dont: ["Do not use Checkbox for immediate on/off settings; use Switch instead."],
    },
    tokens: ["--n-checkbox-size", "--n-checkbox-radius", ...sharedTokens],
  },
  switch: {
    category: "Forms",
    purpose: "Use Switch for settings that turn something on or off immediately.",
    anatomy: [
      { title: "root", description: "Interactive switch control with pressed state." },
      { title: "thumb", description: "Movable indicator for on/off state." },
      { title: "label", description: "Text explaining the setting." },
    ],
    variants: [{ title: "Default", description: "Immediate binary setting." }],
    states: [
      { title: "Off", description: "Setting is disabled." },
      { title: "On", description: "Setting is enabled." },
      { title: "Disabled", description: "Setting cannot be changed." },
    ],
    accessibility: ["Use a label that describes the setting, not the current visual state."],
    guidance: {
      do: ["Use for preferences like notifications or compact mode."],
      dont: ["Do not use Switch for selecting multiple unrelated options."],
    },
    tokens: ["--n-switch-width", "--n-switch-thumb-size", "--n-color-action-primary"],
  },
  select: {
    category: "Forms",
    purpose: "Use Select when a user chooses one option from a compact, known set.",
    anatomy: [
      { title: "trigger", description: "Button-like control that opens the option list." },
      { title: "value", description: "Current selection or placeholder text." },
      { title: "content", description: "Layered list rendered through Base UI portal behavior." },
      { title: "item", description: "Selectable option with highlighted and selected states." },
    ],
    variants: [{ title: "Default", description: "Single-select option list." }],
    states: [
      { title: "Open", description: "Options appear above the app layer." },
      {
        title: "Placeholder",
        description: "Placeholder text does not auto-select the first option.",
      },
      {
        title: "Highlighted",
        description: "Keyboard or pointer focus indicates the next selection.",
      },
      { title: "Disabled", description: "Prevents choosing unavailable options." },
      { title: "Required", description: "Supports native form required metadata." },
      {
        title: "Invalid",
        description: "Connects error text and aria-invalid when validation fails.",
      },
    ],
    accessibility: [
      "Use a visible label and ensure options are short enough to scan.",
      "Use placeholder text only as a hint, not as the accessible name.",
      "Description and message ids are connected through aria-describedby.",
      'Error messages use role="alert" only when invalid is true.',
      "Use name, required, form, and autoComplete when the select participates in native form submission.",
    ],
    guidance: {
      do: ["Use for status, owner, view mode, and compact configuration choices."],
      dont: ["Do not use Select for large searchable datasets."],
    },
    tokens: [
      "--n-select-height-md",
      "--n-input-border-focus",
      "--n-input-placeholder",
      "--n-overlay-background",
      "--n-overlay-border",
      "--n-overlay-shadow",
    ],
  },
  toast: {
    category: "Actions and feedback",
    purpose: "Use Toast to acknowledge short-lived product events without blocking the workflow.",
    anatomy: [
      { title: "provider", description: "Client boundary that manages toast state." },
      { title: "viewport", description: "Portal layer where toasts are announced and positioned." },
      { title: "toast", description: "Message surface with title, description, and tone." },
    ],
    variants: [
      { title: "Neutral", description: "General event acknowledgement." },
      { title: "Success or danger", description: "Outcome tone for saved changes or failed work." },
    ],
    states: [
      { title: "Visible", description: "Appears briefly in the viewport." },
      { title: "Dismissed", description: "Can be removed by timeout or close action." },
    ],
    accessibility: ["Use concise messages and avoid essential decisions inside a toast."],
    guidance: {
      do: ["Confirm background events like saved, copied, or sent."],
      dont: ["Do not use Toast for destructive confirmations or blocking errors."],
    },
    tokens: [
      "--n-toast-width",
      "--n-overlay-background",
      "--n-overlay-border",
      "--n-overlay-shadow",
      "--n-color-status-success",
      "--n-color-status-danger",
    ],
  },
  card: {
    category: "Layout and display",
    purpose:
      "Use Card to group a single related object or repeated item without turning page sections into nested panels.",
    anatomy: [
      { title: "root", description: "Surface container with border, radius, and spacing tokens." },
      {
        title: "content",
        description: "Product content such as object title, metadata, and actions.",
      },
    ],
    variants: [
      { title: "Default", description: "Quiet grouping for repeated items." },
      {
        title: "Raised",
        description: "Use only when elevation communicates layer or interaction.",
      },
    ],
    states: [
      { title: "Static", description: "Groups content without becoming clickable." },
      {
        title: "Interactive",
        description: "If clickable, use a semantic link or button inside the card.",
      },
    ],
    accessibility: ["Keep heading order and actions explicit inside the card."],
    guidance: {
      do: ["Use for repeated summaries, project cards, or compact object groups."],
      dont: ["Do not put cards inside cards or wrap entire page sections as decorative cards."],
    },
    tokens: ["--n-card-padding", "--n-card-radius", "--n-shadow-sm", ...sharedTokens],
  },
  separator: {
    category: "Layout and display",
    purpose: "Use Separator to divide related content sections without adding visual weight.",
    anatomy: [
      { title: "root", description: "Horizontal or vertical rule using the subtle border token." },
    ],
    variants: [
      { title: "Horizontal", description: "Separates stacked content." },
      {
        title: "Vertical",
        description: "Separates inline groups when spacing alone is not enough.",
      },
    ],
    states: [
      {
        title: "Static",
        description: "Decorative by default unless exposed as structural semantics.",
      },
    ],
    accessibility: ["Use semantic sectioning when the separation changes document structure."],
    guidance: {
      do: ["Use separators sparingly to support scanability."],
      dont: ["Do not use separators as a replacement for spacing rhythm."],
    },
    tokens: ["--n-color-border-subtle", "--n-space-3"],
  },
  avatar: {
    category: "Layout and display",
    purpose: "Use Avatar to identify people, teams, or entities in compact product surfaces.",
    anatomy: [
      { title: "root", description: "Circular identity container with tokenized size." },
      { title: "image", description: "Optional supplied image." },
      { title: "fallback", description: "Initials generated from the provided name." },
    ],
    variants: [
      { title: "Image", description: "Use when a trusted image is available." },
      { title: "Fallback", description: "Use initials when no image is available." },
    ],
    states: [
      {
        title: "Loaded or fallback",
        description: "Fallback preserves layout when images are missing.",
      },
    ],
    accessibility: ["Use names in surrounding text when the avatar is decorative."],
    guidance: {
      do: ["Pair avatars with names in dense lists when possible."],
      dont: ["Do not rely on avatar color as the only identifier."],
    },
    tokens: ["--n-avatar-size-md", "--n-radius-full", ...sharedTokens],
  },
  progress: {
    category: "Layout and display",
    purpose: "Use Progress to show measurable completion for uploads, tasks, setup, or workflows.",
    anatomy: [
      { title: "root", description: "Progress region with optional label and value." },
      { title: "track", description: "Background track using muted surface tokens." },
      { title: "indicator", description: "Filled value using action or intent color." },
    ],
    variants: [{ title: "Determinate", description: "Shows known completion from 0 to 100." }],
    states: [
      { title: "In progress", description: "Value is between start and complete." },
      { title: "Complete", description: "Value reaches 100." },
    ],
    accessibility: ["Expose a label and numeric value for assistive technologies."],
    guidance: {
      do: ["Use when progress can be measured."],
      dont: ["Do not fake precision for unknown work; use Spinner instead."],
    },
    tokens: ["--n-progress-height", "--n-progress-radius", "--n-color-action-primary"],
  },
  stat: {
    category: "Layout and display",
    purpose: "Use Stat to summarize a single metric with optional trend context.",
    anatomy: [
      { title: "root", description: "Metric block with label, value, and trend." },
      { title: "label", description: "Names the metric." },
      { title: "value", description: "Primary numeric or short text value." },
      { title: "trend", description: "Optional supporting comparison." },
    ],
    variants: [{ title: "Default", description: "Neutral metric summary." }],
    states: [{ title: "Static", description: "Displays a point-in-time value." }],
    accessibility: [
      "Keep labels and values readable together; do not encode meaning only in trend color.",
    ],
    guidance: {
      do: ["Use for dashboard summaries and compact analytics."],
      dont: ["Do not overload one Stat with multiple metrics."],
    },
    tokens: ["--n-stat-gap", "--n-font-size-2xl", ...sharedTokens],
  },
  "key-value": {
    category: "Layout and display",
    purpose: "Use KeyValue for compact metadata on records, settings, and object summaries.",
    anatomy: [
      { title: "root", description: "Definition-list compatible pair." },
      { title: "label", description: "Metadata key." },
      { title: "value", description: "Metadata value, text, or small component." },
    ],
    variants: [{ title: "Default", description: "Compact label/value pair." }],
    states: [{ title: "Static", description: "Reads as metadata, not a control." }],
    accessibility: ["Use definition list structure when presenting a group of related pairs."],
    guidance: {
      do: ["Use for owner, updated date, status, and permissions."],
      dont: ["Do not use for long prose or multi-step content."],
    },
    tokens: ["--n-key-value-gap", "--n-font-size-sm", ...sharedTokens],
  },
  table: {
    category: "Layout and display",
    purpose:
      "Use Table to present structured records for scanning, comparison, and repeated operations.",
    anatomy: [
      { title: "table", description: "Native table structure for tabular data." },
      { title: "header", description: "Column labels." },
      { title: "body", description: "Rows of related records." },
      { title: "row", description: "A native table row." },
      { title: "head", description: "A native table header cell." },
      { title: "cell", description: "Individual data values and compact actions." },
    ],
    variants: [
      { title: "Default", description: "Readable data table with subtle row separation." },
    ],
    states: [
      { title: "Empty", description: "Pair with EmptyState when no records exist." },
      { title: "Loading", description: "Use Skeleton rows when records are loading." },
    ],
    accessibility: ["Use real table markup for tabular data and concise column headers."],
    guidance: {
      do: ["Use for comparable records and operational lists."],
      dont: ["Do not use Table for layout grids or card collections."],
    },
    tokens: [
      "--n-table-cell-padding-y",
      "--n-table-cell-padding-x",
      "--n-table-border",
      "--n-table-header-background",
      "--n-table-row-background-hover",
      "--n-table-row-background-selected",
      "--n-font-size-sm",
    ],
  },
  tabs: {
    category: "Navigation and overlays",
    purpose: "Use Tabs to switch between related panels within the same context.",
    anatomy: [
      { title: "list", description: "Tab controls grouped together." },
      { title: "trigger", description: "Selectable tab label." },
      { title: "panel", description: "Content associated with the selected tab." },
    ],
    variants: [{ title: "Default", description: "Horizontal tab list for related panels." }],
    states: [
      { title: "Selected", description: "Active tab and visible panel." },
      { title: "Focus", description: "Keyboard focus on the current trigger." },
      { title: "Disabled", description: "Unavailable tab remains visible but inactive." },
    ],
    accessibility: [
      "Use tabs only for related views; preserve keyboard navigation between triggers.",
    ],
    guidance: {
      do: ["Use for Overview, Activity, Settings, and similar local panels."],
      dont: ["Do not use Tabs for global navigation or unrelated destinations."],
    },
    tokens: ["--n-tabs-trigger-height", "--n-tabs-radius", ...sharedTokens],
  },
  dialog: {
    category: "Navigation and overlays",
    purpose:
      "Use Dialog to focus a short task, confirmation, or decision above the current surface.",
    anatomy: [
      { title: "trigger", description: "Control that opens the dialog." },
      { title: "portal", description: "Layer that isolates overlay rendering and stacking." },
      { title: "overlay", description: "Backdrop that separates the dialog from the page." },
      { title: "content", description: "Modal surface with title, description, and actions." },
    ],
    variants: [
      { title: "Task", description: "Short focused task with clear completion." },
      { title: "Confirmation", description: "Decision point for sensitive actions." },
    ],
    states: [
      { title: "Open", description: "Focus moves into the dialog." },
      { title: "Closed", description: "Focus returns to the trigger." },
    ],
    accessibility: [
      "Use a clear title, keep focus contained, and avoid opening dialogs from dialogs.",
    ],
    guidance: {
      do: ["Use for short decisions that need context without a route change."],
      dont: ["Do not use Dialog for long, multi-page workflows."],
    },
    tokens: [
      "--n-dialog-width-md",
      "--n-overlay-z-index",
      "--n-overlay-background",
      "--n-overlay-border",
      "--n-overlay-backdrop",
      "--n-overlay-foreground",
      "--n-overlay-shadow",
      "--n-focus-ring",
    ],
  },
  popover: {
    category: "Navigation and overlays",
    purpose: "Use Popover for contextual controls or details tied to a trigger.",
    anatomy: [
      { title: "trigger", description: "Control that opens the popover." },
      { title: "content", description: "Layered panel with controls or supporting content." },
      { title: "arrow", description: "Optional visual pointer when spatial context helps." },
    ],
    variants: [{ title: "Default", description: "Contextual panel near a trigger." }],
    states: [
      { title: "Open", description: "Panel is visible and keyboard reachable." },
      { title: "Closed", description: "Panel is removed from the layer." },
    ],
    accessibility: ["Do not hide essential page content only inside a hover-only popover."],
    guidance: {
      do: ["Use for filters, quick metadata, or lightweight editing controls."],
      dont: ["Do not use Popover for destructive confirmations."],
    },
    tokens: [
      "--n-popover-width-md",
      "--n-overlay-background",
      "--n-overlay-border",
      "--n-overlay-foreground",
      "--n-overlay-shadow",
    ],
  },
  tooltip: {
    category: "Navigation and overlays",
    purpose: "Use Tooltip to clarify compact controls or truncated metadata.",
    anatomy: [
      { title: "trigger", description: "Element that receives hover or focus." },
      { title: "content", description: "Short non-interactive explanation." },
    ],
    variants: [{ title: "Default", description: "Small text label in the overlay layer." }],
    states: [
      { title: "Visible", description: "Appears on hover or focus after a short delay." },
      { title: "Hidden", description: "Dismisses when trigger loses hover or focus." },
    ],
    accessibility: [
      "Tooltips must support keyboard focus and must not contain required instructions.",
    ],
    guidance: {
      do: ["Use to name icon-only actions or clarify dense metadata."],
      dont: ["Do not put buttons, links, or critical content inside Tooltip."],
    },
    tokens: ["--n-tooltip-radius", "--n-overlay-shadow", ...sharedTokens],
  },
  "dropdown-menu": {
    category: "Navigation and overlays",
    purpose: "Use DropdownMenu to group secondary commands behind a compact trigger.",
    anatomy: [
      { title: "trigger", description: "Control that opens the command list." },
      { title: "content", description: "Layered menu surface." },
      { title: "item", description: "Command row with optional destructive intent." },
    ],
    variants: [
      { title: "Default", description: "Neutral command groups." },
      {
        title: "Destructive item",
        description: "Marks risky commands without making the whole menu destructive.",
      },
    ],
    states: [
      { title: "Open", description: "Items are keyboard navigable." },
      { title: "Highlighted", description: "Current item is ready for selection." },
      { title: "Disabled", description: "Unavailable items stay in context without activation." },
    ],
    accessibility: ["Keep labels action-oriented and support keyboard navigation through Base UI."],
    guidance: {
      do: ["Use for Rename, Duplicate, Archive, and similar secondary commands."],
      dont: ["Do not hide the primary page action inside a menu."],
    },
    tokens: [
      "--n-dropdown-min-width",
      "--n-overlay-background",
      "--n-overlay-border",
      "--n-overlay-shadow",
      "--n-color-text-secondary",
      "--n-color-status-danger",
    ],
  },
};
