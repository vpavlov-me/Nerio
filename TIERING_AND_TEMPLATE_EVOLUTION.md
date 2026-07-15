# Nerio tiering and template evolution

This document defines how Nerio Core, Nerio Pro, and product templates evolve together without forcing the Core roadmap to match template needs component by component.

## Core principle

Core, Pro, and Templates develop at different speeds and serve different purposes.

- **Core** provides stable, universal building blocks.
- **Pro** provides reusable product-ready compositions and advanced workflows.
- **Templates** demonstrate complete product scenarios and may include template-local components.

A template does not need to be implemented entirely from released Core components.

Core must not be expanded prematurely only because one template needs a missing UI element.

## Layer responsibilities

The four-owner model in `docs/core-ui-best-practices.md` applies to tiering decisions: the maintainer
owns visual language, Core owns reusable technical primitive contracts, consumers own application
policy and composition, and Pro owns reusable product-ready workflows. A capability must not move
between those owners merely because one implementation would become shorter.

### Nerio Core

A component belongs in Core when it is:

- domain-agnostic;
- useful across many digital products;
- semantically independent;
- small enough to compose into larger patterns;
- supported by a clear accessibility contract;
- expected to have a stable and intentionally small API;
- useful as a dependency for multiple Pro components or templates.

Examples include Button, Input, Badge, Counter, Chip, Tabs, Dialog, Table, Avatar, Tooltip, Popover, and Progress.

Core should provide a coherent UI language. It is not required to provide complete product workflows.

### Nerio Pro

A component or pattern belongs in Pro when it:

- composes multiple Core components into a reusable product solution;
- contains opinionated product structure;
- supports a complex workflow;
- includes domain-specific behavior or data presentation;
- saves substantial implementation and design time;
- remains useful across more than one screen, product, or template.

Examples include FilterBar, KPI Card, Asset Row, Transaction List, App Sidebar, Settings Header, Billing Plan Card, Portfolio Summary, Command Palette, and advanced DataGrid patterns.

Pro may depend on Core. Core must never depend on Pro.

### Templates

A template represents a complete product scenario, screen, or application direction.

Examples include:

- crypto portfolio dashboard;
- SaaS settings;
- billing portal;
- team management;
- AI workspace.

A template may use:

1. released Core components;
2. released or experimental Pro components;
3. template-local components and sections.

Template-local components are an intentional part of the architecture. They are not automatically missing design-system components.

## Template-local components

Create a component locally inside a template when:

- it is currently needed by only that template;
- its API is still changing rapidly;
- its structure is strongly tied to the template content or layout;
- there is not yet evidence that it should become reusable;
- promoting it would require speculative variants or abstractions.

Example structure:

```text
templates/
  crypto-dashboard/
    components/
      dashboard-hero.tsx
      portfolio-overview-section.tsx
      recent-transactions-section.tsx
```

Template-local components may be visually complex. Visual complexity alone does not justify promotion into Pro or Core.

## Maturity model

Use the following maturity stages for UI patterns discovered during template work.

### 1. Local pattern

The component exists only inside a template.

Characteristics:

- optimized for speed of exploration;
- may use a narrow, template-specific API;
- may change without compatibility guarantees;
- is not published through the Core or Pro registry.

Default uncertain components to this stage.

### 2. Pro candidate

Promote a local pattern toward Pro when it:

- repeats across templates or product areas;
- has recognizable standalone product value;
- has a reusable composition model;
- still contains product structure, workflow logic, or domain meaning;
- can be generalized without producing a large ambiguous API.

A Pro candidate may remain experimental until its contract is validated.

### 3. Pro component

A Pro component has:

- a deliberate reusable API;
- clear dependencies on Core;
- documented use cases and boundaries;
- product-level value beyond one template;
- appropriate tests, registry metadata, and documentation.

### 4. Core candidate

A pattern should be considered for Core only when template and Pro usage reveal a smaller universal primitive.

For example, an advanced portfolio header may reveal reusable primitives such as:

- Stat;
- Counter;
- Progress;
- KeyValue;
- Sparkline.

Do not move the full product composition into Core when only its underlying building blocks are universal.

### 5. Stable Core component

A component may become `stable-core` only after satisfying the complete Core quality checklist defined in `AGENTS.md` and `COMPONENTS.md`.

## Decision sequence

For every new element discovered while building a template, evaluate it in this order.

### Question 1: Can it reasonably exist outside this template?

- **No:** keep it template-local.
- **Yes:** continue.
- **Unknown:** keep it template-local until evidence appears.

### Question 2: Does it contain product structure, workflow behavior, or domain meaning?

- **Yes:** treat it as a Pro candidate.
- **No:** continue.

### Question 3: Is it a minimal, universal entity with a stable semantic and accessibility contract?

- **Yes:** consider it for Core.
- **No:** keep it in Pro or local to the template.

Uncertainty is not a reason to promote a component. Uncertain boundaries should remain local or experimental.

## Promotion signals

Promote a local pattern only when there is concrete evidence such as:

- repeated use in at least two meaningful contexts;
- duplicated behavior or anatomy;
- a stable responsibility that can be explained in one sentence;
- a clear public API with few conditional props;
- shared accessibility behavior;
- measurable implementation value for users.

Do not promote a pattern solely because:

- it appears visually polished;
- a template needs it;
- it resembles a component from another library;
- it could theoretically be reused later;
- moving it would make the template folder look cleaner.

## Dependency direction

The dependency flow is one-way:

```text
Core -> used by Pro -> used by Templates
Core ----------------> used by Templates
Template-local components remain inside their template
```

Allowed:

- Pro imports Core.
- Templates import Core.
- Templates import Pro.
- Template-local sections compose Core and Pro.

Disallowed:

- Core imports Pro.
- Core imports template code.
- Pro imports template-local code.
- A template-local requirement is added to Core without passing the tiering decision sequence.

## Recommended repository structure

```text
packages/
  ui/                  # Nerio Core
  pro/                 # Reusable advanced compositions
  tokens/
  adapters/

templates/
  crypto-dashboard/
    components/        # Template-local patterns
    pages/
    data/

  saas-settings/
    components/
    pages/
    data/
```

A separate Labs package is optional and should be introduced only when there is enough experimental cross-template work to justify its maintenance cost.

## Workflow for template development

When building or updating a template:

1. Use released Core components wherever they fit semantically.
2. Use existing Pro components for reusable product-level patterns.
3. Implement missing template-specific UI locally.
4. Do not block template work while waiting for complete Core coverage.
5. Record repeated or promising local patterns as Pro candidates.
6. Promote patterns only after their responsibility and API are supported by actual use.
7. Extract smaller universal primitives into Core when repeated usage validates them.
8. Update `COMPONENTS.md`, `data/component-catalog.json`, registry metadata, documentation, and agent context when a promotion becomes official.

## Agent requirements

Agents working in this repository must:

- read this document before changing tier placement or promoting template-local code;
- avoid expanding Core solely to satisfy one template;
- prefer template-local implementation when reuse is unproven;
- identify whether a requested component is Core, Pro, or template-local before implementation;
- call out speculative abstractions and oversized public APIs;
- preserve the dependency direction between Core, Pro, and Templates;
- report any proposed promotion and the evidence supporting it;
- keep public tier metadata aligned when a component changes layers.

## Summary rule

Templates are the proving ground, Pro is the reusable product layer, and Core is the stable universal foundation.

Templates may move quickly. Core should move deliberately.
