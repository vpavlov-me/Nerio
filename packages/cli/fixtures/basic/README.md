# Nerio CLI fixture

The executable fixture in `../verify.js` creates temporary projects and verifies both local-path and HTTP registry installs:

```bash
pnpm add -D @nerio-ui/registry@0.1.0-alpha.1 @nerio-ui/cli@0.1.0-alpha.1
pnpm exec nerio init
pnpm exec nerio add button
pnpm exec nerio diff button
pnpm exec nerio update button --dry-run
pnpm exec nerio doctor
```

It asserts that Button installs only its exact source closure, records portable original hashes, and
supports non-destructive drift inspection and update planning.
