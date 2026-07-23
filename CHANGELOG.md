# Changelog

All notable user-facing changes to Nerio Core will be documented in this file.

Items under `Unreleased` may change before the next public release.

## Unreleased

### Added

- Added a metadata-driven catalog of ten bounded product Blocks at `/blocks`, with same-origin
  full-screen previews at `/views/blocks/[slug]`, canonical detail metadata, responsive and
  accessible task-focused examples, and explicit product boundaries. The previous broad settings
  composition was split into profile, security, and notification Blocks; profile, empty-state, and
  feedback galleries were simplified around recognizable tasks; valuable overlay, navigation,
  feedback-family, and dense-form stress coverage moved to unindexed internal fixtures.
- Added an immutable, release-versioned Registry contract and a portable `nerio.lock.json` source
  record with exact revision, style contract, dependency closure, installed paths, and original
  hashes. Added `nerio diff`, deterministic `nerio update --dry-run`, safe source updates,
  conflict-preserving normal updates, explicit force replacement, expanded doctor diagnostics,
  MCP Registry metadata, migration fixtures, and packed-consumer verification. The CLI tarball
  budget moves from 8,000 to 12,000 bytes for this lifecycle contract; the measured tarball is
  10,224 bytes and the unpacked budget remains unchanged.
- Added the client-only single-date DatePicker composed from Calendar and an anchored Base UI
  Popover, with timezone-safe ISO values, controlled and uncontrolled value/open state, localized
  display, min/max and disabled-date constraints, form submission/reset/required behavior, optional
  clear, focus transfer/restoration, Registry, CLI/MCP, docs, source-install, accessibility, and
  cross-browser coverage. Ranges, parsing, presets, time zones, scheduling, availability,
  recurrence, and product shortcuts remain outside Core.
- Added the client-only single-date Calendar with timezone-safe ISO values, controlled and
  uncontrolled selection and visible-month state, roving grid focus, locale-aware labels,
  localized selected-date context, configurable week starts, min/max and disabled-date constraints,
  Registry, CLI/MCP, docs, package/source-install, accessibility, and cross-browser coverage.
  DatePicker, date ranges, scheduling, availability, events, recurrence, time, and timezone
  workflows remain outside this primitive.
- Added the server-safe native FileInput with typed file-only props, forwarded ref and FileList
  events, single or multiple selection, native form/reset behavior, tokenized file-button states,
  Registry, CLI/MCP, docs, package/source-install, accessibility, and cross-browser coverage. Upload,
  drop-zone, preview, validation-workflow, progress, retry, queue, and storage behavior remain outside
  Core.
- Added the client-only single-value Slider with Base UI keyboard, pointer, touch, form, orientation,
  read-only, localized value-text, token, Registry, CLI/MCP, docs, source-install, and browser
  contracts. Existing native range usage can migrate to `Slider` when a tokenized cross-browser
  presentation adds value; multi-thumb ranges and product-specific scale behavior remain outside Core.
- Added native `date`, `month`, `week`, `time`, and `datetime-local` coverage to the server-safe
  Input contract while preserving browser-owned pickers, localized chrome, validity, value, and
  form-submission behavior.
- Added the canonical Core 1.0 platform-primitive coverage matrix, approved bounded follow-up
  identities for Slider, FileInput, Calendar, and DatePicker, and catalog drift validation for the
  native/component/deferred boundary.
- Added deterministic Core visual-regression fixtures, cross-axis screenshot baselines, CI diff artifacts, and an explicit maintainer approval workflow.
- Added Chromium, Firefox, and WebKit interaction gates for docs and demo, an explicit platform
  support policy, deterministic route/search performance checks, retry/failure artifacts, and
  enforced package, CSS, named-import, icon, and optional-adapter budgets.

### Changed

- Moved the Operations Workspace showcase into a metadata-driven docs-local Template architecture.
  `/templates`, `/templates/operations-workspace`, and `/views/operations-workspace` now share one
  catalog and one docs deployment; the standalone demo application, external demo URL, port 3002,
  duplicate appearance runtime, and separate browser build were retired. Existing runtime-axis,
  responsive, accessibility, performance, and product-state coverage now runs against the
  same-origin full-screen View.
- Stabilized the optional `@nerio-ui/adapters/motion` Core 1.0 contract. Runtime exports,
  transition and variant values, package/source parity, reduced-motion updates, SSR/hydration, and
  bundle isolation are snapshot- or fixture-protected. `NerioMotionConfig` now accepts only
  `children`, CSP `nonce`, and deterministic-test `skipAnimations`; alpha passthrough options such
  as global `transition`, `isValidProp`, `isStatic`, and `transformPagePoint` move to consumer-owned
  Motion composition.
- Standardized public package, Registry CLI, and MCP onboarding around version-aligned local
  installs, `pnpm exec` bins, and package-qualified `pnpm dlx` one-off execution. Active docs,
  component install blocks, README, `llms.txt`, CLI help, and release guidance now share one
  validated command contract. Clean-consumer release smoke executes the documented CLI lifecycle
  and packaged MCP bin, while MCP server version metadata derives from the coordinated package.
- Redesigned the public documentation, component Playground, and universal workspace demo around
  the approved Visual Language 1.0; added explicit Core/Pro and alpha boundaries, standardized
  component installation and decision guidance, compact mobile navigation, realistic Core states,
  and synchronized search, sitemap, README, and AI-readable discovery.
- Added the optional `@nerio-ui/adapters/motion` client entrypoint with typed token-aligned
  transitions and variants, user-preference reduced motion, strict LazyMotion guidance,
  source-install metadata, and measured zero-runtime isolation for non-adopters.
- Implemented the approved Nerio 1.0 visual foundation with cool alpha-neutral layers, pure
  white/black foundations, role-based soft geometry, calm shared motion, inverted overlay-glass
  aliases, calculated contrast validation, and a public visual-language reference.
- Applied the approved visual language to Navigation, Layout, and Overlays: neutral navigation
  states, soft selected Tabs elevation, tokenized hover motion, compact popup geometry, inverted
  dark-glass layers, blurred modal backdrops, directional Sheet motion, secondary close controls,
  and inline-end modal action footers.
- Applied the approved visual language to Data Display and Feedback: compact medium-weight
  hierarchy, borderless Card and muted table grouping, fixed Avatar overlap colors, neutral
  inline Alerts, inverted glass Toasts, deliberate status color, and tokenized interaction motion.
- Made Table body cells wrap text by default while retaining explicit consumer control for bounded
  identifiers and intentionally non-wrapping values.
- Refined Table's neutral product-table recipe with a borderless 4px container gutter, compensated
  20px/16px outer and row-group radii, clipped tbody content, short tokenized header dividers,
  neutral selected-row boundaries, and a focused set of interactive documentation
  previews composed from Nerio Checkbox, Button, Icon, and Pagination components; the complete
  preview now keeps its footer inside the muted shell, uses a full-row drag image, and removes the
  selected row's lower divider without changing its geometry. Added Secondary-only per-row rounded
  interaction surfaces that round only on hover in Secondary, vertically centered cells, stable
  inline Checkbox alignment, a composed EmptyState example with icon, comfortable spacing, and a
  secondary create action on a transparent non-row surface without hover treatment, a four-row
  loading preview, and intentional sans/code
  typography. Unified all data headers as neutral sortable controls with trailing direction arrows,
  removed the select-all leading divider, and refined reordering with a dedicated floating row clone,
  insertion cue, selection suppression, and concise `Reorder` tooltip. Documented faithful Primary (unified muted body)
  and Secondary (open page-level rows) presentation recipes without moving DataGrid behavior into
  the Core primitive.
- Aligned Pagination with Button's presentation recipes: outline controls by default and a secondary
  surface for the current page, while retaining stable geometry and `aria-current` state.
- Added a localizable `Dialog.closeLabel` while preserving the existing "Close dialog" default.

### Fixed

- Protected Navigation, Sidebar, Command, Dialog, and Sheet anatomy/state ownership from escaped
  consumer DOM props and synchronized their docs and Registry projections with the shipped APIs.

## 0.1.0-alpha.1 — 2026-07-18

### Documentation and governance

- Added a canonical Core UI implementation standard, reusable review checklist, cross-category
  audit, and aligned agent, contributor, proposal, pull-request, architecture, and AI guidance.
- Completed Tailwind CSS v4-first component authoring, documented and tested the narrow residual CSS
  compatibility policy, and established the `feature -> dev -> main` pull request flow.

### Changed

- Migrated all Core component styling to static Tailwind CSS v4 recipes while preserving Nerio
  semantic and component variables as the public theme, mode, density, and customization contract.
- Added explicit package `@source` registration and source-install bridge guidance; Nerio does not
  inject Tailwind Preflight.

### Fixed

- Extended `nerio doctor`, Registry/CLI/MCP fixtures, runtime-axis validation, and clean-consumer
  coverage for Tailwind package and source-install setup.
- Preserved consumer class precedence, Sheet viewport and RTL placement, and Toast RTL centering in
  the Tailwind-first implementation.

### Migration

- Package consumers must import `@nerio-ui/tokens/tailwind.css` and register the installed
  `@nerio-ui/ui` source path. Source-install consumers must import the copied Nerio bridge and token
  styles. See `docs/tailwind-migration-report.md` for complete migration guidance from
  `0.1.0-alpha.0`.

## 0.1.0-alpha.0 — 2026-07-15

### Core 0.1 alpha summary

#### Foundations

- Established semantic tokens, six preset themes, custom-theme overrides, system/light/dark modes,
  comfortable/compact density, typography recipes, radius, motion, and contrast contracts.

#### Components

- Completed the approved Core 0.1 component scope across actions, forms, overlays, navigation,
  feedback, data display, and layout primitives. All non-deprecated Core components are
  `stable-core`; IconButton remains a deprecated compatibility wrapper.

#### Source registry and CLI

- Added aligned registry metadata and editable source installation through `nerio init`, `list`,
  `info`, `add`, and `doctor`, including clean dependency-chain builds outside the monorepo.

#### MCP and AI

- Added read-only MCP discovery over the same registry contract and an AI-readable `llms.txt` index.
  The packed MCP runtime now resolves its installed registry package instead of a workspace path.

#### Documentation and demo

- Added public installation, package/source usage, entrypoint, customization, component, CLI, MCP,
  accessibility, SEO, and contribution guidance. The universal demo app exercises Core primitives;
  app-local composition previews are not presented as released Blocks or Templates.

#### Accessibility

- Verified accessible names, semantic structure, keyboard interaction, focus management and
  restoration, loading and invalid states, reduced motion, forced colors, RTL, and responsive
  behavior across the release surface where applicable.

#### Known limitations

- This is the first public alpha and is not production-stable or 1.0-compatible.
- Package distribution is source-first TypeScript. Next.js package consumers must configure the
  documented `transpilePackages` list.
- IconButton and the documented Button compatibility aliases remain available only for migration.

### Added

- Added a semantic token system with preset themes, light and dark modes, comfortable and compact density, and CSS-variable customization.
- Added the initial Nerio Core component foundation, including actions, form controls, overlays, feedback, navigation, data display, and layout primitives.
- Added source registry, CLI installation, and MCP component-discovery contracts for Core components.
- Added `Kbd` for displaying keyboard shortcuts in component interfaces.
- Added component contract and accessibility test coverage for the Core release surface.
- Added System, Geist, Inter, IBM Plex, Manrope, Source Sans 3, and Space Grotesk typography preset recipes through CSS tokens.
- Added a reproducible Chromium release smoke for the theme, mode, density, responsive,
  interaction, direction, motion, forced-color, and application-state matrix.

### Changed

- Adopted `@nerio-ui` as the public npm namespace for all six Nerio Core packages.
- Refined Core component APIs, token mappings, and documentation examples as the pre-release contract evolves.
- Consolidated icon-only actions into Button icon mode and keyboard shortcut composition.
- Expanded Card into a composable anatomy with header, content, footer, action, and visual slots.
- Improved theme, dark-mode, and density behavior across the Core component surface.
- Added router-render support to List items and preserved router-rendered Pagination slots and current-page state.
- Changed Nerio Core's default sans-serif typography from Geist to the platform system font stack.
- Isolated Lucide's fixed-stroke option behind `lucideAbsoluteStrokeWidth`; the previous
  `absoluteStrokeWidth` Icon prop remains a deprecated alpha compatibility alias.
- Split `@nerio-ui/adapters` into explicit `icons`, `table`, `charts`, `forms`, and `schema` subpaths;
  non-icon integrations are now optional peers and the monolithic root entrypoint is no longer
  supported.

### Fixed

- Kept primitive token scales immutable across runtime selectors, moved compact density to semantic
  and component remaps, and restored an explicit persisted System/Light/Dark appearance selector.
- Corrected accessibility associations, loading-state announcements, overlay close behavior, and localized Toast dismiss controls.
- Improved Avatar fallback updates, Table scroll-region behavior, and link navigation contracts.
- Closed responsive, high-contrast, image-transition, semantic-root ref, and router-adapter gaps across the remaining polished Core components.
- Protected Icon accessibility semantics from consumer SVG props, kept custom SVG forwarding free
  of Lucide-only DOM warnings, composed Item and ItemGroup render refs, and restored static
  Pagination current-state styling.
- Made SheetClose neutral for body and footer composition, isolated the default icon close style,
  aligned safe-area offsets and viewport metadata, wired the Sheet backdrop token, and corrected
  side-specific enter, exit, and reduced-motion contracts.
- Prevented malformed TableContainer names and consumer prop spreads from creating unnamed focus
  stops, and limited Table row-state styling to truthful current or selected tbody rows.
- Eliminated Toast enter and swipe-dismiss transform jumps across collapsed and expanded stacks,
  preserved both axes for four-way dismissal, and resolved inherited RTL before the first
  interactive render while keeping root direction changes synchronized.
- Bounded SidebarRail to its centered hit area, corrected SidebarContent's div ref contract,
  stabilized SidebarInset refs, and clarified the server/client entrypoint split in examples.
- Corrected Command selection so visible queries and form values use labels only while stable values
  and keywords remain available for selection events and filtering; also fixed grouped data typing,
  leading-slot semantics, no-leading row layout, and shared focus-ring styling.
- Re-ran the post-remediation release gate with strict packed-manifest contracts, isolated adapter
  dependency checks, expanded source-install coverage, and a production consumer build.
- Added safe-area-aware docs and demo shells, corrected copy-paste Sidebar labels and imports,
  hardened runtime-axis validation, and extended release smoke to the public documentation app.

### Deprecated

- Deprecated `IconButton` in favor of Button icon mode. `IconButton` remains available as a compatibility wrapper until the next major release.
- Deprecated Button `subtle` and `destructive` compatibility aliases in favor of `secondary` and `danger`.

### Removed

### Accessibility

- Added accessible-name requirements for icon-only Button usage and strengthened keyboard, focus, label, and state contracts across Core components.

### Migration

- Replace new `IconButton` usage with Button icon mode and provide an accessible name.
- Replace Button `subtle` and `destructive` variants with `secondary` and `danger`.
- Products that relied on Geist implicitly should load it explicitly and apply the Geist typography preset or override `--n-font-sans`.
- Replace explicit Icon `absoluteStrokeWidth` usage with `lucideAbsoluteStrokeWidth`; custom SVG
  components should implement only the generic `IconSvgProps` contract.
- Replace icon imports from `@nerio-ui/adapters` with `@nerio-ui/adapters/icons`. Import optional
  integrations from their dedicated subpath and install only its matching peer dependency.

## Maintenance rules

A changelog entry is required for a new public component or package export; a new prop or variant; a public API, semantic-token, CLI, registry, MCP, or package-compatibility change; a meaningful visual or accessibility behavior change; and any deprecation, removal, or migration requirement.

An entry is usually not required for spelling fixes, internal refactoring, test-only or CI changes, fixture maintenance without behavior changes, documentation layout adjustments, formatting, or implementation cleanup with no observable effect.

Entries should describe consumer impact in concise language, avoid implementation trivia, identify breaking or migration-sensitive changes, and name the preferred API when deprecating an existing one.
