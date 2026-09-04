# Foundation information architecture

## Decision

For the Core 1.0 release line, Nerio exposes one ordered Foundations group for designers, engineers,
and coding agents. The order moves from system architecture through visual roles and composition,
then runtime and accessibility behavior, and finally focused visual foundations:

1. Tokens
2. Color
3. Typography
4. Spacing & layout
5. Themes
6. Accessibility
7. Radius
8. Effects
9. Motion
10. Icons

`apps/docs/content/foundations.json` is the canonical typed-data source for each foundation's path,
navigation label, page title, search/SEO description, order, and legacy aliases. The generated
`foundation-pages.ts` projection drives desktop and mobile navigation, adjacent-page links, the
sitemap, and Next.js redirects. The separate `foundation-search-pages.ts` projection provides full
page metadata and loads lazily when documentation search opens, keeping the global route budget
stable. `llms.txt` remains editorial, but validation requires its Foundations index to match the
canonical order exactly.

## Responsibility and extension model

- **Tokens** explains the primitive, semantic, and component architecture.
- **Color, Typography, Spacing & layout, Radius, Effects, Motion, and Icons** own focused visual or
  behavioral guidance without duplicating token values.
- **Themes** owns composition of the supported theme, mode, and density runtime axes. It links to
  Tokens, Color, Spacing & layout, and Accessibility instead of restating their contracts.
- **Accessibility** owns system invariants, evidence boundaries, and the shared review model.

The post-1.0 Localization foundation owns direction, locale-sensitive component behavior, and
consumer setup under #342; it is not part of the Core 1.0 route set. Its position remains reserved
directly after Accessibility, and the future Content & localization foundation from #491 may follow
it without restructuring the navigation shell. Product voice, translation infrastructure, and
domain copy remain consumer-owned.

Every canonical page remains server-rendered and follows a bounded content shell: Foundation
kicker, one page heading, a lede, section headings that feed the dynamic table of contents, and
focused editorial or source-backed content. Validation checks the shell without snapshotting prose.
The current documentation shell does not render page-level breadcrumbs; its table of contents and
previous/next navigation use the canonical page identity and order. If breadcrumbs are added later,
they must consume the same projection rather than introduce another route map.

## Canonical and compatibility routes

| Identity            | Route                             | Discovery behavior                                                                           |
| ------------------- | --------------------------------- | -------------------------------------------------------------------------------------------- |
| Canonical           | Every route in `foundations.json` | Navigation, search, sitemap, adjacent links, page metadata, and `llms.txt`                   |
| Legacy Motion alias | `/docs/foundations/animations`    | Permanent redirect to `/docs/foundations/motion`; excluded from competing discovery identity |

An implemented foundation route that is absent from the metadata fails validation. Duplicate paths,
labels, titles, aliases, aliases that compete with canonical routes, missing canonical pages,
client-only foundation pages, incomplete page shells, and `llms.txt` order drift also fail.

## Non-goals

This decision does not redesign the documentation shell, create separate designer and engineer
navigation trees, add a CMS, introduce a new runtime axis, change tokens or component APIs, or make
product documentation and translation infrastructure part of Core.
