# Migrate from Core 1.0.0-beta.0 to the next beta

This guide records only consumer-visible changes accepted after the `1.0.0-beta.0` publication. It
will be finalized with the coordinated next-beta preparation; no package is published by this work.

## Runtime and dependency support

- Use Node.js 22 or 24. Node 20 is no longer in the supported public package range because the
  release matrix does not retain an independent Node 20 consumer.
- Use Tailwind CSS 4.1.0 or newer within the supported 4.x line. Tailwind CSS 4.0.0 fails the clean
  Next.js 16.2/Turbopack consumer build while evaluating PostCSS scanner options; 4.1.0 is the
  verified minimum.
- React remains `>=19 <20`, Next.js remains `>=16.2.0 <17`, and TypeScript remains `>=5.9 <6`.

Update the complete coordinated package set and the consumer toolchain together, then run:

```bash
pnpm install
pnpm typecheck
pnpm build
```

Source-install consumers should also run `pnpm exec nerio doctor`, `pnpm exec nerio diff`, and
`pnpm exec nerio update --dry-run` before applying a Registry update.

## Calendar and DatePicker server rendering

`Calendar` no longer reads the host clock during initial rendering. The visible month now resolves
in this order: controlled `month`, `defaultMonth`, controlled `value`, `defaultValue`, consumer-owned
`today`, then the stable neutral month `1970-01-01`.

- Pass `today` when the product wants a current-day marker or an empty Calendar/DatePicker to open
  on the consumer's current month.
- Without `today`, no day receives `aria-current="date"` or `data-today`.
- When every rendered date is unavailable, the grid receives the fallback tab stop; an unavailable
  day is never the roving tab stop.
- DatePicker keeps its visible value in the trigger name/content without repeating it for self-named
  triggers. Controls named by Field or explicit ARIA retain the selected value once in
  `aria-describedby`; consumer descriptions and the localized open/change instruction remain.

```tsx
<Calendar aria-label="Billing date" today={requestCalendarDate} />
```

Derive `requestCalendarDate` in the application boundary that owns the user's date policy. Do not
derive it inside a server/client component render if the two environments may disagree.

## Nerio-owned interactive types

The UI package pins `@base-ui/react` to `1.6.0`, and public component props and event-detail aliases
no longer derive from Base UI declarations. This is a breaking beta type cleanup even though the
runtime interaction model is retained.

- Change handlers receive bounded `NerioChangeEventDetails` or `NerioEventDetails` contracts with
  named reason unions. Cancellation, propagation control, native event access, trigger access, and
  component-specific fields remain available where the runtime supports them.
- Button, Toggle, Checkbox, RadioGroup, Select, Slider, Dialog, Sheet, Popover, Tooltip,
  DropdownMenu, Toast, Tabs, Command, and DatePicker now expose Nerio-owned props/state types.
- `TabsValue` is now `string`; replace numeric or object tab values with stable string identifiers.
- Toast manager add/update/promise inputs now use the exported Nerio `ToastManager*` types.
- Base UI-only props that Nerio wrappers did not forward truthfully are no longer advertised.
  Native attributes, controlled/uncontrolled state, `render`, refs, cancellation, and documented
  accessibility behavior remain part of the Nerio contract.

When an explicit event-detail annotation was imported from Base UI, switch it to the matching
Nerio export:

```tsx
import type { SelectChangeEventDetails } from "@nerio-ui/ui/client";

function handleValue(value: string, details: SelectChangeEventDetails) {
  if (value === "locked") details.cancel();
}
```

Run TypeScript before updating the reviewed API snapshot so removed upstream-only props are found at
the consumer boundary rather than at runtime.

## Registry integrity and atomic CLI operations

Registry schema 1.1 adds `sha256-<hex>` integrity to every source file. Remote Registry access now
requires HTTPS by default and enforces bounded timeouts, response sizes, redirects, content types,
manifest shape, paths, duplicate targets, dependency closure, and file integrity. Use
`--allow-insecure-http` only for a trusted local HTTP Registry; existing production mirror URLs
should move to HTTPS. The reviewed limits are 10 seconds for request/body reads, 2 MiB for a
manifest, 4 MiB for each source response, and three redirects.

`nerio add` and `nerio update` now validate and stage the complete operation before touching
consumer-owned source. Source files commit as one recoverable transaction, and
`nerio.lock.json` commits only after source succeeds. Any failure restores the prior source and lock
state and removes transaction artifacts. If the process or machine stops between commits, the next
Registry command validates the durable local journal and restores the previous source and lock; if
both source and lock had committed, it retains them and removes only the orphaned journal. Dry-run
output, local-change preservation, `--overwrite`, and intentional `--force` behavior remain
unchanged.

Before applying the next Registry:

```bash
pnpm exec nerio doctor
pnpm exec nerio diff
pnpm exec nerio update --dry-run
pnpm exec nerio update
pnpm exec nerio diff
```

Custom local Registry authors must add the declared SHA-256 integrity for every source file. Lock
files created by beta.0 remain readable and acquire integrity metadata on the next successful add or
update.
