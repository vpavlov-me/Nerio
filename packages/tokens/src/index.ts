export const themes = ["purple", "blue", "green", "orange", "red", "neutral"] as const;
export const modes = ["system", "light", "dark"] as const;
export const densities = ["comfortable", "compact"] as const;

export const motionDuration = {
  instant: "80ms",
  fast: "140ms",
  normal: "220ms",
  slow: "360ms",
} as const;

export const motionEasing = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  enter: "cubic-bezier(0, 0, 0.2, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
  expressive: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export const semanticMotion = {
  hover: "fast standard",
  press: "instant standard",
  focus: "fast standard",
  reveal: "normal enter",
  collapse: "fast exit",
  overlayEnter: "normal enter",
  overlayExit: "fast exit",
  pageEnter: "slow expressive",
  dataRefresh: "normal standard",
  successFeedback: "normal expressive",
  errorFeedback: "normal standard",
} as const;

export type NerioPresetTheme = (typeof themes)[number];
export type NerioTheme = NerioPresetTheme | (string & {});
export type NerioMode = (typeof modes)[number];
export type NerioDensity = (typeof densities)[number];
export type NerioMotionDuration = keyof typeof motionDuration;
export type NerioMotionEasing = keyof typeof motionEasing;
export type NerioSemanticMotion = keyof typeof semanticMotion;
