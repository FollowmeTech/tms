module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prefer-promise-reject-errors': [0, { allowEmptyReject: false }],
    'semi': [2, 'always'],
    'indent': [2, 4, { 'SwitchCase': 1 }],
  },
  parserOptions: {
    parser: 'typescript-eslint-parser'
  }
}