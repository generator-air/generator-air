const config = {};

// 开发服务端口
config.devServerPort = 8090;

config.debug = 'http://127.0.0.1:8000';

config.mock = 'http://127.0.0.1:3001';

// 版本库外部引入文件路径
config.externals = [
  {
    path: '/vue/2.6.10/vue.js',
    packageName: 'vue',
    variableName: 'Vue',
  },
  {
    path: '/vuex/3.1.2/vuex.js',
    packageName: 'vuex',
    variableName: 'Vuex',
  },
  {
    path: '/vue-router/3.1.3/vue-router.js',
    packageName: 'vue-router',
    variableName: 'VueRouter',
  },
  {
    path: '/axios/0.19.0/axios.js',
    packageName: 'axios',
    variableName: 'axios',
  },
  {
    path: '/element-ui/2.12.0/index.js',
    packageName: 'element-ui',
    variableName: 'ELEMENT',
  },
  {
    path: '/element-ui/2.12.0/theme-chalk/index.css',
  },
  {
    path: '/lodash.js/4.17.15/lodash.js',
    packageName: 'lodash',
    variableName: '_',
  },
];

module.exports = config;
