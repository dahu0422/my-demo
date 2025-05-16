// 运行时配置
import { RunTimeLayoutConfig } from '@umijs/max';

const loginPath = '/login';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  currentUser?: Object;
  isAdmin?: boolean;
}> {
  return {
    currentUser: {
      permissions: ['access', 'internationalization'],
      isAdmin: true,
    },
  };
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
      // 如果没有登录，重定向到 login
      // const { location } = history;
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
  };
};
