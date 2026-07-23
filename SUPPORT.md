# Support

## Questions and usage help

Use GitHub Discussions for implementation questions, API ideas, and show-and-tell once Discussions are enabled. Until then, open a GitHub issue with a clear title and enough context to reproduce the problem.

## Bugs

Use the bug report template and include a minimal reproduction whenever possible.

## Feature proposals

Use the feature request template before implementing a substantial new component, token contract, or API change.

## Version and source-install support

Nerio coordinates the public `@nerio-ui/*` package versions. A released CLI defaults to the
immutable Registry packed with its compatible release; a moving development branch is never the
default install source. Stable releases follow Semantic Versioning. Prereleases may refine public
contracts before 1.0, but every breaking or migration-sensitive change must be called out in the
changelog and release notes.

Deprecated public APIs remain available for the documented compatibility window and identify the
preferred replacement. Removal requires the corresponding major-release or explicitly documented
prerelease migration. Registry schema changes reject unsupported future readers instead of being
interpreted silently.

Source-installed files belong to the consuming project. Nerio records original hashes and
dependency closure in `nerio.lock.json`, but it does not store consumer source content or synchronize
in the background. Use `nerio diff` and `nerio update --dry-run` to review upstream changes. A normal
update may replace only files that still match their recorded original content; local modifications
are preserved. `--force` is an explicit replacement decision and should be used only after review or
version-control backup.

Report Registry/CLI version mismatches, unsupported schema diagnostics, or reproducible unsafe
update behavior as release-blocking bugs. Product-specific source edits and merge decisions remain
consumer-owned.

## Security

Do not use issues or discussions for security reports. Follow [SECURITY.md](./SECURITY.md).
