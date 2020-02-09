const Generator = require('yeoman-generator');
// const shell = require('shelljs');
// const fs = require('fs');
// const path = require('path');
// const questions = require('../../model/questions');
// const mapToGit = require('../../model/mapToGit');
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

		// this.composeWith(require.resolve('../generator1/index.js'));
		// this.composeWith(require.resolve('../generator2/index.js'));
	}

	initializing() {
		// this.log('app init');
		this.composeWith(require.resolve('../generator/index.js'));
	}

// 	/* 私有函数 */
// 	// 获取脚手架模板的git仓库地址，并克隆
// 	_getGitRepository(answers) {
// 		// 检查git命令是否存在
// 		if (!shell.which('git')) {
// 			shell.echo('发生错误。请确保您已经安装了Git');
// 			shell.exit(1);
// 		}
// 		const repository = mapToGit(answers);
// 		if (repository) {
// 			this.seedName = repository.slice(repository.lastIndexOf('/') + 1, repository.indexOf('.git'));
// 			// 进入 projects 目录
// 			shell.cd(path.resolve(__dirname, '../../projects'));
// 			const done = this.async();
// 			// 查看当前项目，projects下是否已存在
// 			fs.exists(this.seedName, async exists => {
// 				// 如果已存在，让用户确认，是否重新clone
// 				if (exists) {
// 					const answer = await this.prompt({
// 						type: 'confirm',
// 						name: 'isUpdate',
// 						message: '本地已存在脚手架模板，是否更新模板？'
// 					});
// 					if (answer.isUpdate) {
// 						// 删除原有文件夹，重新clone最新版的代码
// 						shell.rm('-rf', this.seedName);
// 						shell.exec(`git clone ${repository}`);
// 					}
// 				} else {
// 					shell.exec(`git clone ${repository}`);
// 				}
// 				done();
// 			});
// 		} else {
// 			this.log("\n" + "啊哦...所选脚手架尚在开发中，请关注后续版本更新~^_^".yellow + "\n");
// 			shell.exit(1);
// 		}
// 	}

// 	// 统一的脚手架模板复制入口
// 	_fileCopy() {
// 		this._normalFileCopy();
// 		this._configFileCopy();
// 		this._loginFileCopy();
// 		this._packageJsonCopy();
// 	}

// 	// configs 下文件夹复制
// 	_configsFolderCopy(folderName) {
// 		const files = fs.readdirSync(this.templatePath(`${this.seedName}/configs/${folderName}`));
// 		files.forEach(file => {
// 			this.fs.copyTpl(
// 				this.templatePath(`${this.seedName}/configs/${folderName}/${file}`),
// 				this.destinationPath(`${this.answers.projectName}/${file}`)
// 			);
// 		});
// 	}

// 	// files 下文件夹复制
// 	_filesFolderCopy(folderName) {
// 		const files = fs.readdirSync(this.templatePath(`${this.seedName}/files/${folderName}`));
// 		files.forEach(file => {
// 			const templatePath = `${this.seedName}/files/${folderName}/${file}`;
// 			let destinationPath = `${this.answers.projectName}/src`;
// 			// 分别处理几个特殊文件（复制到不同的目录下）
// 			if (file === 'errorDict.js') {
// 				destinationPath = `${destinationPath}/model/${file}`;
// 			} else if (file === 'index.js') {
// 				destinationPath = `${destinationPath}/router/${file}`;
// 			} else if (file.indexOf('.vue') > 0) {
// 				destinationPath = `${destinationPath}/pages/${file}`;
// 			}
// 			this._doCopy(templatePath, destinationPath);
// 		});
// 	}

// 	// 执行模板复制
// 	_doCopy(templatePath, destinationPath) {
// 		this.fs.copyTpl(
// 			this.templatePath(templatePath),
// 			this.destinationPath(destinationPath)
// 		);
// 	}

// 	// 脚手架模板，普通文件及文件夹复制
// 	_normalFileCopy() {
// 		// 复制模板文件夹下的内容，到目标文件夹（注：这里无法复制.开头的文件。如.eslintrc）
// 		this.fs.copyTpl(
// 			// 以 `${this.sourceRoot}/${this.seedName}` 文件夹为模板
// 			this.templatePath(this.seedName),
// 			// 将模板文件夹下的所有内容，复制到 `${this.destinationRoot}/${this.answers.projectName}` 文件夹
// 			this.destinationPath(this.answers.projectName),
// 			// 输出给模板的参数
// 			this.answers
// 		);
// 	}

// 	// mock相关配置文件 + .开头的文件复制（模板脚手架中，对.开头文件进行特殊处理，以_开头，以确保可以成功复制）
// 	_configFileCopy() {
// 		fs.exists(`${this.sourceRoot()}/${this.seedName}/configs`, exists => {
// 			// 如果存在配置文件夹（考虑后续支持其他版本脚手架，可能会不存在configs文件夹）
// 			if (exists) {
// 				const files = fs.readdirSync(this.templatePath(`${this.seedName}/configs`));
// 				// 将configs下以_开头的配置文件逐个格式化成以.开头
// 				files.forEach(file => {
// 					const stats = fs.lstatSync(`${this.seedName}/configs/${file}`);
// 					const isDirectory = stats.isDirectory();
// 					if (isDirectory) {
// 						if (file === 'mockConfig') {
// 							if (this.answers.mockType === 'local') {
// 								this._configsFolderCopy('mockConfig');
// 							}
// 						} else {
// 							this._configsFolderCopy('commonConfig');
// 						}
// 					} else {
// 						const formatFile = file.replace('_', '.');
// 						this.fs.copyTpl(
// 							this.templatePath(`${this.seedName}/configs/${file}`),
// 							this.destinationPath(`${this.answers.projectName}/${formatFile}`)
// 						);
// 					}
// 				});
// 			}
// 		});
// 	}

// 	// 登录相关文件复制
// 	_loginFileCopy() {
// 		if (this.answers.loginType === 'self') {
// 			this._filesFolderCopy('loginFiles');
// 		} else {
// 			this._filesFolderCopy('simpleFiles');
// 		}
// 	}

// 	// package.json 生成
// 	_packageJsonCopy() {
// 		// 动态写入 package.json
// 		const name = this.answers.projectName;
// 		const devDependencies = {};
// 		if (this.answers.mockType === 'local') {
// 			devDependencies['json-server'] = '^0.15.1';
// 		}
// 		const pkgJson = {
// 			name,
// 			devDependencies,
// 			"lint-staged": {
// 				"*.js": [
// 					"vue-cli-service lint",
// 					"git add"
// 				],
// 				"*.vue": [
// 					"vue-cli-service lint",
// 					"git add"
// 				]
// 			},
// 			"pre-commit": "lint"
// 		};
// 		// this.destinationPath 指定要写入 pkgJson 的目标 package.json
// 		this.fs.extendJSON(this.destinationPath(`${this.answers.projectName}/package.json`), pkgJson);
// 	}

// 	// configs 配置文件模板删除
// 	_configsDelete() {
// 		shell.rm('-rf', `${this.destinationRoot()}/${this.answers.projectName}/configs`);
// 	}

// 	// files 文件模板删除
// 	_filesDelete() {
// 		shell.rm('-rf', `${this.destinationRoot()}/${this.answers.projectName}/files`);
// 	}


// 	/* 生命周期函数 执行顺序，如下注释所示 */
// 	// No1
// 	initializing() {
// 		this.log('initializing:', 1);
// 		fs.exists(path.resolve(__dirname, '../../projects'), exists => {
// 			if (!exists) {
// 				// 创建用于存放脚手架模板的目录
// 				fs.mkdirSync(path.resolve(__dirname, '../../projects'));
// 			}
// 			// 指定脚手架模板目录
// 			this.sourceRoot(path.resolve(__dirname, '../../projects'));
// 			// 指定脚手架生成目标文件夹目录
// 			this.destinationRoot(path.resolve(process.cwd()));
// 		});
// 	}

// 	// No2
// 	async prompting() {
// 		this.log('prompting:', 2);
// 		this.answers = await this.prompt(questions);
// 	}

// 	// No3
// 	configuring() {
// 		this.log('configuring:', 3);
// 		const answers = this.answers;
// 		if (answers) {
// 			// 根据用户选择，获取对应的 git 仓库，并进行 clone
// 			this._getGitRepository(answers);
// 		}
// 	}

// 	// No4
// 	default() {
// 		this.log('default:', 4);
// 	}

// 	// No5
// 	writing() {
// 		this.log('writing:', 5);

// 		const done = this.async();
// 		fs.exists(`${this.destinationRoot()}/${this.answers.projectName}`, async exists => {
// 			// 如果用户当前目录下，已存在同名项目
// 			if (exists) {
// 				const answer = await this.prompt({
// 					type: 'confirm',
// 					name: 'isReCreate',
// 					message: '即将创建的项目已存在，是否要覆盖已有项目？'
// 				});
// 				if (answer.isReCreate) {
// 					shell.rm('-rf', `${this.destinationRoot()}/${this.answers.projectName}`);
// 					this._fileCopy();
// 				} else {
// 					this.log("\n" + "结束创建。" + "\n");
// 					shell.exit(1);
// 				}
// 			} else {
// 				this._fileCopy();
// 			}
// 			done();
// 		});
// 	}

// 	// No6
// 	conflicts() {
// 		this.log('conflicts:', 6);
// 	}

// 	// No7
// 	install() {
// 		this.log('install:', 7);
// 		// 进入刚刚创建的脚手架目录
// 		shell.cd(`${this.destinationRoot()}/${this.answers.projectName}`);
// 		// 检查是否安装了yarn
// 		if (shell.which('yarn')) {
// 			// 执行npm包安装
// 			this.yarnInstall();
// 		} else if (shell.which('npm')) {
// 			this.npmInstall();
// 		}
// 	}

// 	// No8
// 	end() {
// 		this.log('end:', 8);
// 		this._configsDelete();
// 		this._filesDelete();
// 		this.log("\n" + "Congratulations! Project created successfully ~".green + "\n");
// 	}
};
