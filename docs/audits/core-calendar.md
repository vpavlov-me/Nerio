# Calendar Core 1.0 review

## Responsibility

Calendar is the approved Core surface for one visible calendar month and one selected ISO calendar
date. It owns date-grid semantics, roving focus, month navigation, locale labels, week starts,
constraints, disabled-date policy hooks, and immediate single-date selection. Consumers own
DatePicker composition, form policy, ranges, events, availability, scheduling, recurrence, time,
timezone conversion, fetching, and persistence.

## API admission record

- Stable distinction: a custom calendar is an interactive ARIA grid whose date arithmetic,
  keyboard behavior, focus, localization, and constraints are not supplied by a native element.
- Independent use: inline due-date selection, booking-date choice, reporting dates, and form
  composition share the primitive without sharing a product workflow.
- Composition considered: native `input type="date"` remains preferred when browser-owned picker UI
  is sufficient; Calendar is the bounded custom-grid path and DatePicker remains a separate task.
- Value contract: `CalendarDate` is an ISO `YYYY-MM-DD` calendar date. Visible months use the same
  representation and normalize to the first day, avoiding a competing public date type.
- Customization: locale, explicit week start, labels, tokens, `className`, slots, and source
  ownership cover stable needs without visual variants or product marker props.
- Accessibility and entrypoint: Calendar is client-only in `@nerio-ui/ui/client`; it requires one
  accessible naming strategy and exposes a labelled grid with one roving tab stop.

## Styling classification

Calendar geometry and day states use component aliases mapped to the approved control, surface,
border, action, focus, typography, density, and motion contracts. Today uses weight and underline;
selection uses accent fill and border; unavailable dates use muted text and line-through, so no
state relies on color alone. Compact density remaps the cell and padding aliases.

## State and accessibility evidence

- Month lengths, leap years, year boundaries, controlled and uncontrolled state, min/max, disabled
  dates, read-only, disabled, selected, today, outside-month, and invalid public dates are covered.
- Arrow, Home, End, Page Up, Page Down, Shift plus Page keys, Enter, and Space follow the approved
  calendar-grid model; direction-sensitive horizontal movement is verified in RTL.
- Full localized date labels with selected context on the focused day, abbreviated weekday headers
  with full `abbr` values, polite month announcements, one tab stop, grid-owned focus continuity,
  pointer selection, forced colors, reduced motion, narrow layout, touch, and zoom are covered by
  automated evidence.
- Real VoiceOver, iOS, NVDA, and physical-device evidence remains part of manual issue #143.

## Distribution evidence

Catalog, component matrix, Registry, CLI, MCP, documentation, `llms.txt`, package exports, source
installation, tests, changelog, visual fixtures, and platform coverage describe the same bounded
single-date contract.
