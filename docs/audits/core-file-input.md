# FileInput Core 1.0 review

## Responsibility

FileInput is the approved dedicated Core surface for native file selection. It owns one visible,
focusable `input type="file"`, typed props and ref access, native picker and form behavior, and
tokenized control states. Consumers or Nerio Pro own upload requests, Dropzone behavior, file
validation policy, previews, queues, progress, retry, persistence, and storage.

## API admission record

- Stable distinction: native file selection has FileList, picker security, capture, multiple, and
  reset behavior that do not belong to text-like Input.
- Independent use: profile attachments, document import, evidence submission, and media selection
  share the same primitive without sharing an upload workflow.
- Composition considered: a consumer can use native HTML, but Nerio needs one documented tokenized
  package and source-install path; adding `type="file"` back to Input would weaken its value API.
- Token and className alternatives: visual customization remains available through the Input-family
  and FileInput button aliases, root className, and source ownership. No visual variant is added.
- Accessibility and entrypoint: native semantics require no Base UI or client state, so FileInput is
  server-safe in `@nerio-ui/ui`.
- Maintenance: the API forwards applicable native file attributes while rejecting `type`,
  controlled `value`, `defaultValue`, `readOnly`, and native `size` contracts that are invalid or
  misleading for file selection.

## Styling classification

Control geometry, focus, invalid, and disabled treatment reuse the Input family tokens. The native
file-selector button uses FileInput component aliases mapped to approved semantic action and text
tokens. The browser continues to own picker chrome and filename presentation.

## State and accessibility evidence

- Default, selected, single, multiple, required, invalid, and disabled states are covered.
- Hover and focus-visible use shared motion and focus contracts; reduced motion keeps static state.
- Field and external labels, descriptions, `accept`, `capture`, `name`, `form`, change events,
  forwarded ref, FileList, native form data, and native reset are covered.
- Deterministic browser payloads cover long and non-Latin filenames without automating operating-
  system picker UI.
- Narrow layout and RTL reflow are checked across Chromium, Firefox, and WebKit. Real mobile picker
  and assistive-technology evidence remains part of the manual issue #143 audit.

## Distribution evidence

Catalog, component matrix, platform coverage, Registry, CLI, MCP, documentation, `llms.txt`, package
exports, source installation, tests, changelog, and roadmap projections describe the same native
selection-only contract.
