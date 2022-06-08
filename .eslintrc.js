module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    sourceType: 'module', // Allows for the use of imports
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  extends: [
    'react-app',
    'plugin:react/recommended',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'import',
    'unused-imports',
  ],
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  ignorePatterns: ['/*.*', '**/*.json'], // required to stop this file erroring itself
  rules: {
    'arrow-body-style': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-unused-vars': 'off',
    'react/jsx-one-expression-per-line': 'off',
  },
  overrides: [
    {
      files: ['**/*.stories.*'],
      rules: {
        'import/no-anonymous-default-export': 'off',
      },
    },
  ],
};
