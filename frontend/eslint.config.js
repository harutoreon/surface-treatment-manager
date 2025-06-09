import pluginVue from 'eslint-plugin-vue'
import pluginSecurity from 'eslint-plugin-security'
import vueParser from 'vue-eslint-parser'
import * as espree from 'espree'

export default [
  {
    files: ['**/*.js', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: espree,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        FormData: 'readonly',
        FileReader: 'readonly',
        confirm: 'readonly',
      },
    },
    plugins: {
      vue: pluginVue,
    },
    rules: {
      // Javascript
      'semi': ['warn', 'never'],
      'indent': ['warn', 2],
      'quotes': ['warn', 'single'],
      'no-unused-vars': 'warn',
      'eqeqeq': ['warn', 'always'],
      'no-console': 'warn',
      'keyword-spacing': 'warn',
				"space-before-function-paren": ["warn", {
				  "anonymous": "always",
				  "named": "never",
				  "asyncArrow": "always"
				}],
      'space-infix-ops': 'warn',
      'comma-spacing': 'warn',
      'brace-style': ['warn', '1tbs'],
      'curly': ['warn', 'multi-line'],
      'func-call-spacing': ['warn', 'never'],
      'key-spacing': 'warn',
      'new-cap': 'warn',
      'new-parens': 'warn',
      'no-array-constructor': 'warn',
      'no-floating-decimal': 'warn',
      'spaced-comment': 'warn',
      'no-undef': 'warn',
      'no-eval': 'warn',
      
      // Vue.js
      'vue/valid-v-on': 'error',
      'vue/valid-v-bind': 'error',
      'vue/no-unused-vars': 'warn',
      'vue/no-undef-components': ['warn', {
        ignorePatterns: ['RouterView', 'RouterLink']
      }],
    },
  },
  pluginSecurity.configs.recommended
]
