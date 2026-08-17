import * as React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ComponentsScene } from "../scenes/ComponentsScene";
import { DeveloperScene } from "../scenes/DeveloperScene";
import { FoundationsScene } from "../scenes/FoundationsScene";
import { IdentityScene } from "../scenes/IdentityScene";
import { InteractionScene } from "../scenes/InteractionScene";
import { OutroScene } from "../scenes/OutroScene";
import { PositioningScene } from "../scenes/PositioningScene";
import { ProductScene } from "../scenes/ProductScene";

const transition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 15 })}
  />
);

export function NerioShowreel() {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={180} name="Identity">
        <IdentityScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={240} name="Positioning">
        <PositioningScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={360} name="Foundations">
        <FoundationsScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={660} name="Core components">
        <ComponentsScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={480} name="Interaction choreography">
        <InteractionScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={480} name="Product composition">
        <ProductScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={360} name="Developer experience">
        <DeveloperScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={225} name="Outro">
        <OutroScene format="wide" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
}
