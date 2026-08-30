# Nerio roadmap

Nerio is an open-source, source-first design system for modern digital products.

The roadmap develops three compatible layers:

- **Nerio Core** — tokens, themes, accessible components, package and source installation, Registry,
  CLI, MCP, and public documentation.
- **Nerio Ecosystem** — recipes, agent guidance, Figma interoperability, visualization foundations,
  and developer tooling.
- **Nerio Pro** — optional product-ready starters, templates, advanced patterns, themes, and design
  assets built on Core.

Core remains independently useful and open source. Ecosystem and Pro work must preserve Core's public
API, accessibility, source ownership, and distribution guarantees.

## Roadmap principles

1. Finish and verify Core 1.0 before expanding the stable API.
2. Deliver new capabilities as bounded, reviewable vertical slices.
3. Use real consumer evidence to prioritize components, recipes, tooling, and product patterns.
4. Keep Core independent from private source, licensing, accounts, payments, and hosted Nerio
   services.
5. Keep code, packages, Registry metadata, CLI, MCP, documentation, examples, and Figma mappings
   synchronized.
6. Preserve package and source-install workflows that remain deterministic, inspectable, and safe for
   consumer modification.

## Current release state

- `1.0.0-beta.1` is public across six coordinated packages.
- The signed beta candidate passed the complete release workflow and public consumer verification.
- Package mode, source installation, Registry, CLI, MCP, documentation, and clean Next.js consumer
  paths are available.
- The intended Core 1.0 component and API surface is frozen.
- Stable `1.0.0` still requires #143, #146, #148, #150, and #151.
- Core 1.1 primitive-parity work and the first developer-platform foundations are available on `dev`
  and remain outside the isolated Core 1.0 release candidate.

## Phase 1 — Core 1.0 stable

<!-- parity-track:manual-stable-gates issues:#143,#146,#148,#150,#151 depends-on: -->

The remaining stable sequence is:

1. #143 — complete the accessibility and real-device audit.
2. #146 — complete the external beta.1 feedback cycle.
3. #148 — finalize stable documentation, governance, security, support, and migration policy.
4. #150 — run the final exact-candidate release gate.
5. #151 — publish and verify the exact `1.0.0` candidate.

#143 and #146 may proceed in parallel. Preparatory work under #148 may continue, while final stable
claims remain dependent on accepted human evidence.

### Stable release outcome

- six coordinated stable packages under npm `latest`;
- an immutable version-aligned Registry;
- verified package and source consumers;
- stable CLI and MCP contracts;
- complete migration and support documentation;
- evidence-backed accessibility, browser, framework, and device coverage;
- a signed tag, GitHub Release, and stable documentation deployment from one exact candidate.

## Phase 2 — adoption and developer experience

After Core 1.0, prioritize work that helps teams discover, evaluate, and use Nerio in real products.

### Documentation and composition

<!-- parity-track:adoption issues:#356,#369 depends-on:#151,#341 -->

- #485 and its remaining children — complete the public foundation documentation and
  source-consistency program.
- #356 — publish a bounded collection of maintained Core recipes for recurring product-interface
  compositions.
- #369 — provide a repository-native Agent Skill for building product interfaces with Nerio.
- #355 — decide whether a dedicated Component Lab adds enough value beyond the current documentation
  and visual fixtures.

### Developer platform

<!-- parity-track:developer-platform issues:#351,#352,#353,#354,#355 depends-on:#151,#341 -->

- #351 — compiled package output and simpler package-mode setup, complete on `dev`.
- #352 — expanded CLI lifecycle and project bootstrap, complete on `dev`.
- #353 — complete namespaced Registry and bounded authentication contracts in reviewable slices.
- #354 — expand MCP into a bounded read-only design-system interface using canonical Registry, CLI,
  and documentation data.

Developer-platform tools remain optional and independent from commercial account or licensing
behavior.

### Data visualization

- #424 and related focused work — establish an optional token-aligned chart foundation and canonical
  Recharts integration without making charts part of the default Core runtime.

## Phase 3 — design-to-code ecosystem

<!-- parity-track:ecosystem issues:#357 depends-on:#151,#341,#342 -->

- #490 — define the public token lifecycle and generate a deterministic DTCG-compatible interchange
  artifact.
- #357 — create the open Nerio Core Figma library and synchronization contract from the accepted
  interchange artifact.

Code and generated canonical metadata remain authoritative. Figma must not become a divergent source
of token or component truth.

## Phase 4 — product-ready offerings

Nerio will extend beyond primitives through a focused first product rather than an undifferentiated
catalog of templates.

- #578 — launch public early access for Nerio Pro and the Nerio SaaS Starter.
- #579 — build the first Nerio SaaS Starter after the early-access audience and scope are reviewed.

The initial Starter is expected to provide one coherent Next.js and Figma foundation for a modern
SaaS or B2B product, including:

- authentication and onboarding surfaces;
- responsive application shell and navigation;
- representative list, detail, create, and settings workflows;
- provider-neutral plan and billing presentation;
- complete loading, empty, error, success, permission, disabled, and destructive states;
- theme, mode, density, responsive, accessibility, and localization resilience;
- explicit integration boundaries for auth, data, analytics, email, payments, and deployment.

The Starter remains a product built with released Nerio Core contracts. It must not require changes
to Core merely for template convenience.

## Phase 5 — broader Nerio Pro ecosystem

Future Pro work may include:

- additional product starters and templates;
- advanced data, navigation, billing, AI, and dashboard patterns;
- premium themes and design assets;
- a broader Figma product kit;
- optional private source distribution and commercial licensing;
- product-specific MCP and agent guidance;
- documented support and update policies.

Each expansion should follow released-product feedback and be tracked as a focused issue rather than
implemented as one broad Pro program.

## Branch and release policy

- `release/1.0` or an equivalent exact-candidate worktree owns the stable release line.
- `dev` owns post-1.0 development and ecosystem work.
- Forward features must not enter the stable candidate accidentally.
- Every accepted stable blocker receives a focused change and an explicit backport decision.
- Public packages, tags, Releases, and dist-tags require maintainer authorization and exact-candidate
  verification.

## Task selection

Use this order when selecting roadmap work:

1. A real security, accessibility, compatibility, or stable-release blocker.
2. The next incomplete task in #143 → #146 → #148 → #150 → #151.
3. A ready adoption or ecosystem issue whose documented dependencies are complete.
4. #578 early access and #579 SaaS Starter according to their issue-specific dependencies.
5. Broader Pro work through separately scoped issues.

## Maintenance rule

When roadmap scope changes, update the affected canonical sources in the same pull request, including
where applicable:

- `ROADMAP.md`;
- issue #152;
- `PROJECT.md` and `DECISIONS.md`;
- `COMPONENTS.md` and `data/component-catalog.json` when public capability changes;
- Registry, CLI, MCP, documentation, examples, and release metadata;
- `AGENTS.md` when implementation or coordination rules change.
