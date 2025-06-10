/**
数组转换为树结构
输入：
[
  {id: '0', name: '中国'},
  {id: 1, pid: 0, name: '广州'},
  {id: 2, pid: 0, name: '深圳'},
  {id: 3, pid: 1, name: '天河区'},
]
输出：
[
  {
    id: '0',
    name: '中国',
    children: [
      {
        id: 1,
        pid: 0,
        name: '广州',
        children: [
          {id: 3, pid: 1, name: '天河区'}
        ]
      },
      {
        id: 2,
        pid: 0,
        name: '深圳'
      }
    ]
  }
]
*/

const data = [
  { id: 0, name: '中国' },
  { id: 1, pid: 0, name: '广州' },
  { id: 2, pid: 0, name: '深圳' },
  { id: 3, pid: 1, name: '天河区' },
]

// 使用 Map 映射，单次遍历构建树
// 时间复杂度O(n) 推荐 ❗❗❗
function arrayToTree(data) {
  const idMap = new Map();
  const tree = {};

  data.forEach(item => {
    idMap.set(item.id, { ...item, children: [] });
  });

  data.forEach(item => {
    const node = idMap.get(item.id);
    if (item.pid != null) {
      const parent = idMap.get(item.pid);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      tree = node;
    }
  });

  return tree;
}

// 使用递归，多次遍历构建树
// 时间复杂度O(n^2)
// function arrayToTree(data, pid = undefined) { 
//   return data.filter(item => item.pid === pid).map(item => { 
//     const children = arrayToTree(data, item.id)
//     return { ...item, children }
//   })
// }

const result = arrayToTree(data);
console.log(result)

