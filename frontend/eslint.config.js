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
        parser: {
          parse: (code, options) => espree.parse(code, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            ...options,
          })
        },
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
      'space-before-function-paren': ['warn', {
        'anonymous': 'always',
        'named': 'never',
        'asyncArrow': 'always'
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
      'vue/html-indent': ['warn', 2],
      'vue/max-attributes-per-line': ['warn', {
        singleline: 3,
        multiline: 1,
      }],
      'vue/singleline-html-element-content-newline': ['warn', {
        ignoreWhenNoAttributes: true,
        ignoreWhenEmpty: true,
        ignores: ['pre', 'textarea'],
      }],
      'vue/multiline-html-element-content-newline': ['warn', {
        ignoreWhenEmpty: true,
        ignores: ['pre', 'textarea'],
      }],
      'vue/valid-v-on': 'error',
      'vue/valid-v-bind': 'error',
      'vue/valid-v-cloak': 'error',
      'vue/valid-v-else-if': 'error',
      'vue/valid-v-else': 'error',
      'vue/valid-v-for': 'error',
      'vue/valid-v-html': 'error',
      'vue/valid-v-if': 'error',
      'vue/valid-v-is': 'error',
      'vue/valid-v-memo': 'error',
      'vue/valid-v-model': 'error',
      'vue/valid-v-on': 'error',
      'vue/valid-v-once': 'error',
      'vue/valid-v-pre': 'error',
      'vue/valid-v-show': 'error',
      'vue/valid-v-slot': 'error',      
      'vue/valid-v-text': 'error',      
      'vue/no-unused-vars': 'error',
      'vue/no-template-shadow': 'error',
      'vue/no-undef-components': ['error', {
        ignorePatterns: ['RouterView', 'RouterLink']
      }],
      'vue/no-mutating-props': 'error',
    },
  },
  pluginSecurity.configs.recommended
]
