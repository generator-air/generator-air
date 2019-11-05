const Generator = require('yeoman-generator');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
	}
	method1() {
		this.log('generator1 —— method 1 just ran');
	}

	method2() {
		this.log('generator1 —— method 2 just ran');
	}

	path() {
		this.log('generator1 —— sourceRoot:', this.sourceRoot())
	}

	/* 生命周期函数 */
	initializing() {
		this.log('generator1 —— initializing')
	}

	prompting() {
		this.log('generator1 —— prompting')
	}

	configuring() {
		this.log('generator1 —— configuring')
	}

	default() {
		this.log('generator1 —— default')
	}

	writing() {
		this.log('generator1 —— writing')
	}

	conflicts() {
		this.log('generator1 —— conflicts')
	}

	install() {
		this.log('generator1 —— install')
	}

	end() {
		this.log('generator1 —— end')
	}
};