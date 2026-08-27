# Direction, RTL, and localization

## Status

This is the canonical Core 1.1 contract for text direction, logical layout, locale-sensitive
component behavior, and Core-owned copy. It applies to package and source-installed consumers on
`dev`; it is not part of the isolated Core 1.0 release candidate.

## Direction contract

- The document or the nearest intentional product surface owns the HTML `dir` attribute. Components
  inherit CSS direction and MUST NOT require a Nerio provider for layout.
- Use logical CSS properties and utilities for flow-relative layout. Physical `left`, `right`,
  `top`, and `bottom` remain valid only for an explicitly physical API such as Sheet or Sidebar
  `side`, viewport centering, geometry reported by a positioning primitive, or a physical swipe.
- Base UI behavior does not infer the HTML direction. Applications containing direction-sensitive
  Base UI primitives MUST pair the HTML `dir` value with Base UI's `DirectionProvider`. Nerio does
  not wrap or duplicate that provider.
- Direction is deterministic during server rendering. Do not read `window`, `navigator`, or the
  computed style to choose initial markup. A runtime direction switch updates both the HTML `dir`
  value and the Base UI provider value in the same application state transition.
- Portaled content relies on the document direction for CSS and the Base UI provider for behavior.

## Locale contract

- Nerio does not own a locale provider, translation catalogs, message loading, locale routing, or
  product copy.
- A component accepts `locale` only when it owns durable locale-sensitive formatting, filtering, or
  accessible value text. Calendar, DatePicker, Slider, and Command are the current Core examples.
- Locale-sensitive server markup MUST use an explicit deterministic locale. Calendar and DatePicker
  default to `en-US`; applications pass the same explicit locale on the server and client when they
  need another locale.
- `Intl` owns supported date, number, and collation behavior. Product-specific parsing, currencies,
  time zones, plural rules, and domain terminology remain consumer-owned unless a focused component
  contract says otherwise.
- Calendar keeps `firstDayOfWeek` separate from `locale`: locale formats labels while the explicit
  week-start prop controls grid order. Horizontal day navigation follows direction; Home and End
  follow the rendered week.

## Core-owned copy

Built-in English labels are fallback copy, not a translation system. A component that owns a label
MUST expose a bounded override when the label is not supplied as consumer content. Current examples
include Dialog and Sheet close labels, Pagination navigation labels, Calendar navigation labels,
DatePicker trigger and dialog labels, Sidebar collapse labels, and Toast viewport and dismissal
labels.

Decorative directional icons follow their surrounding logical slot. Icons whose meaning is
explicitly previous/next MAY mirror in RTL; icons with product meaning MUST NOT be mirrored merely
because they appear in a leading or trailing slot.

## Audited surfaces

| Surface                                     | Accepted contract                                                                                      |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Breadcrumbs and Button                      | Consumer copy; logical flow and slots; product icons do not mirror automatically.                      |
| Calendar and DatePicker                     | Explicit locale and week start, deterministic dates, RTL keyboard order, and overridable labels.       |
| Command                                     | Locale-aware filtering with consumer-owned item copy.                                                  |
| Dialog                                      | Physical viewport centering with inherited content direction and an overridable close label.           |
| Dropdown Menu, Popover, Select, and Tooltip | Base UI provider owns directional behavior and positioned geometry; content inherits HTML direction.   |
| Pagination                                  | Logical previous/next controls with overridable visible and accessible labels.                         |
| Sheet and Sidebar Primitive                 | `side` remains an explicitly physical API; content direction and logical layout remain independent.    |
| Slider and Tabs                             | Base UI provider owns horizontal direction while Nerio preserves accessible focus and value contracts. |
| Toast                                       | Viewport uses logical inline-end placement; swipe direction and owned labels are overridable.          |

Sidebar isolates its internal flex axis to keep `side="left" | "right"` physical. The canonical
token stylesheet captures the nearest explicit HTML direction in an inherited custom property and
restores it through the provider content boundary, including source installs and server-rendered text
nodes before hydration.

## Next.js setup

Use one client boundary to keep the HTML and Base UI behavior values aligned:

```tsx
"use client";

import { DirectionProvider } from "@base-ui/react/direction-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <DirectionProvider direction="rtl">{children}</DirectionProvider>;
}
```

Set the matching document attribute in the root layout:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Vite setup

Set `dir` on the document root and pass the same application state to Base UI:

```tsx
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { createRoot } from "react-dom/client";

const direction = "rtl" as const;
document.documentElement.dir = direction;

createRoot(document.getElementById("root")!).render(
  <DirectionProvider direction={direction}>
    <App />
  </DirectionProvider>,
);
```

## Validation boundary

`quality/core-direction-localization.json` records the machine-readable contract and audited
surfaces. `pnpm validate:direction-localization` rejects dependency drift, missing documentation,
non-deterministic defaults, and unsupported component claims. Contract, accessibility, and browser
tests cover representative LTR/RTL keyboard behavior, portals, safe areas, formatting, hydration,
reflow, and overridable labels. Real assistive-technology and physical-device evidence remains in
the manual audit rather than being inferred from automated checks.

## Out of scope

Translation frameworks, message catalogs, locale routing, product voice, consumer data
localization, currency or time-zone policy, bidirectional text sanitization, a new appearance axis,
or changes to the isolated Core 1.0 release candidate.
