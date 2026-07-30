# Blocks catalog audit

## Scope and definition

Issue #249 audits the eleven composition routes that previously shared
`/docs/blocks/[slug]`. A public Nerio Block is a bounded, recognizable product-interface
composition that solves one common task, remains understandable without an application shell, and
primarily composes Nerio Core. It does not own routing, persistence, backend behavior, permissions,
business policy, or product-wide navigation.

The resulting public catalog uses `/blocks`, `/blocks/[slug]`, and the same-origin
`/views/blocks/[slug]` preview route. Internal regression fixtures use
`/visual-test/blocks/[slug]`, are unindexed, bypass documentation chrome, and are excluded from
navigation, search, sitemap, and `llms.txt`.

## Audit matrix

| Previous slug and route                                    | Intended task                                                         | Components and current complexity                                                                                 | Block / Template / internal assessment                                                | Duplication                                                                               | Decision                      | Implementation                                                                                                                                        |
| ---------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `login` · `/docs/blocks/login`                             | Sign into a workspace                                                 | Card, Field, Input, Button, Alert; small single form                                                              | Common reusable Block; not a Template                                                 | Shares auth anatomy with registration and recovery, but the user task is distinct         | `simplify-public-block`       | Canonical `sign-in`; preserve validation, loading, and recovery navigation; redirect the legacy route                                                 |
| `register` · `/docs/blocks/register`                       | Create an account                                                     | Card, Field, Input, Button, Alert; small multi-field form                                                         | Common reusable Block; not a Template                                                 | Shares auth anatomy, but account creation has distinct copy and verification guidance     | `simplify-public-block`       | Canonical `create-account`; retain focused local validation and verification guidance; redirect legacy route                                          |
| `forgot-password` · `/docs/blocks/forgot-password`         | Request password recovery                                             | Card, Field, Input, Button, Alert; small state transition                                                         | Common reusable Block; not a Template                                                 | Shares auth shell, but recovery is a distinct task and outcome                            | `simplify-public-block`       | Canonical `reset-password`; preserve focused success transition; redirect legacy route                                                                |
| `settings-form` · `/docs/blocks/settings-form`             | Edit profile, notifications, view preferences, security, and deletion | Field, FormGroup, Checkbox, RadioGroup, Select, Textarea, Switch, Dialog, Button, Alert; large multi-section page | Too broad for one Block and approaches a settings page composition                    | Combines three independently useful settings tasks                                        | `split-into-blocks`           | Replace with `profile-settings`, `notification-preferences`, and `security-settings`; redirect legacy route to the closest introductory profile Block |
| `table-toolbar` · `/docs/blocks/table-toolbar`             | Search, filter, select, act on, and paginate a small table            | Input, DropdownMenu, Button, Table, Badge, EmptyState, Pagination; medium workflow                                | Reusable bounded Block when it stops before DataGrid responsibility                   | Operations Workspace has a larger table scenario, but this remains independently copyable | `simplify-public-block`       | Keep canonical slug; add truthful checkbox selection and selected-count state; preserve empty result and pagination                                   |
| `user-profile` · `/docs/blocks/user-profile`               | View identity, metrics, metadata, activity, and message action        | Card, Avatar, Stat, KeyValue, List, Badge, Button, Dialog; medium page-like composition                           | Original is broader than a bounded Block; not large enough to become its own Template | Activity and metrics overlap dashboard/profile Template patterns                          | `simplify-public-block`       | Canonical `account-summary`; retain identity, account metadata, status, and one edit action; remove social metrics and activity feed                  |
| `empty-states` · `/docs/blocks/empty-states`               | Compare six unrelated absence and recovery states                     | EmptyState and Button repeated six times; gallery rather than one task                                            | Component-family/example gallery, not one reusable Block                              | Duplicates Empty State component guidance                                                 | `simplify-public-block`       | Canonical `empty-project`; keep one realistic first-project outcome and link to Operations Workspace; redirect legacy route                           |
| `feedback` · `/docs/blocks/feedback`                       | Compare alerts, progress, skeletons, spinner, and Toast               | Alert, Toast, Progress, Skeleton, Spinner, Button; broad family fixture                                           | Original is internal component coverage, not a recognizable product task              | Duplicates feedback component documentation                                               | `split-into-blocks`           | Public `file-upload-state` reframes progress and outcomes around one task; preserve original family coverage at `/visual-test/blocks/feedback`        |
| `overlay-playground` · `/docs/blocks/overlay-playground`   | Stress nested overlays, focus, scrolling, and keyboard behavior       | Dialog, Popover, DropdownMenu, Tooltip, Button, Checkbox; interaction playground                                  | Deterministic internal accessibility and browser fixture                              | Duplicates overlay component docs by design for integration testing                       | `move-to-internal-test-route` | Preserve at `/visual-test/blocks/overlay-playground`; remove from public discovery; legacy route redirects to the unindexed fixture                   |
| `navigation-patterns` · `/docs/blocks/navigation-patterns` | Compare breadcrumbs, local links, tabs, sidebar, and pagination       | Breadcrumbs, Button, Tabs, Pagination; broad navigation composition                                               | Docs/template composition and internal semantic stress fixture, not one task          | Overlaps the documentation shell and navigation component references                      | `move-to-internal-test-route` | Preserve at `/visual-test/blocks/navigation-patterns`; remove from public discovery; legacy route redirects to fixture                                |
| `dense-form` · `/docs/blocks/dense-form`                   | Stress 42-control density, focus order, reflow, and labels            | Field, Input, Button repeated 42 times; deliberately oversized                                                    | Internal accessibility, density, and responsive stress test                           | No public task; purpose is regression coverage                                            | `move-to-internal-test-route` | Preserve at `/visual-test/blocks/dense-form`; remove from public discovery; legacy route redirects to fixture                                         |

## Final public inventory

The initial catalog contains ten Blocks:

1. Sign in
2. Create account
3. Reset password
4. Profile settings
5. Security settings
6. Notification preferences
7. Table toolbar
8. Account summary
9. Empty project
10. File upload state

This inventory covers authentication, settings and account, team and operations, and content and
feedback. Each item has one canonical metadata record for its public title, description, category,
status, components, intended use, boundaries, related surfaces, preview route, detail route, and
indexability.

## Responsibility and promotion boundary

Blocks remain docs-local preview compositions. They do not change Core APIs, publish a Pro package,
or establish backend behavior. Repetition across Blocks and Templates is evidence for
`TIERING_AND_TEMPLATE_EVOLUTION.md`; it is not automatic promotion. Full app shells, page-wide
navigation, advanced data workflows, persistence, permissions, and business rules remain Template,
future Pro, or consuming-application responsibilities.
