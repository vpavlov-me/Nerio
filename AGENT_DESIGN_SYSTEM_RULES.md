# Nerio Core — operating rules for coding agents

## Status and scope

This document is the required operating overlay for agent-authored changes to Nerio Core. The
canonical implementation and review rules live in `docs/core-ui-best-practices.md`; agents MUST read
and apply that document before changing components, tokens, styles, examples, tests, registry
metadata, source installation, documentation, CLI projections, or MCP projections.

Read it together with:

- `PROJECT.md` for product scope and positioning;
- `DECISIONS.md` for accepted product and architecture decisions;
- `DESIGN_SYSTEM.md` for approved visual and token contracts;
- `DESIGN_PRINCIPLES.md` for the system-wide decision framework;
- `COMPONENT_ARCHITECTURE.md` for responsibility and API boundaries;
- `TIERING_AND_TEMPLATE_EVOLUTION.md` for Core, Pro, template, and consumer ownership;
- `COMPONENTS.md` and `data/component-catalog.json` for the canonical inventory.

These sources have scoped authority. Existing canonical APIs remain authoritative until an explicit
migration task approves a change. When authoritative sources conflict, agents MUST stop the affected
implementation, report the exact conflict, and require an explicit source-of-truth update.

## Required operating procedure

Before editing, an agent MUST:

1. Read the root `AGENTS.md` and relevant source-of-truth documents.
2. Inspect at least one analogous Nerio component and the underlying native or Base UI contract.
3. Identify applicable tokens, utilities, tests, docs patterns, catalog fields, registry metadata,
   and source-install fixtures.
4. Classify ownership as existing Core, composition, future Core candidate, Pro, or consumer code.
5. Apply the public API admission rule in `docs/core-ui-best-practices.md` before proposing a prop,
   variant, size, state, slot, event, or imperative handle.
6. Classify styling decisions as system, family, or justified component exception.
7. State the smallest complete slice and explicit out-of-scope items.

Prefer this implementation order:

1. Reuse an existing component unchanged.
2. Compose existing components.
3. Use an existing semantic/component token, `className`, or source ownership.
4. Add a meaningful slot only when structural control is required.
5. Add a semantic prop or variant only after the admission rule passes.
6. Add a Core component only with catalog, tier, and roadmap approval.
7. Add a dependency only when the platform, Base UI, and current Nerio utilities cannot satisfy the
   requirement.

After editing, agents MUST run and report the relevant formatting, linting, type-checking, contract,
accessibility, browser, catalog, token, fixture, source-install, and build checks. Every skipped or
unavailable check MUST be reported.

## Compatibility and visual locks

Agents MUST NOT rename, remove, regroup, or reinterpret public props, variants, tones, emphasis
levels, sizes, slots, exports, entrypoints, or defaults without an explicit migration task.

Agents MUST NOT invent or tune palette, spacing, typography, radius, border, surface, elevation,
density, motion, icon-character, signature-detail, or final-composition decisions. Maintainer-owned
visual decisions require separately approved visual-language work.

## Public contract alignment

A public component change is incomplete until source, exports, `data/component-catalog.json`,
`COMPONENTS.md`, registry metadata, docs, examples, CLI and MCP projections, fixtures, tests, and the
changelog agree where applicable.

Agents MUST preserve:

- native or Base UI semantics, keyboard behavior, focus management, and protected attributes;
- correctly typed props, events, render targets, and composed refs;
- server-safe `@nerio-ui/ui` and interactive `@nerio-ui/ui/client` boundaries;
- semantic/component token consumption and immutable primitive tokens across runtime axes;
- stable, truthful `data-slot`, `data-state`, and semantic state hooks;
- source-installed behavior without runtime dependencies on the docs or registry website;
- Core's domain-agnostic responsibility boundary.

## Immediate rejection checklist

Reject or revise an implementation containing any of the following without an approved exception:

- an interactive `div` or `span` where native semantics exist;
- a missing accessible name or removed focus-visible treatment;
- duplicated native or Base UI state-machine behavior;
- a visual-only prop/variant or color-named public API;
- business logic, routing, fetching, permissions, persistence, or analytics in a Core primitive;
- a raw visual value that replaces a system or family token decision;
- a public `any`, dropped ref, unsafe render/event contract, or assertion hiding a public mismatch;
- `!important`, an unnecessary dependency, or an unnecessary client boundary;
- a silent breaking change or permanent duplicate compatibility API;
- unsynchronized source, catalog, registry, docs, CLI, MCP, fixtures, or tests;
- a production defect fixed inside a documentation-only audit task instead of a focused follow-up.

## Definition of done

An agent-authored change is complete only when it passes the reusable review checklist in
`docs/core-ui-best-practices.md`, preserves the approved responsibility and visual boundaries, runs
the relevant evidence gates, and reports changed files, exact checks, and unresolved limitations.
