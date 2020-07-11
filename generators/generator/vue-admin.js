const Generator = require('yeoman-generator');
const shell = require('shelljs');
const fs = require('fs');
//可以在terminal打印自定义样式的字
require('colors');

// 所有操作，均在用户执行 yo air 的目录下
module.exports = class extends Generator {
  // 必需的 constructor
  constructor(args, opts) {
    // 必需的 super
    super(args, opts);
    const {
      seedName,
      answers,
      sourceRoot,
      destinationRoot,
      airVersion,
      repository,
    } = args[0];
    // 根据 air 版本号，clone 相应版本的模板
    this._repositoryClone(airVersion, repository);
    this.seedName = seedName;
    this.answers = answers;
    // 指定脚手架模板目录
    this.sourceRoot(sourceRoot);
    // 指定脚手架生成目标文件夹目录
    this.destinationRoot(destinationRoot);
  }

  /* 私有函数 */
  // 根据 air 版本号，clone 相应版本的模板
  _repositoryClone(airVersion, repository) {
    let tag = '';
    // vue-admin tag版本号 => generator-air 版本号
    const map = {
      'v1.0.0': /0\.\d\.\d/,
      'v2.0.0': /1\.0\.\d/,
    };
    Object.keys(map).forEach((key) => {
      if (airVersion.match(map[key])) {
        tag = key;
      }
    });
    this.log('tag:', tag);
    if (tag) {
      // 禁掉tag切换警告
      shell.exec('git config --global advice.detachedHead false');
      shell.exec(`git clone --branch ${tag} ${repository}`);
    } else {
      shell.exec(`git clone ${repository}`);
    }
  }
  // 统一的脚手架模板复制入口
  _fileCopy() {
    this._normalFileCopy();
    this._configFileCopy();
    this._loginFileCopy();
    this._packageJsonCopy();
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

  // mock相关配置文件 + .开头的文件复制（模板脚手架中，对.开头文件进行特殊处理，以_开头，以确保可以成功复制）
  _configFileCopy() {
    fs.exists(`${this.sourceRoot()}/${this.seedName}/configs`, (exists) => {
      // 如果存在配置文件夹（考虑后续支持其他版本脚手架，可能会不存在configs文件夹）
      if (exists) {
        const files = fs.readdirSync(
          this.templatePath(`${this.seedName}/configs`)
        );
        // 将configs下以_开头的配置文件逐个格式化成以.开头
        files.forEach((file) => {
          const stats = fs.lstatSync(
            `${this.sourceRoot()}/${this.seedName}/configs/${file}`
          );
          const isDirectory = stats.isDirectory();
          if (isDirectory) {
            if (file === 'mockConfig') {
              if (this.answers.mockType === 'local') {
                this._configsFolderCopy('mockConfig');
              }
            } else {
              this._configsFolderCopy('commonConfig');
            }
          } else {
            const formatFile = file.replace('_', '.');
            this.fs.copyTpl(
              this.templatePath(`${this.seedName}/configs/${file}`),
              this.destinationPath(`${this.answers.projectName}/${formatFile}`)
            );
          }
        });
      }
    });
  }

  // 登录相关文件复制
  _loginFileCopy() {
    if (this.answers.loginType === 'self') {
      this._filesFolderCopy('loginFiles');
    } else {
      this._filesFolderCopy('simpleFiles');
    }
  }

  // package.json 生成
  _packageJsonCopy() {
    // 动态写入 package.json
    const name = this.answers.projectName;
    const devDependencies = {};
    if (this.answers.mockType === 'local') {
      devDependencies['json-server'] = '^0.15.1';
    }
    const pkgJson = {
      name,
      devDependencies,
      'lint-staged': {
        '*.js': ['vue-cli-service lint', 'git add'],
        '*.vue': ['vue-cli-service lint', 'git add'],
      },
      'pre-commit': 'lint',
    };
    // this.destinationPath 指定要写入 pkgJson 的目标 package.json
    this.fs.extendJSON(
      this.destinationPath(`${this.answers.projectName}/package.json`),
      pkgJson
    );
  }

  // files 下文件夹复制
  _filesFolderCopy(folderName) {
    const files = fs.readdirSync(
      this.templatePath(`${this.seedName}/files/${folderName}`)
    );
    files.forEach((file) => {
      const templatePath = `${this.seedName}/files/${folderName}/${file}`;
      let destinationPath = `${this.answers.projectName}/src`;
      // 分别处理几个特殊文件（复制到不同的目录下）
      if (file === 'errorDict.js') {
        destinationPath = `${destinationPath}/model/${file}`;
      } else if (file === 'index.js') {
        destinationPath = `${destinationPath}/router/${file}`;
      } else if (file.indexOf('.vue') > 0) {
        destinationPath = `${destinationPath}/pages/${file}`;
      }
      this._doCopy(templatePath, destinationPath);
    });
  }

  // 执行模板复制
  _doCopy(templatePath, destinationPath) {
    this.fs.copyTpl(
      this.templatePath(templatePath),
      this.destinationPath(destinationPath)
    );
  }

  // configs 下文件夹复制
  _configsFolderCopy(folderName) {
    const files = fs.readdirSync(
      this.templatePath(`${this.seedName}/configs/${folderName}`)
    );
    files.forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(`${this.seedName}/configs/${folderName}/${file}`),
        this.destinationPath(`${this.answers.projectName}/${file}`)
      );
    });
  }

  // configs 配置文件模板删除
  _configsDelete() {
    shell.rm(
      '-rf',
      `${this.destinationRoot()}/${this.answers.projectName}/configs`
    );
  }

  // files 文件模板删除
  _filesDelete() {
    shell.rm(
      '-rf',
      `${this.destinationRoot()}/${this.answers.projectName}/files`
    );
  }

  /* 生命周期函数 执行顺序，如下注释所示 */
  // No5
  writing() {
    const done = this.async();
    fs.exists(
      `${this.destinationRoot()}/${this.answers.projectName}`,
      async (exists) => {
        // 如果用户当前目录下，已存在同名项目
        if (exists) {
          const answer = await this.prompt({
            type: 'confirm',
            name: 'isReCreate',
            message: '即将创建的项目已存在，是否要覆盖已有项目？',
          });
          if (answer.isReCreate) {
            shell.rm(
              '-rf',
              `${this.destinationRoot()}/${this.answers.projectName}`
            );
            this._fileCopy();
          } else {
            shell.exit(1);
          }
        } else {
          this._fileCopy();
        }
        done();
      }
    );
  }

  // No7
  install() {
    // 进入刚刚创建的脚手架目录
    shell.cd(`${this.destinationRoot()}/${this.answers.projectName}`);
    // 检查是否安装了yarn
    if (shell.which('yarn')) {
      // 执行npm包安装
      this.yarnInstall();
    } else if (shell.which('npm')) {
      this.npmInstall();
    }
  }

  // No8
  end() {
    this._configsDelete();
    this._filesDelete();
    this.log(
      '\n' + 'Congratulations! Project created successfully ~'.green + '\n'
    );
  }
};
