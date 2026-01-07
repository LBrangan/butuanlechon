import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    plugins: {
      vue: pluginVue
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      ...pluginVue.configs.base.rules,
      ...pluginVue.configs['vue3-recommended'].rules,
      'vue/multi-word-component-names': 'off'
    }
  },
  skipFormatting
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
]
