# Core 1.0 stable accessibility smoke

This is the bounded internal human-evidence gate for Nerio Core `1.0.0`. It protects the highest-risk
stable interactions without making the exhaustive accessibility/device matrix or an external beta
cohort prerequisites for publication.

The canonical machine-readable record is
[`quality/stable-accessibility-smoke.json`](../../quality/stable-accessibility-smoke.json). Issue
[#143](https://github.com/vpavlov-me/Nerio/issues/143) owns the exact candidate, evidence, findings,
and final release decision.

## Required environments

Run the smoke against one locked candidate and deployment:

1. macOS Safari with VoiceOver;
2. macOS Chromium with keyboard-only navigation;
3. 200% and 400% zoom/reflow plus increased or high contrast in a maintained desktop browser;
4. one maintained mobile browser on a physical touch device.

The broader Windows/NVDA, Android/TalkBack, iOS/VoiceOver, native-picker, reduced-motion, and
complete physical-device matrix remains valuable post-release evidence. It is not a `1.0.0`
publication blocker unless this scoped smoke exposes a release-impacting defect.

## Required scenarios

- Documentation landmarks, navigation, search, appearance controls, and visible focus.
- Labels, descriptions, validation, grouped controls, and representative native controls.
- Dialog, Sheet, Popover, Dropdown Menu, Tooltip, and focus restoration.
- Calendar and DatePicker navigation, selection, dismissal, and form value.
- Alert, progress, loading, Toast announcements, actions, and dismissal.
- Responsive navigation, touch targets, narrow layouts, zoom, reflow, and contrast.

Record concise evidence links and notes for every environment and scenario. Do not include private
consumer content, credentials, recordings with personal data, or invented results.

## Decision rule

The stable smoke passes only when:

- every required environment and scenario records `Pass`;
- the record identifies the exact `1.0.0` candidate SHA and reviewed deployment;
- no unresolved accepted P0/P1 or explicitly blocking finding remains;
- accepted non-blocking P2/P3 findings have focused GitHub issues and are described in known
  limitations where consumer impact exists;
- the maintainer records `release-ready`.

Validate the record with:

```bash
pnpm test:stable-accessibility-smoke
pnpm validate:stable-accessibility-smoke
pnpm validate:stable-accessibility-smoke --expect-pass
```

The last command is intentionally expected to fail while evidence remains pending.
