export type StoryboardScene = {
  id: string;
  label: string;
  durationInFrames: number;
};

export const mainStoryboard = [
  { id: "identity", label: "Identity", durationInFrames: 180 },
  { id: "positioning", label: "Positioning", durationInFrames: 240 },
  { id: "foundations", label: "Foundations", durationInFrames: 360 },
  { id: "components", label: "Core components", durationInFrames: 660 },
  { id: "interaction", label: "Interaction", durationInFrames: 480 },
  { id: "product", label: "Product composition", durationInFrames: 480 },
  { id: "developer", label: "Developer experience", durationInFrames: 360 },
  { id: "outro", label: "Outro", durationInFrames: 225 },
] as const satisfies readonly StoryboardScene[];

export const verticalStoryboard = [
  { id: "identity", label: "Identity", durationInFrames: 150 },
  { id: "positioning", label: "Positioning", durationInFrames: 210 },
  { id: "foundations", label: "Foundations", durationInFrames: 270 },
  { id: "components", label: "Core components", durationInFrames: 300 },
  { id: "product", label: "Product composition", durationInFrames: 330 },
  { id: "outro", label: "Outro", durationInFrames: 240 },
] as const satisfies readonly StoryboardScene[];

export const squareStoryboard = [
  { id: "identity", label: "Identity", durationInFrames: 150 },
  { id: "foundations", label: "Foundations", durationInFrames: 180 },
  { id: "components", label: "Core components", durationInFrames: 200 },
  { id: "product", label: "Product composition", durationInFrames: 230 },
  { id: "outro", label: "Outro", durationInFrames: 180 },
] as const satisfies readonly StoryboardScene[];
