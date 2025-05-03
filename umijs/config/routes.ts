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
  },
];
