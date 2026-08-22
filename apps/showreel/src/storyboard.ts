export type StoryboardScene = {
  id: string;
  label: string;
  durationInFrames: number;
};

export const mainStoryboard = [
  { id: "identity", label: "Identity", durationInFrames: 180 },
  { id: "manifesto", label: "Type manifesto", durationInFrames: 420 },
  { id: "system", label: "System language", durationInFrames: 240 },
  { id: "components", label: "Component portraits", durationInFrames: 480 },
  { id: "composition", label: "Built to compose", durationInFrames: 240 },
  { id: "approval", label: "Approval composition", durationInFrames: 480 },
  { id: "developer", label: "Developer experience", durationInFrames: 240 },
  { id: "outro", label: "Outro", durationInFrames: 144 },
] as const satisfies readonly StoryboardScene[];

export const verticalStoryboard = [
  { id: "identity", label: "Identity", durationInFrames: 150 },
  { id: "manifesto", label: "Type manifesto", durationInFrames: 300 },
  { id: "components", label: "Component portraits", durationInFrames: 330 },
  { id: "approval", label: "Approval composition", durationInFrames: 360 },
  { id: "developer", label: "Developer experience", durationInFrames: 180 },
  { id: "outro", label: "Outro", durationInFrames: 170 },
] as const satisfies readonly StoryboardScene[];

export const squareStoryboard = [
  { id: "identity", label: "Identity", durationInFrames: 120 },
  { id: "manifesto", label: "Type manifesto", durationInFrames: 180 },
  { id: "components", label: "Component portraits", durationInFrames: 220 },
  { id: "approval", label: "Approval composition", durationInFrames: 240 },
  { id: "outro", label: "Outro", durationInFrames: 180 },
] as const satisfies readonly StoryboardScene[];
