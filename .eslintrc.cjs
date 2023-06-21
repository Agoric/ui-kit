/* eslint-disable no-restricted-syntax */
/* eslint-env node */
const process = require('process');

const lintTypes = !!process.env.AGORIC_ESLINT_TYPES;

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: lintTypes
    ? {
        sourceType: 'module',
        project: [
          './packages/*/jsconfig.json',
          './packages/*/tsconfig.json',
          './packages/wallet/*/jsconfig.json',
          './tsconfig.json',
        ],
        tsconfigRootDir: __dirname,
        extraFileExtensions: ['.cjs'],
      }
    : undefined,
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['@agoric', 'plugin:jsdoc/recommended-typescript'],
  rules: {
    '@typescript-eslint/prefer-ts-expect-error': 'warn',
    '@typescript-eslint/no-floating-promises': lintTypes ? 'warn' : 'off',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off',
    // so that floating-promises can be explicitly permitted with void operator
    'no-void': ['error', { allowAsStatement: true }],

    // TS has this covered and eslint gets it wrong
    'no-undef': 'off',

    // n/a to frontend
    '@jessie.js/safe-await-separator': 'off',

    // Note: you must disable the base rule as it can report incorrect errors
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',

    // CI has a separate format check but keep this warn to maintain that "eslint --fix" prettifies
    // UNTIL https://github.com/Agoric/agoric-sdk/issues/4339
    'prettier/prettier': 'warn',
  },
  settings: {
    jsdoc: {
      mode: 'typescript',
    },
  },
  ignorePatterns: [
    'coverage/**',
    '**/output/**',
    'bundles/**',
    'bundle-*',
    'dist/**',
    'examples/**',
    'test262/**',
    '*.html',
    'ava*.config.js',
  ],
};
