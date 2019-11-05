const Generator = require('yeoman-generator');
const questions = require('../../model/questions');
//可以在terminal打印自定义样式的字
require('colors');

module.exports = class extends Generator {
	// 必需的 constructor
	constructor(args, opts) {
		// 必需的 super
		super(args, opts);
		// 调用this.argument，指定argument（不设置options，默认必传。不传会报错）。并定义argument的名称为 name
		this.argument('projectName', {
			type: Array,
			required: false, // this.argument不传第二个option参数，这里默认true
			default: this.appname,
			desc: '项目名称'
		});

		// 调用this.option，指定自定义的flag。并定义flag的名称为 coffee（可通过 yo quyu --help 查看到自定义的flag）
		this.option('coffee', {
			alias: 'co'
		});
		// 输出调用时传入的 arguments
		// this.log('args:', args)
		// 不自动执行的 helper（实例方法）
		this.helperMethod = function () {
			this.log('won\'t be called automatically');
		};
	}

	/* 生命周期函数 */
	initializing() {
		this.sourceRoot('projects');
		// 读取yo quyu argument，传入的 argument。如果传入了多个 argument，且 argument 类型未定义为 Array，这里会取第一个
		// this.log('initializing argument:', this.options.projectName)
		// this.log('initializing option:', this.options.coffee)
		// 多个generator混入
		// this.composeWith(require.resolve('../generator1'));
		// this.composeWith(require.resolve('../generator2'));
	}

	async prompting() {
		this.answers = await this.prompt(questions);
	}

	configuring() {
		this.log('app configuring');
	}

	default() {
		this.log('app default');
	}

	writing() {
		const pkgJson = {
			dependencies: {

			}
		};
		// this.destinationPath 指定要写入 pkgJson 的目标 package.json
		this.fs.extendJSON(this.destinationPath('projects/vue/package.json'), pkgJson);
		// 复制模板文件夹到目标文件夹
		this.fs.copyTpl(
			// 以 this.sourceRoot 文件夹为模板
			this.templatePath(),
			// 根目录下创建 public，将模板文件夹内容整个复制到 public 中
			this.destinationPath('public'),
			// 输出给模板的参数
			this.answers
		);
	}

	conflicts() {
		this.log('app conflicts');
	}

	install() {
		/** 执行根目录下 package.json 的安装。
		/* 【注】app/index.js 执行根目录的 package.json 安装。其他各文件夹下的 index.js 的 install()，执行各自文件夹下的 package.json 安装 */
		// this.yarnInstall();
	}

	end() {
		this.log("\n" + "Congratulations! Project created successfully ~".green + "\n");
	}

};
