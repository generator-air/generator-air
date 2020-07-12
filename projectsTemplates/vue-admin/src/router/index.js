import $vue from 'vue';
import $vueRouter from 'vue-router';
import $Auth from 'authority-filter';
import $authDic from '../model/authDict';
import $api from '../model/api';
import $request from '../mixin/request';
import $store from '../vuex/index';
import $menus from '../model/menu';
import $notify from '../util/notify';

const $home = () => import(/* webpackChunkName: "home" */ 'pages/home');
const $unAuth = () => import(/* webpackChunkName: "unAuth" */ 'pages/unAuth');
const $notFound = () =>
  import(/* webpackChunkName: "notFound" */ 'pages/notFound');

// 批量引入 @/router 下的所有文件
const routerContext = require.context('@/router', false, /\.js$/i);
// 存放所有路由
let routers = [];
const importAllRouters = (requireContext) =>
  requireContext.keys().forEach((item) => {
    if (item.indexOf('index.js') > -1) {
      return;
    }
    // 收集所有路由
    routers = routers.concat(requireContext(item).default);
  });
importAllRouters(routerContext);

// vue-router v3.1.x 版本，两次点击相同路由引起的报错问题处理
const originalPush = $vueRouter.prototype.push;
$vueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

$vue.use($vueRouter);

const router = new $vueRouter({
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: $home,
    },
    {
      path: '/unAuth',
      component: $unAuth,
    },
  ],
});

function getUserInfo() {
  // 拉取用户信息
  return $request
    .$get($api.getUserInfo)
    .then((res) => {
      if (res && res.data) {
        // 全局存储用户信息
        $store.commit('user/setUserInfo', res.data);
        return res.data;
      }
    })
    .catch((err) => {
      if (err.unLogin || err.unAuth) {
        // 全局存储 errorDict 构造的用户信息
        $store.commit('user/setUserInfo', err);
        // 如果当前用户无权访问
        return err;
      }
    });
}

function setRouteAndMenu(user) {
  console.log('user:', user);
  // 将权限字典 + roleId传入权限组件（{ dev: true }开发使用。跳过权限过滤，开启所有权限。正式环境删除即可）
  const auth = new $Auth($authDic, user.roleId, { dev: true });
  // 全局存储 auth 对象
  $store.commit('user/setAuth', auth);
  // 获取经过权限过滤后的路由
  routers = auth.getRouterList(routers);

  router.addRoutes([
    ...routers,
    {
      path: '*',
      component: $notFound,
    },
  ]);
  // 获取经过权限过滤后的菜单
  const menuList = auth.getMenuList($menus);
  // 权限过滤后的菜单保存至vuex
  $store.commit('menu/setMenu', menuList);
}

function doLogin() {
  $notify.error('身份验证失败，请重新登录');
  setTimeout(() => {
    // 【自定义】跳转到第三方登录，地址由开发者与后端确认
    location.href =
      'https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=APPID&agentid=AGENTID&redirect_uri=REDIRECT_URI';
  }, 2000);
}

// 导航守卫重定向逻辑
function redirect(userInfo, to, next, setRouteAndMenu) {
  if (userInfo && userInfo.unLogin) {
    // 未登录/登录过期
    doLogin();
  } else if (userInfo && userInfo.unAuth) {
    // 已登录，无权访问系统
    if (to.path === '/unAuth') {
      next();
    } else {
      next('/unAuth');
    }
  } else if (userInfo) {
    // 已登录，有权访问系统
    if (to.path === '/unAuth') {
      next('/');
    } else {
      next();
    }
    // 【注意顺序】要在导航守卫逻辑后，添加 addRoutes 逻辑。否则 addRoutes 的路由，无法正常加载
    setRouteAndMenu && setRouteAndMenu(userInfo);
  } else {
    next();
  }
}

// 导航守卫入口
router.beforeEach((to, from, next) => {
  const userInfo = $store.state.user.userInfo;
  // 如果已存在全局的用户信息
  if (userInfo) {
    redirect(userInfo, to, next);
  } else {
    getUserInfo().then((res) => {
      redirect(res, to, next, setRouteAndMenu);
    });
  }
});

export default router;
