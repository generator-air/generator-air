module.exports = {
	"env": {
			"commonjs": true,
			"es6": true,
			"node": true
	},
	"extends": "eslint:recommended",
	"globals": {
			"Atomics": "readonly",
			"SharedArrayBuffer": "readonly"
	},
	'parser': 'babel-eslint',
	"parserOptions": {
			"ecmaVersion": 2018
	},
	"rules": {
			'for-direction': 'off',
			'getter-return': [
				'off',
				{
					'allowImplicit': false
				}
			],
			'no-async-promise-executor': 'off',
			'no-misleading-character-class': 'off',
			'no-useless-catch': 'off',
			'require-atomic-updates': 'off',
			'semi': 'error'
	}
};
