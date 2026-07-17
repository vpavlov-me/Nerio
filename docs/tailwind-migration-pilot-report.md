# Tailwind migration pilot report

## Scope and structure

The pilot migrates exactly Button, Input, and Dialog. Button's standalone visual stylesheet is
deleted. Input rules are removed from `forms.css`; Dialog visual rules are removed from `overlays.css`.
The components now contain static Tailwind v4 class recipes and use a conflict-aware merge helper.
The public token package adds `tailwind.css`; docs, demo, packed-package, and source-install consumers
receive explicit build setup.

## Evidence

- The docs production build compiles `@theme`, `@source`, and component utilities; no Tailwind
  directives remain in emitted CSS.
- The packed consumer registers `node_modules/@nerio-ui/ui/src`; the source-installed consumer uses
  copied TSX and bridge files.
- Registry items for Button, Input, and Dialog include `tailwind-merge`, the merge helper, and the
  bridge; obsolete Button/Input style payloads are removed.
- Root `className` conflicts are covered by focused merge tests.
- UI contract and accessibility suites preserve the published component behavior.

## Size comparison

The handwritten UI style directory is 85,837 bytes after the pilot versus 92,936 bytes at
`0.1.0-alpha.0`, a reduction of 7,099 bytes (7.6%). The production docs CSS is 203,073 bytes before
compression. The previous 182,716-byte build was not a valid Tailwind comparison because it emitted
unprocessed `@theme` and `@source` directives and generated none of the package utilities.

## Residual CSS

- `motion.css`: shared transition recipes still used by migrated and unmigrated components.
- `icon.css`: shared Icon implementation used inside Button and Dialog.
- Dialog keyframes in `overlays.css`: preserve enter/exit transforms and reduced-motion fade without a
  duplicate visual selector implementation.
- Scoped `.n-*` box sizing in `styles.css`: temporary compatibility for components awaiting #173.

## Known limitations

- Remaining Core components still use the pre-migration CSS architecture and are owned by #173.
- Package consumers must register the installed UI source path explicitly because Tailwind ignores
  `node_modules` by default.
- The final validators, CLI doctor guidance, migration documentation, and release recommendation are
  owned by #174.

## Recommendation

**PROCEED.** The styling contract was accepted by the maintainer on 2026-07-17. Continue with #173 as
sequential, reviewable component-family slices. Keep
the static-class, Nerio-variable, consumer-owned Preflight, explicit package `@source`, conflict-aware
merge, and narrow residual-CSS rules unchanged during the remaining family migrations.
