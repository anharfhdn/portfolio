import { defineConfig } from "eslint/config";
import nextConfig from "eslint-config-next/core-web-vitals";
import typescriptEslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...nextConfig,
  {
    plugins: {
      "@typescript-eslint": typescriptEslint.plugin,
    },
    rules: {
      "react-hooks/set-state-in-effect": "warn",

      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "dist/**"],
  },
]);

export default eslintConfig;
