const Generator = require('yeoman-generator');
const shell = require('shelljs');
const path = require('path');
const questions = require('../../model/questions');
const mapToTemplate = require('../../model/mapToTemplate');
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
  // 集成指定脚手架的 generator
  _generatorCompose(answers) {
    this.seedName = mapToTemplate(answers);
    if (!this.seedName) {
      this.log(
        '\n' +
          '啊哦...所选脚手架尚在开发中，请关注后续版本更新~^_^'.yellow +
          '\n'
      );
      shell.exit(1);
    }
    const generatorArgs = [
      {
        answers,
        sourceRoot: this.sourceRoot(
          path.resolve(__dirname, `../../projectsTemplates/${this.seedName}`)
        ),
        destinationRoot: this.destinationRoot(path.resolve(process.cwd())),
      },
    ];
    this.composeWith(require.resolve(`../generator/${this.seedName}.js`), {
      arguments: generatorArgs,
    });
  }

  /* 生命周期函数 执行顺序，如下注释所示 */
  // No2
  async prompting() {
    this.answers = await this.prompt(questions);
  }

  // No3
  configuring() {
    const answers = this.answers;
    if (answers) {
      // 根据用户选择，走对应的 generator 逻辑
      this._generatorCompose(answers);
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
