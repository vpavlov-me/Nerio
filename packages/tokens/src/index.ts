export const themes = ["neutral-light", "neutral-dark", "nerio-blue"] as const;
export const densities = ["comfortable", "compact"] as const;

export type NerioTheme = (typeof themes)[number];
export type NerioDensity = (typeof densities)[number];
