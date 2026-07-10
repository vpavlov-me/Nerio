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

## Scope boundary

This record covers Priorities 1 and 2. Priority 3 overlays, Priority 4 navigation, and Priority 5 data display remain separate component-by-component reviews. No new public components or Pro compositions were added.
