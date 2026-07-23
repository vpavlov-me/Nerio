# Core DatePicker quality record

DatePicker is the approved Core 1.0 bounded single-date composition from issue #262.

## Responsibility

DatePicker owns one timezone-independent ISO `YYYY-MM-DD` value, a form-family trigger, one anchored
Calendar popup, focus transfer and restoration, native-compatible form submission and reset,
localization, Calendar constraints, and an optional explicit clear action.

Consumers own ranges, presets, localized or natural-language parsing, time and timezone conversion,
availability, appointments, recurrence, scheduling, async validation, persistence, and product
shortcuts.

## API decision

The public contract reuses `CalendarDate`, Calendar constraints and labels, Base UI Popover open
state details, and existing form-family tokens. `null` is the explicit controlled empty value.
Display formatting is separate from parsing; DatePicker never infers a date from localized text.

The public ref targets the trigger. Meaningful slots are `root`, `trigger`, `content`, `clear`, and
`form-control`; Calendar retains its existing slots inside the popup.

## Accessibility and behavior

- Field, Label, `aria-label`, or `aria-labelledby` names the trigger.
- Keyboard and pointer opening move focus to Calendar's roving day.
- Selection, Escape, outside dismissal, and clear restore focus to the trigger.
- Required, disabled, read-only, invalid, form ownership, submission, and reset remain truthful.
- Locale changes visible and accessible formatting without changing the submitted ISO value.
- RTL, forced colors, reduced motion, touch, zoom, and narrow containers reuse Calendar, Popover,
  Button, and form-family contracts.

## Verification boundary

Automated contract, accessibility, browser, visual, Registry, CLI, MCP, package, source-install, and
release gates cover the implementation. Real VoiceOver, iOS, and NVDA evidence remains part of the
manual complete-surface audit in issue #143.
