# Foundation metadata contract

## Purpose

Nerio foundation documentation renders structural facts from a deterministic build-time projection
instead of copying token values, preset lists, and runtime mappings into individual pages. Editorial
explanation, recommendations, examples, and accessibility guidance remain hand-authored.
The ordered route model and compatibility policy are recorded in
[`foundation-information-architecture.md`](./foundation-information-architecture.md).

## Source precedence

1. `packages/tokens/src/styles.css` is canonical for token values, aliases, selectors, typography
   recipes, and theme/mode/density mappings.
2. `data/component-catalog.json` is canonical for the supported runtime-axis values and defaults.
3. `apps/docs/content/foundations.json` is canonical for public foundation route identity, label,
   title, description, order, and legacy aliases.
4. `apps/docs/lib/generated/foundation-metadata.ts`, `foundation-pages.ts`, and
   `foundation-search-pages.ts` are deterministic projections. They are never edited by hand and are
   not independent sources of truth.

The projection preserves token names, raw CSS values, direct alias references, selectors, and source
ordering. It does not flatten aliases or parse editorial prose.

## Workflow

After changing a projected source, run:

```bash
pnpm prepare:foundation-metadata
pnpm test:foundation-metadata
pnpm validate:foundation-metadata
pnpm validate:docs
```

Commit the source and generated projection together. Typography, Themes, and Color server pages
consume the full metadata projection. Color metadata groups canonical primitive and semantic
families and preserves representative component aliases plus mode and theme mappings without
flattening their CSS-variable references. Documentation navigation, search, adjacent-page links,
the sitemap, and Next.js redirects consume the smaller generated route projection so full editorial
metadata is not added to the client shell. Server page metadata, the Getting Started directory, and
the lazily loaded search index consume the full route projection. The validator also requires every canonical
foundation route to exist, follow the server-rendered foundation page shell, and appear in canonical
order in the Foundations index in `apps/docs/content/llms.txt`. Implemented foundation routes missing
from the contract and aliases that compete with canonical discovery also fail.

## Failure model

Generation rejects malformed CSS, duplicate custom-property declarations in one selector, missing
token aliases, unsupported alias cycles, missing runtime selectors, incomplete foundation discovery
metadata, duplicate route identity, and alias collisions. Validation rejects missing or unclassified
route implementations, competing alias identity, incomplete server-rendered page shells, `llms.txt`
order drift, and checked-in generated output that differs from the canonical sources; drift errors
name the regeneration command.

Facts that cannot be derived safely stay editorial. Do not add a second JSON token inventory, parse
arbitrary prose, flatten aliases, or make generated metadata a public package export without a
separate contract decision.
