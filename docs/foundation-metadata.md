# Foundation metadata contract

## Purpose

Nerio foundation documentation renders structural facts from a deterministic build-time projection
instead of copying token values, preset lists, and runtime mappings into individual pages. Editorial
explanation, recommendations, examples, and accessibility guidance remain hand-authored.

## Source precedence

1. `packages/tokens/src/styles.css` is canonical for token values, aliases, selectors, typography
   recipes, and theme/mode/density mappings.
2. `data/component-catalog.json` is canonical for the supported runtime-axis values and defaults.
3. `apps/docs/content/foundations.json` is canonical for public foundation route identity and order.
4. `apps/docs/lib/generated/foundation-metadata.ts` and `foundation-pages.ts` are deterministic
   projections. They are never edited by hand and are not independent sources of truth.

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

Commit the source and generated projection together. Typography and Themes server pages consume the
full metadata projection. Documentation navigation, search, adjacent-page links, and the sitemap
consume the smaller generated route projection so token metadata is not added to the client shell.
The validator also requires every canonical foundation route to exist and appear in the Foundations
index in `apps/docs/content/llms.txt`.

## Failure model

Generation rejects malformed CSS, duplicate custom-property declarations in one selector, missing
aliases, unsupported alias cycles, missing runtime selectors, duplicate route identity, and missing
route implementations. Validation fails when checked-in generated output differs from the canonical
sources and names the regeneration command.

Facts that cannot be derived safely stay editorial. Do not add a second JSON token inventory, parse
arbitrary prose, flatten aliases, or make generated metadata a public package export without a
separate contract decision.
