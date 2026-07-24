# Template pattern candidates

## Purpose

This report records product patterns that become visible while building docs-local Templates. A
mention is evidence, not promotion. Core remains domain-agnostic; advanced or policy-owning
compositions remain template-local until independent product contexts justify a Pro contract.

## Finance & Assets

| Pattern                       | Current evidence                                                                                               | Recommendation                                          | Evidence needed before promotion                                                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Portfolio summary             | Total balance, period context, movement, cash, invested assets, and pending movement in one financial overview | Keep template-local; possible Pro financial composition | At least three independent financial products with the same semantic anatomy, privacy behavior, localization, and responsive hierarchy |
| Allocation chart wrapper      | One restrained performance series plus selectable allocation list using the optional charts adapter            | Keep template-local                                     | Repeated non-financial and financial use, stable chart accessibility strategy, empty/loading contracts, and adapter-neutral data shape |
| Asset row and mobile drill-in | Dense desktop table and mobile list share identity, quantity, allocation, movement, and value semantics        | Pro candidate, not Core DataGrid                        | Repeated treasury, wealth, and marketplace inventories with proven sorting, selection, virtualization, and keyboard requirements       |
| Transaction row               | Incoming, outgoing, exchange, pending, failed, and completed movement with text and icon semantics             | Pro candidate                                           | Multiple ledgers with stable status taxonomy, reversal/refund behavior, localization, and disclosure requirements                      |
| Balance visibility            | Accessible replacement text and one local visibility control for sensitive values                              | Keep template-local utility                             | Reuse across several products, persistence and announcement policy, clipboard/export behavior, and assistive-technology review         |
| Transfer steps                | Details, validation, review, submitting, and deterministic success inside Dialog                               | Pro workflow candidate                                  | Real product evidence for source/destination selection, fees, compliance, authentication, failure recovery, and idempotency            |

No Finance & Assets pattern changes or widens a Core API.

## Content Library

| Pattern                     | Current evidence                                                                                                   | Recommendation                                     | Evidence needed before promotion                                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Media card and asset row    | One metadata model supports a visual desktop grid and a readable mobile list without changing Core Card or Item    | Pro media-library candidate                        | Multiple creator, marketplace, and knowledge products with stable preview, selection, status, and responsive anatomy                   |
| Library toolbar             | Search, bounded type/status filters, loading inspection, and grid/list controls share one task-focused composition | Keep template-local; possible Pro Filter Bar input | Reuse across independent catalogs, saved-view policy, query ownership, responsive overflow, and keyboard evidence                      |
| Selection bar               | Keyboard-operable checkboxes drive a fixed selection count and one bounded archive action                          | Pro bulk-action candidate                          | Proven action menus, destructive confirmation, select-all scope, pagination semantics, announcements, and mobile behavior              |
| Preview and metadata editor | Local artwork, fallback media, metadata, validated editing, save feedback, and focus restoration share one Dialog  | Pro asset-inspector candidate                      | Repeated media types, permissions, versioning, unsaved-change policy, validation, localization, and larger-content behavior            |
| Deterministic import queue  | Queued, importing, completed, failed, retry, and empty states compose Progress, Alert semantics, and local actions | Keep workflow local; possible Pro upload candidate | Real upload transport, cancellation, duplicate handling, retry policy, concurrency, persistence, security, and assistive-tech evidence |
| Tokenized local artwork     | CSS-only deterministic visuals and a document fallback provide stable docs and visual-regression evidence          | Keep template-local                                | No promotion needed; consumer artwork and media loading remain product-owned                                                           |

No Content Library pattern changes or widens a Core API.

## AI Research Workspace

| Pattern                         | Current evidence                                                                                                  | Recommendation                                       | Evidence needed before promotion                                                                                                            |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Evidence-grounded answer        | One response connects claims to numbered, inspectable local sources and restores focus after inspection           | Pro AI composition candidate                         | Multiple research and agent products with stable claim, citation, source-quality, conflict, and accessibility contracts                     |
| Research composer               | Prompt validation, attachments, model context, run action, interruption, and recovery share one bounded workspace | Keep template-local; possible Pro composer candidate | Proven streaming ownership, file policy, token budgets, keyboard shortcuts, persistence, mobile behavior, and assistive-technology evidence |
| Tool-run status                 | Running progress plus completed, interrupted, failed, and retry states use existing status primitives             | Keep template-local                                  | Real tool orchestration, concurrent and nested runs, cancellation, partial results, telemetry, timeout, and recovery policy                 |
| Source rail and library         | Desktop evidence rail and full source library share source identity, provenance, relevance, and inspection        | Pro knowledge-work candidate                         | Reuse across independent products, ranking and trust policy, stale-source behavior, permissions, filtering, and large-set navigation        |
| Saved research threads          | Search, no-results recovery, status, update context, and return-to-thread behavior are deterministic fixtures     | Keep template-local                                  | Persistence, collaboration, rename/archive/delete policy, pagination, permissions, and real history semantics                               |
| Local model/runtime preferences | Model profile sits beside theme, mode, density, and direction without creating a new Nerio runtime axis           | Keep product-owned                                   | No Core promotion; model selection and product preferences remain application responsibilities                                              |

No AI Research Workspace pattern changes or widens a Core API.

## Developer Portal

| Pattern                      | Current evidence                                                                                                      | Recommendation                              | Evidence needed before promotion                                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Documentation shell          | Product header, deep grouped navigation, content, and page table of contents form one responsive developer experience | Pro documentation composition candidate     | Reuse across independent documentation products, routing contracts, permissions, versioning, responsive hierarchy, and content tooling |
| Documentation search         | Keyboard shortcut, grouped result filtering, no-results state, and destination navigation compose Command and Popover | Pro search candidate                        | Real index ownership, ranking, remote loading, recent items, analytics, large result sets, and assistive-technology review             |
| API endpoint reference       | Method, path, parameters, response, loading, error, events, and recovery form one product-owned reference layout      | Pro developer-tool candidate                | Multiple API products, schema generation, language examples, versioning, deprecation, expandable models, and deep-link behavior        |
| Code example                 | Language tabs, copy feedback, long-line containment, and local syntax content support a practical quickstart          | Keep template-local; possible Pro candidate | Stable syntax-highlighting adapter, multiple consumers, line actions, wrapping policy, accessible annotation, and copy telemetry       |
| Versioned changelog timeline | Version selection, current/previous status, dates, highlights, and migration context are deterministic fixtures       | Keep template-local                         | Real release feeds, pagination, compare/migration behavior, subscriptions, deep links, and localization                                |
| Runtime preference panel     | Theme mode, density, and direction remain canonical Nerio axes inside a product-owned settings page                   | Keep product-owned                          | No Core promotion; persistence and portal preference policy remain application responsibilities                                        |

No Developer Portal pattern changes or widens a Core API.
