# Core 1.0 accessibility and real-device audit

- Issue: [#143](https://github.com/vpavlov-me/Nerio/issues/143)
- Status: **Prepared — manual evidence pending**
- Plan: [`quality/manual-audit-plan.json`](../../quality/manual-audit-plan.json)
- Candidate commit: **Pending**
- Final decision: **Pending**

This document is the evidence record for the broad accessibility and real-device audit that
continues after stable 1.0. The bounded publication prerequisite is documented in
[`core-1-0-stable-accessibility-smoke.md`](./core-1-0-stable-accessibility-smoke.md). Automated
contract, accessibility, browser, visual, package, and release checks do not count as VoiceOver,
NVDA, TalkBack, native picker, physical-device, zoom, contrast, or lived interaction evidence.

Do not change this broader audit's final decision until every required environment has evidence and
every blocking finding is resolved. Its closing decisions remain **Pass for real consumer pilots**
or **Blocked before pilots**; they close the post-release program rather than gate stable 1.0.

## Candidate lock

Record one exact candidate before manual testing starts. If a later change affects rendered DOM,
ARIA, keyboard interaction, focus, announcements, form behavior, value semantics, motion, layout,
or native picker behavior, relock the candidate and rerun the affected scenarios against the new
commit. The completion gate permits only this report and the machine-readable audit plan to change
after the recorded candidate; any other changed path invalidates the completed evidence until the
candidate and applicable results are refreshed. The issue, required environments, evidence fields,
routes, steps, expectations, and scenario-to-environment matrix must remain identical to the plan
stored at that candidate.

| Field                    | Evidence |
| ------------------------ | -------- |
| Commit                   | Pending  |
| GitHub verification      | Pending  |
| CI run                   | Pending  |
| Vercel deployment        | Pending  |
| Package/source mode      | Pending  |
| Audit start              | Pending  |
| Audit owner              | Pending  |
| Automated prep completed | Pending  |

Before recording manual evidence, run:

```bash
pnpm validate:manual-audit-plan
pnpm test:manual-audit-plan
pnpm test:ui
pnpm test:a11y
pnpm validate:platform-support
pnpm test:browser
```

## Evidence rules

Use the
[maintainer runbook](./core-1-0-accessibility-device-audit-runbook.md) to generate one concise,
environment-specific checklist and evidence comment at a time.

For every environment and scenario:

1. Record exact operating system, browser, assistive-technology version, device model, viewport,
   zoom, and package or source-install mode.
2. Start from the scenario route and use the steps in
   [`quality/manual-audit-plan.json`](../../quality/manual-audit-plan.json).
3. Record `Pass`, `Fail`, `Blocked`, or `Not applicable` with a reason.
4. For every failure, create one focused GitHub issue with expected and observed behavior,
   reproduction steps, environment, severity, affected public contract, and evidence.
5. Classify findings as P0, P1, P2, or P3 and state whether they block pilots, API freeze, beta, or
   stable 1.0.
6. Link screenshots, video, or audio when they clarify focus, speech, touch, picker, reflow, or
   contrast behavior. Do not treat an image alone as screen-reader evidence.
7. Never replace missing human evidence with an automated test result.

Before changing the plan status to `complete`, add a machine-readable `completion` record to
`quality/manual-audit-plan.json`. It must contain:

- `candidate`: the exact commit plus HTTPS links for GitHub verification, CI, and Vercel, explicit
  `ciCommit` and `vercelCommit` identities matching that commit, and the audit owner/start timestamp;
- `environments`: one record for every required environment with the operating system, browser,
  assistive technology, device, viewport, zoom, and package mode actually used;
- `results`: one unique record for every scenario/environment pair required by the plan, with an
  allowed result, substantive notes, and at least one HTTPS evidence link. Every `Fail` or
  `Blocked` result must also include a focused GitHub `issue`, `severity` (`P0`–`P3`), and
  `blockingGate` (`pilots`, `api-freeze`, `beta`, or `stable-1.0`); the issue must appear in the
  finding log below.

The completion validator rejects missing pairs, duplicate or unexpected records, placeholder
values, non-evidence URLs, candidate drift between the plan and report, post-candidate source
changes, a pilot-pass decision with failed or blocked results, and any remaining pending table
cells. `Pass for real consumer pilots` requires `Pass` evidence for every required
scenario/environment pair; `Not applicable`, `Fail`, or `Blocked` keeps the final decision blocked.
The environment and scenario outcomes in this report must match the machine-readable completion
records; contradictory human and JSON evidence fails validation.
Each aggregate environment outcome is derived from its applicable scenario results rather than
accepted as an independent assertion.

## Required environments

| Environment ID            | Required environment                              | OS / browser / AT / device | Status  | Evidence |
| ------------------------- | ------------------------------------------------- | -------------------------- | ------- | -------- |
| `macos-safari-voiceover`  | macOS Safari with VoiceOver                       | Pending                    | Not run | Pending  |
| `macos-chromium-keyboard` | macOS Chromium with keyboard-only navigation      | Pending                    | Not run | Pending  |
| `windows-nvda`            | Windows Firefox or Chromium with NVDA             | Pending                    | Not run | Pending  |
| `ios-safari-voiceover`    | Physical iPhone or iPad Safari with VoiceOver     | Pending                    | Not run | Pending  |
| `android-chrome-talkback` | Physical Android Chrome with TalkBack             | Pending                    | Not run | Pending  |
| `zoom-reflow`             | Browser zoom and reflow at 200% and 400%          | Pending                    | Not run | Pending  |
| `reduced-motion`          | Operating-system reduced-motion preference        | Pending                    | Not run | Pending  |
| `high-contrast`           | macOS increased contrast or Windows high contrast | Pending                    | Not run | Pending  |

Each environment record must include:

- `operatingSystem`
- `browser`
- `assistiveTechnology`
- `device`
- `viewport`
- `zoom`
- `packageMode`
- `result` — the aggregate outcome for the environment;
- `notes` — substantive environment-level context in addition to per-scenario notes.

Use `not applicable` only for `assistiveTechnology` in the keyboard-only, zoom/reflow,
reduced-motion, and high-contrast environment records. Every other metadata field requires the
actual tested value.

## Scenario matrix

The JSON plan owns the executable steps and expected results. This table is the human progress and
evidence index.

| Scenario ID                     | Primary route                            | Focus                                                      | Status  | Evidence |
| ------------------------------- | ---------------------------------------- | ---------------------------------------------------------- | ------- | -------- |
| `global-docs-navigation`        | `/docs`                                  | Docs landmarks, search, appearance, page actions           | Not run | Pending  |
| `global-demo-responsive`        | `/views/operations-workspace`            | Product composition, responsive navigation, safe areas     | Not run | Pending  |
| `actions-buttons-toggle`        | `/visual-test`                           | Button, icon actions, loading, disabled, Toggle            | Not run | Pending  |
| `forms-labels-validation`       | `/visual-test#field`                     | Labels, errors, grouped controls, Select                   | Not run | Pending  |
| `native-temporal-inputs`        | `/docs/components/input`                 | Native date, month, week, time, datetime-local             | Not run | Pending  |
| `slider-input`                  | `/docs/components/slider`                | Keyboard, touch, pointer, orientation, RTL                 | Not run | Pending  |
| `file-input-picker`             | `/docs/components/file-input`            | Native picker, filename announcement, reset                | Not run | Pending  |
| `calendar-grid`                 | `/docs/components/calendar#preview`      | Grid navigation, constraints, locale, RTL                  | Not run | Pending  |
| `date-picker-composition`       | `/docs/components/date-picker`           | Focus transfer, Calendar, clear, form value                | Not run | Pending  |
| `table-semantics-overflow`      | `/docs/components/table`                 | Table structure, selection, sorting, overflow              | Not run | Pending  |
| `item-semantics-states`         | `/docs/components/item`                  | Item links, selection, disabled, loading, long content     | Not run | Pending  |
| `feedback-status-states`        | `/visual-test`                           | Alert, progress, loading, empty, error                     | Not run | Pending  |
| `toast-announcements`           | `/docs/components/toast`                 | Priority, stacking, actions, persistence, dismissal        | Not run | Pending  |
| `tabs-orientation-rtl`          | `/docs/components/tabs`                  | Orientations, disabled items, overflow, RTL                | Not run | Pending  |
| `breadcrumbs-current`           | `/docs/components/breadcrumbs`           | Breadcrumbs structure and current-page semantics           | Not run | Pending  |
| `pagination-current-disabled`   | `/docs/components/pagination`            | Current page, disabled controls, ellipsis, RTL             | Not run | Pending  |
| `command-live-states`           | `/docs/components/command-primitive`     | Command active descendant, loading, empty, result count    | Not run | Pending  |
| `sidebar-collapse`              | `/visual-test#sidebar-primitive`         | Sidebar collapse, hidden content, focus retention          | Not run | Pending  |
| `sheet-mobile-modal`            | `/docs/components/sheet#preview`         | Mobile Sheet focus, dismissal, scroll lock, reduced motion | Not run | Pending  |
| `overlay-focus-dismissal`       | `/visual-test/blocks/overlay-playground` | Dialog, Popover, Tooltip, Dropdown Menu                    | Not run | Pending  |
| `motion-adapter-reduced-motion` | `/docs/foundations/motion`               | Optional Motion adapter and live reduced-motion preference | Not run | Pending  |
| `runtime-axes-motion-contrast`  | `/visual-test`                           | Themes, modes, density, RTL, motion, contrast              | Not run | Pending  |

## Finding log

Create a GitHub issue for each actionable defect, then link it here. Do not combine unrelated
components or root causes into one finding. Completed `Fail` and `Blocked` evidence requires one
structured row whose scenario, environment, severity, release impact, issue, resolution, and retest
match the machine-readable result record.
Use exactly `Open`, `Resolved`, or `Closed` for Resolution. Any other value is treated as unresolved.

| Finding       | Scenario | Environment | Severity | Release impact | Issue | Resolution | Retest |
| ------------- | -------- | ----------- | -------- | -------------- | ----- | ---------- | ------ |
| None recorded | —        | —           | —        | —              | —     | —          | —      |

Severity:

- **P0** — prevents task completion, causes data loss, or creates an immediate safety/security risk.
- **P1** — a load-bearing flow is unusable with a required input or assistive technology.
- **P2** — material friction, ambiguity, or platform inconsistency; mark explicitly blocking or
  non-blocking.
- **P3** — limited polish or guidance issue with an accepted follow-up target.

## Environment notes

Record every field exactly as it appears in `completion.environments`. The validator also derives
the scenario list and finding issues from `completion.results`.

### `macos-safari-voiceover`

| Field                | Evidence      |
| -------------------- | ------------- |
| Operating system     | Pending       |
| Browser              | Pending       |
| Assistive technology | Pending       |
| Device               | Pending       |
| Viewport             | Pending       |
| Zoom                 | Pending       |
| Package/source mode  | Pending       |
| Result               | Pending       |
| Notes                | Pending       |
| Completed scenarios  | None recorded |
| Findings             | None recorded |

### `macos-chromium-keyboard`

| Field                | Evidence      |
| -------------------- | ------------- |
| Operating system     | Pending       |
| Browser              | Pending       |
| Assistive technology | Pending       |
| Device               | Pending       |
| Viewport             | Pending       |
| Zoom                 | Pending       |
| Package/source mode  | Pending       |
| Result               | Pending       |
| Notes                | Pending       |
| Completed scenarios  | None recorded |
| Findings             | None recorded |

### `windows-nvda`

| Field                | Evidence      |
| -------------------- | ------------- |
| Operating system     | Pending       |
| Browser              | Pending       |
| Assistive technology | Pending       |
| Device               | Pending       |
| Viewport             | Pending       |
| Zoom                 | Pending       |
| Package/source mode  | Pending       |
| Result               | Pending       |
| Notes                | Pending       |
| Completed scenarios  | None recorded |
| Findings             | None recorded |

### `ios-safari-voiceover`

| Field                | Evidence      |
| -------------------- | ------------- |
| Operating system     | Pending       |
| Browser              | Pending       |
| Assistive technology | Pending       |
| Device               | Pending       |
| Viewport             | Pending       |
| Zoom                 | Pending       |
| Package/source mode  | Pending       |
| Result               | Pending       |
| Notes                | Pending       |
| Completed scenarios  | None recorded |
| Findings             | None recorded |

### `android-chrome-talkback`

| Field                | Evidence      |
| -------------------- | ------------- |
| Operating system     | Pending       |
| Browser              | Pending       |
| Assistive technology | Pending       |
| Device               | Pending       |
| Viewport             | Pending       |
| Zoom                 | Pending       |
| Package/source mode  | Pending       |
| Result               | Pending       |
| Notes                | Pending       |
| Completed scenarios  | None recorded |
| Findings             | None recorded |

### `zoom-reflow`

| Field                | Evidence      |
| -------------------- | ------------- |
| Operating system     | Pending       |
| Browser              | Pending       |
| Assistive technology | Pending       |
| Device               | Pending       |
| Viewport             | Pending       |
| Zoom                 | Pending       |
| Package/source mode  | Pending       |
| Result               | Pending       |
| Notes                | Pending       |
| Completed scenarios  | None recorded |
| Findings             | None recorded |

### `reduced-motion`

| Field                | Evidence      |
| -------------------- | ------------- |
| Operating system     | Pending       |
| Browser              | Pending       |
| Assistive technology | Pending       |
| Device               | Pending       |
| Viewport             | Pending       |
| Zoom                 | Pending       |
| Package/source mode  | Pending       |
| Result               | Pending       |
| Notes                | Pending       |
| Completed scenarios  | None recorded |
| Findings             | None recorded |

### `high-contrast`

| Field                | Evidence      |
| -------------------- | ------------- |
| Operating system     | Pending       |
| Browser              | Pending       |
| Assistive technology | Pending       |
| Device               | Pending       |
| Viewport             | Pending       |
| Zoom                 | Pending       |
| Package/source mode  | Pending       |
| Result               | Pending       |
| Notes                | Pending       |
| Completed scenarios  | None recorded |
| Findings             | None recorded |

## Completion summary

| Gate                                                                 | Result  |
| -------------------------------------------------------------------- | ------- |
| No open P0 or P1 accessibility defect                                | Pending |
| Blocking P2 findings resolved                                        | Pending |
| Every stable Core category covered with keyboard and VoiceOver       | Pending |
| NVDA covers load-bearing interactive families                        | Pending |
| Mobile VoiceOver and TalkBack cover required controls and safe areas | Pending |
| Zoom/reflow, contrast, RTL, touch, and reduced motion verified       | Pending |
| Motion adapter has manual reduced-motion evidence                    | Pending |
| Missing or stale evidence is explicitly listed                       | Pending |

## Final decision

**Pending**

Do not write a pass while required evidence is missing. When the audit is complete, replace the
pending decision with exactly one:

- **Pass for real consumer pilots** — every blocking criterion passes on the recorded candidate.
- **Blocked before pilots** — list every blocker and its focused follow-up issue.
