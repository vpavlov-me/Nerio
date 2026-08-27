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

| Time   | Scene                | Visual story                                                               | Canonical sources                                                                           |
| ------ | -------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 00–03s | Identity             | Official Nerio mark and wordmark resolve from the neutral canvas.          | `apps/docs/public/brand/logo.svg`, `docs/visual-language-1-0.md`                            |
| 03–10s | Type manifesto       | “Build the product.” gives way to the Purple-accented “Own the source.”    | `PROJECT.md`, `README.md`                                                                   |
| 10–14s | System language      | Actions, Forms, Navigation, Data, and Feedback sit under “One system.”     | `data/component-catalog.json`                                                               |
| 14–22s | Component portraits  | Button, Input, and Tabs receive large isolated editorial portraits.        | Button, Input, Tabs, Badge                                                                  |
| 22–26s | Built to compose     | Component names orbit one typographic composition claim.                   | `data/component-catalog.json`, `docs/visual-language-1-0.md`                                |
| 26–34s | Approval composition | The previously introduced components assemble into one release decision.   | Card, Progress, Badge, Avatar, Button                                                       |
| 34–37s | Developer experience | One exact public command supports the typographic “Inspect. Install. Own.” | `README.md`, Registry/CLI public contract                                                   |
| 37–39s | Outro                | Open-source beta status, React + TypeScript, and canonical URL close.      | `quality/release-metadata.json`, `packages/ui/package.json`, `apps/docs/lib/site-config.ts` |

Scene lengths include restrained 12-frame crossfades. The total composition is exactly 2,340 frames
at 60fps (39 seconds).

## Alternative compositions

- **Vertical:** 24 seconds at 1080×1920. Identity and manifesto stack vertically; component
  portraits become a single editorial column; the approval surface is recomposed below its title.
- **Square:** 15 seconds at 1080×1080. The cut prioritizes identity, manifesto, component
  portraits, approval composition, and the final open-source claim.
- **Hero loop:** 8 seconds at 1920×1080 and 30fps. The official mark, token arcs, and one Core action
  move on periodic frame functions so frame 240 returns to the opening state. It remains readable
  and complete without audio.

## Source inventory

### Real Core sources shown

- Button, Input, Tabs, Badge, Card, Avatar, and Progress;
- semantic text, surface, border, action, radius, and motion tokens;
- adapter-provided Lucide icons at the Nerio stroke contract;
- one static release-approval composition built from public Core components.

Product screenshots, state walkthroughs, toggle demonstrations, and simulated clicks are excluded.
Motion belongs to composition, scale, masks, and spatial assembly rather than UI state changes.

### Exact developer command shown

```bash
pnpm exec nerio add button
```

## Review gates

Before merge, the maintainer approves the storyboard, scene selection, visual direction, pacing,
public claims and URLs, the full horizontal draft, and representative vertical/square/Hero frames.
Audio remains a separate explicit approval. Generated video binaries stay outside normal Git history.
