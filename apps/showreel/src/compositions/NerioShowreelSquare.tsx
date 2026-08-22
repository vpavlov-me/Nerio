import * as React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ApprovalScene } from "../scenes/ApprovalScene";
import { ComponentPortraitsScene } from "../scenes/ComponentPortraitsScene";
import { IdentityScene } from "../scenes/IdentityScene";
import { OutroScene } from "../scenes/OutroScene";
import { TypeManifestoScene } from "../scenes/TypeManifestoScene";

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
      <TransitionSeries.Sequence durationInFrames={180} name="Type manifesto square">
        <TypeManifestoScene format="square" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={220} name="Component portraits square">
        <ComponentPortraitsScene format="square" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={240} name="Approval composition square">
        <ApprovalScene format="square" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={180} name="Outro square">
        <OutroScene format="square" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
}
