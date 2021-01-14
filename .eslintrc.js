const base = require('@patract/dev/config/eslint');

module.exports = {
  ...base,
  ignorePatterns: [
    '.eslintrc.js',
    '.prettierrc.js',
    'babel.config.js',
    'jest.config.js',
    '.github/**',
    '.vscode/**',
    '.yarn/**',
    '*.spec.ts',
    '**/build/*',
    '**/coverage/*',
    '**/node_modules/*'
  ],
  parserOptions: {
    ...base.parserOptions,
    project: ['./tsconfig.json']
  },
  rules: {
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    ...base.rules
  }
};
