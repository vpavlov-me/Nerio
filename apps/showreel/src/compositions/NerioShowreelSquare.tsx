import * as React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ApprovalScene } from "../scenes/ApprovalScene";
import { ComponentPortraitsScene } from "../scenes/ComponentPortraitsScene";
import { IdentityScene } from "../scenes/IdentityScene";
import { OutroScene } from "../scenes/OutroScene";
import { TypeManifestoScene } from "../scenes/TypeManifestoScene";
import { getSceneDuration, squareStoryboard, storyboardTransitionFrames } from "../storyboard";

const sceneDuration = (id: (typeof squareStoryboard)[number]["id"]) =>
  getSceneDuration(squareStoryboard, id);

const transition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: storyboardTransitionFrames.square })}
  />
);

export function NerioShowreelSquare() {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence
        durationInFrames={sceneDuration("identity")}
        name="Identity square"
      >
        <IdentityScene format="square" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence
        durationInFrames={sceneDuration("manifesto")}
        name="Type manifesto square"
      >
        <TypeManifestoScene durationInFrames={sceneDuration("manifesto")} format="square" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence
        durationInFrames={sceneDuration("components")}
        name="Component portraits square"
      >
        <ComponentPortraitsScene format="square" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence
        durationInFrames={sceneDuration("approval")}
        name="Approval composition square"
      >
        <ApprovalScene format="square" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={sceneDuration("outro")} name="Outro square">
        <OutroScene format="square" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
}
