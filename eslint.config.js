import storybook from 'eslint-plugin-storybook';
import eslintJs from '@eslint/js';
import tsEslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';
import pluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';

export default [
  {
    // GLOBAL IGNORES
    ignores: ['**/dist/', 'stencil/', 'tailwind.config.js', '**/.angular/', '**/.vitepress/', '**/playwright-report/', 'playwright.config.ts'],
  },
  prettier, // general defaults
  eslintJs.configs['recommended'], // general
  {
    files: ['**/*.{js,ts,jsx,tsx,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {},
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsEslint.parser,
    },
  }, // chosen vue defaults
  ...pluginVue.configs['flat/recommended'], // vue
  {
    files: ['**/*.vue'],
    rules: {
      // The built-in no-unused-vars rule incorrectly flags the return value of
      // defineEmits() as unused because the emits function is only called from
      // within the template, which the rule cannot see. Turn it off for Vue
      // files; the vue/no-unused-vars rule from eslint-plugin-vue covers the
      // template-aware equivalent.
      'no-unused-vars': 'off',
      'vue/html-indent': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
          },
        },
      ],
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: true,
          ignores: ['router-link'],
        },
      ],
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsEslint.parser,
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
  },
  ...storybook.configs['flat/recommended'],
];
