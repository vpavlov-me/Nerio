import * as React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ApprovalScene } from "../scenes/ApprovalScene";
import { ComponentPortraitsScene } from "../scenes/ComponentPortraitsScene";
import { DeveloperScene } from "../scenes/DeveloperScene";
import { IdentityScene } from "../scenes/IdentityScene";
import { OutroScene } from "../scenes/OutroScene";
import { TypeManifestoScene } from "../scenes/TypeManifestoScene";
import { getSceneDuration, storyboardTransitionFrames, verticalStoryboard } from "../storyboard";

const sceneDuration = (id: (typeof verticalStoryboard)[number]["id"]) =>
  getSceneDuration(verticalStoryboard, id);

const transition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: storyboardTransitionFrames.vertical })}
  />
);

export function NerioShowreelVertical() {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence
        durationInFrames={sceneDuration("identity")}
        name="Identity vertical"
      >
        <IdentityScene format="vertical" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence
        durationInFrames={sceneDuration("manifesto")}
        name="Type manifesto vertical"
      >
        <TypeManifestoScene durationInFrames={sceneDuration("manifesto")} format="vertical" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence
        durationInFrames={sceneDuration("components")}
        name="Component portraits vertical"
      >
        <ComponentPortraitsScene format="vertical" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence
        durationInFrames={sceneDuration("approval")}
        name="Approval composition vertical"
      >
        <ApprovalScene format="vertical" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence
        durationInFrames={sceneDuration("developer")}
        name="Developer experience vertical"
      >
        <DeveloperScene format="vertical" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={sceneDuration("outro")} name="Outro vertical">
        <OutroScene format="vertical" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
}
