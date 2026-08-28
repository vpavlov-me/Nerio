# Nerio CLI fixture

The executable fixture in `../verify.js` creates temporary projects and verifies both local-path and HTTP registry installs:

```bash
pnpm add -D @nerio-ui/registry@1.0.0-beta.1 @nerio-ui/cli@1.0.0-beta.1
pnpm exec nerio init
pnpm exec nerio add button card --dry-run
pnpm exec nerio add button card
pnpm exec nerio diff button
pnpm exec nerio update button --dry-run
pnpm exec nerio doctor
```

It asserts that requested items install as one deterministic dependency union and atomic source plus
lock transaction, records portable original hashes, and supports non-destructive drift inspection
and update planning.
