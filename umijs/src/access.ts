// 在这里按照初始化数据定义项目中的权限，统一管理
// 参考文档 https://umijs.org/docs/max/access

export default (initialState: {
  currentUser: { permissions: string[]; isAdmin: boolean };
}) => {
  const currentUser = initialState?.currentUser || {};
  // menu permissions map
  const permissionsMap = currentUser.permissions.reduce(
    (acc: any, curr: string) => {
      acc[curr] = true;
      return acc;
    },
    {},
  );
  console.log('currentUser', currentUser);

  return {
    isAdmin: currentUser?.isAdmin,
    ...permissionsMap,
  };
};
