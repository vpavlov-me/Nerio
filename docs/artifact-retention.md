# Repository artifact retention

Nerio tracks durable sources and reviewed evidence. Reproducible, generated, or machine-local review
output stays outside the Git tree so it cannot become a stale second source of truth.

## Retention model

| Evidence class                          | Tracked location and owner                              | Retention rule                                                                                                                                                       |
| --------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Playwright visual baselines             | `tests/visual/__screenshots__/{linux,darwin}/`          | Track only maintainer-reviewed platform baselines through the visual baseline approval flow.                                                                         |
| Public documentation and product assets | `docs/assets/` and `apps/docs/public/`                  | Track optimized, semantically named assets that have a live product or documentation owner.                                                                          |
| Durable audit evidence                  | `docs/audits/` and `docs/audits/screenshots/`           | Track only evidence linked by an active audit with its issue, method, status, and decision owner.                                                                    |
| Canonical generated inputs              | `quality/`                                              | Track reviewed baselines, budgets, snapshots, and policy records that directly drive a validator. Do not track a full diagnostic merely because it can be generated. |
| Generators and validators               | `scripts/` plus their contract tests                    | Track deterministic tooling and tests; keep their run output ephemeral.                                                                                              |
| Local or CI QA output                   | `artifacts/`, `test-results/`, and `playwright-report/` | Never track. Upload review evidence to the pull request or a short-lived Actions artifact.                                                                           |

Temporary screenshots, comparison boards or HTML, videos, traces, full generated reports, and local
work logs belong under `artifacts/qa/` or another tool-owned ignored output directory. The retired
`design-qa-artifacts/` path is also ignored to prevent historical output from returning.

Repository documentation must be portable. Do not commit personal home-directory paths, operating
system temporary paths, tool-private cache paths, or local-file URL evidence. Normal documented
`localhost` and loopback development URLs are allowed because they describe reproducible setup, not
evidence on one machine.

## Route bundle reports

The route measurement contract has three different outputs:

- `quality/docs-route-bundle-baseline.json` is the reviewed measurement baseline;
- `quality/docs-route-budgets.json` is the enforced allowance policy;
- `artifacts/docs-route-bundle-report.json` is the ignored current diagnostic report.

Build the docs and inspect a current full report with:

```bash
pnpm build
pnpm report:docs-routes
```

The command writes `artifacts/docs-route-bundle-report.json` and also emits JSON to stdout. A custom
ephemeral destination can be supplied with
`node scripts/docs-route-bundle-report.mjs --report-only --output=artifacts/reports/routes.json`.
Pull-request and release CI upload the default report from the existing production build; download
the SHA-named `docs-route-bundle-report-*` Actions artifact when diagnosing a remote result.

Refresh the canonical baseline only as an intentional reviewed change:

```bash
pnpm build
node scripts/docs-route-bundle-report.mjs --write-baseline --report-only
git diff -- quality/docs-route-bundle-baseline.json
pnpm validate:route-budgets
```

Do not refresh the baseline while changing a budget. A budget change requires its own measured
before/after evidence and justification under the override process in
[`docs/quality-gates.md`](./quality-gates.md).

## Enforcement and exceptions

Run:

```bash
pnpm test:repo-artifacts
pnpm validate:repo-artifacts
```

The validator checks the tracked tree for designated ephemeral directories, misplaced generated
comparison/report files, and machine-specific evidence paths in canonical documentation. It reports
the exact path and line for text violations and runs in both pull-request and release gates.

A legitimate portable example may use the inline `repo-artifacts-allow` marker on the same line.
Use it only with an explanation in the surrounding text. Durable binary evidence instead needs a
semantic filename, a canonical location from the table above, and a live reference from its owner.
