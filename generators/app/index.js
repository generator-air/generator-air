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
  _repositoryClone(answers) {
    // 检查git命令是否存在
    if (!shell.which('git')) {
      shell.echo('发生错误。请确保您已经安装了Git');
      shell.exit(1);
    }
    const repository = mapToGit(answers);
    if (repository) {
      this.seedName = repository.slice(
        repository.lastIndexOf('/') + 1,
        repository.indexOf('.git')
      );
      // 进入 projects 目录
      shell.cd(path.resolve(__dirname, '../../projects'));
      const done = this.async();
      // 查看当前项目，projects下是否已存在
      fs.exists(this.seedName, async (exists) => {
        // 如果已存在，让用户确认，是否重新clone
        if (exists) {
          const answer = await this.prompt({
            type: 'confirm',
            name: 'isUpdate',
            message: '本地已存在脚手架模板，是否更新模板？',
          });
          if (answer.isUpdate) {
            // 删除原有文件夹，重新clone最新版的代码
            shell.rm('-rf', this.seedName);
            shell.exec(`git clone ${repository}`);
          }
        } else {
          shell.exec(`git clone ${repository}`);
        }
        done();
      });
    } else {
      this.log(
        '\n' +
          '啊哦...所选脚手架尚在开发中，请关注后续版本更新~^_^'.yellow +
          '\n'
      );
      shell.exit(1);
    }
  }

  /* 生命周期函数 执行顺序，如下注释所示 */
  // No1
  initializing() {
    this.log('initializing:', 1);
    fs.exists(path.resolve(__dirname, '../../projects'), (exists) => {
      if (!exists) {
        // 创建用于存放脚手架模板的目录
        fs.mkdirSync(path.resolve(__dirname, '../../projects'));
      }
      // 指定脚手架模板目录
      this.sourceRoot(path.resolve(__dirname, '../../projects'));
      // 指定脚手架生成目标文件夹目录（在generator里，读取不到用户执行命令的位置，所以在app/index.js中获取，再传给子generator）
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
      this._repositoryClone(answers);
      const generatorArgs = [
        {
          seedName: this.seedName,
          answers,
          sourceRoot: this.sourceRoot(),
          destinationRoot: this.destinationRoot(),
        },
      ];
      this.composeWith(require.resolve(`../generator/${this.seedName}.js`), {
        arguments: generatorArgs,
      });
    }
  }

  // 	// No4
  // 	default() {
  // 		this.log('default:', 4);
  // 	}

  // No5
  // writing() {
  //   this.log('writing:', 5);

  // }

  // 	// No6
  // 	conflicts() {
  // 		this.log('conflicts:', 6);
  // 	}

  // 	// No7
  // 	install() {
  // 		this.log('install:', 7);
  // 	}

  // 	// No8
  // 	end() {
  // 		this.log('end:', 8);
  // 	}
};
