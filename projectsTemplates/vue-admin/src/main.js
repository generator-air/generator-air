import $vue from 'vue';

import $app from '@/App.vue';
import $store from './vuex';
import $router from './router';
import './mixin';
// 引入静态资源（svg + common less）
import './assets';
import 'normalize.css';

$vue.config.devtools = process.env.NODE_ENV === 'development';

new $vue({
  store: $store,
  router: $router,
  el: '#app',
  render: (h) => h($app),
});
