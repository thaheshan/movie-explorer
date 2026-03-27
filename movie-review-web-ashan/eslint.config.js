import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node, // ✅ added Node support
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      js,
      react: pluginReact,
    },

    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,

      // React specific fixes
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
      "react/prop-types": "off", // Optional (you can enable later)

      // General improvements
      "no-unused-vars": ["warn"],
      "no-console": "warn",
    },
  },

  // React settings
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Prettier (must be last)
  prettier,
]);