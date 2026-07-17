# Tailwind CSS v4 styling contract

## Ownership

Tailwind CSS v4 is Nerio Core's component-style authoring and build engine. Nerio `--n-*` variables
remain the canonical primitive, semantic, and component value layer. Base UI continues to own
interactive behavior. Tailwind utilities may resolve to Nerio variables, but Tailwind configuration
must not duplicate token values or create a second visual implementation.

Nerio supports Tailwind CSS `>=4.0.0 <5`. The pilot is verified with 4.3.x and
`tailwind-merge` 3.6.x.

## Public bridge

Import `@nerio-ui/tokens/styles.css` for Nerio variables and
`@nerio-ui/tokens/tailwind.css` inside a Tailwind-processed stylesheet for the CSS-first
`@theme inline` bridge. Bridge names use the `n` namespace, for example `bg-n-surface`,
`text-n-text-secondary`, and `rounded-n-control`. The bridge exposes stable foundation and semantic
contracts only; component-internal variables are referenced statically in component source.

## Package mode

```css
@import "tailwindcss";
@import "@nerio-ui/tokens/tailwind.css";
@import "@nerio-ui/ui/styles.css";
@source "../node_modules/@nerio-ui/ui/src";
```

The `@source` path is relative to the consumer stylesheet and must point at the installed package
source under the package manager's layout. Consumers using a different layout adjust only that path.

## Source-install mode

Import Tailwind, the installed `styles/tailwind.css`, the installed token stylesheet, and any
documented residual styles. Installed TSX lives in the consumer source tree and is detected normally.
The CLI copies complete static class strings; workspace aliases are not required.

## Preflight

The consumer owns Preflight. Nerio packages never import `tailwindcss` or
`tailwindcss/preflight.css`. Consumers may use the default `@import "tailwindcss"` or import Tailwind's
theme and utilities layers without Preflight. Nerio's compatibility stylesheet scopes box sizing to
Nerio class names while the remaining migration is in progress; it is not a document-wide reset.

## Authoring and overrides

- Use complete, statically detectable class strings. Do not interpolate utility fragments.
- Use Nerio semantic/component variables. Raw Tailwind palette utilities are not Core defaults.
- Use `tailwindCn` for Tailwind-first components so a consumer root `className` deterministically
  replaces conflicting utilities.
- Keep public props, slots, data attributes, Base UI behavior, and package entrypoints unchanged.
- Do not mirror utilities into large `@apply` blocks.

## Residual CSS policy

Residual CSS is allowed only for shared keyframes, selectors that utilities make materially harder to
audit, or compatibility rules for components not yet migrated. It must use Nerio variables, remain
small, and be listed in the migration report. A migrated component must not retain a parallel visual
selector implementation.

The pilot retains shared motion recipes, icon styling, and Dialog keyframes. Button visual CSS is
removed; Input and Dialog visual selectors are removed from their shared stylesheets.

## Published baseline compatibility

The `0.1.0-alpha.0` React APIs, entrypoints, tokens, accessibility contracts, runtime theme/mode/density
axes, RTL behavior, forced-colors behavior, and reduced-motion behavior remain the compatibility
baseline. Tailwind changes the authoring and consumer build setup, not the component API or visual
language.
