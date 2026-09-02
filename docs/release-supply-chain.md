# Release supply-chain contract

This document prepares release evidence. It does not publish a package, request or store an npm
credential, create a tag or GitHub Release, or move an npm dist-tag.

## Exact candidate

Manual release-gate dispatch requires `candidate_sha`, an exact lowercase 40-character commit SHA.
The candidate job fetches that object, proves it belongs to the repository and is contained by the
`dev` release branch, and publishes a SHA-named identity artifact. Every downstream release job
checks out the same SHA explicitly. A branch name, default checkout, abbreviated SHA, or mutable tag
is not an acceptable candidate identity.

## GitHub Actions

Every third-party Action reference is pinned to an immutable commit SHA. The trailing version
comment keeps reviews readable. Dependabot's monthly `github-actions` updates remain enabled, but a
version proposal must still pass workflow contract tests and maintainer review before merge.

The visual-baseline label lookup authenticates with the workflow `GITHUB_TOKEN` and only requests
read access to pull-request metadata. Release and PR workflows retain read-only repository
permissions and contain no publication step.

## npm trusted publishing and provenance

For a separately authorized publication, configure npm trusted publishing against the exact
repository, release workflow filename, and protected release environment. Prefer short-lived OIDC
identity over a long-lived automation token. The publication workflow must request
`id-token: write` only in its isolated publish job, while repository contents stay read-only.

Before enabling that job, verify:

1. the npm organization and each of the six package names are controlled by the maintainer;
2. the trusted-publisher repository, workflow filename, and environment match exactly;
3. environment protection requires the intended maintainers and release branch;
4. npm provenance is enabled and the resulting attestation identifies the exact candidate SHA;
5. the package version, Registry revision, Git tag, GitHub Release, and protected dist-tags are
   compared after publication.

Do not paste npm tokens, recovery codes, cookies, signing keys, or OIDC responses into issues,
artifacts, logs, repository files, or agent prompts. This repository's current workflows
intentionally have neither credentials nor publish authority.

## SBOM

`pnpm generate:sbom --candidate <sha>` creates a deterministic CycloneDX 1.5 record for
`@nerio-ui/tokens`, `@nerio-ui/adapters`, `@nerio-ui/ui`, `@nerio-ui/registry`, `@nerio-ui/cli`,
and `@nerio-ui/mcp`, plus their declared runtime and peer relationships. The candidate SHA is
recorded at metadata and package-component level.

The release package job runs `pnpm validate:sbom`, then retains the result as
`sbom-<candidate_sha>`. This is candidate evidence, not proof that a publication occurred.
