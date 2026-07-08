export const themes = ["purple-light", "neutral-light", "neutral-dark", "fintech-blue-light"] as const;
export const densities = ["comfortable", "compact"] as const;

export type NerioTheme = (typeof themes)[number];
export type NerioDensity = (typeof densities)[number];
