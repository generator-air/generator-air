const Generator = require('yeoman-generator');
// const shell = require('shelljs');
// const fs = require('fs');
//可以在terminal打印自定义样式的字
require('colors');

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
};
