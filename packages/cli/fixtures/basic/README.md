# Nerio CLI fixture

The executable fixture in `../verify.js` creates temporary projects and verifies both local-path and HTTP registry installs:

```bash
nerio init
nerio add button
nerio doctor
```

It asserts that Button installs only its component source, direct source dependencies, utility, and scoped styles.
