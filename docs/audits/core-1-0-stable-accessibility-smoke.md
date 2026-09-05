# Core 1.0 stable accessibility smoke

This is the bounded internal human-evidence gate for Nerio Core `1.0.0`. It protects the highest-risk
stable interactions without making the exhaustive accessibility/device matrix or an external beta
cohort prerequisites for publication.

The canonical machine-readable record is
[`quality/stable-accessibility-smoke.json`](../../quality/stable-accessibility-smoke.json). Issue
[#143](https://github.com/vpavlov-me/Nerio/issues/143) owns the exact candidate, evidence, findings,
and final release decision.

## Recorded result

The maintainer completed all four environment groups and all six scenario groups with no finding
against source candidate `da3923f38f91f38b77f890ad28e043ab16f45fe1` and deployment
<https://nerio-mbwxunoxu-dquality.vercel.app>. Those observations were recorded in evidence commit
`0ec50fdc6a92ccf177ddf27e97eff7fc60846766`.

The observations carry forward to final source candidate
`c318f0760a340a0c5949e604b8381d7fef83c1f1` and deployment
<https://nerio-f6yjsyqij-dquality.vercel.app>. The explicit
[package README carry-forward](https://github.com/vpavlov-me/Nerio/issues/143#issuecomment-5550022599),
building on the
[final release-hardening carry-forward](https://github.com/vpavlov-me/Nerio/issues/143#issuecomment-5549958394),
[Dialog RTL and API snapshot carry-forward](https://github.com/vpavlov-me/Nerio/issues/143#issuecomment-5538121438),
[final review carry-forward](https://github.com/vpavlov-me/Nerio/issues/143#issuecomment-5537768311),
[CLI lock-race review](https://github.com/vpavlov-me/Nerio/issues/143#issuecomment-5530878264), and
[earlier documentation review](https://github.com/vpavlov-me/Nerio/issues/143#issuecomment-5530590241),
binds the record to the new candidate without claiming another manual run.

The preceding reviewed range
`23e514c9a331ee06d7c60acf0a301b575f791604..9a812072e11dff10dbf4cdd29c9685769e62e4e2`
contains seven commits and 17 unique changed paths: the prior two-file evidence relock; pre-merge
audit transport handling and its release/workflow contracts; Windows-separator normalization for
the docs route-report output guard; a test-only asynchronous Select focus wait; and public Dialog
guidance, Playground behavior, Security block, browser-test, and preview-copy corrections. It
changes no package implementation, exported API, Registry payload, token, package CSS, dependency
manifest, or lockfile. The only package path is a one-line test wait.

The changed public docs paths introduce no new confirmation flow. The Security block no longer
offers an irreversible account action through an ordinary Dialog. The existing Playground actions
now close their controlled Dialogs. Exact-source Chromium coverage asserts that the Security block
has no destructive confirmation pattern and that Playground `Cancel` closes its Dialog. These are
automated checks for the changed LTR documentation paths, not repeated human observations. The
`9a812072` source workflow passed all 11 technical jobs, branch policy passed, and the exact-SHA
Vercel deployment is ready. Its production audit ended in a registry transport timeout after bounded
retries, so that transport-tolerant result is not clean-audit or publication evidence; #151 still
requires the bare strict `pnpm audit:prod` with a successful registry response and no production
advisory at `low` or above.

The latest range
`9a812072e11dff10dbf4cdd29c9685769e62e4e2..c318f0760a340a0c5949e604b8381d7fef83c1f1`
contains the prior two-file evidence relock and publication-safe wording in the six public package
READMEs. Package tarball contents change only in their embedded README text. Package implementation,
manifests, exports, dependencies, public API, Registry payload and integrity, tokens, CSS, lockfile,
documentation application behavior, browser fixtures, and audited interactions are unchanged. The
exact-source workflow passed all 11 technical jobs, including all six pack inspections, all three
isolated consumers, Chromium 111/111, Firefox 17/17, WebKit 17/17, and visual 22/22. Its production
audit received `No known vulnerabilities found`; branch policy passed and the exact-SHA Vercel
deployment is ready. This latest wording-only package change does not invalidate the human scenarios.

The recorded human sessions used the default horizontal LTR presentation; they did not include a
human RTL Dialog run. In that LTR presentation, `start-1/2` and `left-1/2` resolve to the same
physical 50% left anchor with the unchanged `-translate-x-1/2`, so the recorded Dialog placement,
interaction, dismissal, and focus behavior remain applicable. The source correction changes only
RTL centering. Candidate-bound unit coverage locks the physical anchor, while the Chromium,
Firefox, and WebKit gate sets the root direction to RTL and verifies horizontal centering within one
pixel, viewport containment, Escape dismissal, and trigger focus restoration. This is automated RTL
evidence, not a claim of human RTL verification.

The earlier Registry and public API snapshot changes synchronize the corrected Dialog source integrity and
their current parity hashes; the API approval classifies that derivative snapshot update as a fix
under #148. They change no exported API shape. The README change corrects the already-completed
bounded-smoke status. The latest reviewed range adds no package component behavior, dependency,
token, CSS contract, or exported API change.

## Required environments

Run the smoke against one locked candidate and deployment:

1. macOS Safari with VoiceOver;
2. macOS Chromium with keyboard-only navigation;
3. 200% and 400% zoom/reflow plus increased or high contrast in a maintained desktop browser;
4. one maintained mobile browser on a physical touch device.

Recorded product versions must meet the canonical minimum engine lines in
[`quality/platform-support.json`](../../quality/platform-support.json): Safari maps to WebKit,
Chrome/Chromium/Edge map to Chromium, and Firefox maps to Firefox. This is a maintained-release
floor for the evidence, not a claim that every mobile product uses that engine at runtime.
If a vendor prefix is recorded, use only Apple Safari, Google Chrome, Microsoft Edge, or Mozilla
Firefox; record Chromium without a vendor prefix.
For `zoom-reflow-contrast`, desktop OS evidence is fully structured: keep the legacy
`operatingSystem` field at `null`, set `operatingSystemFamily` to `windows`, `macos`, `linux`,
`chromeos`, `bsd`, `unix`, or `other`, and record a numeric dotted release in
`operatingSystemVersion`. Put the distribution name, edition, architecture, build, and other prose
in `notes`. The family and version fields are the authoritative OS evidence; the `other` family and
descriptive notes cover current and future systems without a product-name catalog or free-text
identity inference.
The recorded browser product must be available for the structured family: Safari is macOS-only;
Windows and Linux allow Chrome, Chromium, Edge, or Firefox; ChromeOS allows Chrome, Chromium, or
Firefox; and BSD, Unix, and `other` use Chromium or Firefox. The two dedicated macOS rows record
`operatingSystem` strictly as `macOS <numeric dotted version>`.

The broader Windows/NVDA, Android/TalkBack, iOS/VoiceOver, native-picker, reduced-motion, and
complete physical-device matrix remains valuable post-release evidence. It is not a `1.0.0`
publication blocker unless this scoped smoke exposes a release-impacting defect.

## Required scenarios

- Documentation landmarks, navigation, search, appearance controls, and visible focus.
- Labels, descriptions, validation, grouped controls, and representative native controls.
- Dialog, Sheet, Popover, Dropdown Menu, Tooltip, and focus restoration.
- Calendar and DatePicker navigation, selection, dismissal, and form value.
- Alert, progress, loading, Toast announcements, actions, and dismissal.
- Responsive navigation, touch targets, narrow layouts, zoom, reflow, and contrast.

Record concise evidence links and notes for every environment and scenario. Do not include private
consumer content, credentials, recordings with personal data, or invented results.
For `zoom-reflow-contrast`, keep `operatingSystem`, `operatingSystemFamily`,
`operatingSystemVersion`, and `zoomLevelsTested` at `null` while evidence is pending. After both
required levels run on the locked candidate, record the exact set `["200%", "400%"]` and set
`increasedOrHighContrastEnabled` to `true` only after that setting was exercised. The `zoom` and
`notes` strings remain descriptive; they are not parsed as proof, contradiction, or a substitute
for the structured results.
For `mobile-touch`, keep `deviceClass` and `physicalDeviceUsed` at `null` while evidence is pending.
After the smoke runs on real hardware, set `deviceClass` to `phone` or `tablet` and set
`physicalDeviceUsed` to `true`. The class must be `phone` for iOS, `tablet` for iPadOS, and either
class for Android. Record `operatingSystem` as exactly one supported family plus its numeric version,
for example `iOS 18.5`, `iPadOS 18.5`, or `Android 16`. These fields, together with `result: Pass`, are
the authoritative structured hardware evidence. `device` remains a concise self-attested model
label: the validator rejects placeholder, simulator, emulator, virtual, evidence-document,
unambiguous browser-only, and generic-only values, but intentionally does not maintain a product
catalog or infer hardware class from a model name. The `device` and `notes` strings are descriptive;
they are not parsed as proof, contradiction, or a substitute for the structured result.

## Decision rule

The stable smoke passes only when:

- every required environment and scenario records `Pass`;
- the record identifies the exact `1.0.0` candidate SHA and reviewed deployment;
- no unresolved accepted P0/P1 or explicitly blocking finding remains;
- accepted non-blocking P2/P3 findings have focused GitHub issues and are described in known
  limitations where consumer impact exists;
- the maintainer records `release-ready`.

Validate the record with:

```bash
pnpm test:stable-accessibility-smoke
pnpm validate:stable-accessibility-smoke
pnpm validate:stable-accessibility-smoke --expect-pass
```

The final command must pass for a stable release decision; the current completed record passes it.
