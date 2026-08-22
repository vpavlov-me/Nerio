import * as React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ApprovalScene } from "../scenes/ApprovalScene";
import { ComponentPortraitsScene } from "../scenes/ComponentPortraitsScene";
import { CompositionScene } from "../scenes/CompositionScene";
import { DeveloperScene } from "../scenes/DeveloperScene";
import { IdentityScene } from "../scenes/IdentityScene";
import { OutroScene } from "../scenes/OutroScene";
import { SystemLanguageScene } from "../scenes/SystemLanguageScene";
import { TypeManifestoScene } from "../scenes/TypeManifestoScene";

const transition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 12 })}
  />
);

export function NerioShowreel() {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={180} name="Identity">
        <IdentityScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={420} name="Type manifesto">
        <TypeManifestoScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={240} name="System language">
        <SystemLanguageScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={480} name="Component portraits">
        <ComponentPortraitsScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={240} name="Built to compose">
        <CompositionScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={480} name="Approval composition">
        <ApprovalScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={240} name="Developer experience">
        <DeveloperScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={144} name="Outro">
        <OutroScene format="wide" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
}
