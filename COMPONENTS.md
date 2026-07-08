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

---

## Core components

### Foundation

| Component / Area | Status | Package | Notes |
|---|---|---|---|
| Tokens | Planned | `@nerio/tokens` | Color, spacing, radius, typography, motion |
| Themes | Planned | `@nerio/tokens` | `purple-light`, `neutral-light`, `neutral-dark`, `fintech-blue-light` |
| Typography | Planned | `@nerio/ui` | Text, heading, code primitives |
| Icon Adapter | Planned | `@nerio/adapters` | Adapter API, Lucide default implementation |

### Actions

| Component | Status | Package | Notes |
|---|---|---|---|
| Button | Planned | `@nerio/ui` | Variants, sizes, loading, icon slots |
| IconButton | Planned | `@nerio/ui` | Accessible icon-only action |
| Link | Planned | `@nerio/ui` | Styled link primitive |

### Forms

| Component | Status | Package | Notes |
|---|---|---|---|
| Input | Planned | `@nerio/ui` | Text input |
| Textarea | Planned | `@nerio/ui` | Multiline input |
| Label | Planned | `@nerio/ui` | Accessible form label |
| Field | Planned | `@nerio/ui` | Label, help text, error, description |
| FormGroup | Planned | `@nerio/ui` | Form layout primitive |
| Checkbox | Planned | `@nerio/ui` | Basic checkbox |
| Radio Group | Planned | `@nerio/ui` | Basic radio selection |
| Switch | Planned | `@nerio/ui` | Toggle control |
| Select | Planned | `@nerio/ui` | Base select |

### Overlays

| Component | Status | Package | Notes |
|---|---|---|---|
| Dialog | Planned | `@nerio/ui` | Modal primitive |
| Sheet | Planned | `@nerio/ui` | Basic side panel |
| Popover | Planned | `@nerio/ui` | Floating content |
| Tooltip | Planned | `@nerio/ui` | Short contextual help |
| Dropdown Menu | Planned | `@nerio/ui` | Basic menu |

### Data display

| Component | Status | Package | Notes |
|---|---|---|---|
| Card | Planned | `@nerio/ui` | Surface primitive |
| Badge | Planned | `@nerio/ui` | Status and metadata |
| Avatar | Planned | `@nerio/ui` | User/entity avatar |
| Table | Planned | `@nerio/ui` | Basic table only |
| List | Planned | `@nerio/ui` | Basic list primitive |
| Separator | Planned | `@nerio/ui` | Layout divider |

### Feedback

| Component | Status | Package | Notes |
|---|---|---|---|
| Alert | Planned | `@nerio/ui` | Inline feedback |
| Toast | Planned | `@nerio/ui` | Temporary notification |
| Progress | Planned | `@nerio/ui` | Progress indicator |
| Skeleton | Planned | `@nerio/ui` | Loading placeholder |
| Empty State | Planned | `@nerio/ui` | Basic empty state |
| Spinner | Planned | `@nerio/ui` | Loading indicator |

### Navigation and layout

| Component | Status | Package | Notes |
|---|---|---|---|
| Tabs | Planned | `@nerio/ui` | Basic tabs |
| Breadcrumbs | Planned | `@nerio/ui` | Hierarchy navigation |
| Pagination | Planned | `@nerio/ui` | Basic pagination |
| Sidebar Primitive | Planned | `@nerio/ui` | Layout primitive only |
| Command Primitive | Planned | `@nerio/ui` | Basic command structure |

---

## Pro components

### Data-heavy UI

| Component | Status | Package | Notes |
|---|---|---|---|
| DataGrid | Planned | `@nerio/pro` | Sorting, filtering, column visibility, saved views |
| Advanced Table | Planned | `@nerio/pro` | Bulk actions, density, row actions |
| Filter Bar | Planned | `@nerio/pro` | Complex filters |
| Saved Views | Planned | `@nerio/pro` | Named table/filter states |
| Column Settings | Planned | `@nerio/pro` | Visibility and ordering |

### Dashboards

| Component | Status | Package | Notes |
|---|---|---|---|
| KPI Card | Planned | `@nerio/pro` | Metric with trend |
| KPI Group | Planned | `@nerio/pro` | Dashboard metric cluster |
| Trend Chip | Planned | `@nerio/pro` | Positive/negative/neutral movement |
| Chart Card | Planned | `@nerio/pro` | Chart wrapper and metadata |
| Activity Feed | Planned | `@nerio/pro` | Product activity timeline |
| Analytics Panel | Planned | `@nerio/pro` | Advanced dashboard section |

### SaaS and admin

| Component | Status | Package | Notes |
|---|---|---|---|
| AppShell | Planned | `@nerio/pro` | Full application layout |
| AppSidebar | Planned | `@nerio/pro` | Workspace switcher, nav, user menu |
| Settings Layout | Planned | `@nerio/pro` | Settings page structure |
| Billing Settings | Planned | `@nerio/pro` | Plan, invoices, payment method |
| Team Members | Planned | `@nerio/pro` | Members and invites |
| Roles & Permissions | Planned | `@nerio/pro` | Permission UI |
| Audit Log | Planned | `@nerio/pro` | Security/admin log |

### Finance and crypto

| Component | Status | Package | Notes |
|---|---|---|---|
| Portfolio Card | Planned | `@nerio/pro` | Portfolio summary |
| Asset Row | Planned | `@nerio/pro` | Asset/token row |
| Transaction List | Planned | `@nerio/pro` | Crypto/finance transactions |
| Wallet Connector UI | Planned | `@nerio/pro` | Wallet connection pattern |
| Balance Visibility | Planned | `@nerio/pro` | Hide/show sensitive values |
| PnL Components | Planned | `@nerio/pro` | Profit/loss display |
| Risk Badge | Planned | `@nerio/pro` | Risk status indicator |

### AI interfaces

| Component | Status | Package | Notes |
|---|---|---|---|
| AI Chat Shell | Planned | `@nerio/pro` | Full chat interface |
| Prompt Input | Planned | `@nerio/pro` | AI prompt composer |
| Message | Planned | `@nerio/pro` | Assistant/user message |
| Sources | Planned | `@nerio/pro` | Citations/source display |
| Tool Call | Planned | `@nerio/pro` | Tool execution UI |
| Reasoning Block | Planned | `@nerio/pro` | Collapsible reasoning/status block |
| Attachment | Planned | `@nerio/pro` | File attachment UI |
| Code Block | Planned | `@nerio/pro` | AI/code response block |

### Templates

| Template | Status | Package | Notes |
|---|---|---|---|
| Universal Workspace | Planned | `@nerio/pro` | General SaaS/admin template |
| Banking Dashboard | Planned | `@nerio/pro` | Fintech dashboard template |
| Crypto Portfolio Dashboard | Planned | `@nerio/pro` | Crypto/portfolio template |
| Admin Settings | Planned | `@nerio/pro` | SaaS settings template |
| Billing Portal | Planned | `@nerio/pro` | Subscription management template |
| AI Assistant | Planned | `@nerio/pro` | AI product template |

---

## Tiering examples

| Item | Tier | Reason |
|---|---|---|
| Button | Core | Basic reusable action |
| Dialog | Core | Common overlay primitive |
| Basic Table | Core | Generic data display |
| DataGrid | Pro | Advanced data workflow |
| Sidebar Primitive | Core | Layout building block |
| AppSidebar | Pro | Product-ready composition |
| Empty State | Core | Basic feedback pattern |
| Illustrated Empty State templates | Pro | Product-ready pattern library |
| Theme tokens | Core | Foundation |
| Premium themes | Pro | Commercial design asset |
| Command Primitive | Core | Generic command structure |
| Command Palette | Pro | Full product pattern |
| Basic chat primitives | Optional Core | Generic structure only |
| AI Chat Shell | Pro | Full AI product workflow |
