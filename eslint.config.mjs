import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  {
    rules: {
      "@next/next/no-html-link-for-pages": ["error", "apps/docs/src/app"],
    },
  },
  {
    files: ["packages/**/*.{js,jsx,ts,tsx}"],
    rules: {
      // The published package is not a Next.js app.
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "storybook-static/**",
    "next-env.d.ts",
    "**/dist/**",
    "apps/docs/.next/**",
  ]),
]);

export default eslintConfig;
