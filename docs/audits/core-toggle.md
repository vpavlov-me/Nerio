# Toggle Core 1.0 audit

## Responsibility

Toggle is a Core action primitive for one independent button whose pressed state persists. Button
retains momentary actions, Switch retains immediate settings, Checkbox retains selection,
ButtonGroup retains layout, and a future ToggleGroup retains grouped value and keyboard policy.

## Public contract

- Base UI owns native button activation, controlled and uncontrolled pressed state, disabled
  behavior, `aria-pressed`, `data-pressed`, and render composition.
- Nerio exposes `pressed`, `defaultPressed`, `onPressedChange`, `value`, `disabled`, `ghost` and
  `outline` variants, `sm`, `md`, and `lg` sizes, forwarded refs, and the Base UI render contract.
- Icon-only usage requires a stable `aria-label`; visible-label usage accepts children and one
  leading Nerio icon adapter.
- The native root defaults to `type="button"` so Toggle never submits a surrounding form by
  accident.

## Styling layer

Control height, typography, spacing, radius, disabled opacity, focus, and motion reuse existing
system and action-family contracts. Toggle-specific component tokens isolate unpressed, pressed,
hover, active, border, foreground, and icon-size customization. Pressed state remains visible in
forced colors and never depends on animation.

## Verification

Contract coverage protects the type union, refs, state hooks, controlled and uncontrolled state,
event details and cancellation, keyboard and pointer activation, disabled behavior, non-submit
default, focus retention, and render composition. Accessibility coverage protects stable names,
`aria-pressed`, icon-only naming, disabled state, and representative axe output. Registry, CLI,
MCP, docs, browser, visual, package, source-install, catalog, token, runtime-axis, and release gates
protect the remaining distribution surfaces.

## Existing-usage audit

The component, Template, and Block corpus was reviewed before merge for button-owned retained state.
The audit replaces only independent state and preserves existing boundaries:

| Surface                                                                   | Decision                                                                                                                                                                                      |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Finance & Assets` balance visibility                                     | Replaced the stateful icon Button with a controlled icon-only Toggle. The stable `Show balances` name is retained while `aria-pressed` communicates whether values are visible.               |
| `Content Library` loading simulation                                      | Replaced the alternating icon Button with a controlled icon-only Toggle. The deterministic preview mode now exposes one stable `Simulate loading` name.                                       |
| `AI Research Workspace` source loading simulation                         | Replaced the alternating-label Button with a visible-label controlled Toggle.                                                                                                                 |
| Content Library grid/list, Finance period, Support mode/density/direction | Kept outside Toggle because these are mutually exclusive grouped values owned by a future ToggleGroup or another group-selection primitive.                                                   |
| Collection/import empty-state controls and other show/hide actions        | Kept as Button because they trigger disclosure, restoration, or destructive fixture transitions rather than a retained button state.                                                          |
| Core composites, public Blocks, and internal Block fixtures               | No valid independent retained-button state was found. Sidebar uses disclosure semantics, settings use Switch/Checkbox/Select, and deterministic state galleries use momentary Button actions. |

Template catalog metadata and browser coverage record the three valid adoptions. The audit does not
invent a new product setting merely to demonstrate Toggle.

## Explicit non-goals

ToggleGroup, Toolbar, exclusive or multiple group selection, roving focus, arrow-key navigation,
Switch or Checkbox semantics, loading, indeterminate state, validation, form value submission,
application persistence, permissions, formatting policy, filters, and product workflows.
