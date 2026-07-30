"use client";

import { Slider } from "@nerio-ui/ui/client";
import * as React from "react";

export default function SliderTestPage() {
  const [volume, setVolume] = React.useState(40);

  return (
    <main className="visual-test-fixture">
      <form className="form-preview-stack" aria-label="Slider form example">
        <Slider
          label="Volume"
          name="volume"
          value={volume}
          valueLabel={`${volume}%`}
          onValueChange={setVolume}
          getAriaValueText={(_, value) => `${value} percent`}
        />
        <Slider aria-label="Read-only volume" defaultValue={72} readOnly />
        <Slider aria-label="Unavailable volume" defaultValue={24} disabled />
        <Slider aria-label="Vertical volume" defaultValue={60} orientation="vertical" />
        <div dir="rtl">
          <Slider aria-label="RTL volume" defaultValue={35} />
        </div>
      </form>
    </main>
  );
}
