import base from "@nerio/config/eslint";

export default [
  ...base,
  {
    files: ["src/**/*.js", "fixtures/**/*.js"],
    languageOptions: {
      globals: {
        __dirname: "readonly",
        console: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
