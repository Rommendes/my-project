import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint'; // 👈 novo

export default [
  { ignores: ['dist'] },

  // Regras para arquivos TypeScript e React
  {
    files: ['**/*.{ts,tsx}'], // 👈 suporte para TS e TSX
    languageOptions: {
      parser: tseslint.parser, // 👈 parser TypeScript
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true, // ou um caminho para o tsconfig.json se quiser
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommendedTypeChecked.rules, // 👈 regras TS
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': 'off', // desligamos o no-unused-vars do JS
      '@typescript-eslint/no-unused-vars': ['error'], // usamos o do TS
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // Regras para arquivos JS normais (se ainda tiver algum)
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
