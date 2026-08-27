import { NumberField, type NumberFieldFormatOptions } from "../../src/client";

const decimalFormat = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
  style: "decimal",
} satisfies NumberFieldFormatOptions;

void (
  <NumberField
    label="Quantity"
    value={2}
    min={0}
    max={10}
    step={0.5}
    format={decimalFormat}
    onValueChange={(value, details) => {
      value satisfies number | null;
      details.reason satisfies
        | "input-change"
        | "input-clear"
        | "input-blur"
        | "input-paste"
        | "keyboard"
        | "increment-press"
        | "decrement-press"
        | "wheel"
        | "scrub"
        | "none";
    }}
  />
);

// @ts-expect-error NumberField owns numeric state instead of a native string value.
void (<NumberField label="Quantity" value="2" />);

// @ts-expect-error Currency formatting belongs to consumer composition.
void (<NumberField label="Amount" format={{ style: "currency", currency: "USD" }} />);

// @ts-expect-error NumberField uses onValueChange instead of a parallel native change contract.
void (<NumberField label="Quantity" onChange={() => undefined} />);
