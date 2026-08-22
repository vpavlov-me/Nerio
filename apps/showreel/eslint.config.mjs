import config from "@nerio-ui/config/eslint";

export default [
  ...config,
  {
    ignores: ["dist/**", "out/**", "stills/**"],
  },
  {
    files: ["scripts/**/*.mjs"],
    rules: {
      "no-undef": "off",
    },
  },
];
