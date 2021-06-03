module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'google'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    quotes: ['off', 'double'],
    'require-jsdoc': 0,
    'object-curly-spacing': 0,
    'no-trailing-spaces': 0,
    indent: 0,
    'quote-props': 0,
    'comma-dangle': 0,
  },
};
