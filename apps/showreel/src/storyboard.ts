export type StoryboardScene = {
  id: string;
  label: string;
  durationInFrames: number;
};

export const storyboardTransitionFrames = {
  main: 12,
  square: 10,
  vertical: 10,
} as const;

export function getSceneDuration(
  storyboard: readonly StoryboardScene[],
  id: StoryboardScene["id"],
) {
  const scene = storyboard.find((candidate) => candidate.id === id);
  if (!scene) throw new Error(`Unknown storyboard scene: ${id}`);
  return scene.durationInFrames;
}

export function getCompositionDuration(
  storyboard: readonly StoryboardScene[],
  transitionDurationInFrames: number,
) {
  const sceneFrames = storyboard.reduce((total, scene) => total + scene.durationInFrames, 0);
  return sceneFrames - transitionDurationInFrames * Math.max(0, storyboard.length - 1);
}

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
