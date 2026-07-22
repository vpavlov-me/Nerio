"use client";

import { Slider } from "@nerio-ui/ui/client";
import * as React from "react";

export function SliderPreview() {
  const [volume, setVolume] = React.useState(40);

  return (
    <section id="preview" className="component-example" aria-label="Slider examples">
      <form
        className="component-example__preview form-preview-stack"
        aria-label="Slider form example"
      >
        <Slider
          label="Volume"
          description="Notification playback level."
          name="volume"
          value={volume}
          valueLabel={`${volume}%`}
          onValueChange={setVolume}
          getAriaValueText={(_, value) => `${value} percent`}
        />
        <Slider aria-label="Read-only volume" defaultValue={72} readOnly />
        <Slider aria-label="Unavailable volume" defaultValue={24} disabled />
        <Slider aria-label="Vertical volume" defaultValue={60} orientation="vertical" />
      </form>
    </section>
  );
}
