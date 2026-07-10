# Core component quality pass

This is an internal review record for the Core Component Quality Pass. The component catalog remains the machine-readable source of truth for release status.

## Priority 1 — feedback and display foundations

| Component   | API      | Visual and density | States                                              | Accessibility                  | Tokens   | Docs and registry | Validation        | Final status | Known issues                                                                                         |
| ----------- | -------- | ------------------ | --------------------------------------------------- | ------------------------------ | -------- | ----------------- | ----------------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| Badge       | Reviewed | Reviewed           | Static, semantic tones                              | Reviewed                       | Reviewed | Reviewed          | Repository checks | stable-core  | `variant` remains a deprecated alias for `tone` until the next major release.                        |
| Toast       | Reviewed | Reviewed           | Stack, dismiss, neutral/info/success/warning/danger | Reviewed with Base UI contract | Reviewed | Reviewed          | Repository checks | stable-core  | Managed actions remain provided by the Base UI manager API rather than a separate Nerio composition. |
| Alert       | Reviewed | Reviewed           | Persistent inline tones                             | Reviewed                       | Reviewed | Reviewed          | Repository checks | stable-core  | No dismiss behavior by design; use Toast for temporary updates.                                      |
| Empty State | Reviewed | Reviewed           | Informational and actionable                        | Reviewed                       | Reviewed | Reviewed          | Repository checks | stable-core  | Optional visual mark is intentionally omitted when it adds no meaning.                               |
| Progress    | Reviewed | Reviewed           | Determinate and indeterminate                       | Reviewed                       | Reviewed | Reviewed          | Repository checks | stable-core  | Use Spinner for compact inline waits.                                                                |
| Skeleton    | Reviewed | Reviewed           | Loading and reduced motion                          | Reviewed                       | Reviewed | Reviewed          | Repository checks | stable-core  | Surrounding regions own the busy status.                                                             |
| Spinner     | Reviewed | Reviewed           | Size and reduced motion                             | Reviewed                       | Reviewed | Reviewed          | Repository checks | stable-core  | Use one loading announcement per region.                                                             |
| Card        | Reviewed | Reviewed           | Static surface                                      | Reviewed                       | Reviewed | Reviewed          | Repository checks | stable-core  | Interactive cards remain an explicit link or button composition.                                     |
| Avatar      | Reviewed | Reviewed           | Image and initials fallback                         | Reviewed                       | Reviewed | Reviewed          | Repository checks | stable-core  | Status, grouped-avatar, and image-error fallback compositions are not Core API.                      |

## API migration

- `Badge.variant` is deprecated in favour of `Badge.tone`. Existing `neutral`, `info`, `success`, and `danger` values keep working. New code may also use `accent` and `warning` through `tone`.

## Priority 2 — actions and forms

| Component                                | API      | Visual and density | States                                              | Accessibility                                   | Tokens   | Docs and registry | Validation        | Final status | Known issues                                                                                                  |
| ---------------------------------------- | -------- | ------------------ | --------------------------------------------------- | ----------------------------------------------- | -------- | ----------------- | ----------------- | ------------ | ------------------------------------------------------------------------------------------------------------- |
| Button                                   | Reviewed | Reviewed           | Loading, disabled, icon slots                       | Reviewed with Base UI contract                  | Reviewed | Reviewed          | Repository checks | stable-core  | `outline`, `subtle`, and `destructive` compatibility variants remain documented aliases.                      |
| IconButton                               | Reviewed | Reviewed           | Loading now replaces icon with Spinner, disabled    | Reviewed with Base UI contract                  | Reviewed | Reviewed          | Repository checks | stable-core  | Requires a label; use Tooltip for unfamiliar actions.                                                         |
| Link                                     | Reviewed | Reviewed           | Hover and focus                                     | Native anchor reviewed                          | Reviewed | Reviewed          | Repository checks | stable-core  | Native anchors do not gain a disabled state. Use a non-interactive element when a destination is unavailable. |
| Input / Textarea / Label                 | Reviewed | Reviewed           | Invalid, disabled, focus                            | Native form semantics reviewed                  | Reviewed | Reviewed          | Repository checks | stable-core  | Autosize belongs to an explicit future composition, not Textarea.                                             |
| Field / Form Message / FormGroup         | Reviewed | Reviewed           | Description, message, invalid, responsive layout    | ID associations and fieldset semantics reviewed | Reviewed | Reviewed          | Repository checks | stable-core  | Field accepts one control child so it can safely attach IDs and descriptions.                                 |
| Checkbox / Radio Group / Switch / Select | Reviewed | Reviewed           | Checked, disabled, invalid, controlled/uncontrolled | Reviewed with Base UI contract                  | Reviewed | Reviewed          | Repository checks | stable-core  | Keep complex async, searchable, or multi-select patterns out of this Core layer.                              |

## Priority 3 — overlays

| Component     | API      | Visual and density | States                                                  | Accessibility                          | Tokens   | Docs and registry | Validation        | Final status | Known issues                                                                   |
| ------------- | -------- | ------------------ | ------------------------------------------------------- | -------------------------------------- | -------- | ----------------- | ----------------- | ------------ | ------------------------------------------------------------------------------ |
| Dialog        | Reviewed | Reviewed           | Controlled/uncontrolled, close, motion                  | Reviewed with Base UI focus management | Reviewed | Reviewed          | Repository checks | stable-core  | Keep long, task-heavy workflows in a dedicated page or future Pro composition. |
| Popover       | Reviewed | Reviewed           | Controlled/uncontrolled, optional title and description | Reviewed with Base UI contract         | Reviewed | Reviewed          | Repository checks | stable-core  | Do not use for modal decisions or essential persistent content.                |
| Dropdown Menu | Reviewed | Reviewed           | Keyboard selection, disabled, destructive               | Reviewed with Base UI contract         | Reviewed | Reviewed          | Repository checks | stable-core  | Nested menu and command-pattern expansion remain out of scope.                 |
| Tooltip       | Reviewed | Reviewed           | Hover, focus, controlled, disabled                      | Reviewed with Base UI contract         | Reviewed | Reviewed          | Repository checks | stable-core  | Do not put required guidance or actions in a tooltip.                          |

## Priority 4 — navigation

| Component   | API      | Visual and density | States                                                           | Accessibility                        | Tokens   | Docs and registry | Validation        | Final status | Known issues                                                                             |
| ----------- | -------- | ------------------ | ---------------------------------------------------------------- | ------------------------------------ | -------- | ----------------- | ----------------- | ------------ | ---------------------------------------------------------------------------------------- |
| Tabs        | Reviewed | Reviewed           | Selected, disabled, controlled/uncontrolled, underline/segmented | Reviewed with Base UI contract       | Reviewed | Reviewed          | Repository checks | stable-core  | Keep routing, overflow controls, and complex workspace navigation out of this primitive. |
| Breadcrumbs | Reviewed | Reviewed           | Explicit current page prevents a second implicit current page    | Native navigation semantics reviewed | Reviewed | Reviewed          | Repository checks | stable-core  | Keep paths concise; collapse logic belongs to an application composition.                |
| Pagination  | Reviewed | Reviewed           | Current, linked, disabled previous/next                          | Native navigation semantics reviewed | Reviewed | Reviewed          | Repository checks | stable-core  | State ownership and data fetching remain with the application.                           |

## Scope boundary

This record covers Priorities 1 through 4. Priority 5 data display remains a separate component-by-component review. No new public components or Pro compositions were added.
