const Generator = require('yeoman-generator');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const updateNotifier = require('update-notifier');
const semver = require('semver');
const pkg = require('../../package.json');
const commonQs = require('../../model/commonQs');
const getTagQs = require('../../model/tagQs');
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
  // node 版本检查
  _checkNodeVersion(wanted) {
    // process.version 可以获取当前的 node 版本
    if (!semver.satisfies(process.version, wanted)) {
      console.log('Node版本过低，请升级到v8.0.0以上版本');
      // 退出进程
      process.exit(1);
    }
  }
  // 版本更新检查
  _checkVersion() {
    const notifier = updateNotifier({ pkg, updateCheckInterval: 0 });
    if (notifier.update) {
      notifier.notify({ isGlobal: true });
      shell.exit(1);
    }
  }
  // 检查git是否存在
  _checkGit() {
    if (!shell.which('git')) {
      this.log('对不起，检查到您本地没有安装git，请安装后再次操作'.yellow);
      shell.exit(1);
    }
  }
  // 检查feflow是否安装
  _checkFeflow() {
    if (!shell.which('fef')) {
      this.log(
        '【warning】generator-air基于feflow构建，请先全局安装 feflow: '.red +
          'npm install @feflow/cli -g'.yellow
      );
      shell.exit(1);
    }
  }
  // 环境检查
  _checkEnvironment() {
    // node 版本检查
    this._checkNodeVersion('>=8.0.0');
    // 版本更新检查
    this._checkVersion();
    // 检查git命令是否存在
    this._checkGit();
    // 检查开发者是否安装feflow
    this._checkFeflow();
  }
  // 获取脚手架模板的git仓库地址
  async _getRepository(answers) {
    const repository = mapToGit(answers);
    if (!repository) {
      this.log(
        '\n' +
          '啊哦...所选脚手架尚在开发中，请关注后续版本更新~^_^'.yellow +
          '\n'
      );
      shell.exit(1);
    }
    this.seedName = repository.slice(
      repository.lastIndexOf('/') + 1,
      repository.indexOf('.git')
    );
    // 进入 projects 目录
    shell.cd(path.resolve(__dirname, '../../projects'));
    // 查看当前项目，projects下是否已存在
    const isExists = fs.existsSync(this.seedName);
    if (!isExists) {
      // 让用户选择clone的模板版本
      this._tagChoose(repository);
      return;
    }
    // 如果已存在，让用户确认，是否重新clone
    const answer = await this.prompt({
      type: 'confirm',
      name: 'isUpdate',
      message: '本地已存在脚手架模板，是否更新模板？',
      default: true,
    });
    if (!answer.isUpdate) {
      this._generatorCompose();
      return;
    }
    // 如果需要更新模板，删除原有文件夹，重新clone
    shell.rm('-rf', this.seedName);
    // 让用户选择clone的模板版本
    this._tagChoose(repository);
  }

  // 拉取指定仓库的所有tag，供用户选择
  _tagChoose(repository) {
    shell.exec(
      `git ls-remote --tags ${repository}`,
      { silent: true },
      async (code, stdout) => {
        const tagInfos = stdout.split('\n');
        // split切割出的最后一项是空项，手动弹出，删除空项
        tagInfos.pop();
        const tags = [];
        tagInfos.forEach((tagInfo) => {
          // 手动删除带有^{}的tag标签（这类标签是怎样产生的，待查）
          if (tagInfo.indexOf('{}') === -1) {
            const start = tagInfo.lastIndexOf('/') + 1;
            const tag = tagInfo.substring(start);
            tags.push(tag);
          }
        });
        const tagQs = getTagQs(tags);
        const tagAnswer = await this.prompt(tagQs);
        // 根据用户选择的版本，拉取模板+generator代码
        if (tagAnswer.version === 'latest') {
          shell.exec(`git clone ${repository}`);
        } else {
          // 禁掉tag切换警告
          shell.exec('git config --global advice.detachedHead false');
          shell.exec(`git clone --branch ${tagAnswer.version} ${repository}`);
        }
        this._generatorCompose();
      }
    );
  }

  // 集成指定脚手架的 generator
  _generatorCompose() {
    this.composeWith(
      require.resolve(
        path.resolve(
          __dirname,
          `../../projects/${this.seedName}/generator/generator.js`
        )
      )
    );
  }

  /* 生命周期函数 执行顺序，如下注释所示 */
  // No1
  async initializing() {
    // 环境检查
    this._checkEnvironment();
    const isExists = fs.existsSync(path.resolve(__dirname, '../../projects'));
    if (!isExists) {
      // 创建用于存放脚手架模板的目录
      fs.mkdirSync(path.resolve(__dirname, '../../projects'));
    }
  }

  // No2
  async prompting() {
    const answers = await this.prompt(commonQs);
    if (answers) {
      // 根据用户选择，获取对应的 git 仓库，并进行 clone
      this._getRepository(answers);
    }
  }

  // No3
  // configuring() {
  // 		this.log('configuring:', 3);
  // }

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
