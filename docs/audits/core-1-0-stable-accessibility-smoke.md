# Core 1.0 stable accessibility smoke

This is the bounded internal human-evidence gate for Nerio Core `1.0.0`. It protects the highest-risk
stable interactions without making the exhaustive accessibility/device matrix or an external beta
cohort prerequisites for publication.

The canonical machine-readable record is
[`quality/stable-accessibility-smoke.json`](../../quality/stable-accessibility-smoke.json). Issue
[#143](https://github.com/vpavlov-me/Nerio/issues/143) owns the exact candidate, evidence, findings,
and final release decision.

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

The last command is intentionally expected to fail while evidence remains pending.
