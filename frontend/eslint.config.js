import pluginVue from 'eslint-plugin-vue'
import pluginSecurity from 'eslint-plugin-security'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'

export default [
  // Security
  pluginSecurity.configs.recommended,

  // Flat Config
  ...pluginVue.configs['flat/recommended'],

  // Main Config
  {
    files: ['**/*.js', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // JavaScript
      'semi': ['warn', 'never'],
      'indent': ['warn', 2],
      'quotes': ['warn', 'single'],
      'no-unused-vars': 'warn',
      'eqeqeq': ['warn', 'always'],
      'no-console': 'warn',
      'keyword-spacing': 'warn',
      'space-before-function-paren': ['warn', {
        'anonymous': 'always',
        'named': 'never',
        'asyncArrow': 'always'
      }],
      'space-infix-ops': 'warn',
      'comma-spacing': 'warn',
      'brace-style': ['warn', '1tbs'],
      'curly': ['warn', 'multi-line'],
      'no-undef': 'error',
      'no-eval': 'error',

      // Vue.js Custom
      'vue/html-indent': ['warn', 2],
      'vue/max-attributes-per-line': ['warn', {
        singleline: 3,
        multiline: 1,
      }],
      'vue/no-undef-components': ['error', {
        ignorePatterns: ['RouterView', 'RouterLink']
      }],
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': ['warn', {
        html: {
          void: 'always',
        }
      }],
      'vue/require-default-prop': 'off'
    },
  },

  // Config File itself
  {
    files: ['*.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  }
]
