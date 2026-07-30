"use client";

import { Slider } from "@nerio-ui/ui/client";
import * as React from "react";

export function SliderPreview() {
  const [tipAmount, setTipAmount] = React.useState(15);

  return (
    <section className="component-example" aria-label="Slider preview">
      <form className="component-example__preview" aria-label="Tip amount example">
        <Slider
          label="Tip amount"
          description="Amount added to the bill."
          name="tipAmount"
          min={0}
          max={50}
          value={tipAmount}
          valueLabel={`$${tipAmount}`}
          onValueChange={setTipAmount}
          getAriaValueText={(_, value) => `${value} US dollars`}
        />
      </form>
    </section>
  );
}
