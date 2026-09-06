# Core 1.0 publication record

## Public release

[Nerio Core 1.0.0](https://github.com/vpavlov-me/Nerio/releases/tag/v1.0.0) was published on
2026-09-05. The six public packages (`tokens`, `adapters`, `ui`, `registry`, `cli`, and `mcp` under
`@nerio-ui`) resolve to `1.0.0` through both npm `latest` and `stable`. Historical `beta` remains
on `1.0.0-beta.1` and `alpha` on `0.1.0-alpha.2`.

- Exact approved commit: `6bc7962f20f1d09f186d89d9ed0294a4b2630482`.
- Signed tag: `v1.0.0`; annotated tag object `0e7bcdda52e2e895137f9076e114686ed1b4c553`.
- Tree: `e4e41d66199ae67e81c8fe3fb9d476bf4ca65817`.
- Immutable Registry: version `1.0.0`, revision `v1.0.0`, schema `1.1.0`, style contract
  `tailwind-v1`, 46 items.
- Registry manifest SHA-256: `5309074b769563ad9922266e522c88f934c21a5b3cf747aec546482fb5a4d849`.
- [Archive hashes](https://github.com/vpavlov-me/Nerio/releases/download/v1.0.0/artifact-manifest.json).
- [Candidate-bound CycloneDX SBOM](https://github.com/vpavlov-me/Nerio/releases/download/v1.0.0/nerio-6bc7962f20f1d09f186d89d9ed0294a4b2630482.cdx.json).
- [Publication evidence](https://github.com/vpavlov-me/Nerio/issues/151#issuecomment-5554193207).

All six public archives were downloaded and matched the inspected archives byte for byte.
SHA-1/SHA-256/SHA-512 integrity and npm registry signatures were verified, including signing-key
validity at publication. The tag signature passed local verification and GitHub reports it valid.

The maintainer explicitly approved manual account-2FA publication without CI provenance for this
release. Registry signatures and archive hashes are not candidate-linked provenance. Trusted
publishing/provenance remains a follow-up, not a claimed property of these artifacts.

## Public consumer evidence

The public-registry checks used Node 22.23.2 and pnpm 11.7.0, clean consumer directories and fresh
stores, and exact npm versions without file/workspace dependency overrides:

- minimum and current supported Next.js profiles passed;
- all six package manifests and coordinated dependencies passed;
- the eight-command local CLI lifecycle, representative source installations, immutable Registry,
  portable installed metadata, and diff/update planning passed;
- package-qualified one-off CLI and MCP execution and packaged MCP discovery passed;
- package and source Next.js builds passed, including Tailwind with and without Preflight;
- the maintained Vite fixture passed with representative imports and optional-peer isolation;
- all six final `latest`/`stable` tags and protected prerelease tags were checked after promotion.

These results complement the exact-candidate CI and human smoke; they do not claim completion of
every migration, assistive-technology, physical-device, or independent-consumer scenario. The wider
programs in [#585](https://github.com/vpavlov-me/Nerio/issues/585) and
[#146](https://github.com/vpavlov-me/Nerio/issues/146) remain deferred as agreed.

## Post-publication status-update policy

The maintainer approved a separate publication-status documentation PR after release. This is not
a new release candidate and must not authorize republishing `1.0.0`, moving the release tag, or
rewriting human evidence.

The existing pre-publication guard remains unchanged: only the three evidence files in
`stable-accessibility-evidence-paths.mjs` may follow the smoke candidate before a release is approved.

For the explicit `Published stable 1.0` status only, the validator additionally requires:

1. The canonical publication receipt in `quality/core-1-0-publication.json` identifies the exact
   annotated `v1.0.0` tag object and commit, and that commit is contained by current history.
2. The original smoke candidate precedes that release commit with only the previously allowed
   evidence-only delta. Original smoke, audit, readiness, and platform records remain unchanged.
3. Current release metadata matches the tagged metadata except for `docsStatusLabel`.
4. Every tracked or untracked, staged or unstaged change relative to the tag is restricted to the
   exact status-documentation/validator files listed in `published-release-documentation.mjs`.
   Changed status files must remain regular files. Runtime, public packages, dependencies,
   lockfiles, API/Registry snapshots, and other docs routes are not allowlisted.
   The two executable TSX documents must additionally match the exact reviewed publication-copy
   hashes; their paths cannot admit later behavioral changes under this exception.

The current-repository boundary is also checked by `pnpm validate:repo-artifacts`, which runs
unconditionally with full Git history in the PR gate's `always-fast` job and the Release gate's
`release-quality` job. It does not depend on the optional manual-audit scope. The narrowly
allowlisted browser-test change only aligns discovery assertions with the published status.
The two workflow files may add only the exact mandatory bootstrap derived from the reviewed
immutable policy commit. That bootstrap loads the guard from Git, not the candidate worktree,
and checks the guard, callers, tests, receipt, and workflow bytes against that immutable anchor.
The receipt keeps the 1.0.0 boundary active if a later change attempts to revert the status label.
Changing protected GitHub workflow settings or replacing the policy anchor itself remains a
maintainer-reviewed policy change, not an authority granted by this documentation exception.

The output explicitly describes preserved historical evidence and never claims a new human smoke
for the documentation commit. Missing/moved/lightweight tags, changed release identity, alternate
evidence paths, metadata drift, and changes outside this boundary fail validation. Prepared or
future versions do not enter this mode and retain the exact-candidate gate.

This receipt is reviewed release bookkeeping, not a substitute for online npm/GitHub verification
or cryptographic provenance. Existing CI checks, protected-branch rules, and separate maintainer
approval for merging into `main` still apply. Updating active documentation does not modify the
historical copy stored in the immutable release tag.
