const Generator = require('yeoman-generator');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
	}
	method1() {
		this.log('generator2 —— method 1 just ran');
	}

	method2() {
		this.log('generator2 —— method 2 just ran');
	}

	/* 生命周期函数 */
	initializing() {
		this.log('generator2 —— initializing');
	}

	prompting() {
		this.log('generator2 —— prompting');
	}

	configuring() {
		this.log('generator2 —— configuring');
	}

	default() {
		this.log('generator2 —— default');
	}

	writing() {
		this.log('generator2 —— writing');
	}

	conflicts() {
		this.log('generator2 —— conflicts');
	}

	install() {
		this.log('generator2 —— install');
	}

	end() {
		this.log('generator2 —— end');
	}
};
