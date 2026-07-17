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
Nerio class names and restores inherited typography on Nerio native controls. These are permanent,
narrow compatibility rules, not a document-wide reset or evidence of an incomplete migration.

## Setup diagnostics

Run `nerio doctor` after configuring a consumer stylesheet. It validates the registry as well as the
Tailwind setup it can inspect in the project: a Tailwind import, the package bridge and `@source`
registration in package mode, copied bridge and token styles in source-install mode, the
no-Preflight compatibility path, and unsupported legacy component styles imported from the installed
source directory. The command reports all detected setup problems with remediation text; it does not
modify consumer files.

## Authoring and overrides

- Use complete, statically detectable class strings. Do not interpolate utility fragments.
- Use Nerio semantic/component variables. Raw Tailwind palette utilities are not Core defaults.
- Use `tailwindCn` for Tailwind-first components so a consumer root `className` deterministically
  replaces conflicting utilities.
- Keep public props, slots, data attributes, Base UI behavior, and package entrypoints unchanged.
- Do not mirror utilities into large `@apply` blocks.

## Residual CSS policy

Residual CSS is allowed only for these categories:

- named keyframes shared by Tailwind-first recipes;
- the scoped Nerio-class `box-sizing: border-box` rule needed when package or source consumers omit
  Preflight;
- the scoped native-control `font-family: inherit` rule needed when those consumers omit Preflight.

Residual CSS must remain small, documented, and covered by the Tailwind contract test. It must not
contain `.n-*` visual component selectors, `@apply` mirrors, or any second styling layer parallel to
the static Tailwind recipes. Adding another category requires an explicit architecture decision and
updated consumer evidence.

## Published baseline compatibility

The `0.1.0-alpha.0` React APIs, entrypoints, tokens, accessibility contracts, runtime theme/mode/density
axes, RTL behavior, forced-colors behavior, and reduced-motion behavior remain the compatibility
baseline. Tailwind changes the authoring and consumer build setup, not the component API or visual
language.
