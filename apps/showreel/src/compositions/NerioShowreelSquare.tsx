import * as React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ComponentsScene } from "../scenes/ComponentsScene";
import { FoundationsScene } from "../scenes/FoundationsScene";
import { IdentityScene } from "../scenes/IdentityScene";
import { OutroScene } from "../scenes/OutroScene";
import { ProductScene } from "../scenes/ProductScene";

const transition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 10 })}
  />
);

export function NerioShowreelSquare() {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={150} name="Identity square">
        <IdentityScene format="square" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={180} name="Foundations square">
        <FoundationsScene format="square" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={200} name="Core components square">
        <ComponentsScene format="square" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={230} name="Product composition square">
        <ProductScene format="square" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={180} name="Outro square">
        <OutroScene format="square" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
}
