import * as React from "react";
import { Composition, Folder, Still } from "remotion";
import { NerioHeroLoop } from "./compositions/NerioHeroLoop";
import { NerioShowreel } from "./compositions/NerioShowreel";
import { NerioShowreelSquare } from "./compositions/NerioShowreelSquare";
import { NerioShowreelVertical } from "./compositions/NerioShowreelVertical";
import { PosterFrame } from "./compositions/PosterFrame";
import {
  getCompositionDuration,
  mainStoryboard,
  squareStoryboard,
  storyboardTransitionFrames,
  verticalStoryboard,
} from "./storyboard";
import "./styles.css";

export function RemotionRoot() {
  return (
    <>
      <Folder name="Nerio-Showreel">
        <Composition
          id="NerioShowreel"
          component={NerioShowreel}
          durationInFrames={getCompositionDuration(mainStoryboard, storyboardTransitionFrames.main)}
          fps={60}
          width={1920}
          height={1080}
        />
        <Composition
          id="NerioShowreelVertical"
          component={NerioShowreelVertical}
          durationInFrames={getCompositionDuration(
            verticalStoryboard,
            storyboardTransitionFrames.vertical,
          )}
          fps={60}
          width={1080}
          height={1920}
        />
        <Composition
          id="NerioShowreelSquare"
          component={NerioShowreelSquare}
          durationInFrames={getCompositionDuration(
            squareStoryboard,
            storyboardTransitionFrames.square,
          )}
          fps={60}
          width={1080}
          height={1080}
        />
        <Composition
          id="NerioHeroLoop"
          component={NerioHeroLoop}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="Nerio-Posters">
        <Still id="NerioPosterWide" component={PosterFrame} width={1920} height={1080} />
        <Still id="NerioPosterVertical" component={PosterFrame} width={1080} height={1920} />
        <Still id="NerioPosterSquare" component={PosterFrame} width={1080} height={1080} />
      </Folder>
    </>
  );
}
