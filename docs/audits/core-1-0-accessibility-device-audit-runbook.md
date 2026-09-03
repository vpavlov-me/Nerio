# Core 1.0 accessibility and device audit runbook

This runbook reduces post-release issue #585 to the human observations that
automation cannot supply. It does not replace the bounded stable smoke, the canonical broader scope
in `quality/manual-audit-plan.json`, or the evidence record in
`docs/audits/core-1-0-accessibility-device-audit.md`.

## What is already automated

Before the candidate is handed to a human tester, Codex or the maintainer runs:

```bash
pnpm validate:manual-audit-plan
pnpm test:manual-audit-plan
pnpm test:ui
pnpm test:a11y
pnpm validate:platform-support
pnpm test:browser
```

These checks cover component contracts, automated accessibility rules, keyboard and focus behavior,
cross-engine interaction, responsive containment, RTL, reduced-motion CSS, forced-colors CSS, and
console/runtime failures. They are preparation evidence. They do not prove that assistive-technology
speech, touch gestures, native pickers, or the lived interaction are understandable.

## What the maintainer needs to do

Complete eight environment records. The work can be organized into four sessions:

1. **Mac session:** Safari with VoiceOver, Chromium keyboard-only, 200%/400% zoom and reflow,
   operating-system reduced motion, and macOS increased contrast.
2. **iOS session:** a physical iPhone or iPad running Safari with VoiceOver.
3. **Windows session:** Firefox or Chromium with NVDA.
4. **Android session:** a physical Android device running Chrome with TalkBack.

Do not combine observations from different candidates. Record the exact candidate SHA and Vercel
deployment supplied in issue #585 before starting.

## Generate one checklist per environment

Run:

```bash
pnpm manual-audit:checklist -- --environment macos-safari-voiceover
```

Replace the environment ID with one of:

```text
macos-safari-voiceover
macos-chromium-keyboard
windows-nvda
ios-safari-voiceover
android-chrome-talkback
zoom-reflow
reduced-motion
high-contrast
```

The command prints only the scenarios required for that environment, with the canonical route,
steps, expectations, and result fields. Copy the output into one comment on issue #585 and complete
it during the session. The URL of that comment may be used as the evidence link for every result in
the same environment; separate screenshots or recordings are needed only when they clarify a
finding.

## Record a result

For every scenario, choose one:

- `Pass` — all expected behavior was observed;
- `Fail` — an actionable product defect was observed;
- `Blocked` — the scenario could not be completed in the required environment;
- `Not applicable` — the scenario legitimately does not apply; record the specific reason.

Add at least one concrete sentence. For screen readers, record the control name, role, state, and
important announcement or focus transition. For keyboard, record the key sequence and final focus.
For mobile, record the gesture, picker or overlay behavior, dismissal, and focus return. For reflow,
record whether content or actions disappeared, overlapped, or required two-dimensional page
scrolling.

Do not write only “works” or “looks good.” The strict validator rejects generic evidence.

## Handle a problem

Stop the affected scenario and record:

- the exact route and scenario ID;
- expected and observed behavior;
- device, OS, browser, and assistive-technology versions;
- reproduction steps;
- whether the problem prevents task completion or creates material friction.

Codex can turn this observation into a focused Nerio issue, classify its release impact, prepare a
fix, and provide a retest checklist. Do not hide a failure by marking it not applicable.

## Finish an environment

At the end of the checklist, record `Pass`, `Fail`, `Blocked`, or `Not applicable` for the environment
and link any finding issues. Send the completed issue-comment URL to Codex. Codex will transfer the
real results into the machine-readable completion record and the canonical report without changing
the human observations.

After all eight environments are complete, run:

```bash
pnpm validate:manual-audit-complete
```

Issue #585 may close only when this strict command passes and the report records exactly **Pass for
real consumer pilots**. A blocked result keeps the issue open until its finding is resolved and
retested.
