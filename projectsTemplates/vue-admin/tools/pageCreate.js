const $inquirer = require('inquirer');
const $fse = require('fs-extra');
const $chalk = require('chalk');
const $defaultTemplate = require('../src/model/pageTemplates/default');
const $listTemplate = require('../src/model/pageTemplates/list');
const $editTemplate = require('../src/model/pageTemplates/edit');
const $detailTemplate = require('../src/model/pageTemplates/detail');

const questions = [
  {
    type: 'input',
    name: 'root',
    message: '请输入页面默认存放的根路径',
    default: 'src/pages',
  },
  {
    type: 'input',
    name: 'path',
    message: '请输入页面路径（相对于根路径）',
  },
  {
    type: 'list',
    name: 'type',
    message: '请选择期望创建的页面类型',
    choices: [
      {
        name: '列表页',
        value: 'list',
      },
      {
        name: '编辑（新建）页',
        value: 'edit',
      },
      {
        name: '详情页',
        value: 'detail',
      },
      {
        name: '其他',
        value: 'default',
      },
    ],
  },
];

function getTemplate(pageType) {
  // 匹配用户选择的页面模板
  switch (pageType) {
    case 'list':
      return $listTemplate;
    case 'edit':
      return $editTemplate;
    case 'detail':
      return $detailTemplate;
    default:
      return $defaultTemplate;
  }
}

$inquirer.prompt(questions).then((answers) => {
  if (answers.path.charAt(0) !== '/') {
    answers.path = '/' + answers.path;
  }
  const url = answers.root + answers.path;
  $inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `即将创建页面: ${$chalk.yellow(
          url
        )}，页面类型：${$chalk.yellow(answers.type)}，确认生成？`,
        default: true,
      },
    ])
    .then((answer) => {
      if (answer.confirm) {
        $fse.readFile(url, 'binary', function (err, data) {
          if (data) {
            return;
          }
          const start = answers.path && answers.path.lastIndexOf('/');
          const index = answers.path && answers.path.lastIndexOf('.');
          const end = (index > -1 && index) || answers.path.length;
          const pageName = answers.path.substring(start + 1, end);
          const template = getTemplate(answers.type).replace(
            /\$pageName\$/g,
            pageName
          );
          $fse.outputFile(url, template, function (err) {
            if (err) {
              return;
            }
          });
        });
      }
    });
});
