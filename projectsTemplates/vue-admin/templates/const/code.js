const mockServerTask = `// json-server 启动
$gulp.task('json-server', done => {
  $execa('node', [
    './mock/mock-server.js'
  ], {
    stdio: 'inherit'
  });
  done();
});`;

const authImport = `
import $Auth from 'authority-filter';
import $authDic from '../model/authDict';`;

const notifyImport = "import $notify from '../util/notify';";

const loginPageImport = `const $login = () => import(/* webpackChunkName: "login" */ 'pages/login.vue');`;

const authDicImport = "import $authDic from '../model/authDict';";

const allMenusImport = "import $allMenus from '../model/menu';";

const loginPageRoute = `
    {
      path: '/login',
      component: $login
    },`;

const thirdLoginRedirectHandler = `
function doLogin() {
  $notify.error('身份验证失败，请重新登录');
  setTimeout(() => {
    // 【自定义】跳转到第三方登录，地址由开发者与后端确认
    location.href = 'https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=APPID&agentid=AGENTID&redirect_uri=REDIRECT_URI';
  }, 2000);
}

// 导航守卫重定向逻辑
function redirect(userInfo, to, next, setRouteAndMenu) {
  if (userInfo && userInfo.unLogin) { // 未登录/登录过期
    doLogin()
  } else if (userInfo && userInfo.unAuth) { // 已登录，无权访问系统
    if (to.path === '/unAuth') {
      next();
    } else {
      next('/unAuth');
    }
  } else if (userInfo) { // 已登录，有权访问系统
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
`;

const selfLoginRedirectHandler = `
function redirect(userInfo, to, next, setRouteAndMenu) {
  if (userInfo && userInfo.unLogin) { // 当前未登录
    // 正常进入登录页
    if (to.path === '/login') {
      next();
    } else {
      next('/login');
    }
  } else if (userInfo && userInfo.unAuth) { // 已登录，无权访问系统
    // 正常进入无权访问页
    if (to.path === '/unAuth' || to.path === '/login') {
      next();
    } else {
      next('/unAuth');
    }
  } else if (userInfo) { // 已登录，有权访问系统
    // 用户手动访问登录页 / 无权访问页，重定向到首页
    if (to.path === '/login' || to.path === '/unAuth') {
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
`;

const routeHandler = `
  // 将权限字典 + roleId传入权限组件（{ dev: true }开发使用。跳过权限过滤，开启所有权限。正式环境删除即可）
  const auth = new $Auth($authDic, user.roleId, { dev: true });
  // 全局存储 auth 对象
  $store.commit('user/setAuth', auth);
  // 获取经过权限过滤后的路由
  routers = auth.getRouterList(routers);
`;

const authMenuHandler = `// 获取经过权限过滤后的菜单
  const menuList = auth.getMenuList($menus);
  // 权限过滤后的菜单保存至vuex
  $store.commit('menu/setMenu', menuList);`;

const menuHandler = "$store.commit('menu/setMenu', $menus);";

const logMenu = `
  {
    title: '日志示例',
    icon: 'clock',
    submenu: [
      {
        title: '日志管理',
        icon: 'clock',
        submenu: [
          {
            title: '日志页',
            url: '/log'
          }
        ]
      }
    ]
  },`;

const operationMenu = `
  {
    title: '操作过滤',
    icon: 'clock',
    url: '/operation'
  },`;

module.exports = {
  mockServerTask,
  notifyImport,
  authImport,
  loginPageImport,
  authDicImport,
  allMenusImport,
  loginPageRoute,
  thirdLoginRedirectHandler,
  selfLoginRedirectHandler,
  routeHandler,
  menuHandler,
  authMenuHandler,
  logMenu,
  operationMenu,
};
