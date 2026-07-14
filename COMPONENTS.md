# Nerio component matrix

This document defines which components belong to Nerio Core and which components belong to Nerio Pro.

## Product rule

Core provides foundations and reusable building blocks.

Pro provides advanced product-ready components, templates, premium themes, Figma assets, and domain-specific patterns.

Core should be good enough to build a real product without a paid license.

Pro should save time on complex SaaS, fintech, crypto, data-rich dashboard, and AI interface work.

## Source of truth

- Canonical machine-readable inventory: `data/component-catalog.json`
- Human-readable projection: `COMPONENTS.md`
- Product decisions: `DECISIONS.md`
- Agent context: `AGENTS.md`

Update the catalog first, then update this matrix and every affected registry, docs, CLI, and MCP projection. Run `pnpm validate:catalog` to detect drift.

## Status values

- `planned`: approved for the tier, not implemented yet.
- `draft`: exploratory work exists but the public contract is not ready for use.
- `implemented-initial`: first implementation exists, and API or styling may still change.
- `polished`: public API and presentation are implemented, but the complete stable-core verification evidence is not yet available.
- `quality-pass-needed`: component exists but still needs an API, accessibility, token, docs, and registry review before it can support Pro work.
- `stable-core`: component passed the Core quality checklist and can safely support future Pro components, templates, registry installs, and AI/MCP usage.
- `deprecated-compatibility`: public wrapper retained only for migration; new work must use its documented replacement.
- `future`: expected later, not part of the current milestone.

Do not mark a component as `stable-core` until the Core quality checklist is satisfied across API, accessibility, tokens, docs, registry metadata, and validation.

---

## Core components

### Foundation

| Component / Area  | Status      | Package           | Notes                                                                                                                            |
| ----------------- | ----------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Tokens            | stable-core | `@nerio/tokens`   | Color, spacing, radius, typography, motion                                                                                       |
| Themes            | stable-core | `@nerio/tokens`   | Brand themes: `purple`, `blue`, `green`, `orange`, `red`, `neutral`; custom themes supported through CSS variables               |
| Modes             | stable-core | `@nerio/tokens`   | Color modes: `system`, `light`, `dark`                                                                                           |
| Density           | stable-core | `@nerio/tokens`   | Density modes: `comfortable`, `compact`                                                                                          |
| Typography Tokens | stable-core | `@nerio/tokens`   | System UI default plus seven official token recipes. Consumer-loaded fonts only; not a v1 runtime axis.                          |
| Radius Tokens     | stable-core | `@nerio/tokens`   | Token-customizable radius variables. Not a v1 runtime axis.                                                                      |
| Motion Tokens     | stable-core | `@nerio/tokens`   | Token-customizable duration/motion variables. Not a v1 runtime axis.                                                             |
| Contrast Tokens   | stable-core | `@nerio/tokens`   | Token-customizable semantic contrast targets and semantic color overrides. Not a v1 runtime axis.                                |
| Typography        | stable-core | `@nerio/ui`       | Semantic heading, text, and inline code primitives                                                                               |
| Kbd               | stable-core | `@nerio/ui`       | Native shortcut notation with verified inline, Button, density, and forced-colors behavior                                       |
| Icon              | stable-core | `@nerio/ui`       | Server-safe renderer with protected non-focusable semantics, warning-free custom SVG forwarding, and explicit meaningful labels. |
| Icon Adapter      | stable-core | `@nerio/adapters` | Tree-shakeable Lucide source and generic SVG contract with Lucide-only stroke behavior kept separate.                            |

### Actions

| Component   | Status                   | Package            | Notes                                                                                          |
| ----------- | ------------------------ | ------------------ | ---------------------------------------------------------------------------------------------- |
| Button      | stable-core              | `@nerio/ui/client` | Variants, including link, sizes, loading, icon-only mode, directional icon slots, Kbd, tooltip |
| ButtonGroup | stable-core              | `@nerio/ui`        | Server-safe attached group for related Buttons; supports horizontal and vertical layouts       |
| IconButton  | deprecated-compatibility | `@nerio/ui/client` | Deprecated wrapper for Button icon-only mode; retained until the next major release            |

### Forms

| Component   | Status      | Package            | Notes                                                                                                                                |
| ----------- | ----------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Input       | stable-core | `@nerio/ui`        | Thin native single-line control for text-like values; labels and validation belong to Field                                          |
| InputGroup  | stable-core | `@nerio/ui`        | Composable surface for an Input with explicit start/end addons                                                                       |
| Textarea    | stable-core | `@nerio/ui`        | Multiline input                                                                                                                      |
| Label       | stable-core | `@nerio/ui`        | Accessible form label                                                                                                                |
| Field       | stable-core | `@nerio/ui`        | Label, help text, error, description                                                                                                 |
| FormMessage | stable-core | `@nerio/ui`        | Field message/error text                                                                                                             |
| FormGroup   | stable-core | `@nerio/ui`        | Fieldset group with title, description, message, invalid state, and stack, inline, or responsive grid layout                         |
| Checkbox    | stable-core | `@nerio/ui/client` | Base UI checkbox for independent, indeterminate, and form-backed options                                                             |
| Radio Group | stable-core | `@nerio/ui/client` | Base UI radio selection with options or RadioGroupItem composition, group metadata, and item states                                  |
| Switch      | stable-core | `@nerio/ui/client` | Base UI toggle for immediate binary settings with invalid and read-only state support                                                |
| Select      | stable-core | `@nerio/ui/client` | Single-select control with options or curated item composition, form metadata, controlled popup state, and Base UI keyboard behavior |

### Input-family roadmap

| Component                                                                            | Tier            | Status | Boundary                                                                                                                              |
| ------------------------------------------------------------------------------------ | --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| SearchInput                                                                          | Core candidate  | future | Composes Input and InputGroup for a query, icon, and optional accessible clear action; it never owns results, fetching, or filtering. |
| PasswordInput                                                                        | Core candidate  | future | Composes Input and InputGroup for an accessible visibility action; it never owns password policy.                                     |
| Calendar                                                                             | Core candidate  | future | Universal accessible calendar grid and deliberately small date-selection primitive.                                                   |
| DatePicker                                                                           | Core candidate  | future | Basic single-date control composed from Calendar and Popover; ranges, presets, and scheduling remain out of scope.                    |
| Combobox / NumberField / OTPInput                                                    | Core candidates | future | Candidates only; no public API is committed.                                                                                          |
| DateRangePicker / DateTimePicker / DatePickerWithPresets / NaturalLanguageDatePicker | Pro             | future | Product-ready date workflows.                                                                                                         |
| GlobalSearch / EntitySearch / AdvancedSearch / CommandPalette / FilterBar            | Pro             | future | Result fetching, workflow behavior, and product-level search/filter composition.                                                      |

### Overlays

| Component     | Status      | Package            | Notes                                                                                                |
| ------------- | ----------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| Dialog        | stable-core | `@nerio/ui/client` | Modal primitive with title, description, close, controlled state, ref, and Base UI focus behavior    |
| Sheet         | polished    | `@nerio/ui/client` | Base UI modal side-panel primitive with compound slots, sides, sizes, and tokenized overlay behavior |
| Popover       | stable-core | `@nerio/ui/client` | Floating content with optional context, controlled state, ref, and overlay tokens                    |
| Tooltip       | stable-core | `@nerio/ui/client` | Short non-essential contextual help through Base UI                                                  |
| Dropdown Menu | stable-core | `@nerio/ui/client` | Basic menu with disabled and destructive items                                                       |

### Data display

| Component | Status      | Package     | Notes                                                                                                                               |
| --------- | ----------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Card      | stable-core | `@nerio/ui` | Composable surface with verified visual placement, header action, semantic root, narrow layout, focus, and heading contracts        |
| Badge     | stable-core | `@nerio/ui` | Status and metadata                                                                                                                 |
| Avatar    | stable-core | `@nerio/ui` | User/entity avatar with verified image transitions, aspect-ratio cropping, accessible naming, and fallback behavior                 |
| Table     | stable-core | `@nerio/ui` | Native table anatomy with explicit named keyboard-scroll opt-in, responsive and RTL overflow, and consumer-owned data behavior      |
| List      | stable-core | `@nerio/ui` | Structured list with stable IDs, visible ordered markers, native links, and package-agnostic router rendering                       |
| Item      | stable-core | `@nerio/ui` | Generic composition primitive with composed render/forwarded refs, responsive content/media/actions, and consumer-owned interaction |
| Separator | stable-core | `@nerio/ui` | Layout divider                                                                                                                      |
| KeyValue  | stable-core | `@nerio/ui` | Simple definition-list value display                                                                                                |
| Stat      | stable-core | `@nerio/ui` | Basic metric display. Advanced KPI cards belong to Pro.                                                                             |

### Feedback

| Component   | Status      | Package            | Notes                                                                                              |
| ----------- | ----------- | ------------------ | -------------------------------------------------------------------------------------------------- |
| Alert       | stable-core | `@nerio/ui`        | Inline feedback with persistent semantic context                                                   |
| Toast       | stable-core | `@nerio/ui/client` | Static presentation plus deterministic managed stack, lifecycle, priority, actions, swipe, and RTL |
| Progress    | stable-core | `@nerio/ui`        | Task-completion progress with required accessible naming, normalized ranges, and tokenized motion  |
| Skeleton    | stable-core | `@nerio/ui`        | Loading placeholder                                                                                |
| Empty State | stable-core | `@nerio/ui`        | Composable media, header, actions, size, alignment, role guidance, and responsive stacking         |
| Spinner     | stable-core | `@nerio/ui`        | Loading indicator                                                                                  |

### Navigation and layout

| Component         | Status      | Package            | Notes                                                                                                                                           |
| ----------------- | ----------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Tabs              | stable-core | `@nerio/ui/client` | Compound tabs with verified controlled state, disabled skipping, variants, overflow, RTL indicator, focus, hydration, and motion                |
| Breadcrumbs       | stable-core | `@nerio/ui`        | Hierarchy navigation with ordered list semantics and explicit current-page support                                                              |
| Pagination        | stable-core | `@nerio/ui`        | Link, button, and static pagination with current-state parity, boundaries, ellipsis, router rendering, density, wrapping, and RTL               |
| Sidebar Primitive | stable-core | `@nerio/ui/client` | Stateful layout primitive with server-safe regions, accessible collapse, physical sides, and consumer-owned data                                |
| Command Primitive | stable-core | `@nerio/ui/client` | Accessible local or consumer-filtered action picker with stable values, groups, disabled navigation, and deliberate empty/loading announcements |

---

## Pro components

### Data-heavy UI

| Component       | Status  | Package      | Notes                                              |
| --------------- | ------- | ------------ | -------------------------------------------------- |
| DataGrid        | planned | `@nerio/pro` | Sorting, filtering, column visibility, saved views |
| Advanced Table  | planned | `@nerio/pro` | Bulk actions, density, row actions                 |
| Filter Bar      | planned | `@nerio/pro` | Complex filters                                    |
| Saved Views     | planned | `@nerio/pro` | Named table/filter states                          |
| Column Settings | planned | `@nerio/pro` | Visibility and ordering                            |

### Dashboards

| Component       | Status  | Package      | Notes                                                                     |
| --------------- | ------- | ------------ | ------------------------------------------------------------------------- |
| KPI Card        | planned | `@nerio/pro` | Advanced metric with trend, comparison, state, actions, and chart context |
| KPI Group       | planned | `@nerio/pro` | Dashboard metric cluster                                                  |
| Trend Chip      | planned | `@nerio/pro` | Positive/negative/neutral movement                                        |
| Chart Card      | planned | `@nerio/pro` | Chart wrapper and metadata                                                |
| Activity Feed   | planned | `@nerio/pro` | Product activity timeline                                                 |
| Analytics Panel | planned | `@nerio/pro` | Advanced dashboard section                                                |

### SaaS and admin

| Component           | Status  | Package      | Notes                              |
| ------------------- | ------- | ------------ | ---------------------------------- |
| AppShell            | planned | `@nerio/pro` | Full application layout            |
| AppSidebar          | planned | `@nerio/pro` | Workspace switcher, nav, user menu |
| Settings Layout     | planned | `@nerio/pro` | Settings page structure            |
| Billing Settings    | planned | `@nerio/pro` | Plan, invoices, payment method     |
| Team Members        | planned | `@nerio/pro` | Members and invites                |
| Roles & Permissions | planned | `@nerio/pro` | Permission UI                      |
| Audit Log           | planned | `@nerio/pro` | Security/admin log                 |

### Documentation UI

| Component              | Status  | Package      | Notes                                                      |
| ---------------------- | ------- | ------------ | ---------------------------------------------------------- |
| Documentation Shell    | planned | `@nerio/pro` | Full docs layout with header, sidebar, content, and TOC    |
| Documentation Header   | planned | `@nerio/pro` | Product identity, version, search, theme, and repo actions |
| Documentation Sidebar  | planned | `@nerio/pro` | Grouped documentation navigation with active states        |
| Page Table of Contents | planned | `@nerio/pro` | Sticky in-page navigation generated from headings          |
| Documentation Search   | planned | `@nerio/pro` | Search command pattern for docs discovery                  |

### Finance and crypto

| Component           | Status  | Package      | Notes                       |
| ------------------- | ------- | ------------ | --------------------------- |
| Portfolio Card      | planned | `@nerio/pro` | Portfolio summary           |
| Asset Row           | planned | `@nerio/pro` | Asset/token row             |
| Transaction List    | planned | `@nerio/pro` | Crypto/finance transactions |
| Wallet Connector UI | planned | `@nerio/pro` | Wallet connection pattern   |
| Balance Visibility  | planned | `@nerio/pro` | Hide/show sensitive values  |
| PnL Components      | planned | `@nerio/pro` | Profit/loss display         |
| Risk Badge          | planned | `@nerio/pro` | Risk status indicator       |

### AI interfaces

| Component       | Status  | Package      | Notes                              |
| --------------- | ------- | ------------ | ---------------------------------- |
| AI Chat Shell   | planned | `@nerio/pro` | Full chat interface                |
| Prompt Input    | planned | `@nerio/pro` | AI prompt composer                 |
| Message         | planned | `@nerio/pro` | Assistant/user message             |
| Sources         | planned | `@nerio/pro` | Citations/source display           |
| Tool Call       | planned | `@nerio/pro` | Tool execution UI                  |
| Reasoning Block | planned | `@nerio/pro` | Collapsible reasoning/status block |
| Attachment      | planned | `@nerio/pro` | File attachment UI                 |
| Code Block      | planned | `@nerio/pro` | AI/code response block             |

### Templates

| Template                            | Status  | Package      | Notes                            |
| ----------------------------------- | ------- | ------------ | -------------------------------- |
| Universal Workspace Template        | planned | `@nerio/pro` | General SaaS/admin template      |
| Banking Dashboard Template          | planned | `@nerio/pro` | Fintech dashboard template       |
| Crypto Portfolio Dashboard Template | planned | `@nerio/pro` | Crypto/portfolio template        |
| Admin Settings Template             | planned | `@nerio/pro` | SaaS settings template           |
| Billing Portal Template             | planned | `@nerio/pro` | Subscription management template |
| AI Assistant Template               | planned | `@nerio/pro` | AI product template              |

---

## Tiering examples

| Item                              | Tier          | Reason                                             |
| --------------------------------- | ------------- | -------------------------------------------------- |
| Button                            | Core          | Basic reusable action                              |
| Dialog                            | Core          | Common overlay primitive                           |
| Basic Table                       | Core          | Generic data display                               |
| DataGrid                          | Pro           | Advanced data workflow                             |
| Basic Stat                        | Core          | Simple metric display                              |
| KPI Card                          | Pro           | Advanced dashboard metric pattern                  |
| Sidebar Primitive                 | Core          | Layout building block                              |
| AppSidebar                        | Pro           | Product-ready composition                          |
| Empty State                       | Core          | Basic feedback pattern                             |
| Illustrated Empty State templates | Pro           | Product-ready pattern library                      |
| Theme tokens                      | Core          | Foundation                                         |
| Typography/radius/motion tokens   | Core          | Token-customizable foundation, not v1 runtime axes |
| Premium brand themes              | Pro           | Commercial design asset                            |
| Command Primitive                 | Core          | Generic command structure                          |
| Command Palette                   | Pro           | Full product pattern                               |
| Basic chat primitives             | Optional Core | Generic structure only                             |
| AI Chat Shell                     | Pro           | Full AI product workflow                           |
