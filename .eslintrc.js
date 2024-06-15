module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/prettier',
    'plugin:vue-scoped-css/recommended',
    'plugin:jest/recommended'
  ],
  rules: {
    'vue-scoped-css/no-unused-selector': [
      'warn',
      {
        ignoreBEMModifier: true
      }
    ],
    'vue/v-on-style': ['error', 'shorthand'],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-alert': 'error',
    eqeqeq: 'error',
    'prefer-template': 'error',
    'no-console': 'warn',
    'no-debugger': 'warn'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
