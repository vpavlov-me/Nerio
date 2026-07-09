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
- `implemented-initial`: first implementation exists, and API or styling may still change.
- `quality-pass-needed`: component exists but still needs an API, accessibility, token, docs, and registry review before it can support Pro work.
- `stable-core`: component passed the Core quality checklist and can safely support future Pro components, templates, registry installs, and AI/MCP usage.
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
| Typography Tokens | quality-pass-needed | `@nerio/tokens`                 | Token-customizable font variables. Not a v1 runtime axis.                                                          |
| Radius Tokens     | quality-pass-needed | `@nerio/tokens`                 | Token-customizable radius variables. Not a v1 runtime axis.                                                        |
| Motion Tokens     | quality-pass-needed | `@nerio/tokens`                 | Token-customizable duration/motion variables. Not a v1 runtime axis.                                               |
| Contrast Tokens   | planned             | `@nerio/tokens`                 | Token-customizable semantic contrast variables. Not a v1 runtime axis.                                             |
| Typography        | planned             | `@nerio/ui`                     | Text, heading, code primitives                                                                                     |
| Icon Adapter      | quality-pass-needed | `@nerio/ui` / `@nerio/adapters` | Current `Icon` export in `@nerio/ui`; adapter package remains part of the architecture                             |

### Actions

| Component  | Status              | Package     | Notes                                |
| ---------- | ------------------- | ----------- | ------------------------------------ |
| Button     | quality-pass-needed | `@nerio/ui` | Variants, sizes, loading, icon slots |
| IconButton | quality-pass-needed | `@nerio/ui` | Accessible icon-only action          |
| Link       | planned             | `@nerio/ui` | Styled link primitive                |

### Forms

| Component   | Status              | Package     | Notes                                |
| ----------- | ------------------- | ----------- | ------------------------------------ |
| Input       | stable-core         | `@nerio/ui` | Text input                           |
| Textarea    | stable-core         | `@nerio/ui` | Multiline input                      |
| Label       | stable-core         | `@nerio/ui` | Accessible form label                |
| Field       | stable-core         | `@nerio/ui` | Label, help text, error, description |
| FormMessage | stable-core         | `@nerio/ui` | Field message/error text             |
| FormGroup   | planned             | `@nerio/ui` | Form layout primitive                |
| Checkbox    | quality-pass-needed | `@nerio/ui` | Basic checkbox                       |
| Radio Group | planned             | `@nerio/ui` | Basic radio selection                |
| Switch      | quality-pass-needed | `@nerio/ui` | Toggle control                       |
| Select      | stable-core         | `@nerio/ui` | Base select                          |

### Overlays

| Component     | Status              | Package     | Notes                 |
| ------------- | ------------------- | ----------- | --------------------- |
| Dialog        | quality-pass-needed | `@nerio/ui` | Modal primitive       |
| Sheet         | planned             | `@nerio/ui` | Basic side panel      |
| Popover       | quality-pass-needed | `@nerio/ui` | Floating content      |
| Tooltip       | quality-pass-needed | `@nerio/ui` | Short contextual help |
| Dropdown Menu | quality-pass-needed | `@nerio/ui` | Basic menu            |

### Data display

| Component | Status              | Package     | Notes                                                   |
| --------- | ------------------- | ----------- | ------------------------------------------------------- |
| Card      | quality-pass-needed | `@nerio/ui` | Surface primitive                                       |
| Badge     | quality-pass-needed | `@nerio/ui` | Status and metadata                                     |
| Avatar    | quality-pass-needed | `@nerio/ui` | User/entity avatar                                      |
| Table     | quality-pass-needed | `@nerio/ui` | Basic table only                                        |
| List      | planned             | `@nerio/ui` | Basic list primitive                                    |
| Separator | quality-pass-needed | `@nerio/ui` | Layout divider                                          |
| KeyValue  | quality-pass-needed | `@nerio/ui` | Simple definition-list value display                    |
| Stat      | quality-pass-needed | `@nerio/ui` | Basic metric display. Advanced KPI cards belong to Pro. |

### Feedback

| Component   | Status              | Package     | Notes                  |
| ----------- | ------------------- | ----------- | ---------------------- |
| Alert       | planned             | `@nerio/ui` | Inline feedback        |
| Toast       | quality-pass-needed | `@nerio/ui` | Temporary notification |
| Progress    | quality-pass-needed | `@nerio/ui` | Progress indicator     |
| Skeleton    | quality-pass-needed | `@nerio/ui` | Loading placeholder    |
| Empty State | quality-pass-needed | `@nerio/ui` | Basic empty state      |
| Spinner     | quality-pass-needed | `@nerio/ui` | Loading indicator      |

### Navigation and layout

| Component         | Status              | Package     | Notes                   |
| ----------------- | ------------------- | ----------- | ----------------------- |
| Tabs              | quality-pass-needed | `@nerio/ui` | Basic tabs              |
| Breadcrumbs       | planned             | `@nerio/ui` | Hierarchy navigation    |
| Pagination        | planned             | `@nerio/ui` | Basic pagination        |
| Sidebar Primitive | planned             | `@nerio/ui` | Layout primitive only   |
| Command Primitive | planned             | `@nerio/ui` | Basic command structure |

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
