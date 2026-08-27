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
import { getSceneDuration, mainStoryboard, storyboardTransitionFrames } from "../storyboard";

const sceneDuration = (id: (typeof mainStoryboard)[number]["id"]) =>
  getSceneDuration(mainStoryboard, id);

const transition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: storyboardTransitionFrames.main })}
  />
);

export function NerioShowreel() {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={sceneDuration("identity")} name="Identity">
        <IdentityScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence
        durationInFrames={sceneDuration("manifesto")}
        name="Type manifesto"
      >
        <TypeManifestoScene durationInFrames={sceneDuration("manifesto")} format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={sceneDuration("system")} name="System language">
        <SystemLanguageScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence
        durationInFrames={sceneDuration("components")}
        name="Component portraits"
      >
        <ComponentPortraitsScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence
        durationInFrames={sceneDuration("composition")}
        name="Built to compose"
      >
        <CompositionScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence
        durationInFrames={sceneDuration("approval")}
        name="Approval composition"
      >
        <ApprovalScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence
        durationInFrames={sceneDuration("developer")}
        name="Developer experience"
      >
        <DeveloperScene format="wide" />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={sceneDuration("outro")} name="Outro">
        <OutroScene format="wide" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
}
