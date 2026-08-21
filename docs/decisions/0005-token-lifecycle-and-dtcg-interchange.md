# ADR 0005: Token lifecycle and DTCG interchange

## Status

Accepted

## Context

Nerio's public token values, aliases, theme and mode mappings, and density remaps are authored in
`packages/tokens/src/styles.css`. That CSS is the runtime contract used by package consumers,
source-installed components, the documentation application, Registry fixtures, and validation.
The source-backed foundation metadata introduced by issue #487 already proves that deterministic
projections can be derived from this contract without copying values into documentation.

CSS does not carry every piece of metadata required by design tools and token lifecycle tooling. In
particular, it does not reliably encode a DTCG type, human-readable purpose, public layer, lifecycle
state, replacement, or the relationship between runtime sets. A hand-maintained JSON file containing
the same values would create a second source of truth, while making JSON canonical now would put the
frozen package, Registry, source-install, and runtime contracts at unnecessary risk.

The current stable Design Tokens Community Group release is 2025.10. Its Format module defines
tokens, groups, types, aliases, `$deprecated`, and vendor extensions. Its Color module defines the
portable color value model. Its Resolver module defines sets and modifiers that can describe
conditional resolution. DTCG 2025.10 is a stable Community Group Report intended for
implementation, but it is not a W3C Standard. Nerio must version its claimed compatibility and must
not silently follow preview drafts.

Issue #490 permits this decision work before stable Core 1.0. The generator, public package export,
and downstream design-tool integration remain post-1.0 implementation work.

## Decision

Nerio will keep CSS and source metadata canonical and expose token interoperability through
one-way, deterministic, versioned DTCG projections. Generated artifacts are downstream contracts,
not authoring sources, and design tools cannot write values back into Core.

## Rules

### 1. Canonical sources and generation direction

Nerio will use a one-way generation model:

```text
styles.css values, aliases, and runtime selectors
                     +
metadata without values, aliases, or resolved output
                     |
                     v
       validated internal token model
          |                     |
          v                     v
  nerio.tokens.json     nerio.token-sets.json
```

- `packages/tokens/src/styles.css` remains the only canonical source for token values, CSS variable
  identities, alias relationships, and theme/mode/density selector mappings.
- A source metadata descriptor may become canonical only for facts CSS cannot express cleanly:
  DTCG type, description, primitive/semantic/component layer, lifecycle state, replacement, and
  intentional export visibility. It MUST NOT contain token values, resolved values, CSS aliases, or
  duplicated runtime mappings.
- The existing #487 parser and validation approach SHOULD be extended or shared rather than replaced
  by an unrelated parser.
- Generated artifacts MUST be committed, marked as generated, reproducible from a clean checkout,
  and rejected by validation when they drift.
- Generated JSON is an interchange surface, not an authoring surface. Pull requests MUST change the
  canonical CSS or metadata descriptor and regenerate it; direct edits are invalid.
- A future move to structured token authoring requires a separate ADR, an explicit migration plan,
  exact CSS equivalence evidence, package/source-install compatibility, and maintainer approval.

The planned package paths are:

- generated format artifact: `packages/tokens/src/generated/nerio.tokens.json`;
- generated runtime-set manifest: `packages/tokens/src/generated/nerio.token-sets.json`;
- public subpath after implementation approval: `@nerio-ui/tokens/tokens.json`;
- public runtime-set subpath after implementation approval:
  `@nerio-ui/tokens/token-sets.json`.

Adding those files or exports is not part of this ADR change.

### 2. Stable identity and layers

Every exported token will retain its complete CSS variable identity in Nerio metadata. Removing the
leading `--` is not a rename; the identity remains `--n-*` for compatibility and migration.

The DTCG document will group tokens by Nerio's public layers:

- `primitive` for raw, immutable scales;
- `semantic` for reusable intent;
- `component` for family or component customization contracts.

Leaf names will preserve the CSS-variable name without the leading `--n-`. The canonical CSS name
and layer will also be recorded in the `com.vpavlov.nerio` extension. Groups organize the artifact
but MUST NOT be used as a substitute for explicit type or layer metadata.

The generator MUST reject duplicate CSS identities, duplicate DTCG paths, case-folded collisions,
reserved-name collisions, and paths that cannot be represented without an explicit stable mapping.

### 3. DTCG mapping

The interchange artifact will target the exact stable DTCG 2025.10 Format and Color modules.

- Every token MUST have a valid `$type`, directly or through an unambiguous typed group.
- Primitive CSS values will be converted to the corresponding DTCG value model when the conversion
  is lossless and validated.
- Direct CSS aliases such as `var(--n-space-4)` will remain token references rather than flattened
  values.
- Chained aliases will be preserved and checked for missing targets, cycles, and type mismatches.
- Compound values will use DTCG composite types only when the CSS source represents one stable
  conceptual token. A CSS shorthand MUST NOT be guessed into a composite if round-trip meaning is
  ambiguous.
- Colors will use the DTCG Color value model with an explicit color space and alpha. A convenience
  hex value MAY be included only when it agrees with the canonical parsed color.
- Dimensions will use DTCG-supported units. Unsupported or context-dependent CSS expressions MUST
  fail with an actionable classification error or be intentionally excluded with a documented
  reason; they MUST NOT be silently coerced.
- Durations, cubic Bézier curves, font families, font weights, numbers, borders, shadows,
  transitions, gradients, and typography will use their DTCG types only when the canonical value can
  be represented faithfully.
- Descriptions will explain intent and consumer usage. They MUST NOT restate only the current value.
- `$deprecated` will carry the public deprecation explanation. Replacement identity and lifecycle
  dates will use the `com.vpavlov.nerio` extension because DTCG does not standardize those fields.

Nerio will use the reverse-domain extension key `com.vpavlov.nerio`. The extension schema will be
versioned independently and will initially be limited to:

- canonical CSS variable identity;
- primitive, semantic, or component layer;
- public or intentionally excluded visibility;
- lifecycle state and replacement identity;
- Nerio package/Registry compatibility;
- runtime-set membership where the DTCG Format token alone cannot express it.

Tools MUST preserve unknown extensions as required by the DTCG format.

### 4. Theme, mode, and density

Theme, mode, and density are orthogonal Nerio runtime axes, not token types. The format artifact will
describe token identities and values without pretending those axes are standard DTCG types.

The separate `nerio.token-sets.json` artifact will target the stable DTCG 2025.10 Resolver module
where its set/modifier model represents Nerio's selectors without loss. It will record:

- the six preset themes and a custom-theme extension point;
- `system`, `light`, and `dark` mode behavior, including the media-query-backed system resolution;
- `comfortable` and `compact` density remaps;
- the deterministic resolution order;
- references to the tokens in `nerio.tokens.json`;
- the exact Resolver-module and Nerio extension versions.

If a selector behavior cannot be represented faithfully by the stable Resolver module, the
manifest MUST use a bounded `com.vpavlov.nerio` extension and document the limitation. It MUST NOT
claim unsupported DTCG semantics. Combined theme names and new runtime axes remain prohibited.

### 5. Token lifecycle

Each public token has one lifecycle state: `active` or `deprecated`. Removed tokens are release and
migration history; they do not remain as live entries in the current artifact.

#### Admission

A new token is admitted only when its owner and layer are clear, existing composition or aliases do
not express the decision, and its public customization or interoperability value justifies a stable
identity.

- Primitive tokens require a reusable raw scale or value.
- Semantic tokens require meaning shared across multiple component families or product contexts.
- Component tokens require a stable family/component customization contract or an isolated unique
  mechanic.
- Product-specific values remain consumer-owned; speculative workflow tokens and Pro/private tokens
  do not enter the Core artifact.

Every admitted token MUST define identity, layer, type, description policy, canonical value or
alias, export visibility, and validation evidence.

#### Compatible change

- Adding an active public token or alias is a minor change.
- Correcting description or non-behavioral metadata is a patch change.
- A semantic/component remap that preserves documented meaning is normally a minor visual change
  and requires changelog and visual/contrast evidence.
- A narrowly corrective remap MAY be a patch only when it restores an already documented contract,
  introduces no migration, and has focused regression evidence.
- Primitive value changes are major by default because primitive tokens are public and consumers may
  use or override them directly.
- Changing a token's type, layer, meaning, CSS identity, or alias target in a way that changes its
  documented responsibility is breaking.

#### Rename and deprecation

Public tokens are not renamed in place. CSS custom-property aliases resolve in the scope where they
are declared, so a root-level `--old: var(--new)` or `--new: var(--old)` bridge cannot preserve
arbitrary descendant overrides of both names. A minor release MAY deprecate the old identity and
announce its future replacement, but the old CSS variable MUST remain the active component and
semantic consumption path and the only guaranteed override path for the rest of that major line.
Switching runtime consumption to the new identity and removing the old identity happen together in
an approved major release.

A release MAY expose both names as runtime override paths only when it provides an explicit bridge
that is evaluated in every documented override scope, preserves the old variable's default and
direct-consumption behavior, and has focused browser evidence for both names. A root-level alias
alone does not satisfy this requirement. If that evidence cannot be provided, the replacement CSS
identity MUST wait for the major release rather than claim incomplete compatibility.

- Deprecation is introduced in a minor release and MUST include a reason, replacement when one
  exists, migration guidance, and the first deprecated version.
- A deprecated alias remains for the rest of the current major line. It MUST also remain for at
  least two minor releases after notice when that cadence exists.
- A deprecated token MUST continue to resolve and appear in the interchange artifact until its
  approved removal. When a live replacement alias is emitted, it MUST also pass alias validation.
- Validation MUST prove that overriding every documented live CSS identity changes the runtime
  value observed by the semantic or component consumption path in every supported override scope.
- A deprecation with no replacement MUST explain the supported composition, native platform, Pro,
  or consumer-owned alternative.

#### Removal

Removing a public token, deprecated alias, or supported export is a major change. Removal requires:

- the retention rule above to be satisfied;
- migration guidance and changelog evidence;
- no active canonical token referencing the removed identity;
- package, Registry, CLI/MCP, docs, and source-install checks proving that the old identity is no
  longer advertised;
- explicit approval in the release plan.

### 6. Source installation and local modifications

Package consumers receive the versioned generated artifacts associated with their package version.
Source-installed consumers remain governed by Registry lock, diff, and update/conflict behavior.

- The interchange artifact MUST NOT overwrite a consumer's token CSS or local theme automatically.
- Locally modified source is compared against the recorded Registry revision before update.
- A canonical token rename uses the compatibility alias during the retention window so local source
  can migrate deliberately.
- Consumer-created tokens and themes stay in consumer namespaces and are not added to the Nerio
  artifact unless separately admitted to Core.
- A design tool import is downstream consumption, not authority to write values back into Nerio.

### 7. Versioning, determinism, and integrity

Each generated artifact will record:

- DTCG report version and module compatibility;
- Nerio extension schema version;
- `@nerio-ui/tokens` version;
- Registry revision or compatibility identifier when available;
- generator version;
- canonical source digest and artifact digest.

The JSON output MUST use deterministic token paths, object ordering, numeric normalization, and final
newline behavior. Running the generator twice from the same clean checkout MUST produce identical
bytes. Digests MUST exclude or normalize their own digest field so they are reproducible.

Validation MUST fail on missing types or descriptions, unsupported values, unresolved aliases,
cycles, duplicate identities, invalid deprecation targets, unexplained exclusions, stale generated
files, nondeterministic output, or package/source contents that disagree with the approved exports.

### 8. Tool boundary

The generated artifacts are generic ecosystem contracts.

- Issue #357 may map them into Figma variable collections, modes, component properties, and import
  limitations.
- Figma-specific names, collection IDs, plugin data, and component mapping do not belong in the
  generic token artifact.
- Figma, another design tool, or an imported file MUST NOT become a competing canonical source.
- Bidirectional synchronization, hosted token services, plugins, and Pro/private token distribution
  require separate decisions.

## Rejected alternatives

### Hand-maintained JSON beside CSS

Rejected because values and aliases would drift, review would not establish which source wins, and
source-installed consumers would receive conflicting contracts.

### Make JSON canonical immediately

Rejected because the current runtime, package, Registry, documentation, and validation surfaces are
CSS-first. No migration or equivalence evidence currently justifies moving the authoring model.

### Flatten every alias to a resolved value

Rejected because it removes semantic relationships, prevents downstream propagation, and weakens
validation and design-tool handoff.

### Encode theme, mode, and density as token types or combined names

Rejected because those are orthogonal runtime sets. DTCG types describe value shape, while combined
names would violate Nerio's accepted runtime-axis decision.

### Add Figma-specific fields to the generic artifact

Rejected because #357 owns tool mapping. The generic export must remain useful to other tools and
must not couple Core to one vendor.

### Bidirectional synchronization

Rejected for the first tranche because conflict ownership, source-install edits, and release
versioning are not defined well enough to make design-tool writes safe.

## Consequences

- Nerio gains a clear lifecycle before exposing an interchange file.
- The first implementation can add typed metadata without duplicating canonical values.
- Package and source-install consumers keep the existing CSS runtime and receive no new runtime
  dependency or client cost.
- Downstream tools can preserve aliases and reason about token types and lifecycle.
- The generator must explicitly classify values that CSS can express but DTCG cannot represent
  losslessly; those cases become visible engineering decisions instead of silent coercions.
- Theme/mode/density interoperability requires a second generated manifest and careful Resolver
  validation rather than a single flattened file.
- Completing issue #490 still requires the generator, validators, artifacts, package/source
  distribution checks, consumer documentation, and the #357 handoff after stable Core 1.0.

## Implementation sequence after stable Core 1.0

1. Add the value-free metadata descriptor and its schema/tests.
2. Extract a shared canonical CSS token model from the #487 parser/validators.
3. Generate and validate `nerio.tokens.json` against DTCG 2025.10.
4. Generate and validate `nerio.token-sets.json` against the stable Resolver contract and bounded
   Nerio extensions.
5. Add deterministic and negative fixtures for aliases, cycles, types, deprecations, exclusions,
   digests, and clean-run equality.
6. Approve package subpath exports only after tarball, Registry/source-install, API, budget, and
   consumer import evidence passes.
7. Publish contributor/consumer lifecycle and compatibility documentation.
8. Update issue #357 to consume only the generic generated artifacts.

## References

- [Design Tokens Technical Reports 2025.10](https://www.designtokens.org/TR/2025.10/)
- [DTCG Format Module 2025.10](https://www.designtokens.org/TR/2025.10/format/)
- [DTCG Color Module 2025.10](https://www.designtokens.org/TR/2025.10/color/)
- [DTCG Resolver Module 2025.10](https://www.designtokens.org/TR/2025.10/resolver/)
- [ADR 0004: Theme, mode, and density axes](./0004-theme-mode-density-axes.md)
- [Foundation documentation and standards audit](../audits/foundations-best-practices-audit.md)
- [Issue #487](https://github.com/vpavlov-me/Nerio/issues/487)
- [Issue #490](https://github.com/vpavlov-me/Nerio/issues/490)
- [Issue #357](https://github.com/vpavlov-me/Nerio/issues/357)
