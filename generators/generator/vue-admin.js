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
    // 指定脚手架生成目标文件夹目录（这个地址要从 app/index.js 传过来。不能在当前文件中获取，因为这里获取不到用户执行目录）
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
      'v3.0.0': /1\.1\.\d/,
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
    // 根据模板js文件，生成js代码
    this._generateFiles();
    // 模板项目所有文件复制
    this._normalFileCopy();
    // .开头的配置文件复制（.editorconfig、.eslintrc、.gitignore）
    this._configFileCopy();
    // package.json 动态生成
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

  // 根据模板项目包含的模板文件，生成使用者期望的代码
  _generateFiles() {
    const templatePath = `${this.sourceRoot()}/${this.seedName}/templates`;

    const {
      mockServerTask,
      authImport,
      loginPageImport,
      loginPageRoute,
      thirdLoginRedirectHandler,
      selfLoginRedirectHandler,
      routeHandler,
      menuHandler,
      authMenuHandler,
      operationMenu,
      logMenu,
    } = require(`${templatePath}/const/code.js`);

    const {
      LOCAL_MOCK_HOST,
      ONLINE_MOCK_HOST,
      MOCK_SERVER_NAME,
    } = require(`${templatePath}/const/constants.js`);

    /* config.js 生成 */
    const configFileTemplates = fs.readdirSync(
      this.templatePath(`${this.seedName}/templates/configTemplates`)
    );
    configFileTemplates.forEach((fileName) => {
      const generateFile = require(`${templatePath}/configTemplates/${fileName}`);
      const localMock = this.answers.mockType === 'local';
      const mockConfig = {
        mockHost: localMock ? LOCAL_MOCK_HOST : ONLINE_MOCK_HOST,
        mockServerName: localMock ? `\n  '${MOCK_SERVER_NAME}',` : '',
        mockServerTask: localMock ? mockServerTask : '',
      };
      const file = generateFile(mockConfig);
      const filePath = this.templatePath(`${this.seedName}/config/${fileName}`);
      fs.writeFileSync(filePath, file);
    });

    /* router/index.js + menu.js 生成 */
    const fileTemplates = fs.readdirSync(
      this.templatePath(`${this.seedName}/templates/fileTemplates`)
    );
    fileTemplates.forEach((fileName) => {
      const generateFile = require(`${templatePath}/fileTemplates/${fileName}`);
      const { loginType, useAuth, useLog } = this.answers;
      const selfLogin = loginType === 'self';
      const fileConfig = {
        loginPageImport: selfLogin ? loginPageImport : '',
        loginPageRoute: selfLogin ? loginPageRoute : '',
        redirectHandler: selfLogin
          ? selfLoginRedirectHandler
          : thirdLoginRedirectHandler,
        authImport: useAuth ? authImport : '',
        routeHandler: useAuth ? routeHandler : '',
        menuHandler: useAuth ? authMenuHandler : menuHandler,
        operationMenu: useAuth ? operationMenu : '',
        logMenu: useLog ? logMenu : '',
      };
      const file = generateFile(fileConfig);
      let filePath = '';
      switch (fileName) {
        case 'routerIndex.js':
          filePath = this.templatePath(`${this.seedName}/src/router/index.js`);
          break;
        case 'menu.js':
          filePath = this.templatePath(`${this.seedName}/src/model/menu.js`);
          break;
        default:
          break;
      }
      fs.writeFileSync(filePath, file);
    });
  }

  // .开头的文件复制（模板脚手架中，对.开头文件进行特殊处理，以_开头，以确保可以成功复制）
  _configFileCopy() {
    const files = fs.readdirSync(
      this.templatePath(`${this.seedName}/templates/configFiles`)
    );
    // 将configs下以_开头的配置文件逐个格式化成以.开头
    files.forEach((file) => {
      const formatFile = file.replace('_', '.');
      this.fs.copyTpl(
        this.templatePath(`${this.seedName}/templates/configFiles/${file}`),
        this.destinationPath(`${this.answers.projectName}/${formatFile}`)
      );
    });
  }

  // package.json 生成
  _packageJsonCopy() {
    const { projectName, mockType, useAuth, useLog } = this.answers;
    // 动态写入 package.json
    const dependencies = {};
    const devDependencies = {};
    // 本地 mock 添加 json-server
    if (mockType === 'local') {
      devDependencies['json-server'] = '^0.15.1';
    }
    // 使用权限管理，添加 authority-filter
    if (useAuth) {
      dependencies['authority-filter'] = '^0.0.1';
    }
    // 使用日志，添加 badjs-report
    if (useLog) {
      dependencies['badjs-report'] = '^1.3.3';
    }
    const pkgJson = {
      name: projectName,
      dependencies,
      devDependencies,
    };
    // this.destinationPath 指定要写入 pkgJson 的目标 package.json
    this.fs.extendJSON(
      this.destinationPath(`${this.answers.projectName}/package.json`),
      pkgJson
    );
  }

  _foldersDelete() {
    const projectPath = `${this.destinationRoot()}/${this.answers.projectName}`;
    const { mockType, loginType, useAuth, useLog } = this.answers;
    shell.rm('-rf', `${projectPath}/templates`);
    if (mockType !== 'local') {
      shell.rm('-rf', `${projectPath}/mock`);
    }
    if (loginType !== 'self') {
      shell.rm('-rf', `${projectPath}/src/pages/login.vue`);
    }
    if (!useAuth) {
      shell.rm('-rf', `${projectPath}/src/model/authDict.js`);
      shell.rm('-rf', `${projectPath}/src/router/operation.js`);
      shell.rm('-Rf', `${projectPath}/src/pages/operation`);
    }
    if (!useLog) {
      shell.rm('-rf', `${projectPath}/src/mixin/badjs.js`);
      shell.rm('-rf', `${projectPath}/src/router/log.js`);
      shell.rm('-Rf', `${projectPath}/src/pages/log`);
    }
  }

  /* 生命周期函数 执行顺序，如下注释所示 */
  // No5
  async writing() {
    const isExists = fs.existsSync(
      `${this.destinationRoot()}/${this.answers.projectName}`
    );
    // 如果用户当前目录下，已存在同名项目
    if (isExists) {
      const answer = await this.prompt({
        type: 'confirm',
        name: 'isReCreate',
        message: '即将创建的项目名称已存在，是否要覆盖已有项目？',
      });
      if (answer.isReCreate) {
        shell.rm(
          '-rf',
          `${this.destinationRoot()}/${this.answers.projectName}`
        );
        this._fileCopy();
      } else {
        this.log('\n' + '结束创建。' + '\n');
        shell.exit(1);
      }
    } else {
      this._fileCopy();
    }
  }

  // No7
  async install() {
    const answer = await this.prompt([
      {
        type: 'confirm',
        name: 'isInstall',
        message: '项目已生成，是否现在安装依赖包？',
        default: true,
      },
    ]);
    if (answer.isInstall) {
      this.log('即将为您安装项目依赖包，请稍候几秒钟哦~😉'.yellow);
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
  }

  // No8
  end() {
    this._foldersDelete();
    this.log(
      '\n' + 'Congratulations! Project created successfully ~ '.green + '\n'
    );
  }
};
