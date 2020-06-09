module.exports = {
  "env": {
      "commonjs": true,
      "es6": true,
      "node": true
  },
  "extends": "eslint:recommended",
  'parser': 'babel-eslint',
  "parserOptions": {
      "ecmaVersion": 2018
  },
  "globals": {
    "location": "readonly"
  },
  "rules": {
      'semi': ['error', 'always']
  }
};
