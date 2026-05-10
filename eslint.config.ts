import {nodeConfig} from '@dada78641/eslint-config';

export default [
  ...nodeConfig,
  {
    rules: {
      '@stylistic/semi': ['error', 'always', {omitLastInOneLineBlock: false}],
      '@typescript-eslint/no-explicit-any': 'warn',
    }
  }
];
