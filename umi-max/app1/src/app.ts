// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    headerRender: false,
    footerRender: false,
    menuRender: false,
  };
};

// export const qiankun = {
//   async bootstrap() {
//     console.log('subapp bootstraped');
//   },
//   async mount(props: any) {
//     console.log('subapp mount', props);
//   },
//   async unmount() {
//     console.log('subapp unmount');
//   },
// };
