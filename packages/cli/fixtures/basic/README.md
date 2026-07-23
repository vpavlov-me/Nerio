# Nerio CLI fixture

The executable fixture in `../verify.js` creates temporary projects and verifies both local-path and HTTP registry installs:

```bash
nerio init
nerio add button
nerio diff button
nerio update button --dry-run
nerio doctor
```

It asserts that Button installs only its exact source closure, records portable original hashes, and
supports non-destructive drift inspection and update planning.
