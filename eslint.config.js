import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import globals from "globals";

const LAYERS = ["shared", "entities", "features", "widgets", "pages", "app"];

const SLICE_INTERNALS = LAYERS.map((layer) => `${layer}/*/**`);

const PUBLIC_API_MESSAGE =
  'Импортируйте слайс через публичный API (например "entities/task"): internals доступны только внутри слайса.';

const OUTSIDE_SLICE_MESSAGE =
  "Относительный импорт выходит за пределы слайса — используйте публичный API.";

const layerConfigs = LAYERS.map((layer, index) => ({
  files: [`src/${layer}/**/*.{ts,tsx}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          { group: SLICE_INTERNALS, message: PUBLIC_API_MESSAGE },
          {
            group: [...LAYERS.slice(index + 1).map((upper) => `${upper}/**`), `${layer}/**`],
            message: `Слой "${layer}" не импортирует вышележащие слои и другие слайсы своего слоя.`,
          },
          { group: ["../../**"], message: OUTSIDE_SLICE_MESSAGE },
        ],
      },
    ],
  },
}));

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**"] },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: { react, "react-hooks": reactHooks },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: "detect" } },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-key": "error",
      "react/no-unknown-property": "error",
      "react/self-closing-comp": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-restricted-imports": [
        "error",
        { patterns: [{ group: SLICE_INTERNALS, message: PUBLIC_API_MESSAGE }] },
      ],
    },
  },
  ...layerConfigs,
  prettier,
);
