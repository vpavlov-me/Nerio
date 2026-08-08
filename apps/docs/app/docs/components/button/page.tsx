import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { ButtonPreview } from "./button-preview";

const apiRows = [
  ["variant", "primary | secondary | outline | ghost | link | danger", "Sets action emphasis."],
  ["size", "sm | md | lg", "Uses density-aware height tokens."],
  [
    "leadingIcon / trailingIcon",
    "IconComponent",
    "Places a decorative icon before or after the label.",
  ],
  ["icon + aria-label", "IconComponent + string", "Creates an accessible icon-only action."],
  ["badge", "<Badge>", "Adds a concise count or status after the visible label at sm size."],
  ["kbd", "<Kbd>", "Displays a quiet shortcut hint after the label."],
  ["tooltip", "ReactNode", "Adds supplemental hover and focus help."],
  ["loading", "boolean", "Shows Spinner, disables activation, and sets aria-busy."],
] as const;

const variantRows = [
  ["primary", "Lead one clear local decision."],
  ["secondary", "Support the primary action without competing with it."],
  ["outline", "Offer a bounded secondary action on a quiet surface."],
  ["ghost", "Keep repeated or low-emphasis actions visually calm."],
  [
    "link",
    "Use for navigation with an anchor render target; it has no control padding and underlines on hover or focus-visible.",
  ],
  ["danger", "Signal a destructive action that needs explicit intent."],
] as const;

const anatomyRows = [
  ["button", "Base UI button primitive with variant, size, disabled, loading, and focus states."],
  ["button-icon", "Optional leading or trailing icon rendered through the Nerio icon adapter."],
  ["button-label", "Visible action text that remains available while loading."],
  ["button-badge", "Optional Badge count or status placed after the visible action label."],
  [
    "button-kbd",
    "Optional quiet keyboard shortcut hint placed between the label and trailing icon.",
  ],
] as const;

const stateRows = [
  ["Default, hover, and active", "Variant tokens control interaction feedback."],
  ["Focus", "Focus-visible uses the shared Nerio focus ring."],
  ["Loading", "Disables repeat activation and exposes aria-busy."],
  ["Disabled", "Prevents activation while preserving layout."],
] as const;

const implementationRows = [
  ["Registry item", "button installs Button with its Badge, Kbd, and Tooltip dependencies."],
  ["Base UI", "button"],
  ["Registry dependencies", "badge, tooltip, kbd"],
  [
    "Package dependencies",
    "@base-ui/react, @nerio-ui/adapters, clsx, react, tailwind-merge, tailwindcss",
  ],
] as const;

const tokenRows = [
  ["Sizing", "--n-button-height-sm / md / lg", "Control heights across density modes."],
  ["Shape", "--n-button-radius", "Corner radius for text and icon-only Buttons."],
  ["Primary", "--n-button-background-primary / hover / active", "Primary action surface."],
  [
    "Secondary",
    "--n-button-background-secondary / hover / border / foreground",
    "Supporting action treatment.",
  ],
  ["Ghost", "--n-button-background-ghost / hover / foreground", "Low-emphasis action treatment."],
  [
    "Link",
    "--n-link-color / hover / underline-offset / underline-thickness",
    "Text-level navigation with an underline on hover and focus-visible.",
  ],
  [
    "Danger",
    "--n-button-background-destructive / foreground-destructive",
    "Destructive action treatment.",
  ],
  [
    "Button Kbd",
    "--n-button-kbd-background / border-color / foreground / opacity",
    "Quiet shortcut treatment inside a Button.",
  ],
  [
    "Button Badge",
    "--n-badge-height-sm / radius / padding-inline-sm",
    "Compact count or status treatment inside a Button.",
  ],
  [
    "Icon-only",
    "--n-icon-button-size-sm / md / lg / radius",
    "Square Button sizing when icon is used.",
  ],
  [
    "Interaction",
    "--n-motion-hover-duration / --n-motion-press-duration / --n-focus-ring",
    "Motion and focus feedback.",
  ],
] as const;

export default function Page() {
  return (
    <StandardDocPage
      title="Button"
      lede="Buttons trigger explicit product actions. Choose a clear label and the least visual emphasis that still matches the decision."
      kind="button"
      preview={<ButtonPreview />}
      sectionContent={{
        variants: (
          <DocumentationTable headers={["Variant", "Use"]} rows={variantRows} codeColumns={1} />
        ),
        anatomy: (
          <DocumentationTable headers={["Slot", "Purpose"]} rows={anatomyRows} codeColumns={1} />
        ),
        states: (
          <DocumentationTable headers={["State", "Behavior"]} rows={stateRows} codeColumns={1} />
        ),
        api: <DocumentationTable headers={["Prop", "Values", "Purpose"]} rows={apiRows} />,
        implementation: (
          <DocumentationTable
            headers={["Contract", "Value"]}
            rows={implementationRows}
            codeColumns={1}
          />
        ),
        guidance: (
          <div className="doc-guidance-cards">
            <Card>
              <CardHeader>
                <Icon icon={Check} />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                Use one primary action per local decision and keep labels action-oriented.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Use the link variant with an anchor render target for a destination.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards">
            {[
              [
                "Badge",
                "Add a concise count or status inside a Button without creating another action.",
                "/docs/components/badge",
              ],
              [
                "Tooltip",
                "Clarify compact controls without carrying essential meaning.",
                "/docs/components/tooltip",
              ],
              [
                "DropdownMenu",
                "Group several secondary actions under one trigger.",
                "/docs/components/dropdown-menu",
              ],
            ].map(([title, description, href]) => (
              <Card key={title} className="doc-related-card" href={href} variant="secondary">
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        ),
        tokens: <DocumentationTable headers={["Group", "Tokens", "Controls"]} rows={tokenRows} />,
      }}
    />
  );
}
