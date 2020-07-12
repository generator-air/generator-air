module.exports = ({
  authImport,
  notifyImport,
  loginPageImport,
  loginPageRoute,
  redirectHandler,
  routeHandler,
  menuHandler,
}) => `import $vue from 'vue';
import $vueRouter from 'vue-router';${authImport}
import $api from '../model/api';
import $request from '../mixin/request';
import $store from '../vuex/index';
import $menus from '../model/menu';
${notifyImport}

${loginPageImport}
const $home = () => import(/* webpackChunkName: "home" */ 'pages/home');
const $unAuth = () => import(/* webpackChunkName: "unAuth" */ 'pages/unAuth');
const $notFound = () => import(/* webpackChunkName: "notFound" */ 'pages/notFound');

// 批量引入 @/router 下的所有文件
const routerContext = require.context('@/router', false, /\\.js$/i);
// 存放所有路由
let routers = [];
const importAllRouters = requireContext => requireContext.keys().forEach(
  item => {
    if (item.indexOf('index.js') > -1) {
      return;
    }
    // 收集所有路由
    routers = routers.concat(requireContext(item).default);
  }
);
importAllRouters(routerContext);

// vue-router v3.1.x 版本，两次点击相同路由引起的报错问题处理
const originalPush = $vueRouter.prototype.push;
$vueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

$vue.use($vueRouter);

const router = new $vueRouter({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: $home
    },
    {
      path: '/unAuth',
      component: $unAuth
    },${loginPageRoute}
  ]
});

function getUserInfo() {
  // 拉取用户信息
  return $request.$get($api.getUserInfo).then(res => {
    if (res && res.data) {
      // 全局存储用户信息
      $store.commit('user/setUserInfo', res.data);
      return res.data;
    }
  }).catch(err => {
    if (err.unLogin || err.unAuth) {
      // 全局存储 errorDict 构造的用户信息
      $store.commit('user/setUserInfo', err);
      // 如果当前用户无权访问
      return err;
    }
  });
}

function setRouteAndMenu(user) {
  console.log('user:', user);${routeHandler}
  router.addRoutes([
    ...routers,
    {
      path: '*',
      component: $notFound
    }
  ]);
  ${menuHandler}
}
${redirectHandler}
// 导航守卫入口
router.beforeEach((to, from, next) => {
  const userInfo = $store.state.user.userInfo;
  // 如果已存在全局的用户信息
  if (userInfo) {
    redirect(userInfo, to, next);
  } else {
    getUserInfo().then(res => {
      redirect(res, to, next, setRouteAndMenu);
    })
  }
})

export default router;
`;
