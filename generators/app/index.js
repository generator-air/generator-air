const Generator = require('yeoman-generator');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const questions = require('../../model/questions');
const mapToGit = require('../../model/mapToGit');
//可以在terminal打印自定义样式的字
require('colors');

module.exports = class extends Generator {
	// 必需的 constructor
	constructor(args, opts) {
		// 必需的 super
		super(args, opts);
		// 不自动执行的 helper（实例方法）
		// this.helperMethod = function () {
		// 	this.log('won\'t be called automatically');
		// };
	}

	/* 私有函数 */
	// 获取脚手架模板的git仓库地址，并克隆
	_getGitRepository(projectType, framework) {
		// 检查git命令是否存在
		if (!shell.which('git')) {
			shell.echo('发生错误。请确保您已经安装了Git');
			shell.exit(1);
		}
		const repository = mapToGit(projectType, framework);
		if (repository) {
			this.seedName = repository.slice(repository.lastIndexOf('/') + 1, repository.indexOf('.git'));
			// 进入 projects 目录
			shell.cd(path.resolve(__dirname, '../../projects'));
			const done = this.async();
			// 查看当前项目，projects下是否已存在
			fs.exists(this.seedName, async exists => {
				// 如果已存在，让用户确认，是否重新clone
				if (exists) {
					const answer = await this.prompt({
						type: 'confirm',
						name: 'isUpdate',
						message: '本地已存在脚手架模板，是否更新模板？'
					});
					if (answer.isUpdate) {
						// 删除原有文件夹，重新clone最新版的代码
						shell.rm('-rf', this.seedName);
						shell.exec(`git clone ${repository}`);
					}
					done();
				}
			});
		}
	}
	// 统一的脚手架模板复制入口
	_fileCopy() {
		this._normalFileCopy();
		this._specialFileCopy();
	}

	// 脚手架模板，普通文件及文件夹复制
	_normalFileCopy() {
		// 复制模板文件夹下的内容，到目标文件夹（注：这里无法复制.开头的文件。如.eslintrc）
		this.fs.copyTpl(
			// 以 `${this.sourceRoot}/${this.seedName}` 文件夹为模板
			this.templatePath(this.seedName),
			// 将模板文件夹下的所有内容，复制到 `${this.destinationRoot}/${this.answers.projectName}` 文件夹
			this.destinationPath(this.answers.projectName),
			// 输出给模板的参数
			this.answers
		);
	}
	// 脚手架模板，.开头的文件复制（模板脚手架中，对.开头文件进行特殊处理，以_开头，以确保可以成功复制）
	_specialFileCopy() {
		fs.exists(`${this.sourceRoot()}/${this.seedName}/configs`, exists => {
			// 如果存在配置文件夹
			if (exists) {
				const files = fs.readdirSync(this.templatePath(`${this.seedName}/configs`));
				// 将configs下以_开头的配置文件逐个格式化成以.开头
				files.forEach(file => {
					const formatFile = file.replace('_', '.');
					this.fs.copyTpl(
						this.templatePath(`${this.seedName}/configs/${file}`),
						this.destinationPath(`${this.answers.projectName}/${formatFile}`)
					);
				});
			}
		});
	}
	// configs 配置文件模板删除
	_configsDelete() {
		shell.rm('-rf', `${this.destinationRoot()}/${this.answers.projectName}/configs`);
	}

	/* 生命周期函数 执行顺序，如下注释所示 */
	// No1
	initializing() {
		this.log('initializing:', 1);
		this.log('appname:', this.appname);
		fs.exists(path.resolve(__dirname, '../../projects'), exists => {
			if (!exists) {
				// 创建用于存放脚手架模板的目录
				fs.mkdirSync(path.resolve(__dirname, '../../projects'));
			}
			// 指定脚手架模板目录
			this.sourceRoot(path.resolve(__dirname, '../../projects'));
			// 指定脚手架生成目标文件夹目录
			this.destinationRoot(path.resolve(process.cwd()));
		});
	}
	// No2
	async prompting() {
		this.log('prompting:', 2);
		this.answers = await this.prompt(questions);
	}
	// No3
	configuring() {
		this.log('configuring:', 3);
		const answers = this.answers;
		if (answers) {
			// 根据用户选择，获取对应的 git 仓库，并进行 clone
			this._getGitRepository(answers.type, answers.frameworkH5 || answers.frameworkMini);
		}
	}
	// No4
	default() {
		this.log('default:', 4);
	}
	// No5
	writing() {
		this.log('writing:', 5);
		// 【待删除】脚手架里的index.html读取了BASE_URL字段。当前answers中没有这个字段，出现报错。为绕过报错，模拟测试数据
		this.answers.BASE_URL = '';

		const done = this.async();
		fs.exists(`${this.destinationRoot()}/${this.answers.projectName}`, async exists => {
			this.log('项目已存在:', exists);
			// 如果用户当前目录下，已存在同名项目
			if (exists) {
				const answer = await this.prompt({
					type: 'confirm',
					name: 'isReCreate',
					message: '即将创建的项目已存在，是否要覆盖已有项目？'
				});
				if (answer.isReCreate) {
					shell.rm('-rf', `${this.destinationRoot()}/${this.answers.projectName}`);
				}
				this._fileCopy();
			} else {
				this._fileCopy();
			}
			done();
		});

		// 动态写入 package.json
		// const pkgJson = {
		// 	dependencies: {

		// 	}
		// };
		// this.destinationPath 指定要写入 pkgJson 的目标 package.json
		// this.fs.extendJSON(this.destinationPath(`public/${this.seedName}/package.json`), pkgJson);
	}
	// No6
	conflicts() {
		this.log('conflicts:', 6);
	}
	// No7
	install() {
		this.log('install:', 7);
		/** 执行根目录下 package.json 的安装。
		/* 【注】app/index.js 执行根目录的 package.json 安装。其他各文件夹下的 index.js 的 install()，执行各自文件夹下的 package.json 安装 */
		// this.yarnInstall();
	}
	// No8
	end() {
		this.log('end:', 8);
		this._configsDelete();
		this.log("\n" + "Congratulations! Project created successfully ~".green + "\n");
	}
};
