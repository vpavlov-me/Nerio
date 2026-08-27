import { OTPField, type OTPFieldValidationType } from "../../src/client";

const validationType = "alphanumeric" satisfies OTPFieldValidationType;

void (
  <OTPField
    label="Verification code"
    length={6}
    validationType={validationType}
    onValueChange={(value, details) => {
      value satisfies string;
      details.reason satisfies "input-change" | "input-clear" | "input-paste" | "keyboard";
    }}
    onValueComplete={(value, details) => {
      value satisfies string;
      details.reason satisfies "input-change" | "input-paste";
    }}
  />
);

// @ts-expect-error OTPField owns one string value.
void (<OTPField label="Code" length={6} value={123456} />);

// @ts-expect-error OTPField does not expose authentication or automatic submission policy.
void (<OTPField label="Code" length={6} autoSubmit />);

// @ts-expect-error OTPField does not own masked credential entry.
void (<OTPField label="Code" length={6} mask />);
