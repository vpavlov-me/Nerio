# Visual quality contract

Nerio reviews visible changes against the maintained design-system rules, component contracts, and
deterministic visual baselines. Screenshots help reviewers evaluate a change, but a local screenshot
or chronological QA log is never a source of truth by itself.

## Sources of truth

Use the narrowest durable owner for a decision:

- [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) and the
  [1.0 visual language](./visual-language-1-0.md) own system-wide color, surface, geometry,
  typography, density, motion, and interaction direction;
- [Core UI best practices](./core-ui-best-practices.md) own component responsibility, state,
  accessibility, responsive behavior, and evidence expectations;
- component source, public documentation, Registry metadata, and contract tests own the released
  component behavior;
- the [visual regression workflow](./visual-regression.md) and reviewed files under
  `tests/visual/__screenshots__/` own current pixel baselines;
- focused audit documents under `docs/audits/` own durable audit conclusions when they identify an
  issue, status, method, and maintained decision source.

A reference image supplied during review is input to a decision, not a permanent contract. Record
the accepted rule in its canonical owner and retain the image only when that owner still links to it.

## Review method

For every material visual change:

1. Identify the canonical rule and the exact route, component, state, mode, density, viewport, and
   platform under review.
2. Compare like-for-like captures. Match viewport and device scale, wait for fonts and animations,
   block volatile or third-party content, and separate full-view composition checks from focused
   anatomy checks when either would otherwise be illegible.
3. Review hierarchy, spacing, typography, semantic color and tokens, assets, copy, responsive
   behavior, focus and keyboard behavior, and relevant open/closed or loading/error states.
4. Classify findings by severity and system owner. Fix the token, family, component, or docs layer
   that owns the defect instead of patching one screenshot.
5. Run the contract, accessibility, browser, and visual checks selected by the changed surface.
   Baseline updates follow the approval flow in `docs/visual-regression.md`.
6. Record the accepted rule and its issue or pull request in the durable owner. Put transient
   screenshots, comparisons, videos, and traces in pull-request attachments, Actions artifacts, or
   the ignored local destinations defined by the
   [artifact retention policy](./artifact-retention.md).

An unexplained pixel match is not approval, and green visual snapshots do not replace interaction
or accessibility evidence.

## Historical log disposition

The former root `design-qa.md` mixed reusable review technique with completed implementation notes
and machine-local evidence. Its content was classified as follows:

| Content class                                                                                                 | Durable owner                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reusable source selection, comparison, severity, and verification method                                      | This contract and `docs/visual-regression.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Approved system-wide visual decisions and reference boards                                                    | `docs/visual-language-1-0.md`, `docs/audits/visual-language-1-0.md`, and `docs/assets/visual-language-1-0/`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Current component behavior and accepted pixels                                                                | Component source, docs, contract tests, and `tests/visual/__screenshots__/`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Completed Playground, Blocks, Table, Toast, and documentation iterations                                      | Repository history and their owning pull requests, including [#25](https://github.com/vpavlov-me/Nerio/pull/25), [#61](https://github.com/vpavlov-me/Nerio/pull/61), [#156](https://github.com/vpavlov-me/Nerio/pull/156), [#251](https://github.com/vpavlov-me/Nerio/pull/251), [#378](https://github.com/vpavlov-me/Nerio/pull/378), [#379](https://github.com/vpavlov-me/Nerio/pull/379), [#405](https://github.com/vpavlov-me/Nerio/pull/405), [#420](https://github.com/vpavlov-me/Nerio/pull/420), [#430](https://github.com/vpavlov-me/Nerio/pull/430), [#523](https://github.com/vpavlov-me/Nerio/pull/523), and [#536](https://github.com/vpavlov-me/Nerio/pull/536) |
| Superseded findings, localhost sessions, personal paths, temporary captures, and repeated pass/final evidence | Removed; these are not active repository contracts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

Future visual QA decisions belong in the existing owner above. Do not recreate a root execution log
or append per-run evidence to a canonical policy document.
