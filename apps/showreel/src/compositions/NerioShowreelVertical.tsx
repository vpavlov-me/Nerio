import * as React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ComponentsScene } from "../scenes/ComponentsScene";
import { FoundationsScene } from "../scenes/FoundationsScene";
import { IdentityScene } from "../scenes/IdentityScene";
import { OutroScene } from "../scenes/OutroScene";
import { PositioningScene } from "../scenes/PositioningScene";
import { ProductScene } from "../scenes/ProductScene";

const transition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 12 })}
  />
);

export function NerioShowreelVertical() {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={150} name="Identity vertical">
        <IdentityScene format="vertical" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={210} name="Positioning vertical">
        <PositioningScene format="vertical" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={270} name="Foundations vertical">
        <FoundationsScene format="vertical" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={300} name="Core components vertical">
        <ComponentsScene format="vertical" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={330} name="Product composition vertical">
        <ProductScene format="vertical" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={240} name="Outro vertical">
        <OutroScene format="vertical" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
}
