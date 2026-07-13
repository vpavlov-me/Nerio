# Changelog

All notable user-facing changes to Nerio Core will be documented in this file.

Nerio has not been publicly released yet. Items under `Unreleased` may change before the first public pre-release.

## Unreleased

### Added

- Added a semantic token system with preset themes, light and dark modes, comfortable and compact density, and CSS-variable customization.
- Added the initial Nerio Core component foundation, including actions, form controls, overlays, feedback, navigation, data display, and layout primitives.
- Added source registry, CLI installation, and MCP component-discovery contracts for Core components.
- Added `Kbd` for displaying keyboard shortcuts in component interfaces.
- Added component contract and accessibility test coverage for the Core release surface.
- Added System, Geist, Inter, IBM Plex, Manrope, Source Sans 3, and Space Grotesk typography preset recipes through CSS tokens.

### Changed

- Refined Core component APIs, token mappings, and documentation examples as the pre-release contract evolves.
- Consolidated icon-only actions into Button icon mode and keyboard shortcut composition.
- Expanded Card into a composable anatomy with header, content, footer, action, and visual slots.
- Improved theme, dark-mode, and density behavior across the Core component surface.
- Added router-render support to List items and preserved router-rendered Pagination slots and current-page state.
- Changed Nerio Core's default sans-serif typography from Geist to the platform system font stack.

### Fixed

- Corrected accessibility associations, loading-state announcements, overlay close behavior, and localized Toast dismiss controls.
- Improved Avatar fallback updates, Table scroll-region behavior, and link navigation contracts.
- Closed responsive, high-contrast, image-transition, semantic-root ref, and router-adapter gaps across the remaining polished Core components.

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

## Maintenance rules

A changelog entry is required for a new public component or package export; a new prop or variant; a public API, semantic-token, CLI, registry, MCP, or package-compatibility change; a meaningful visual or accessibility behavior change; and any deprecation, removal, or migration requirement.

An entry is usually not required for spelling fixes, internal refactoring, test-only or CI changes, fixture maintenance without behavior changes, documentation layout adjustments, formatting, or implementation cleanup with no observable effect.

Entries should describe consumer impact in concise language, avoid implementation trivia, identify breaking or migration-sensitive changes, and name the preferred API when deprecating an existing one.
