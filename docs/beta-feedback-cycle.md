# Core 1.0 beta feedback cycle

This document records the completed manual beta publication and the external evaluation required
by issue #146. It does not authorize another npm publication, dist-tag change, Git tag, GitHub
Release, tester outreach, or a stable-release decision.

## Candidate record

| Field               | Required value                                                               |
| ------------------- | ---------------------------------------------------------------------------- |
| Version             | `1.0.0-beta.0`                                                               |
| Frozen API baseline | `3689a58d48878bfdbfa8ad6a27383c08ecf97ea3`                                   |
| Publish candidate   | `5ffbd44e208039c9007ae3397a74d279d4a22eff`                                   |
| Registry revision   | `v1.0.0-beta.0`                                                              |
| npm tag             | `beta`                                                                       |
| Protected tags      | Do not move `latest` or `alpha`                                              |
| Git tag and Release | `v1.0.0-beta.0`, GitHub prerelease, created from the exact publish candidate |
| Window opens        | `2026-08-01T16:42:44Z`                                                       |
| Earliest close      | `2026-08-15T16:42:44Z`                                                       |

The publish candidate must contain the frozen API baseline plus only reviewed release preparation
and approved blocker fixes. Record any frozen API change, its SemVer classification, migration
update, snapshot approval, and targeted consumer or accessibility revalidation.

## Pre-publication decision

The maintainer records a single `Approved to publish beta.0` or `Blocked before beta.0` decision
after all of the following are complete:

- the `dev -> main` release gate passes on the exact candidate, including Chromium, Firefox,
  WebKit, visual, API, package, Registry, CLI, MCP, adapter, accessibility-contract, and production
  dependency checks;
- `NERIO_RELEASE_EXPECT_PUBLIC=1 pnpm validate:release` and `pnpm pack:check` pass in a clean
  checkout;
- every tarball's manifest, exports, files, dependency graph, license, source contents, and
  exclusion boundaries are reviewed manually;
- npm identity, scope access, required 2FA, provenance, and trusted-publishing configuration are
  confirmed without recording credentials;
- the alpha-to-beta migration guide and known limitations are reviewed;
- there is no open P0/P1 or accepted beta-blocking P2 issue.

Decision: **Approved to publish beta.0** on 2026-08-01. The exact-candidate gate, tarball review,
npm access and 2FA checks, migration review, and blocker review passed before publication.

## Public verification record

Every row records post-publication evidence. A package is not verified merely because `npm publish`
returned success.

| Artifact             | Exact version or reference | Provenance                | Public metadata | Clean install | Result |
| -------------------- | -------------------------- | ------------------------- | --------------- | ------------- | ------ |
| `@nerio-ui/tokens`   | `1.0.0-beta.0`             | npm registry signature: 1 | Verified        | Passed        | Passed |
| `@nerio-ui/adapters` | `1.0.0-beta.0`             | npm registry signature: 1 | Verified        | Passed        | Passed |
| `@nerio-ui/registry` | `1.0.0-beta.0`             | npm registry signature: 1 | Verified        | Passed        | Passed |
| `@nerio-ui/ui`       | `1.0.0-beta.0`             | npm registry signature: 1 | Verified        | Passed        | Passed |
| `@nerio-ui/cli`      | `1.0.0-beta.0`             | npm registry signature: 1 | Verified        | Passed        | Passed |
| `@nerio-ui/mcp`      | `1.0.0-beta.0`             | npm registry signature: 1 | Verified        | Passed        | Passed |
| Immutable Registry   | `v1.0.0-beta.0`            | N/A                       | Verified        | Passed        | Passed |
| Git tag              | `v1.0.0-beta.0`            | Signed: verified          | Exact SHA       | N/A           | Passed |
| GitHub Release       | `v1.0.0-beta.0` prerelease | Exact SHA and tag match   | Links verified  | N/A           | Passed |

After all six packages exist, run the published-artifact smoke:

```bash
NERIO_RELEASE_EXPECT_PUBLIC=1 NERIO_RELEASE_EXPECT_PUBLISHED=1 pnpm test:release-consumer
```

The command passed against all six public packages after publication. It verified coordinated
public metadata and dependencies, package and source installation, the documented eight-command
local CLI workflow, package-qualified one-off CLI execution, MCP bin discovery, and a clean Next.js
consumer build. npm `beta` points to `1.0.0-beta.0` for every package; `alpha` and `latest` were not
moved. npm reports one registry signature per package. This release used interactive 2FA and npm
registry signatures; it does not claim a separate provenance attestation.

Also verify package mode and source mode in separate clean supported Next.js consumers, the
documented local and package-qualified CLI commands, Registry `diff` and update dry run,
`nerio.lock.json` portability, and MCP startup through the public package bin.

## Cohort

Use anonymous participant IDs in the repository. Keep names, contact details, private product
information, credentials, and proprietary source outside public evidence.

At least three independent external consumers must complete meaningful evaluations:

1. a product designer or design-system maintainer evaluates visual quality, API clarity, themes,
   density, responsive behavior, RTL, accessibility, and the Core/Pro boundary;
2. a frontend engineer integrates package mode in a real product or representative independent
   application;
3. a source-mode consumer installs, locally modifies, diffs, and updates Registry components.

Across the cohort, at least one evaluation must exercise Calendar and DatePicker, and at least one
must exercise Registry `diff` and update behavior. Internal pilot products do not count toward the
three external consumers.

## Evaluation form

Create one copy per participant:

```text
Participant ID:
Role:
Independent product or representative context:
Beta version and exact install date:
Operating system, browser, Node, React, Next.js, TypeScript, and Tailwind versions:
Mode: package / source / both
Workflows completed:
Calendar and DatePicker exercised: yes / no
Registry diff and update exercised: yes / no
MCP exercised: yes / no
Accessibility and device contexts exercised:
Installation outcome:
Migration outcome:
API and composition clarity:
Visual quality and customization:
Responsive, RTL, localization, reduced-motion, and accessibility observations:
Unexpected behavior:
Missing platform primitive or product-specific request:
Would adopt for a real product: yes / no / with conditions
Blocking conditions:
Supporting issue links:
Consent to publish an anonymized summary: yes / no
```

Meaningful evaluation requires a completed install plus at least one real composition or source
lifecycle. Browsing documentation or giving general impressions alone does not count.

## Finding intake

Create one GitHub issue per actionable finding. Record:

- participant ID and beta version without private identity or product data;
- affected public contract: package, API, accessibility, visual, installation, migration,
  Registry/source upgrade, CLI, MCP, support range, or documentation;
- severity: P0, P1, P2, or P3;
- reproducible environment and steps;
- expected and actual behavior;
- Core defect, native-platform guidance, consumer-owned workflow, Pro candidate, or rejected
  request classification;
- release impact: blocks current beta, blocks stable 1.0, or non-blocking;
- resolution, verification, and follow-up beta when applicable.

P0/P1 findings require an immediate stop and a new beta. Resolve accepted API, accessibility,
installation, migration, Registry/source-upgrade, or public-command P2 blockers before stable 1.0.
Do not add speculative product components or reopen the frozen Core boundary for isolated requests.

## Progress ledger

| Participant | Role    | Package mode | Source mode | Calendar/DatePicker | Registry update | Completed | Findings |
| ----------- | ------- | ------------ | ----------- | ------------------- | --------------- | --------- | -------- |
| External-01 | Pending | Pending      | Pending     | Pending             | Pending         | Pending   | Pending  |
| External-02 | Pending | Pending      | Pending     | Pending             | Pending         | Pending   | Pending  |
| External-03 | Pending | Pending      | Pending     | Pending             | Pending         | Pending   | Pending  |

## Closing report

The maintainer records one final recommendation: **Proceed to stable documentation** or
**Blocked before stable**. Include:

- every beta version, exact commit, npm package, Registry, tag, and GitHub Release link;
- the UTC feedback-window start and end and proof that at least 14 calendar days elapsed;
- an anonymized cohort summary and the workflows each participant completed;
- package/source installs, Calendar/DatePicker, Registry update, and MCP results;
- feedback themes and P0/P1/P2/P3 counts;
- linked issues, resolutions, rejected requests, and Core/native/consumer/Pro rationale;
- every frozen API change between betas and its migration/snapshot evidence;
- confirmation that no P0/P1 or accepted stable-blocking P2 remains;
- explicit maintainer confirmation of the visual language and final Core scope after external use.

Issue #146 remains open until every exit criterion above has real evidence. Templates, automated
checks, internal pilots, or an elapsed calendar window alone are not completion evidence.
