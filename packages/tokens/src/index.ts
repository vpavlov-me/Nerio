export const themes = ["purple", "neutral", "fintech-blue"] as const;
export const modes = ["system", "light", "dark"] as const;
export const densities = ["comfortable", "compact"] as const;

export type NerioTheme = (typeof themes)[number];
export type NerioMode = (typeof modes)[number];
export type NerioDensity = (typeof densities)[number];
