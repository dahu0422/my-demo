export default [
  // 登录页
  {
    name: 'menu.login',
    locale: 'menu.login',
    path: '/login',
    component: './Login',
    layout: false,
    hideInMenu: true,
  },
  {
    name: '首页',
    locale: 'menu.home',
    path: '/home',
    component: './Home',
  },
  {
    name: '权限演示',
    locale: 'menu.access',
    path: '/access',
    component: './Access',
    access: 'access',
  },
  {
    name: '国际化演示',
    locale: 'menu.internationalization',
    path: '/internationalization',
    component: './Internationalization',
    access: 'internationalization',
  },
  {
    // 带上 * 通配符意味着将 /app1/project 下所有子路由都关联给微应用 app1
    name: '子应用app1',
    locale: 'menu.app1',
    path: '/app1/project/*',
    microApp: 'app1',
  },
];
