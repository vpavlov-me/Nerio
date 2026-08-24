# Core 1.x capability parity and post-1.0 sequence

## Decision

**Accepted planning baseline — 2026-08-06**

Nerio will sequence post-1.0 work by user capability, semantic responsibility, accessibility
contract, and measured product value. Component-count parity with Base UI, shadcn/ui, HeroUI, or any
other library is not a product criterion.

The current Core 1.0 surface is complete for its frozen boundary. The beta.1 technical closure in
#330–#336 is baseline, not an active competitive gap. Stable 1.0 remains governed by the manual
#143/#146 evidence gates and the existing #148 → #150 → #151 sequence.

No Core 1.0 runtime, package, Registry, token, export, or API snapshot changed in this decision.
Roadmap #152 authorizes #342 on `dev` before #151 while the isolated stable candidate remains
unchanged. Other forward tracks retain their recorded dependencies.

The canonical machine-readable projection is
[`quality/core-1-x-capability-parity.json`](../quality/core-1-x-capability-parity.json).

## Evidence boundary

The decision uses the exact `dev` baseline
[`930890b9c450da7674a3274360bcada8fc99300a`](https://github.com/vpavlov-me/Nerio/tree/930890b9c450da7674a3274360bcada8fc99300a),
Registry schema `1.1.0`, 46 Registry items, published version `1.0.0-beta.1`, Base UI `1.6.0`, and
public API snapshot hash
`248544c8b546a702c3f9415729ecc3eba298019000ae402c7e5a551275f7e9a3`.

The machine-readable projection tracks the current reviewed API snapshot separately, so additive
post-decision documentation routes do not rewrite this pinned evidence boundary.

Sources were retrieved on 2026-08-06:

- [Nerio `dev` baseline](https://github.com/vpavlov-me/Nerio/tree/930890b9c450da7674a3274360bcada8fc99300a)
- [Nerio Core 1.0 roadmap #152](https://github.com/vpavlov-me/Nerio/issues/152)
- [Base UI component documentation](https://base-ui.com/react/components/accordion)
- [Base UI releases](https://base-ui.com/react/overview/releases)
- [Base UI 1.6.0 package metadata](https://www.npmjs.com/package/@base-ui/react/v/1.6.0)
- [shadcn/ui component index](https://ui.shadcn.com/docs/components)
- [HeroUI component index](https://heroui.com/en/docs/react/components)

Competitor evidence identifies user expectations and meaningful interaction contracts. It does not
authorize copying APIs, styles, names, implementation, or tier boundaries. Base UI remains Nerio's
only interactive primitive layer.

## Classification rules

| Classification       | Meaning                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| Existing Core        | The frozen Core surface already owns the capability.                            |
| Native guidance      | Native HTML or browser behavior is the preferred public contract.               |
| Core 1.1 primitive   | A bounded additive primitive is accepted after stable 1.0.                      |
| Core 1.2 primitive   | A bounded additive primitive is accepted for the Core 1.2 tranche.              |
| Later Core candidate | A decision, evidence tranche, or platform dependency is still required.         |
| Core recipe          | A tested copyable composition is better than a public component API.            |
| Adapter              | An optional integration or deterministic interchange layer owns the capability. |
| Pro                  | A reusable product-ready composition or workflow owns the capability.           |
| Consumer-owned       | The application owns the policy, data, routing, or one-product composition.     |
| Rejected             | Nerio intentionally does not plan a dedicated maintained surface.               |

For every accepted component or API, the public API admission rule in
[`docs/core-ui-best-practices.md`](./core-ui-best-practices.md) remains mandatory. A matrix
classification is roadmap permission, not implementation approval without the linked focused issue.

## Current Core coverage

These grouped rows cover every current Core catalog identity. Grouping avoids turning the matrix
into a list of visual synonyms while still preserving exact component evidence.

| Capability                                                                                                                     | Current Nerio evidence                                                        | Base UI or native contract                                                                   | Decision        |
| ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------- |
| <!-- capability:foundation-runtime-and-tokens classification:existing-core priority:none target:current --> Runtime and tokens | Tokens, Themes, Modes, Density, typography/radius/motion/contrast foundations | CSS variables and current runtime-axis policy                                                | Existing Core   |
| <!-- capability:integration-foundations classification:existing-core priority:none target:current --> Integration foundations  | Motion Adapter, Icon, Icon Adapter, Kbd                                       | Optional peer isolation and semantic SVG/keyboard notation                                   | Existing Core   |
| <!-- capability:actions classification:existing-core priority:none target:current --> Actions                                  | Button, Toggle, ButtonGroup                                                   | Base UI Button and Toggle plus native form behavior                                          | Existing Core   |
| <!-- capability:form-foundations classification:existing-core priority:none target:current --> Form foundations                | Input, InputGroup, Textarea, Label, Field, Form Message, FormGroup, FileInput | Native inputs plus Base UI field/form relationships where used                               | Existing Core   |
| <!-- capability:selection-and-range classification:existing-core priority:none target:current --> Selection and range          | Checkbox, Radio Group, Switch, Select, Slider                                 | Base UI selection primitives and native form contracts                                       | Existing Core   |
| <!-- capability:single-date classification:existing-core priority:none target:current --> Single date                          | Calendar and DatePicker                                                       | Nerio-owned grid and Popover composition                                                     | Existing Core   |
| <!-- capability:overlay-foundations classification:existing-core priority:none target:current --> Overlay foundations          | Dialog, Sheet, Popover, Tooltip                                               | Base UI Dialog, Drawer, Popover, and Tooltip                                                 | Existing Core   |
| <!-- capability:menu-foundation classification:existing-core priority:none target:current --> Menu foundation                  | Dropdown Menu convenience and compound APIs                                   | Base UI Menu                                                                                 | Existing Core   |
| <!-- capability:data-display classification:existing-core priority:none target:current --> Data display                        | Card, Badge, Avatar, Table, Item, List, Separator, Key Value, Stat            | Native semantics plus Base UI Avatar/Separator where useful                                  | Existing Core   |
| <!-- capability:feedback classification:existing-core priority:none target:current --> Feedback                                | Alert, Toast, Progress, Skeleton, Empty State, Spinner                        | Native progress and Base UI Toast                                                            | Existing Core   |
| <!-- capability:navigation-and-command classification:existing-core priority:none target:current --> Navigation and command    | Tabs, Breadcrumbs, Pagination, Sidebar Primitive, Command Primitive           | Base UI Tabs/Autocomplete plus native links and landmarks                                    | Existing Core   |
| <!-- capability:native-html-guidance classification:native-guidance priority:none target:current --> Native HTML guidance      | Platform coverage matrix                                                      | Native color input, meter, details/summary, select, output, overflow, anchors, and landmarks | Native guidance |

The complete current catalog also includes planned Pro identities. They are classified below rather
than being misreported as missing Core components.

## Accepted Core 1.1 capabilities

| Capability                                                                                                                                     | User problem and accepted boundary                                                                                                                                     | Complexity | Issue                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------ |
| <!-- capability:direction-localization classification:core-1.1-primitive priority:P1 target:Core 1.1 --> Direction and localization            | Inherited direction, logical layout, deterministic locale-sensitive behavior, and overridable Core-owned labels. No translation framework or product catalogs.         | High       | [#342](https://github.com/vpavlov-me/Nerio/issues/342) |
| <!-- capability:disclosure-family classification:core-1.1-primitive priority:P1 target:Core 1.1 --> Accordion and Collapsible                  | One independent disclosure and one grouped disclosure family. Native `details`/`summary` remains the zero-abstraction path.                                            | Medium     | [#343](https://github.com/vpavlov-me/Nerio/issues/343) |
| <!-- capability:compound-dialog-alert-dialog classification:core-1.1-primitive priority:P1 target:Core 1.1 --> Compound Dialog and AlertDialog | Add meaningful compound anatomy and a conservative confirmation responsibility without breaking the convenience Dialog.                                                | High       | [#344](https://github.com/vpavlov-me/Nerio/issues/344) |
| <!-- capability:single-select-combobox classification:core-1.1-primitive priority:P1 target:Core 1.1 --> Single-select Combobox                | One synchronous filtered option set and selected form value. Fetching, creation, virtualization, and multiple selection remain outside Core.                           | High       | [#345](https://github.com/vpavlov-me/Nerio/issues/345) |
| <!-- capability:search-field classification:core-1.1-primitive priority:P1 target:Core 1.1 --> SearchField                                     | One query input, accessible clear action, and search event composed from the form family. Results, requests, debounce, and global shortcuts remain consumer-owned.     | Medium     | [#346](https://github.com/vpavlov-me/Nerio/issues/346) |
| <!-- capability:number-field classification:core-1.1-primitive priority:P1 target:Core 1.1 --> NumberField                                     | One finite numeric form value with locale, min/max/step, increment/decrement, reset, and deliberate wheel behavior. Currency and parsing policy remain consumer-owned. | High       | [#370](https://github.com/vpavlov-me/Nerio/issues/370) |
| <!-- capability:otp-field classification:core-1.1-primitive priority:P1 target:Core 1.1 --> OTPField                                           | One verification-code form value with paste, deletion, autofill, mobile, and accessible group behavior. Authentication remains consumer-owned.                         | High       | [#347](https://github.com/vpavlov-me/Nerio/issues/347) |
| <!-- capability:grouped-selection classification:core-1.1-primitive priority:P1 target:Core 1.1 --> ToggleGroup and CheckboxGroup              | Two separate semantics delivered as independent slices: grouped pressed state and grouped checkboxes.                                                                  | High       | [#348](https://github.com/vpavlov-me/Nerio/issues/348) |
| <!-- capability:compound-menu-family classification:core-1.1-primitive priority:P1 target:Core 1.1 --> Compound menu family                    | Compatible convenience API plus action and link items, checkbox/radio selection, one-level submenus, descriptions, shortcuts, and bounded positioning.                 | High       | [#350](https://github.com/vpavlov-me/Nerio/issues/350) |

### Direction and localization dependency decision

#342 is a shared track, not a hard requirement to finish a complete repository-wide audit before
every new component can begin. The minimum public direction/localization contract must land first.
After that, component work may proceed in parallel, but a direction-sensitive API cannot merge
until the relevant #342 decision is available and tested.

This removes unnecessary serialization without allowing each component to invent its own `dir`,
locale, copy, arrow-key, formatting, or hydration behavior.

### SearchField and NumberField decision

SearchField and NumberField do not share one semantic or interaction responsibility. SearchField is
a query composition around native search behavior. NumberField is a Base UI-backed numeric value
contract with locale, stepping, bounds, form reset, and wheel policy. [#346](https://github.com/vpavlov-me/Nerio/issues/346)
therefore retains SearchField only; NumberField is split into
[#370](https://github.com/vpavlov-me/Nerio/issues/370).

### MultiSelect decision

<!-- capability:multi-select classification:core-1.2-primitive priority:P2 target:Core 1.2 -->

[#349](https://github.com/vpavlov-me/Nerio/issues/349) completed its Core 1.2 decision spike after
single-select Combobox and CheckboxGroup supplied real composition and accessibility evidence.
[ADR 0006](./decisions/0006-bounded-multiselect.md) accepts a separate bounded component for finite
local options, synchronous filtering, removable text values, repeated form values, reset, and polite
announcements. It does not add `multiple` to Combobox or absorb async data, creation,
virtualization, selection quotas, rich product chips, or FilterBar workflows.

## Later primitive and ownership decisions

| Capability                                                                                                                                       | Classification       | Rationale                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| <!-- capability:context-menu classification:later-core-candidate priority:P3 target:Core 1.2 --> ContextMenu                                     | Later Core candidate | Revisit after the shared menu family is stable; pointer discoverability and equivalent keyboard access need evidence.             |
| <!-- capability:menubar-toolbar-navigation-menu classification:consumer-owned priority:none target:consumer --> Menubar, Toolbar, NavigationMenu | Consumer-owned       | Current need is editor/site/product composition. Button, ToggleGroup, DropdownMenu, links, and routing remain clearer owners.     |
| <!-- capability:preview-card classification:rejected priority:none target:none --> PreviewCard / HoverCard                                       | Rejected             | Low-frequency pointer-first disclosure adds no current universal responsibility; use Popover, Tooltip, or product-owned previews. |
| <!-- capability:autocomplete-suggestions classification:core-recipe priority:P2 target:Core 1.2 --> Free-form autocomplete suggestions           | Core recipe          | Teach Input/SearchField plus consumer suggestions; use Combobox for selected value and Command for actions.                       |
| <!-- capability:advanced-platform-workflows classification:pro priority:P2 target:Pro --> Advanced platform workflows                            | Pro                  | Date ranges, scheduling, uploads, advanced color editing, multi-thumb ranges, and data workflows include product policy.          |
| <!-- capability:library-plumbing classification:consumer-owned priority:none target:consumer --> Base UI library plumbing                        | Consumer-owned       | CSP context and unstable responsive utilities are implementation/configuration details, not Nerio components.                     |

Base UI `ScrollArea` does not create a Nerio gap: native overflow and supported styling remain the
default. Base UI `Meter` maps to native `meter` guidance. Base UI `Drawer` maps to Sheet. Base UI
`Autocomplete` already underpins Command and may support future recipes without becoming a second
selection component.

## Pro disposition

| Capability                                                                                                        | Catalog evidence                                                                           | Decision |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------- |
| <!-- capability:pro-data-and-dashboard classification:pro priority:P2 target:Pro --> Data and dashboard workflows | DataGrid, Advanced Table, Filter Bar, Saved Views, Column Settings, KPI and chart families | Pro      |
| <!-- capability:pro-product-surfaces classification:pro priority:P2 target:Pro --> Product-ready surfaces         | Application, documentation, finance/crypto, AI, and template catalog identities            | Pro      |

These identities are not missing Core coverage. Core continues to provide the primitives from which
Pro and consumer applications compose them.

## Developer platform and adoption

| Capability                                                                                                                  | Accepted disposition                                                                                                                 | Issue                                                  |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| <!-- capability:package-output classification:later-core-candidate priority:P2 target:Core 1.2 --> Package output           | ADR 0007 accepts unbundled compiled runtime output and a self-contained editable source Registry after measured prototypes.          | [#351](https://github.com/vpavlov-me/Nerio/issues/351) |
| <!-- capability:cli-lifecycle classification:later-core-candidate priority:P2 target:Core 1.2 --> CLI lifecycle             | Modularize first; add lifecycle slices independently; bootstrap waits only for #351.                                                 | [#352](https://github.com/vpavlov-me/Nerio/issues/352) |
| <!-- capability:registry-namespaces classification:later-core-candidate priority:P2 target:Core 1.2 --> Registry namespaces | Reuse the existing integrity/transport/transaction engine after CLI modularization.                                                  | [#353](https://github.com/vpavlov-me/Nerio/issues/353) |
| <!-- capability:mcp-discovery classification:later-core-candidate priority:P2 target:Core 1.2 --> MCP discovery             | Keep #354 focused on bounded read-only discovery and planning from canonical data.                                                   | [#354](https://github.com/vpavlov-me/Nerio/issues/354) |
| <!-- capability:agent-skill classification:core-recipe priority:P2 target:Core 1.2 --> Agent Skill                          | Use #369 as the separate canonical progressive-disclosure skill issue.                                                               | [#369](https://github.com/vpavlov-me/Nerio/issues/369) |
| <!-- capability:component-lab classification:later-core-candidate priority:P3 target:Core 1.2 --> Component Lab             | Existing docs and visual fixtures remain default; build only after a measured prototype proves another surface is worth maintaining. | [#355](https://github.com/vpavlov-me/Nerio/issues/355) |
| <!-- capability:core-recipes classification:core-recipe priority:P2 target:Core 1.2 --> Core recipes                        | Ship a stable-1.0 tranche independently; later recipes wait only for their exact component dependencies.                             | [#356](https://github.com/vpavlov-me/Nerio/issues/356) |
| <!-- capability:figma-interchange classification:adapter priority:P3 target:Ecosystem --> Figma interchange                 | Code-owned export and drift validation are an adapter; a real file and visual approval remain manual.                                | [#357](https://github.com/vpavlov-me/Nerio/issues/357) |

The repository-native Agent Skill is intentionally removed from #354's implementation ownership.
MCP may expose canonical data that the skill references, but the two artifacts must not become one
oversized issue or duplicate their instructions.

## Issue dispositions

| Issue                                                  | Disposition                      | Priority / target | Dependency decision                                                                                                  |
| ------------------------------------------------------ | -------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| [#342](https://github.com/vpavlov-me/Nerio/issues/342) | Retain                           | P1 / Core 1.1     | Ready on dev after #341; minimum contract precedes direction-sensitive API merges, full audit runs in parallel.      |
| [#343](https://github.com/vpavlov-me/Nerio/issues/343) | Retain                           | P1 / Core 1.1     | After #151 and the relevant #342 foundation.                                                                         |
| [#344](https://github.com/vpavlov-me/Nerio/issues/344) | Retain                           | P1 / Core 1.1     | Parallel with other primitive work after relevant #342 foundation.                                                   |
| [#345](https://github.com/vpavlov-me/Nerio/issues/345) | Retain                           | P1 / Core 1.1     | Single-select only; parallel field track.                                                                            |
| [#346](https://github.com/vpavlov-me/Nerio/issues/346) | Split                            | P1 / Core 1.1     | Retain SearchField; NumberField moves to #370.                                                                       |
| [#347](https://github.com/vpavlov-me/Nerio/issues/347) | Retain                           | P1 / Core 1.1     | Base UI 1.6.0 stable OTPField; no auth workflow.                                                                     |
| [#348](https://github.com/vpavlov-me/Nerio/issues/348) | Retain with parallel slices      | P1 / Core 1.1     | ToggleGroup and CheckboxGroup may use separate PRs.                                                                  |
| [#349](https://github.com/vpavlov-me/Nerio/issues/349) | Accept bounded implementation    | P2 / Core 1.2     | Separate options-only MultiSelect after accepted ADR 0006; no async, creation, virtualization, quotas, or FilterBar. |
| [#350](https://github.com/vpavlov-me/Nerio/issues/350) | Retain                           | P1 / Core 1.1     | Complete shared menu anatomy; no ContextMenu/Menubar/NavigationMenu.                                                 |
| [#351](https://github.com/vpavlov-me/Nerio/issues/351) | Accept ADR 0007                  | P2 / Core 1.2     | Unbundled compiled runtime plus a self-contained source Registry; implementation remains one focused follow-up PR.   |
| [#352](https://github.com/vpavlov-me/Nerio/issues/352) | Retain with slices               | P2 / Core 1.2     | Modularization/lifecycle independent; bootstrap waits for #351.                                                      |
| [#353](https://github.com/vpavlov-me/Nerio/issues/353) | Retain                           | P2 / Core 1.2     | Waits for CLI modularization, not full #352.                                                                         |
| [#354](https://github.com/vpavlov-me/Nerio/issues/354) | Split                            | P2 / Core 1.2     | MCP only; Agent Skill moves to #369.                                                                                 |
| [#355](https://github.com/vpavlov-me/Nerio/issues/355) | Retain, decision-first           | P3 / Core 1.2     | Existing fixtures remain default pending measured prototype.                                                         |
| [#356](https://github.com/vpavlov-me/Nerio/issues/356) | Retain with independent tranches | P2 / Core 1.2     | Stable-1.0 tranche does not wait for Core 1.1.                                                                       |
| [#357](https://github.com/vpavlov-me/Nerio/issues/357) | Retain, mixed manual             | P3 / Ecosystem    | Export work after stable; component subset after first 1.1 tranche.                                                  |
| [#369](https://github.com/vpavlov-me/Nerio/issues/369) | Retain separately                | P2 / Core 1.2     | Canonical Agent Skill issue after #151.                                                                              |
| [#370](https://github.com/vpavlov-me/Nerio/issues/370) | Created from split               | P1 / Core 1.1     | Independent NumberField after relevant #342 foundation.                                                              |

## Parallel implementation order

1. Finish #143/#146, then #148 → #150 → #151. This decision does not alter stable 1.0.
2. Land the minimum #342 direction/localization contract.
3. Run these Core 1.1 tracks in parallel:
   - disclosure and overlay: #343, #344;
   - fields: #345, #346, #347, #370;
   - grouped selection and menus: #348, #350;
   - the remaining #342 audit across existing surfaces.
4. Start adoption after #151 without waiting for new primitives:
   - the first #356 stable-1.0 recipe tranche;
   - #369 Agent Skill.
5. Run independent Core 1.2 platform tracks:
   - #351 package-output decision;
   - #352 CLI modularization;
   - #354 MCP discovery;
   - #355 Lab decision/prototype.
6. Start #353 after only the CLI modularization slice. Start CLI bootstrap after only the #351
   package decision. Start #349 after #345 and #348 provide real evidence.
7. Start #357's component-library tranche after the first accepted Core 1.1 subset and the required
   human visual authority are available.

## Measurable acceptance boundary

This planning baseline remains valid only while the validator proves:

- every current catalog component is classified;
- every reviewed Base UI 1.6.0 public primitive is classified;
- every platform coverage decision is represented;
- every issue #342–#357 plus related #369/#370 has one disposition;
- the historical catalog, Registry, Core version, and public API metadata remain pinned to baseline
  commit `930890b9c450da7674a3274360bcada8fc99300a`, while separate current metadata track
  intentional repository changes;
- the exact current catalog schema and hash, Registry schema, item count and hash, Core version,
  Base UI dependency, and approved public API snapshot have not drifted;
- this document, the machine projection, and `ROADMAP.md` agree.

Future implementation PRs must still synchronize source, public types, catalog, `COMPONENTS.md`,
Registry, CLI/MCP, docs, `llms.txt`, fixtures, tests, API snapshots, release notes, and validation
when their actual public contract changes.
