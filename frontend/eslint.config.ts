import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import pluginSecurity from "eslint-plugin-security";
import vueParser from "vue-eslint-parser";

export default [
  // Ignore files
  {
    ignores: [
      "frontend/test/units/coverage/**",
    ],
  },

  // JavaScript base rules
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    rules: {
      ...js.configs.recommended.rules,
    },
    languageOptions: {
      globals: globals.browser,
    },
  },

  // TypeScript rules
  ...tseslint.configs.recommended,

  // Vue rules
  ...pluginVue.configs["flat/recommended"].map((config) => ({
    ...config,
    files: ["**/*.vue"],
  })),
  {
    files: ["**/*.vue"],
    plugins: {
      vue: pluginVue,
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
        sourceType: "module",
      },
    },
    rules: {
      "vue/html-indent": ["warn", 2],
      "vue/max-attributes-per-line": ["warn", {
        singleline: 3,
        multiline: 1,
      }],
      "vue/no-undef-components": ["error", {
        ignorePatterns: ["RouterView", "RouterLink"],
      }],
      "vue/multi-word-component-names": "off",
      "vue/html-self-closing": ["warn", {
        html: {
          void: "always",
        },
      }],
      "vue/require-default-prop": "off",
    },
  },

  // Security rules
  {
    plugins: {
      security: pluginSecurity,
    },
    rules: {
      ...pluginSecurity.configs["recommended"].rules,
      "security/detect-object-injection": "off",  // 誤検知が多いため無効化
    },
  },

  // Custom rules
  {
    rules: {
      "no-console": "warn",
      camelcase: ["warn", { properties: "never" }],
    },
  },
];