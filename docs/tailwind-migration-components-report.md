# Tailwind component migration report

## Actions and Forms

The first #173 family slice migrates ButtonGroup, Textarea, Label and LabelHint, Field, FormMessage,
FormGroup, InputGroup, Checkbox, RadioGroup, Switch, and Select. Button and Input were already migrated
by the accepted #172 pilot. Public props, variants, refs, Base UI composition, form participation,
ARIA wiring, slots, state attributes, runtime variables, RTL behavior, density, reduced motion, and
forced-colors behavior remain unchanged.

Ordinary visual rules now live in complete static Tailwind CSS v4 class strings. Root components use
`tailwindCn` so consumer utilities remain the last deterministic conflict winner. Registry installs
include the token bridge and class merge helper for every migrated item.

The former `button-group.css`, `forms.css`, and `input-group.css` implementations are deleted.
`select.css` retains only `n-select-popup-in` and `n-select-popup-out`: named keyframes are residual CSS
under the accepted policy, while Select layout, surface, typography, state, and motion application are
owned by the component's Tailwind recipe.

The handwritten `packages/ui/src/styles` directory is 63,837 bytes after this slice, 22,000 bytes
smaller than the accepted pilot baseline. The reduction removes duplicate visual implementations; it
does not change token values or public component APIs.

Validation for the slice covers UI contracts, accessibility, catalog and token projections, docs,
CLI and MCP source installs, package and source-consumer builds with and without Preflight, production
builds, and browser comparison across the supported runtime axes.

## Remaining sequence

1. Foundation, Data Display, Feedback, and Progress.
2. Navigation, Layout, and Overlays.
