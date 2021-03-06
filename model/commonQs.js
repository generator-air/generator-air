const questions = [
  {
    type: 'list',
    name: 'type',
    message: '请选择期望创建的项目类型',
    choices: [
      {
        name: 'pc管理端',
        value: 'pc',
      },
      {
        name: 'h5移动端',
        value: 'h5',
      },
      {
        name: '小程序',
        value: 'miniprogram',
      },
      {
        name: 'NodeJS',
        value: 'node',
      },
      {
        name: '组件工具',
        value: 'component',
      },
    ],
  },
  {
    type: 'list',
    name: 'framework',
    message: '请选择期望使用的框架',
    choices: [
      {
        name: 'vue',
        value: 'vue',
      },
      {
        name: 'react',
        value: 'react',
      },
    ],
    when(answers) {
      return answers.type === 'pc' || answers.type === 'h5';
    },
  },
  {
    type: 'list',
    name: 'framework',
    message: '请选择期望使用的框架',
    choices: [
      {
        name: '不使用框架',
        value: 'none',
      },
      {
        name: 'taro',
        value: 'taro',
      },
    ],
    when(answers) {
      return answers.type === 'miniprogram';
    },
  },
  {
    type: 'list',
    name: 'framework',
    message: '请选择期望使用的框架',
    choices: [
      {
        name: 'koa',
        value: 'koa',
      },
      {
        name: 'express',
        value: 'express',
      },
    ],
    when(answers) {
      return answers.type === 'node';
    },
  },
  {
    type: 'list',
    name: 'framework',
    message: '请选择您的组件类型',
    choices: [
      {
        name: '原生js组件',
        value: 'js',
      },
      {
        name: 'vue组件',
        value: 'vue',
      },
      {
        name: 'react组件',
        value: 'react',
      },
    ],
    when(answers) {
      return answers.type === 'component';
    },
  },
];

module.exports = questions;
