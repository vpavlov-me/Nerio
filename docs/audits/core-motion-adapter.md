# Core Motion adapter stabilization

## Decision

Retain and stabilize `@nerio-ui/adapters/motion` as an optional Core 1.0 foundation contract.
Core UI remains CSS-first and imports no Motion runtime. The adapter is justified only for
coordinated presence, interruption, layout continuity, gestures, or sequencing that would make CSS
state orchestration fragile.

## Stable responsibility and API

The stable runtime exports are:

- `NerioMotionConfig`;
- `useNerioReducedMotion`;
- `motionTransitions`;
- `motionVariants`.

`NerioMotionConfig` owns `reducedMotion="user"` and accepts only `children`, an optional Content
Security Policy `nonce`, and `skipAnimations` for deterministic test or visual capture. Global
transition overrides, Motion prop filtering, static-canvas behavior, page-point transforms,
component choreography, routing, scroll systems, and product timelines are not Nerio adapter
responsibilities.

The transition names and values are snapshot-protected for `instant`, `fast`, `normal`, `slow`,
`enter`, `exit`, `expressive`, and `layout`. Variants are frozen to `fade`, `fadeScale`,
four-direction `slide`, and `collapse`, using only `hidden`, `visible`, and `exit` state keys. CSS
duration, easing, distance, and TypeScript value parity remains enforced by
`pnpm test:motion-adapter`.

## Distribution and support

- Package entrypoint: `@nerio-ui/adapters/motion`.
- Runtime: client-only.
- Optional peer: `motion@^12.42.2`; it is not a dependency.
- Source target: `lib/motion-adapter.tsx`.
- Recommended loading: strict `LazyMotion` with `m` and `domAnimation`; use `domMax` only for
  layout, pan, or drag capability.
- Core UI, icons, and token-only adapter imports resolve zero Motion runtime code.
- Normal optional consumers resolve one Motion runtime copy.

Package and source-installed consumers compile against the same source. Missing-peer fixtures fail
predictably, while icons/UI-only consumers install no optional integration peers.

## Accessibility, SSR, and browser contract

The operating-system reduced-motion preference is honored by default and updates mounted
compositions live. Animated transform and layout travel is removed under reduced motion while
opacity and the static end state remain available. The preference hook uses a deterministic server
snapshot, and the config renders and hydrates without drift. Browser evidence covers presence
completion, rapid reversal, layout reordering, keyboard and pointer activation, live preference
changes, unmount cleanup, dark mode, mobile width, overflow, and console/hydration health.

Automated evidence does not replace the real assistive-technology and device audit in issue #143.

## Alpha migration

The initial alpha wrapper inherited most `MotionConfigProps`. Before beta, that accidental
passthrough is removed. Move transition choices to individual animated elements and use the
token-aligned Nerio transitions. A composition that requires `isValidProp`, `isStatic`,
`transformPagePoint`, or another low-level Motion configuration owns a direct Motion integration
and must preserve user-preference reduced motion.

Removing the adapter remains non-disruptive: replace optional compositions with CSS recipes or
static end states, remove the copied source file, and uninstall `motion`. No Core component,
provider, or migration changes.

## Verification map

| Risk                           | Evidence                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------- |
| Public API and alpha migration | Exact runtime snapshot plus positive and negative TypeScript fixtures                           |
| Token parity                   | CSS/TypeScript duration, easing, distance, and spring validator                                 |
| Reduced motion                 | SSR/hydration unit test, live media-query subscription test, browser static-end-state assertion |
| Package isolation              | Packed optional-peer consumer, zero-runtime Core/icons/token-only bundles, one-copy checks      |
| Loading budgets                | Measured `domAnimation` and `domMax` gzip budgets                                               |
| Source installation            | Registry, CLI, MCP, installed-source typecheck, and release consumer                            |
| Public alignment               | Catalog, matrix, Registry, docs, `llms.txt`, support policy, release guidance, and changelog    |

This evidence satisfies the Core quality checklist without adding a required runtime dependency,
new visual values, a new runtime appearance axis, or Motion behavior to existing Core components.
