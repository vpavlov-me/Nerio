# Docs-local Template migration audit

## Scope

Issue #248 replaces the standalone `apps/demo-app` deployment with a metadata-driven Template and
full-screen View architecture inside `apps/docs`. The first migrated Template is Operations
Workspace. Blocks catalog work and the remaining five planned Templates stay in #249 and #250.

## Responsibility map

| Previous responsibility                          | Previous owner                                         | Docs-local replacement                                                                                 | Decision                                                                                       |
| ------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Universal workspace route                        | `apps/demo-app/app/page.tsx` at `/`                    | `apps/docs/features/templates/operations-workspace/view.tsx` rendered at `/views/operations-workspace` | Preserve the product surface as template-local code.                                           |
| Public discovery                                 | `/templates` linked to an external deployment          | `/templates` gallery and `/templates/operations-workspace` detail page derive from `templateCatalog`   | Replace external demo framing with truthful Template metadata and Preview maturity.            |
| Full-screen isolation                            | Separate Next.js application                           | `DocsChrome` omits documentation chrome for `/views/*`                                                 | Preserve a clean app-like surface without another runtime or deployment.                       |
| Preview embedding                                | Cross-origin iframe                                    | Same-origin iframe from the detail page to `/views/operations-workspace`                               | Retain useful isolation while removing cross-domain coupling.                                  |
| Theme, mode, and density state                   | Demo-only appearance helper and `nerio-demo-*` storage | Shared docs appearance helper and `nerio-docs-*` storage                                               | One deployment owns one pre-hydration appearance contract.                                     |
| RTL control                                      | Demo root mutation                                     | Template-local control with root direction restored on unmount                                         | Preserve direct View behavior without leaking direction into docs navigation.                  |
| Responsive Sidebar and mobile Sheet              | Demo page and global CSS                               | Operations Workspace View and scoped CSS module                                                        | Preserve one active navigation tree per viewport.                                              |
| Safe-area handling                               | Demo root CSS variables                                | Template-scoped safe-area variables                                                                    | Preserve physical-device layout evidence without document-global demo CSS.                     |
| Loading, empty, error, success, and Toast states | Demo-local React state                                 | Operations Workspace View                                                                              | Preserve deterministic product-state coverage.                                                 |
| Analytics                                        | Demo root layout                                       | Existing docs root layout                                                                              | Avoid a second analytics bootstrap and project.                                                |
| Metadata, icon, and viewport                     | Demo root layout                                       | Docs root metadata/icon/viewport plus route-specific metadata                                          | Preserve canonical handling and mark full-screen Views unindexed.                              |
| Browser engines                                  | Separate `demo-*` Playwright projects and port 3002    | `template-*` projects against the docs server on port 3100                                             | Preserve Chromium, Firefox, and WebKit coverage with one build.                                |
| Performance smoke                                | Standalone demo root                                   | `/views/operations-workspace` on the docs server                                                       | Preserve local ownership, hydration, layout-shift, and transfer-budget evidence.               |
| Release interaction smoke                        | Standalone demo root                                   | Operations Workspace View route                                                                        | Preserve runtime-axis, focus, overlay, Table, Sidebar, Command, Toast, and safe-area evidence. |
| Visual evidence                                  | Core visual fixture plus browser failure screenshots   | Existing Core visual fixture plus focused Operations Workspace desktop/mobile baselines                | Protect the migrated product surface without multiplying every mock state.                     |
| Framework/package policy                         | Both app package manifests                             | `apps/docs/package.json` only                                                                          | One Next.js application owns public docs and Templates.                                        |
| Local development                                | `pnpm dev` started ports 3000 and 3002                 | `pnpm dev` starts docs on port 3000                                                                    | Remove the second local application and port contract.                                         |
| Vercel deployment                                | `nerio` and `nerio-demo` projects                      | `nerio` docs deployment only                                                                           | The repository no longer contains a demo-app build target or external demo URL.                |

## Canonical route and metadata contract

`apps/docs/features/templates/catalog.ts` owns the public title, slug, description, category,
maturity, detail route, preview route, audience, scenarios, runtime coverage, components used,
limitations, and indexability for every Template.

- `/templates` is the catalog.
- `/templates/[slug]` is the descriptive and indexable Template page.
- `/views/[slug]` is the direct, full-screen, unindexed preview.
- Unknown detail and View slugs call `notFound()`.
- Indexable detail routes are projected into the sitemap from the same catalog.

## Ownership boundary

Operations Workspace is a Template-local composition. It composes stable Core components but does
not add or change Core APIs, publish a Pro package, introduce a backend, or claim stable Template
distribution. Repeated patterns remain evidence for #250 rather than automatic promotion.

## Retired coupling

The replacement removes:

- `apps/demo-app`;
- `@nerio-ui/demo-app`;
- port `3002`;
- `NEXT_PUBLIC_DEMO_APP_URL`;
- `https://nerio-demo.vercel.app`;
- separate demo build/start steps in Playwright;
- duplicate appearance initialization and analytics code.

Historical release reports may continue to mention the demo application as evidence for the commit
they describe. They are not active runtime or deployment contracts.
