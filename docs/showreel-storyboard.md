# Nerio source-first showreel storyboard

## Scope and status

This storyboard implements issue #291 as a presentation and launch asset outside the Core 1.0
package surface. The copy remains accurate for the public `1.0.0-beta.1` release. It does not claim
stable availability, introduce a hosted app, change Core APIs, or promote Template-local patterns.

The visual direction follows `docs/visual-language-1-0.md`: white and black foundations, cool
alpha-neutral grouping, restrained Purple accent, rounded neutral geometry, sparse borders, compact
internal spacing, and calm spatial motion. Decorative particles, glows, broad gradients, fake device
frames, and marketing-only component APIs are excluded.

## Main composition

| Time   | Scene                    | Visual story                                                                  | Canonical sources                                                                                 |
| ------ | ------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 00–03s | Identity                 | Official Nerio mark and wordmark resolve from the neutral canvas.             | `apps/docs/public/brand/logo.svg`, `docs/visual-language-1-0.md`                                  |
| 03–07s | Positioning              | “Source-first design system for modern digital products” meets real source.   | `PROJECT.md`, `README.md`, `quality/public-api-snapshot.json`                                     |
| 07–13s | Foundations              | Token roles become live Button, Input, Badge, and Progress surfaces.          | `packages/tokens/src/styles.css`, `@nerio-ui/ui`, `@nerio-ui/ui/client`                           |
| 13–24s | Core components          | Actions, forms, selection, feedback, and data display compose consistently.   | `data/component-catalog.json`, Button, Toggle, Checkbox, Tabs, Card, Badge, Avatar, Progress      |
| 24–32s | Interaction choreography | Real controlled state changes settle into the actual Nerio Dialog contract.   | Toggle, Switch, Progress, Dialog, DialogFooter                                                    |
| 32–40s | Product composition      | Two distinct real products demonstrate dense and operational composition.     | `/views/operations-workspace`, `/views/finance-assets`, `apps/docs/features/templates/catalog.ts` |
| 40–46s | Developer experience     | Package and source workflows use the exact current public commands.           | `README.md`, `quality/public-api-snapshot.json`, Registry/CLI public contract                     |
| 46–48s | Outro                    | Open-source beta status, React + TypeScript, and canonical URL close cleanly. | `quality/release-metadata.json`, `packages/ui/package.json`, `apps/docs/lib/site-config.ts`       |

Scene lengths include restrained 15-frame crossfades. The total composition is exactly 2,880 frames
at 60fps (48 seconds).

## Alternative compositions

- **Vertical:** 24 seconds at 1080×1920. Identity and positioning stack vertically; components use
  a single-column stage; product captures use tall windows rather than a crop of the wide frame.
- **Square:** 15 seconds at 1080×1080. The cut prioritizes identity, foundations, components,
  product composition, and the final developer/open-source claim.
- **Hero loop:** 8 seconds at 1920×1080 and 30fps. The official mark, token arcs, and one Core action
  move on periodic frame functions so frame 240 returns to the opening state. It remains readable
  and complete without audio.

## Source inventory

### Real Core sources shown

- Button and icon Button states;
- Toggle, Checkbox, Switch, and Tabs selection states;
- Input, Badge, Card, Avatar, Progress, Dialog, and DialogFooter;
- semantic text, surface, border, action, radius, and motion tokens;
- adapter-provided Lucide icons at the Nerio stroke contract.

### Real product sources shown

- Operations Workspace: operational health, initiative ownership, activity, and responsive shell.
- Finance & Assets: portfolio, holdings, transactions, security, and dense numeric hierarchy.

The Template captures are same-origin, deterministic, and generated from `apps/docs`. They are the
only screenshot-based material and remain a minority of the showreel.

### Exact developer commands shown

```bash
pnpm add @nerio-ui/ui @nerio-ui/tokens @nerio-ui/adapters
pnpm add -D @nerio-ui/registry@1.0.0-beta.1 @nerio-ui/cli@1.0.0-beta.1
pnpm exec nerio init
pnpm exec nerio add button
pnpm exec nerio doctor
```

```tsx
import { Card } from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import "@nerio-ui/ui/styles.css";
```

## Review gates

Before merge, the maintainer approves the storyboard, scene selection, visual direction, pacing,
public claims and URLs, the full horizontal draft, and representative vertical/square/Hero frames.
Audio remains a separate explicit approval. Generated video binaries stay outside normal Git history.
