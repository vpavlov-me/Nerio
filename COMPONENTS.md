# Nerio component matrix

This document defines which components belong to Nerio Core and which components belong to Nerio Pro.

## Product rule

Core provides foundations and reusable building blocks.

Pro provides advanced product-ready components, templates, premium themes, Figma assets, and domain-specific patterns.

Core should be good enough to build a real product without a paid license.

Pro should save time on complex SaaS, fintech, crypto, data-rich dashboard, and AI interface work.

## Source of truth

- Human-readable tiering: `COMPONENTS.md`
- Machine-readable tiering: `data/component-catalog.json`
- Product decisions: `DECISIONS.md`
- Agent context: `AGENTS.md`

Keep these files aligned when component scope changes.

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

| Component / Area  | Status              | Package                         | Notes                                                                                                              |
| ----------------- | ------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Tokens            | quality-pass-needed | `@nerio/tokens`                 | Color, spacing, radius, typography, motion                                                                         |
| Themes            | quality-pass-needed | `@nerio/tokens`                 | Brand themes: `purple`, `blue`, `green`, `orange`, `red`, `neutral`; custom themes supported through CSS variables |
| Modes             | quality-pass-needed | `@nerio/tokens`                 | Color modes: `system`, `light`, `dark`                                                                             |
| Density           | quality-pass-needed | `@nerio/tokens`                 | Density modes: `comfortable`, `compact`                                                                            |
| Typography Tokens | quality-pass-needed | `@nerio/tokens`                 | System UI default plus seven official token recipes. Consumer-loaded fonts only; not a v1 runtime axis.            |
| Radius Tokens     | quality-pass-needed | `@nerio/tokens`                 | Token-customizable radius variables. Not a v1 runtime axis.                                                        |
| Motion Tokens     | quality-pass-needed | `@nerio/tokens`                 | Token-customizable duration/motion variables. Not a v1 runtime axis.                                               |
| Contrast Tokens   | planned             | `@nerio/tokens`                 | Token-customizable semantic contrast variables. Not a v1 runtime axis.                                             |
| Typography        | stable-core         | `@nerio/ui`                     | Semantic heading, text, and inline code primitives                                                                 |
| Kbd               | polished            | `@nerio/ui`                     | Native keyboard shortcut notation with quiet tokenized styling                                                     |
| Icon Adapter      | quality-pass-needed | `@nerio/ui` / `@nerio/adapters` | Current `Icon` export in `@nerio/ui`; adapter package remains part of the architecture                             |

### Actions

| Component  | Status                   | Package            | Notes                                                                                          |
| ---------- | ------------------------ | ------------------ | ---------------------------------------------------------------------------------------------- |
| Button     | stable-core              | `@nerio/ui`        | Variants, including link, sizes, loading, icon-only mode, directional icon slots, Kbd, tooltip |
| IconButton | deprecated-compatibility | `@nerio/ui/client` | Deprecated wrapper for Button icon-only mode; retained until the next major release            |

### Forms

| Component   | Status      | Package     | Notes                                                                                                        |
| ----------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------------ |
| Input       | stable-core | `@nerio/ui` | Text input                                                                                                   |
| Textarea    | stable-core | `@nerio/ui` | Multiline input                                                                                              |
| Label       | stable-core | `@nerio/ui` | Accessible form label                                                                                        |
| Field       | stable-core | `@nerio/ui` | Label, help text, error, description                                                                         |
| FormMessage | stable-core | `@nerio/ui` | Field message/error text                                                                                     |
| FormGroup   | stable-core | `@nerio/ui` | Fieldset group with title, description, message, invalid state, and stack, inline, or responsive grid layout |
| Checkbox    | stable-core | `@nerio/ui` | Base UI checkbox for independent options                                                                     |
| Radio Group | stable-core | `@nerio/ui` | Base UI radio selection with label, description, message, and disabled options                               |
| Switch      | stable-core | `@nerio/ui` | Base UI toggle for immediate binary settings                                                                 |
| Select      | stable-core | `@nerio/ui` | Base select                                                                                                  |

### Overlays

| Component     | Status      | Package     | Notes                                                                                             |
| ------------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------- |
| Dialog        | stable-core | `@nerio/ui` | Modal primitive with title, description, close, controlled state, ref, and Base UI focus behavior |
| Sheet         | planned     | `@nerio/ui` | Basic side panel                                                                                  |
| Popover       | stable-core | `@nerio/ui` | Floating content with optional context, controlled state, ref, and overlay tokens                 |
| Tooltip       | stable-core | `@nerio/ui` | Short non-essential contextual help through Base UI                                               |
| Dropdown Menu | stable-core | `@nerio/ui` | Basic menu with disabled and destructive items                                                    |

### Data display

| Component | Status      | Package     | Notes                                                                                                                       |
| --------- | ----------- | ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| Card      | polished    | `@nerio/ui` | Composable surface with visual placement, header action, semantic root, and heading contracts; browser verification remains |
| Badge     | stable-core | `@nerio/ui` | Status and metadata                                                                                                         |
| Avatar    | polished    | `@nerio/ui` | User/entity avatar with image-error fallback; broader image verification remains                                            |
| Table     | polished    | `@nerio/ui` | Basic table with explicit keyboard-scroll opt-in; responsive overflow verification remains                                  |
| List      | polished    | `@nerio/ui` | Structured list with stable IDs and visible ordered markers; router rendering verification remains                          |
| Separator | stable-core | `@nerio/ui` | Layout divider                                                                                                              |
| KeyValue  | stable-core | `@nerio/ui` | Simple definition-list value display                                                                                        |
| Stat      | stable-core | `@nerio/ui` | Basic metric display. Advanced KPI cards belong to Pro.                                                                     |

### Feedback

| Component   | Status      | Package     | Notes                                                                                       |
| ----------- | ----------- | ----------- | ------------------------------------------------------------------------------------------- |
| Alert       | stable-core | `@nerio/ui` | Inline feedback with persistent semantic context                                            |
| Toast       | polished    | `@nerio/ui` | Managed notification with action and localized dismiss API; full stack tests remain         |
| Progress    | polished    | `@nerio/ui` | Progress with explicit ARIA ownership and value normalization; expanded motion tests remain |
| Skeleton    | stable-core | `@nerio/ui` | Loading placeholder                                                                         |
| Empty State | polished    | `@nerio/ui` | Basic empty state with configurable heading semantics; action-composition coverage remains  |
| Spinner     | stable-core | `@nerio/ui` | Loading indicator                                                                           |

### Navigation and layout

| Component         | Status      | Package     | Notes                                                                                     |
| ----------------- | ----------- | ----------- | ----------------------------------------------------------------------------------------- |
| Tabs              | stable-core | `@nerio/ui` | Basic tabs with first-enabled default selection, disabled tabs, controlled state, and ref |
| Breadcrumbs       | stable-core | `@nerio/ui` | Hierarchy navigation with ordered list semantics and explicit current-page support        |
| Pagination        | polished    | `@nerio/ui` | Link and button pagination with consumer-owned state; router rendering coverage remains   |
| Sidebar Primitive | planned     | `@nerio/ui` | Layout primitive only                                                                     |
| Command Primitive | planned     | `@nerio/ui` | Basic command structure                                                                   |

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

| Template                   | Status  | Package      | Notes                            |
| -------------------------- | ------- | ------------ | -------------------------------- |
| Universal Workspace        | planned | `@nerio/pro` | General SaaS/admin template      |
| Banking Dashboard          | planned | `@nerio/pro` | Fintech dashboard template       |
| Crypto Portfolio Dashboard | planned | `@nerio/pro` | Crypto/portfolio template        |
| Admin Settings             | planned | `@nerio/pro` | SaaS settings template           |
| Billing Portal             | planned | `@nerio/pro` | Subscription management template |
| AI Assistant               | planned | `@nerio/pro` | AI product template              |

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
