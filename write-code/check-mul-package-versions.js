// 请实现一个方法，可以扫描出给定的packageTree中存在的多版本包名称并打印提醒：
// 有2个包存在多版本：c[1.0.1, 1.0.2], d[1.0.2, 1.0.3]

var packageTree = {
  name: 'a',
  version: '1.0.0',
  node_modules: [
    {
      name: 'b',
      version: '1.0.1',
      children: [
        {
          name: 'c',
          version: '1.0.1',
        },
        {
          name: 'd',
          version: '1.0.2',
        }
      ]
    },
    {
      name: 'c',
      version: '1.0.2',
      children: [
        {
          name: 'd',
          version: '1.0.2',
        },
      ]
    },
    {
      name: 'e',
      version: '1.0.2',
      children: [
        {
          name: 'd',
          version: '1.0.3',
        },
      ]
    }
  ]
};

function checkMulPackageVersions(packageTree) {
  const versionMap = new Map();

  // 递归便利包树，手机所有包及其版本
  function traverse(node) {
    if (!node) return;

    const { name, version, node_modules, children } = node
    const dependencies = node_modules || children || [];

    if (!versionMap.has(name)) {
      versionMap.set(name, new Set())
    }

    versionMap.get(name).add(version);

    dependencies.forEach(child => traverse(child));
  }

  traverse(packageTree);

  // 遍历versionMap，找出存在多版本包
  for (const [name, versions] of versionMap.entries()) {
    if (versions.size > 1) {
      console.log(`${name}存在多版本：${Array.from(versions).join(', ')}`);
    }
  }
}

checkMulPackageVersions(packageTree);

// 2025.05.28 橙狮体育