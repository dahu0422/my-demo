// 运行时配置
import { history, RunTimeLayoutConfig } from '@umijs/max';

const loginPath = '/login';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  currentUser?: Object;
}> {
  // 登录鉴权，跳转非登录页时查询用户信息
  const { location } = history;
  if (location.pathname !== loginPath) {
    console.log('location.pathname', location.pathname);
    // TODO:查询用户信息
    return { currentUser: {} };
  }
  return {};
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  console.log(initialState);
  return {
    title: 'Umi Max Demo',
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: true,
    },

    /**
     * 页面布局
     */
    layout: 'mix', // 混合布局
    headerTitleRender: () => {
      return <div>headerTitleRender</div>;
    },
    footerRender: () => <div>footer</div>,

    /**
     * 页面切换
     */
    onPageChange: () => {
      console.log('onPageChange', !initialState?.currentUser);
      const { location } = history;
      // 如果没有登录，重定向到 login
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
  };
};
