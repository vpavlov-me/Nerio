import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const otpFieldDoc = getComponentDoc("otp-field");

const anatomyRows = [
  ["root / label", "Named verification-code group and visible native label."],
  ["input-group / input", "Real character slots backed by one string and one form value."],
  ["separator", "Visual grouping that is hidden from assistive technology."],
  ["description / message", "Associated help or concise validation content."],
] as const;
const stateRows = [
  ["Empty / filled / complete", "One controlled or uncontrolled value clamped to length."],
  ["Paste / deletion", "Base UI distributes accepted text and keeps focus predictable."],
  ["Autofill / mobile", "Defaults to one-time-code and a keyboard hint matched to validation."],
  [
    "Password managers",
    "May place an autofill accessory on the first slot; keep the label and one-time-code hint stable.",
  ],
  ["Disabled / read-only", "Prevents edits while preserving truthful native semantics."],
  ["Required / invalid", "Participates in forms and associates concise validation content."],
] as const;
const apiRows = [
  ["length", "Required positive slot count and completion boundary."],
  ["value / defaultValue / onValueChange", "One string value with a bounded change reason."],
  ["onValueComplete", "Runs after every slot contains an accepted character."],
  ["onValueInvalid", "Reports rejected typed or pasted characters without changing the value."],
  ["validationType / inputMode", "Accepted characters and virtual-keyboard hint."],
  ["getSlotLabel", "Localizes following-slot labels such as Digit 2 of 6."],
  ["name / form / required / autoComplete", "Native form, reset, validation, and autofill."],
] as const;

export const metadata = createPageMetadata({
  title: "OTPField component",
  description: otpFieldDoc!.description,
  path: "/docs/components/otp-field",
});

export default function Page() {
  return (
    <StandardDocPage
      title={otpFieldDoc!.title}
      lede={otpFieldDoc!.description}
      kind="otp-field"
      sectionContent={{
        anatomy: (
          <DocumentationTable headers={["Slot", "Purpose"]} rows={anatomyRows} codeColumns={1} />
        ),
        states: (
          <DocumentationTable headers={["State", "Behavior"]} rows={stateRows} codeColumns={1} />
        ),
        api: <DocumentationTable headers={["Props", "Purpose"]} rows={apiRows} codeColumns={1} />,
        guidance: (
          <div className="doc-guidance-cards">
            <Card>
              <CardHeader>
                <Icon icon={Check} />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                Use OTPField for short numeric or alphanumeric verification, invite, or recovery
                codes. Keep the code visible so people can review it before submission.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Put verification requests, resend timers, countdowns, masking, rate limits, recovery
                workflows, or credential storage in OTPField. Those remain consumer-owned.
              </CardContent>
            </Card>
          </div>
        ),
      }}
    />
  );
}
