# Nerio showreel

`apps/showreel` is a non-deployed Remotion workspace for source-first Nerio launch material. It
renders real Nerio components, token-driven surfaces, current public commands, and deterministic
same-origin Template captures. It does not add a public Core API, hosted application, remote render
service, or release claim.

## Compositions

| Composition             | Output    | FPS | Duration |
| ----------------------- | --------- | --- | -------- |
| `NerioShowreel`         | 1920×1080 | 60  | 48s      |
| `NerioShowreelVertical` | 1080×1920 | 60  | 24s      |
| `NerioShowreelSquare`   | 1080×1080 | 60  | 15s      |
| `NerioHeroLoop`         | 1920×1080 | 30  | 8s       |

The vertical and square cuts use format-specific scene order and layout rather than cropping the
horizontal composition. The Hero loop uses only periodic frame-derived motion and has no audio
dependency.

## Preview and render

From the repository root:

```bash
pnpm showreel:dev
pnpm showreel:capture
pnpm showreel:stills
pnpm showreel:render:main
pnpm showreel:render:vertical
pnpm showreel:render:square
pnpm showreel:render:hero
```

`showreel:capture` starts the docs app on `127.0.0.1:3100`, captures the canonical same-origin
Operations Workspace and Finance & Assets Views, and stops the server. Captures use a fixed viewport,
light mode, Purple theme, Comfortable density, LTR direction, reduced motion, and local deterministic
data. The committed captures are render inputs; rerun the command when either source View changes.

`showreel:stills` writes representative scene and poster frames to `apps/showreel/stills/`.
Rendered videos go to `apps/showreel/out/`. Both directories are ignored so draft binaries do not
enter Git history.

## Audio contract

Every composition is designed to work muted. No music or sound effects are committed. Approved
local audio may later be placed under `public/audio/` and referenced with `staticFile()` after its
license and final mix are reviewed. Placeholder copyrighted media must not be committed.

## Source and status contract

- Current public status: `1.0.0-beta.1`.
- Stable `1.0` must not be claimed before issue #151 is complete.
- Component names and commands come from the frozen Core 1.0 catalog, README, and API snapshot.
- Product screens come from `apps/docs/features/templates` through deterministic captures.
- `@nerio-ui/ui` and `@nerio-ui/ui/client` remain the actual component sources.
- The Remotion workspace must not change Core APIs or add showreel-only exports.

The full scene-to-source map is in [`docs/showreel-storyboard.md`](../../docs/showreel-storyboard.md).

## Remotion license

Remotion 4.0.512 is source-available under the Remotion License. The current public terms allow free
commercial creation for individuals and companies of up to three people; collaborations or companies
of four or more require a Company License. This workspace is a local creator/motion-design-system
workflow, not a customer-facing video automation product. The maintainer must keep the usage within
the applicable free-license threshold or obtain the appropriate Company License before use by a
larger organization. Review the current terms at <https://www.remotion.dev/> before distribution.

## Troubleshooting

- Install browser binaries with `pnpm exec playwright install chromium` if captures cannot launch.
- Run `pnpm install --frozen-lockfile` after switching branches.
- Remotion animation is frame-driven. Do not add CSS transitions, CSS animations, wall-clock timers,
  unseeded randomness, remote runtime assets, or browser-dependent measurements.
- If a Template route changes, update the source map and regenerate captures before rendering.
