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

| Component / Area  | Status              | Package                     | Notes                                                                                                                                          |
| ----------------- | ------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Tokens            | stable-core         | `@nerio-ui/tokens`          | Color, spacing, radius, typography, motion                                                                                                     |
| Themes            | stable-core         | `@nerio-ui/tokens`          | Brand themes: `purple`, `blue`, `green`, `orange`, `red`, `neutral`; custom themes supported through CSS variables                             |
| Modes             | stable-core         | `@nerio-ui/tokens`          | Explicit persisted `system`, `light`, and `dark` modes; System follows live OS preference changes.                                             |
| Density           | stable-core         | `@nerio-ui/tokens`          | `comfortable` and `compact` remap semantic/component contracts while primitive scales remain immutable.                                        |
| Typography Tokens | stable-core         | `@nerio-ui/tokens`          | System UI default plus seven official token recipes. Consumer-loaded fonts only; not a v1 runtime axis.                                        |
| Radius Tokens     | stable-core         | `@nerio-ui/tokens`          | Token-customizable radius variables. Not a v1 runtime axis.                                                                                    |
| Motion Tokens     | stable-core         | `@nerio-ui/tokens`          | Token-customizable duration/motion variables. Not a v1 runtime axis.                                                                           |
| Motion Adapter    | implemented-initial | `@nerio-ui/adapters/motion` | Optional client-only Motion integration with typed token-aligned transitions, variants, reduced-motion configuration, and source installation. |
| Contrast Tokens   | stable-core         | `@nerio-ui/tokens`          | Token-customizable semantic contrast targets and semantic color overrides. Not a v1 runtime axis.                                              |
| Typography        | stable-core         | `@nerio-ui/ui`              | Semantic heading, text, and inline code primitives                                                                                             |
| Kbd               | stable-core         | `@nerio-ui/ui`              | Native shortcut notation with verified inline, Button, density, and forced-colors behavior                                                     |
| Icon              | stable-core         | `@nerio-ui/ui`              | Server-safe renderer with protected non-focusable semantics, warning-free custom SVG forwarding, and explicit meaningful labels.               |
| Icon Adapter      | stable-core         | `@nerio-ui/adapters/icons`  | Tree-shakeable Lucide source and generic SVG contract; optional table, chart, form, and schema integrations stay on isolated subpaths.         |

### Actions

| Component   | Status                   | Package               | Notes                                                                                                                                       |
| ----------- | ------------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Button      | stable-core              | `@nerio-ui/ui/client` | Variants, including link, sizes, loading, icon-only mode, directional icon slots, Kbd, tooltip, and prop/ref-safe custom render composition |
| ButtonGroup | stable-core              | `@nerio-ui/ui`        | Server-safe attached group for related Buttons; supports horizontal and vertical layouts                                                    |
| IconButton  | deprecated-compatibility | `@nerio-ui/ui/client` | Deprecated wrapper for Button icon-only mode; retained until the next major release                                                         |

### Forms

| Component   | Status      | Package               | Notes                                                                                                                                        |
| ----------- | ----------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Input       | stable-core | `@nerio-ui/ui`        | Thin native single-line control for text-like, numeric, and temporal values; native picker, form, and validation behavior stay browser-owned |
| InputGroup  | stable-core | `@nerio-ui/ui`        | Composable surface for an Input with explicit start/end addons                                                                               |
| Textarea    | stable-core | `@nerio-ui/ui`        | Multiline input with native disabled/read-only behavior and normalized focus and invalid-state hooks                                         |
| Label       | stable-core | `@nerio-ui/ui`        | Accessible form label with a native non-submit supplementary hint trigger                                                                    |
| Field       | stable-core | `@nerio-ui/ui`        | Label, help text, error, description                                                                                                         |
| FormMessage | stable-core | `@nerio-ui/ui`        | Field message/error text                                                                                                                     |
| FormGroup   | stable-core | `@nerio-ui/ui`        | Fieldset group with title, description, message, invalid state, and stack, inline, or responsive grid layout                                 |
| Checkbox    | stable-core | `@nerio-ui/ui/client` | Base UI checkbox for grouped multi-selection, indeterminate aggregates, and form-backed option sets                                          |
| Radio Group | stable-core | `@nerio-ui/ui/client` | Base UI radio selection with options or RadioGroupItem composition, group metadata, and item states                                          |
| Switch      | stable-core | `@nerio-ui/ui/client` | Base UI toggle for immediate binary settings with invalid and read-only state support                                                        |
| Select      | stable-core | `@nerio-ui/ui/client` | Single-select control with options or curated item composition, form metadata, controlled popup state, and Base UI keyboard behavior         |
| Slider      | planned     | `@nerio-ui/ui/client` | Approved Core 1.0 single-value range primitive; multi-thumb and product-specific scales remain outside Core                                  |
| FileInput   | planned     | `@nerio-ui/ui`        | Approved Core 1.0 native file selection without upload workflow ownership                                                                    |
| Calendar    | planned     | `@nerio-ui/ui/client` | Approved Core 1.0 single-date calendar grid; ranges, events, availability, and scheduling remain outside Core                                |
| DatePicker  | planned     | `@nerio-ui/ui/client` | Approved Core 1.0 bounded single-date control composed from Calendar and Core overlays                                                       |

### Input-family roadmap

The canonical native and composite platform boundary lives in
`docs/core-platform-primitive-coverage.md`. Input provides the supported native path for date,
month, week, time, and `datetime-local` values without a second component identity. Slider,
FileInput, Calendar, and DatePicker are approved planned Core components above and are implemented
only by #259–#262.

| Component                                                                            | Tier            | Status | Boundary                                                                                                                              |
| ------------------------------------------------------------------------------------ | --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| SearchInput                                                                          | Core candidate  | future | Composes Input and InputGroup for a query, icon, and optional accessible clear action; it never owns results, fetching, or filtering. |
| PasswordInput                                                                        | Core candidate  | future | Composes Input and InputGroup for an accessible visibility action; it never owns password policy.                                     |
| Combobox / NumberField / OTPInput                                                    | Core candidates | future | Candidates only; no public API is committed.                                                                                          |
| DateRangePicker / DateTimePicker / DatePickerWithPresets / NaturalLanguageDatePicker | Pro             | future | Product-ready date workflows.                                                                                                         |
| GlobalSearch / EntitySearch / AdvancedSearch / CommandPalette / FilterBar            | Pro             | future | Result fetching, workflow behavior, and product-level search/filter composition.                                                      |

### Overlays

| Component     | Status      | Package               | Notes                                                                                                                     |
| ------------- | ----------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Dialog        | stable-core | `@nerio-ui/ui/client` | Modal primitive with title, description, localizable close, controlled state, ref, and Base UI focus behavior             |
| Sheet         | stable-core | `@nerio-ui/ui/client` | Modal side-panel primitive with neutral close composition, safe-area layout, four sides, sizes, and shared overlay motion |
| Popover       | stable-core | `@nerio-ui/ui/client` | Floating content with optional context, controlled state, ref, and overlay tokens                                         |
| Tooltip       | stable-core | `@nerio-ui/ui/client` | Short non-essential contextual help through Base UI                                                                       |
| Dropdown Menu | stable-core | `@nerio-ui/ui/client` | Basic menu with disabled and destructive items                                                                            |

### Data display

| Component | Status      | Package        | Notes                                                                                                                                                     |
| --------- | ----------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card      | stable-core | `@nerio-ui/ui` | Composable surface with verified visual placement, header action, semantic root, narrow layout, focus, and heading contracts                              |
| Badge     | stable-core | `@nerio-ui/ui` | Status and metadata                                                                                                                                       |
| Avatar    | stable-core | `@nerio-ui/ui` | User/entity avatar with verified image transitions, aspect-ratio cropping, accessible naming, and fallback behavior                                       |
| Table     | stable-core | `@nerio-ui/ui` | Native table anatomy with runtime-safe named keyboard-scroll opt-in, tbody-only row states, responsive and RTL overflow, and consumer-owned data behavior |
| List      | stable-core | `@nerio-ui/ui` | Structured list with stable IDs, visible ordered markers, native links, and package-agnostic router rendering                                             |
| Item      | stable-core | `@nerio-ui/ui` | Generic composition primitive with composed render/forwarded refs, responsive content/media/actions, and consumer-owned interaction                       |
| Separator | stable-core | `@nerio-ui/ui` | Layout divider                                                                                                                                            |
| KeyValue  | stable-core | `@nerio-ui/ui` | Simple definition-list value display                                                                                                                      |
| Stat      | stable-core | `@nerio-ui/ui` | Basic metric display. Advanced KPI cards belong to Pro.                                                                                                   |

### Feedback

| Component   | Status      | Package               | Notes                                                                                                                                                                                                                                               |
| ----------- | ----------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alert       | stable-core | `@nerio-ui/ui`        | Inline feedback with persistent semantic context                                                                                                                                                                                                    |
| Toast       | stable-core | `@nerio-ui/ui/client` | Bottom-centered stack with smaller cards stepping upward, standard Button actions and icon dismissal, reset copy margins, floating elevation, unified enter/expand/swipe/dismiss transforms, inherited RTL, lifecycle, priority, and clean installs |
| Progress    | stable-core | `@nerio-ui/ui`        | Task-completion progress with required accessible naming, normalized ranges, and tokenized motion                                                                                                                                                   |
| Skeleton    | stable-core | `@nerio-ui/ui`        | Loading placeholder                                                                                                                                                                                                                                 |
| Empty State | stable-core | `@nerio-ui/ui`        | Composable media, header, actions, size, alignment, role guidance, and responsive stacking                                                                                                                                                          |
| Spinner     | stable-core | `@nerio-ui/ui`        | Loading indicator                                                                                                                                                                                                                                   |

### Navigation and layout

| Component         | Status      | Package               | Notes                                                                                                                                                         |
| ----------------- | ----------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tabs              | stable-core | `@nerio-ui/ui/client` | Compound tabs with verified controlled state, disabled skipping, variants, overflow, RTL indicator, focus, hydration, and motion                              |
| Breadcrumbs       | stable-core | `@nerio-ui/ui`        | Hierarchy navigation with ordered list semantics and explicit current-page support                                                                            |
| Pagination        | stable-core | `@nerio-ui/ui`        | Link, button, and static pagination with outline defaults, secondary current-state parity, boundaries, ellipsis, router rendering, density, wrapping, and RTL |
| Sidebar Primitive | stable-core | `@nerio-ui/ui/client` | Stateful layout primitive with a bounded rail, stable native refs, server-safe regions, accessible collapse, physical sides, and consumer-owned data          |
| Command Primitive | stable-core | `@nerio-ui/ui/client` | Label-only selected queries, separate keyword matching, sound groups, explicit row layout, semantic leading content, and accessible states                    |

---

## Pro components

### Data-heavy UI

| Component       | Status  | Package         | Notes                                              |
| --------------- | ------- | --------------- | -------------------------------------------------- |
| DataGrid        | planned | `@nerio-ui/pro` | Sorting, filtering, column visibility, saved views |
| Advanced Table  | planned | `@nerio-ui/pro` | Bulk actions, density, row actions                 |
| Filter Bar      | planned | `@nerio-ui/pro` | Complex filters                                    |
| Saved Views     | planned | `@nerio-ui/pro` | Named table/filter states                          |
| Column Settings | planned | `@nerio-ui/pro` | Visibility and ordering                            |

### Dashboards

| Component       | Status  | Package         | Notes                                                                     |
| --------------- | ------- | --------------- | ------------------------------------------------------------------------- |
| KPI Card        | planned | `@nerio-ui/pro` | Advanced metric with trend, comparison, state, actions, and chart context |
| KPI Group       | planned | `@nerio-ui/pro` | Dashboard metric cluster                                                  |
| Trend Chip      | planned | `@nerio-ui/pro` | Positive/negative/neutral movement                                        |
| Chart Card      | planned | `@nerio-ui/pro` | Chart wrapper and metadata                                                |
| Activity Feed   | planned | `@nerio-ui/pro` | Product activity timeline                                                 |
| Analytics Panel | planned | `@nerio-ui/pro` | Advanced dashboard section                                                |

### SaaS and admin

| Component           | Status  | Package         | Notes                              |
| ------------------- | ------- | --------------- | ---------------------------------- |
| AppShell            | planned | `@nerio-ui/pro` | Full application layout            |
| AppSidebar          | planned | `@nerio-ui/pro` | Workspace switcher, nav, user menu |
| Settings Layout     | planned | `@nerio-ui/pro` | Settings page structure            |
| Billing Settings    | planned | `@nerio-ui/pro` | Plan, invoices, payment method     |
| Team Members        | planned | `@nerio-ui/pro` | Members and invites                |
| Roles & Permissions | planned | `@nerio-ui/pro` | Permission UI                      |
| Audit Log           | planned | `@nerio-ui/pro` | Security/admin log                 |

### Documentation UI

| Component              | Status  | Package         | Notes                                                      |
| ---------------------- | ------- | --------------- | ---------------------------------------------------------- |
| Documentation Shell    | planned | `@nerio-ui/pro` | Full docs layout with header, sidebar, content, and TOC    |
| Documentation Header   | planned | `@nerio-ui/pro` | Product identity, version, search, theme, and repo actions |
| Documentation Sidebar  | planned | `@nerio-ui/pro` | Grouped documentation navigation with active states        |
| Page Table of Contents | planned | `@nerio-ui/pro` | Sticky in-page navigation generated from headings          |
| Documentation Search   | planned | `@nerio-ui/pro` | Search command pattern for docs discovery                  |

### Finance and crypto

| Component           | Status  | Package         | Notes                       |
| ------------------- | ------- | --------------- | --------------------------- |
| Portfolio Card      | planned | `@nerio-ui/pro` | Portfolio summary           |
| Asset Row           | planned | `@nerio-ui/pro` | Asset/token row             |
| Transaction List    | planned | `@nerio-ui/pro` | Crypto/finance transactions |
| Wallet Connector UI | planned | `@nerio-ui/pro` | Wallet connection pattern   |
| Balance Visibility  | planned | `@nerio-ui/pro` | Hide/show sensitive values  |
| PnL Components      | planned | `@nerio-ui/pro` | Profit/loss display         |
| Risk Badge          | planned | `@nerio-ui/pro` | Risk status indicator       |

### AI interfaces

| Component       | Status  | Package         | Notes                              |
| --------------- | ------- | --------------- | ---------------------------------- |
| AI Chat Shell   | planned | `@nerio-ui/pro` | Full chat interface                |
| Prompt Input    | planned | `@nerio-ui/pro` | AI prompt composer                 |
| Message         | planned | `@nerio-ui/pro` | Assistant/user message             |
| Sources         | planned | `@nerio-ui/pro` | Citations/source display           |
| Tool Call       | planned | `@nerio-ui/pro` | Tool execution UI                  |
| Reasoning Block | planned | `@nerio-ui/pro` | Collapsible reasoning/status block |
| Attachment      | planned | `@nerio-ui/pro` | File attachment UI                 |
| Code Block      | planned | `@nerio-ui/pro` | AI/code response block             |

### Templates

| Template                            | Status  | Package         | Notes                            |
| ----------------------------------- | ------- | --------------- | -------------------------------- |
| Universal Workspace Template        | planned | `@nerio-ui/pro` | General SaaS/admin template      |
| Banking Dashboard Template          | planned | `@nerio-ui/pro` | Fintech dashboard template       |
| Crypto Portfolio Dashboard Template | planned | `@nerio-ui/pro` | Crypto/portfolio template        |
| Admin Settings Template             | planned | `@nerio-ui/pro` | SaaS settings template           |
| Billing Portal Template             | planned | `@nerio-ui/pro` | Subscription management template |
| AI Assistant Template               | planned | `@nerio-ui/pro` | AI product template              |

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
