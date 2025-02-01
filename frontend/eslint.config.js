import pluginVue from "eslint-plugin-vue"

export default [
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      vue: pluginVue,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",

      "no-console": "warn",
      "no-debugger": "warn",
      "curly": "error",
      "eqeqeq": "error",
      "no-eval": "error",
      "strict": ["error", "global"],

      "vue/valid-v-on": "error",
      "vue/valid-v-bind": "error",
      "vue/no-unused-vars": "warn",
      "vue/no-undef-components": "warn",
    },
  },
]
