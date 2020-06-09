const Generator = require("yeoman-generator");
const shell = require("shelljs");
const fs = require("fs");
//可以在terminal打印自定义样式的字
require("colors");

// 所有操作，均在用户执行 yo air 的目录下
module.exports = class extends Generator {
  // 必需的 constructor
  constructor(args, opts) {
    // 必需的 super
    super(args, opts);
    const { seedName, answers, sourceRoot, destinationRoot } = args[0];
    this.seedName = seedName;
    this.answers = answers;
    // 指定脚手架模板目录
    this.sourceRoot(sourceRoot);
    // 指定脚手架生成目标文件夹目录（这个地址要从 app/index.js 传过来。不能在当前文件中获取，因为这里获取不到用户执行目录）
    this.destinationRoot(destinationRoot);
  }

  /* 私有函数 */
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
    const templatePath = `${this.sourceRoot()}/${
      this.seedName
    }/templates`;
    const {
      mockServerTask,
      notifyImport,
      thirdToLoginHandler,
      localToLoginHandler,
      loginPageImport,
      thirdLoginHandler,
      selfLoginHandler
    } = require(`${templatePath}/const/code.js`);
    const {
      LOCAL_MOCK_HOST,
      ONLINE_MOCK_HOST,
      MOCK_SERVER_NAME
    } = require(`${templatePath}/const/constants.js`);

    /* config.js + gulpfile.js 生成 */
    const configFileTemplates = fs.readdirSync(
      this.templatePath(`${this.seedName}/templates/configTemplates`)
    );
    configFileTemplates.forEach((fileName) => {
      const generateFile = require(`${templatePath}/configTemplates/${fileName}`);
      const localMock = this.answers.mockType === 'local';
      const mockConfig = {
        mockHost: localMock ? LOCAL_MOCK_HOST : ONLINE_MOCK_HOST,
        mockServerName: localMock ? `\n  '${MOCK_SERVER_NAME}',` : '',
        mockServerTask: localMock ? mockServerTask : ''
      };
      console.log('mockConfig:', mockConfig);
      const file = generateFile(mockConfig);
      const filePath = this.templatePath(`${this.seedName}/${fileName}`);
      fs.writeFileSync(filePath, file);
    });

    /* errorDict、router/index.js、login.vue 生成 */
    const fileTemplates = fs.readdirSync(
      this.templatePath(`${this.seedName}/templates/fileTemplates`)
    );
    fileTemplates.forEach((fileName) => {
      const generateFile = require(`${templatePath}/fileTemplates/${fileName}`);
      const selfLogin = this.answers.loginType === 'self';
      const fileConfig = {
        notifyImport: selfLogin ? '' : notifyImport,
        toLoginHandler: selfLogin ? localToLoginHandler : thirdToLoginHandler,
        loginPageImport: selfLogin ? loginPageImport : '',
        loginHandler: selfLogin ? selfLoginHandler : thirdLoginHandler
      };
      console.log('fileConfig:', fileConfig);
      const file = generateFile(fileConfig);
      let filePath = '';
      switch (fileName) {
        case 'errorDict.js':
          filePath = this.templatePath(`${this.seedName}/src/model/errorDict.js`);
          break;
        case 'routerIndex.js':
          filePath = this.templatePath(`${this.seedName}/src/router/index.js`);
          break;
        default:
          break;
      }
      fs.writeFileSync(filePath, file);
    });
  }

  // mock相关配置文件 + .开头的文件复制（模板脚手架中，对.开头文件进行特殊处理，以_开头，以确保可以成功复制）
  _configFileCopy() {
    const files = fs.readdirSync(
      this.templatePath(`${this.seedName}/templates/configFiles`)
    );
    // 将configs下以_开头的配置文件逐个格式化成以.开头
    files.forEach((file) => {
      const formatFile = file.replace("_", ".");
      this.fs.copyTpl(
        this.templatePath(`${this.seedName}/templates/configFiles/${file}`),
        this.destinationPath(`${this.answers.projectName}/${formatFile}`)
      );
    });
  }

  // package.json 生成
  _packageJsonCopy() {
    // 动态写入 package.json
    const name = this.answers.projectName;
    const devDependencies = {};
    if (this.answers.mockType === "local") {
      devDependencies["json-server"] = "^0.15.1";
    }
    const pkgJson = {
      name,
      devDependencies,
      "lint-staged": {
        "*.js": ["vue-cli-service lint", "git add"],
        "*.vue": ["vue-cli-service lint", "git add"],
      },
      "pre-commit": "lint",
    };
    // this.destinationPath 指定要写入 pkgJson 的目标 package.json
    this.fs.extendJSON(
      this.destinationPath(`${this.answers.projectName}/package.json`),
      pkgJson
    );
  }

  _foldersDelete() {
    const projectPath = `${this.destinationRoot()}/${this.answers.projectName}`;
    const { mockType, loginType } = this.answers;
    shell.rm('-rf', `${projectPath}/templates`);
    if (mockType !== 'local') {
      shell.rm('-rf',`${projectPath}/mock`);
    }
    if (loginType !== 'self') {
       shell.rm('-rf',`${projectPath}/src/pages/login.vue`);
    }
  }

  /* 生命周期函数 执行顺序，如下注释所示 */
  // No5
  writing() {
    this.log("generator writing:", 5);
    const done = this.async();
    fs.exists(
      `${this.destinationRoot()}/${this.answers.projectName}`,
      async (exists) => {
        // 如果用户当前目录下，已存在同名项目
        if (exists) {
          const answer = await this.prompt({
            type: "confirm",
            name: "isReCreate",
            message: "即将创建的项目已存在，是否要覆盖已有项目？",
          });
          if (answer.isReCreate) {
            shell.rm(
              "-rf",
              `${this.destinationRoot()}/${this.answers.projectName}`
            );
            this._fileCopy();
          } else {
            this.log("\n" + "结束创建。" + "\n");
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
    this.log("generator install:", 7);
    // 进入刚刚创建的脚手架目录
    shell.cd(`${this.destinationRoot()}/${this.answers.projectName}`);
    // 检查是否安装了yarn
    if (shell.which("yarn")) {
      // 执行npm包安装
      this.yarnInstall();
    } else if (shell.which("npm")) {
      this.npmInstall();
    }
  }

  // No8
  end() {
    this.log("generator end:", 8);
    this._foldersDelete();
    this.log(
      "\n" + "Congratulations! Project created successfully ~".green + "\n"
    );
  }
};
