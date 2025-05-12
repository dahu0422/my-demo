/**
 * @desc 并发池：n 条异步请求，控制一次只发送 x 条 --- async / await 版本
 * @params tasks - 任务数组，每个任务是一个返回 Promise 的函数
 * @params maxConcurrency - 最大并发数，默认为 5
 */
async function runWithConcurrency(tasks, maxConcurrency = 5) {
  const results = []; // 存储所有任务的结果
  const executing = new Set(); // 存储当前正在执行的任务

  for (const task of tasks) {
    // 如果已达到并发限制，等待其中一个任务完成
    if (executing.size >= maxConcurrency) {
      await Promise.race(executing); // 等待最快完成的任务
    }

    const p = task()
      .then(result => {
        executing.delete(p); // 任务完成后，从执行集合中删除
        return { status: 'fulfilled', value: result };
      })
      .catch(error => {
        executing.delete(p); // 任务失败后，从执行集合中删除
        return { status: 'rejected', reason: error };
      });

    executing.add(p); // 将任务添加到执行集合中
    results.push(p); // 将任务结果添加到结果数组中
  }

  return Promise.all(results); // 等待所有任务完成并返回结果
}

// 使用示例
const tasks = Array(10).fill(null).map((_, i) =>
  () => new Promise((resolve, reject) => {
    const delay = Math.random() * 2000;
    setTimeout(() => {
      if (i === 5) {
        reject(new Error('请求失败'));
      } else {
        console.log(`请求 ${i + 1} 完成`);
        resolve(i + 1);
      }
    }, delay);
  })
);

runWithConcurrency(tasks, 3).then(results => {
  console.log('所有请求完成:', results);
});