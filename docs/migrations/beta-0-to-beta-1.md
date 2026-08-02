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

## Other public changes

Additional post-beta API, Registry, CLI, or MCP changes will be added only when their implementation
and migration evidence merge. Historical beta.0 behavior remains documented in the release record.
