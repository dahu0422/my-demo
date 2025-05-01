// 运行时配置
import { RunTimeLayoutConfig } from '@umijs/max';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout: RunTimeLayoutConfig = (initialState) => {
  console.log(initialState);
  return {
    title: 'Umi Max Demo',
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    layout: 'mix',
    headerTitleRender: () => {
      return <div>headerTitleRender</div>;
    },
    menuHeaderRender: false,

    footerRender: () => <div>footer</div>,
  };
};
