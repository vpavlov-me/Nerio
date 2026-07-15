"use client";

import * as React from "react";
import { Input } from "@nerio-ui/ui";

const phoneCharacters = /[^0-9+()\s-]/g;

/** Documentation-only example; phone parsing and validation remain consumer-owned. */
export function PhoneInputPreview() {
  const [value, setValue] = React.useState("+1 555 0100");

  return (
    <Input
      aria-label="Phone number"
      autoComplete="tel"
      inputMode="tel"
      onChange={(event) => setValue(event.currentTarget.value.replace(phoneCharacters, ""))}
      pattern="[0-9+() -]*"
      type="tel"
      value={value}
    />
  );
}
