module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: false,
  },
  globals: {
    process: 'readonly',
    __dirname: 'readonly',
    APIMODE: 'readonly',
  },
  extends: ['eslint:recommended', 'plugin:vue/essential', 'prettier'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
