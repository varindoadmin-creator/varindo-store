import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'public/**', 'tsconfig.tsbuildinfo'] },
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      // JSX text is already escaped by React; requiring HTML entities makes long-form
      // bilingual copy significantly harder to edit without improving output safety.
      'react/no-unescaped-entities': 'off'
    }
  }
];

export default config;
