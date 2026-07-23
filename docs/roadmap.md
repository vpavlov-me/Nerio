# Roadmap

## Foundation — current

- [ ] Monorepo tooling and shared configuration
- [ ] Token architecture and first theme contracts
- [ ] Core Base UI-backed components
- [ ] Public docs application and live component previews
- [x] Docs-local Operations Workspace Template and same-origin preview View
- [ ] Registry proof of concept and `nerio add button`
- [ ] Initial AI guidance: `llms.txt` and MCP component discovery
- [ ] CI, release workflow, and DCO enforcement

## Core quality stabilization

- [ ] Token foundation and token validation
- [ ] Button and IconButton quality pass
- [ ] Forms quality pass, including Field invalid behavior and Select placeholder/form behavior
- [ ] Overlay quality pass
- [ ] Basic table and data-display quality pass
- [ ] Registry, docs, CLI, and MCP validation alignment
- [ ] Component maturity model adoption

## Core coverage expansion

- [ ] FormGroup, Radio Group, Alert, List, Breadcrumbs, Pagination
- [ ] Sidebar Primitive and Command Primitive
- [ ] Close the canonical Core 1.0 platform coverage decision
- [x] Add native temporal Input coverage
- [x] Add single-value Slider
- [x] Add FileInput
- [x] Add Calendar
- [x] Add single-date DatePicker

## Product building blocks

- [ ] Form primitives and validation adapter
- [ ] Navigation, command menu, and searchable selection
- [ ] Overlay patterns and notifications
- [ ] Data table adapter and empty/loading/error patterns
- [ ] Chart adapter and universal analytics examples
- [ ] Product date, scheduling, and availability workflows above the bounded Core single-date primitives
- [ ] File upload workflows above native Core file selection

## Distribution and adoption

- [ ] Stable CLI and versioned registry
- [ ] Component changelog and migration guidance
- [ ] Expanded AI recipes and model-agnostic agent instructions
- [ ] More product patterns: settings, billing, auth, onboarding, and data-dense dashboards

The roadmap describes direction, not a promise or release schedule. GitHub issue #152 owns the
current executable sequence; `docs/core-platform-primitive-coverage.md` owns the Core 1.0
native-versus-component boundary. Maintainers prioritize production needs and quality over raw
component count.
