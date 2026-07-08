export const themes = ["purple", "blue", "green", "orange", "red", "neutral"] as const;
export const modes = ["system", "light", "dark"] as const;
export const densities = ["comfortable", "compact"] as const;

export type NerioPresetTheme = (typeof themes)[number];
export type NerioTheme = NerioPresetTheme | (string & {});
export type NerioMode = (typeof modes)[number];
export type NerioDensity = (typeof densities)[number];
