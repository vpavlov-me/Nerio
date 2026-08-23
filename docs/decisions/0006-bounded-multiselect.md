# ADR 0006: Bounded MultiSelect responsibility

## Status

Proposed — explicit maintainer approval is required before implementation.

## Context

Nerio currently has three adjacent selection contracts:

- `Select` owns one value from a popup collection without text filtering;
- `Combobox` owns one value from a longer, filterable popup collection;
- `CheckboxGroup` owns multiple independent values that remain visibly available as checkboxes.

None of them owns multiple values from a longer, filterable popup collection. Consumers can reach
that outcome by importing Base UI directly or by combining a popup, input, list, and checkboxes, but
that makes each consumer responsible for one coupled interaction contract: virtual focus, multiple
selection, removable selected values, repeated form values, reset, validation, filtering, and
selection announcements.

Issue [#349](https://github.com/vpavlov-me/Nerio/issues/349) requires a decision before source or
public API changes. The accepted Core 1.x parity matrix permits either a bounded Core component or a
deferred outcome. It does not approve implementation by itself.

This spike uses the current `dev` baseline at commit
`3abf7201d045a6ba9f26912eb150ef63479c30b9` and the pinned `@base-ui/react` version `1.7.0`.

## Evidence

### Existing Nerio composition is not sufficient

| Existing contract | Why it remains correct                                                  | Why it does not own this responsibility                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Select`          | One selected value, one popup, no editable query.                       | Changing its value to an array would change its value, form, keyboard, visual, and accessibility contracts.                                                       |
| `Combobox`        | One selected value and an editable query are independently controlled.  | A `multiple` mode would make value types, selected-value rendering, reset, clear, and announcements conditional throughout one public component.                  |
| `CheckboxGroup`   | A short set of independent choices stays visible and directly operable. | Hiding it in a popup and adding a query would replace its fieldset-like presentation with a combobox/listbox focus model and create a second popup state machine. |
| `Badge`           | Static status, metadata, or classification.                             | A removable selected value is an interactive composite item, not a badge action.                                                                                  |
| `Item`            | Generic content anatomy for visible rows.                               | It does not own selection state, virtual focus, or form behavior. It may inform internal item anatomy only.                                                       |

The responsibility is therefore semantic rather than a convenience wrapper. Reimplementing it with
Nerio primitives would not be ordinary composition: the composition would have to invent and
maintain behavior already owned by Base UI.

### Base UI capability is sufficient as the primitive layer

Base UI 1.7.0 exposes a multiple-selection mode on `Combobox.Root`. Its documented multiple example
uses `Combobox.Chips`, `Combobox.Chip`, and `Combobox.ChipRemove` inside the input. The pinned source
also provides these behaviors:

- the popup list uses `role="listbox"` and `aria-multiselectable="true"`;
- options expose selected and highlighted state separately;
- DOM focus stays on the input while `aria-activedescendant` represents list navigation;
- selected chips form a keyboard-navigable toolbar;
- logical arrow keys move between chips, Backspace/Delete removes a chip, and ArrowUp/ArrowDown
  returns to list navigation;
- each selected value is submitted through a repeated hidden input with the same `name`;
- `required` is satisfied only when the multiple selection is non-empty;
- Base UI owns item equality, filtering registration, popup state, and change reasons.

The prototype also establishes one wrapper responsibility: Base UI does not restore the initial
multiple selection after a native form reset. Nerio must own the uncontrolled default restoration
and canceled-reset guard, matching the accepted wrapper strategy already used by `Combobox` and
`CheckboxGroup`.

Nerio does not need a second selection or popup state machine. It needs a thin, Nerio-owned contract
over that existing mode.

### Accessibility standards require an explicit boundary

The WAI-ARIA Authoring Practices listbox pattern supports multiple selection and requires
`aria-multiselectable="true"` when more than one option may be selected. It also requires focus and
selection to remain visually distinguishable.

The APG combobox pattern, however, generally describes one suggested value as the combobox value.
It notes that accepting a suggestion may instead add it to a separate recipient list and clear the
input, but it does not define a complete multi-token combobox contract. Base UI's multiple mode is a
documented extension that combines a combobox input, a multi-select listbox, and a selected-values
toolbar.

Therefore automated roles and attributes are necessary but not sufficient evidence. Any
implementation requires focused VoiceOver and NVDA verification of option toggling, chip traversal,
removal, status announcements, and focus return before the component can advance beyond its initial
prerelease status.

## Proposed decision

Admit a separate, bounded Core `MultiSelect` candidate, implemented only after this ADR is accepted.
It will wrap `BaseCombobox.Root` with `multiple` and reuse the accepted Combobox collection, popup,
filtering, field, and styling families. It will not add `multiple` to Nerio's existing `Combobox`.

The name describes a distinct stable responsibility:

> Select zero or more string values from a finite, locally available, filterable popup collection.

This is a client component. Base UI remains the only interactive primitive layer. Nerio owns the
string-value public API, field anatomy, selected-value presentation, Core-owned fallback copy,
semantic styling, and complete package/source-install contract.

This proposal does not itself add the component to the catalog, Registry, package exports, docs,
API snapshots, or release notes.

## Proposed public API fixture

The implementation PR may refine names for consistency, but it must not broaden the responsibility
without updating and re-approving this decision.

```tsx
export interface MultiSelectOption<Value extends string = string> {
  value: Value;
  label: React.ReactNode;
  textValue: string;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface MultiSelectOptionGroup<Value extends string = string> {
  value: string;
  label: React.ReactNode;
  options: readonly MultiSelectOption<Value>[];
}

export type MultiSelectItems<Value extends string = string> =
  readonly MultiSelectOption<Value>[] | readonly MultiSelectOptionGroup<Value>[];

export interface MultiSelectLabels {
  clear: string;
  toggle: string;
  remove: (textValue: string) => string;
  selected: (textValue: string) => string;
  removed: (textValue: string) => string;
  cleared: string;
}

export type MultiSelectChangeEventReason =
  | "item-press"
  | "chip-remove-press"
  | "clear-press"
  | "escape-key"
  | "input-change"
  | "input-clear"
  | "list-navigation"
  | "outside-press"
  | "focus-out"
  | "trigger-press"
  | "none";

export type MultiSelectChangeEventDetails = NerioChangeEventDetails<MultiSelectChangeEventReason>;

export interface MultiSelectProps<Value extends string = string> {
  label: React.ReactNode;
  options: MultiSelectItems<Value>;
  value?: readonly NoInfer<Value>[];
  defaultValue?: readonly NoInfer<Value>[];
  onValueChange?: (value: Value[], eventDetails: MultiSelectChangeEventDetails) => void;

  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string, eventDetails: MultiSelectChangeEventDetails) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: MultiSelectChangeEventDetails) => void;

  description?: React.ReactNode;
  message?: React.ReactNode;
  name?: string;
  form?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;

  filter?: ((option: MultiSelectOption<Value>, query: string) => boolean) | false;
  locale?: Intl.LocalesArgument;
  loopFocus?: boolean;
  emptyMessage?: React.ReactNode;
  placeholder?: string;
  labels?: Partial<MultiSelectLabels>;
  size?: "sm" | "md" | "lg";
}
```

The initial contract is options-only. Flat and grouped data, React-node labels, descriptions, and
disabled options cover the required generic content without exposing compound item parts or an
alternate popup composition. A composed-item path requires separate API-admission evidence.

The implementation must use the existing Nerio event-detail normalization rather than export Base
UI event types. Exact supported reasons must be reduced to the reasons the implementation can
truthfully produce and covered by contract tests.

## Selected-value presentation

The initial contract supports one presentation only: removable text values rendered inside the
input group. Each selected value uses its option `textValue` for the visible chip text and accessible
remove label. Rich option content stays in the list; it is not copied into a chip.

The initial contract deliberately does not expose:

- a summary-only mode such as "5 selected";
- a configurable visible-chip limit;
- a generic `renderValue` callback or selected-value slot;
- a consumer-supplied chip component;
- value reordering or drag-and-drop.

Those choices keep every selected value directly keyboard-operable and keep selected-value
rendering out of product-filter territory. A summary or custom slot may be reconsidered only with
separate evidence for overflow, keyboard access, accessible naming, and API admission. Consumers
that require those policies should own their composition for now.

The control must wrap and reflow without clipping selected values or the query input at 320 CSS
pixels, 200% zoom, text-spacing overrides, long localized labels, and RTL. No fixed chip count is a
substitute for resilient layout.

## State and form contract

- Selection, query, and popup state are three independent controlled/uncontrolled pairs.
- In controlled mode, interaction emits the proposed next state and never mirrors ownership
  internally.
- In uncontrolled mode, form reset restores `defaultValue`, restores `defaultQuery`, and closes the
  popup. A canceled reset changes nothing.
- Values are unique strings and preserve selection order. Duplicate option values are rejected.
- Every selected value must resolve to a current option. Unknown values are not rendered, submitted,
  announced, or counted toward `required`; development builds should report the contract error.
- A selected disabled option remains visible and submitted but cannot be toggled from the popup or
  removed through its chip. The consumer must enable it or update controlled state explicitly.
- With `name`, form submission emits one entry per selected value in selection order.
- `required` means at least one known selected value. Invalid focus is redirected to the visible
  input, never left on a hidden validation control.
- Root `disabled` removes all submitted values and interaction. `readOnly` preserves submission and
  focusable inspection while blocking selection, removal, and clear-all.
- Clear-all empties selection and the current query, leaves popup ownership unchanged, and returns
  focus to the input. Controlled callbacks still emit proposed next states without mirroring them.

Form/reset and controlled-state behavior must be tested through Nerio's public string API rather
than inferred from Base UI's object-value internals.

## Keyboard and announcement contract

The implementation must preserve Base UI's focus model and add no competing handlers except where a
Nerio contract is explicitly tested:

- Tab enters and leaves the field once; selected chips are reached from the input with logical arrow
  navigation rather than added as independent tab stops.
- ArrowUp/ArrowDown opens or navigates the list; highlighted and selected options remain distinct.
- Enter toggles the highlighted option without replacing the other values.
- Escape closes the popup. When the popup is already closed, Escape does not clear selection; the
  wrapper must cancel Base UI's closed-state multiple-clear behavior.
- Backspace on an empty query removes the last removable value; Backspace/Delete on a focused chip
  removes that value; logical arrows traverse chips in LTR and RTL.
- Disabled options and disabled chips are discoverable but not operable.
- After removal or clear-all, focus returns to the input and the field remains usable.

A permanently mounted polite status region must announce selection changes. Default English copy
must be concise, and every Core-owned string must be overridable through `labels`. Item presses,
chip removals, and clear-all announce the affected `textValue`; query changes and popup navigation do
not create redundant live announcements. The popup's selected state and chip text remain available
without relying on the live region.

Automated accessibility tests must verify names, descriptions, errors, roles, selected/disabled
states, live-region updates, and no axe violations. Browser tests must verify real key sequences,
focus, form values, reset, LTR/RTL chip traversal, and reflow. Manual VoiceOver and NVDA evidence is
required before the initial release status can advance.

## Ownership boundary

Core owns:

- finite local option registration and locale-aware synchronous filtering;
- multiple selection, query, and popup state;
- field relationships, disabled/read-only/invalid/required behavior;
- repeated form values and reset;
- removable selected values, clear-all, focus, keyboard behavior, and announcements;
- flat and grouped options with disabled items;
- package, Registry, source-install, docs, types, and semantic styling parity.

Core does not own:

- fetching, async result lifecycles, caching, pagination, or remote errors;
- creating options, free-form tokens, tagging rules, or validation of business entities;
- virtualization or infinite lists;
- minimum/maximum selection policy, quotas, or conditional availability rules;
- FilterBar, saved views, query-string serialization, persistence, analytics, or bulk actions;
- rich domain chips, avatars, entity actions, value reordering, or product-specific summaries.

Those responsibilities remain consumer-owned or may justify a later Pro composition.

## Rejected alternatives

### Add `multiple` to Nerio `Combobox`

Rejected because one boolean would change the public value from `Value | null` to `Value[]`, add
conditional selected-value anatomy, change form encoding and reset, and introduce multi-selection
announcements. Base UI can model that conditional generic internally; Nerio's restrained public API
should keep the two responsibilities explicit.

### Compose `CheckboxGroup` inside `Popover`

Rejected because it creates a second popup/query/focus implementation, hides controls whose accepted
responsibility is to stay visible, and does not provide listbox virtual focus or chip navigation.

### Publish only a recipe around Base UI

Rejected because every consumer would still own the coupled accessibility, state, form, reset, and
announcement contract. This is precisely the repeated domain-agnostic behavior Core exists to own.

### Add summary and arbitrary value slots in the first version

Rejected because they introduce overflow and keyboard policies before evidence establishes one
stable accessible contract. Removable text values are the smallest complete presentation.

### Defer the component entirely

Still a valid maintainer outcome. If this proposal is not accepted, no public implementation should
land. Nerio should instead strengthen `Combobox` and `CheckboxGroup` guidance and leave Base UI
multiple composition consumer-owned.

## Consequences

- Nerio can own one reusable multi-selection field without absorbing product filtering.
- `Combobox` and `CheckboxGroup` retain their accepted single-responsibility contracts.
- The implementation can reuse Base UI instead of forking interaction behavior.
- Removable text values provide a complete initial interaction but intentionally do not optimize
  very large selected sets; those use cases require new evidence.
- The component begins at an evidence-based prerelease status and cannot advance on automated ARIA
  checks alone.
- Accepting this ADR triggers a separate source-first implementation PR; it does not authorize a
  release, `main` promotion, or Pro expansion.

## Implementation sequence after approval

1. Add the catalog entry at the approved prerelease status and derive synchronized projections.
2. Implement the public string-value wrapper over Base UI Combobox multiple mode.
3. Add selected-value chips, clear-all, overridable labels, and a polite announcement region.
4. Verify controlled/uncontrolled selection, query, popup, form, reset, required, disabled, and
   read-only behavior.
5. Synchronize package exports, Registry, CLI/MCP fixtures, docs, `llms.txt`, API snapshots, examples,
   tests, visual fixtures, budgets, and release notes.
6. Complete browser, RTL, reflow, forced-colors, reduced-motion, VoiceOver, and NVDA evidence before
   changing the initial release status.

## Spike validation boundary

Before this ADR is accepted, the decision PR must prove:

- the proposed API fixture type-checks without Base UI types in the public surface;
- a Base UI 1.7.0 prototype exposes a multi-select listbox, keyboard-operable selected values,
  repeated form entries, and required validity, while a thin Nerio-style owner restores the initial
  selection on uncanceled form reset;
- docs/decision validation and formatting pass;
- `quality/public-api-snapshot.json` is unchanged;
- no catalog, Registry, package export, source component, or release-note change is included.

## References

- [Base UI Combobox documentation](https://base-ui.com/react/components/combobox)
- [Base UI 1.7.0 release notes](https://base-ui.com/react/overview/releases/v1-7-0)
- [WAI-ARIA APG Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
- [WAI-ARIA APG Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [Nerio Core UI implementation best practices](../core-ui-best-practices.md)
- [Nerio Core 1.x capability parity](../core-1-x-capability-parity.md)
- [Direction, RTL, and localization](../direction-localization.md)
- [Issue #349](https://github.com/vpavlov-me/Nerio/issues/349)
