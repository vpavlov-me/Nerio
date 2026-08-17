import * as React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ApprovalScene } from "../scenes/ApprovalScene";
import { ComponentPortraitsScene } from "../scenes/ComponentPortraitsScene";
import { DeveloperScene } from "../scenes/DeveloperScene";
import { IdentityScene } from "../scenes/IdentityScene";
import { OutroScene } from "../scenes/OutroScene";
import { TypeManifestoScene } from "../scenes/TypeManifestoScene";

const transition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 10 })}
  />
);

export function NerioShowreelVertical() {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={150} name="Identity vertical">
        <IdentityScene format="vertical" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={300} name="Type manifesto vertical">
        <TypeManifestoScene format="vertical" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={330} name="Component portraits vertical">
        <ComponentPortraitsScene format="vertical" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={360} name="Approval composition vertical">
        <ApprovalScene format="vertical" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={180} name="Developer experience vertical">
        <DeveloperScene format="vertical" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={170} name="Outro vertical">
        <OutroScene format="vertical" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
}
