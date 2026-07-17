## Summary

Describe the problem and the change in a few direct sentences.

For component or API work, include the responsibility owner, why existing composition, tokens, or
consumer ownership are insufficient, and whether styling decisions are system, family, or justified
component exceptions. Use `docs/core-ui-best-practices.md` as the canonical review standard.

## Related issue

Closes #

## Visual evidence

Add screenshots, a recording, or a link to the relevant docs/demo route for visible changes.

## Release note

- [ ] No user-facing change
- [ ] Added
- [ ] Changed
- [ ] Fixed
- [ ] Deprecated
- [ ] Removed
- [ ] Breaking
- [ ] Accessibility
- [ ] Migration required

Release note:

<!--
Write one concise sentence describing the impact on Nerio users.
Use "No user-facing change" for internal-only work.
-->

## Checklist

- [ ] The scope is focused and the code follows `AGENTS.md`.
- [ ] The implementation uses Nerio tokens rather than hard-coded design values where applicable.
- [ ] Tailwind-first changes follow `docs/tailwind-styling-contract.md`, including static utilities, deterministic `className` overrides, residual CSS, and package/source-install evidence.
- [ ] The component has deliberate keyboard, focus, and semantic behavior.
- [ ] Component/API work passes the responsibility and public API admission rules in `docs/core-ui-best-practices.md`, or this is not applicable.
- [ ] Styling decisions are classified as system, family, or justified component exceptions, or this is not applicable.
- [ ] Applicable state, accessibility, responsive/RTL/localization, motion, source-install, and documentation evidence is recorded.
- [ ] Docs, usage snippets, examples, and registry metadata are updated when the public API changes.
- [ ] Public copy and documentation are in English.
- [ ] I added a DCO sign-off to my commits (`git commit -s`).
- [ ] Required checks pass locally or I have explained why they cannot run.
