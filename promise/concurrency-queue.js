/**
 * @desc 并发池：n 条异步请求，控制一次只发送 x 条 --- promise + queue 队列版
 */
class ConcurrentPool {
  constructor(maxConcurrency = 5) {
    this.concurrency = maxConcurrency // 最大并发数
    this.running = 0 // 当前并发数
    this.queue = [] // 等待队列，存放待执行的任务
  }

  /**
   /**
    * 添加任务到并发池中
    * @param {Function} task - 需要执行的任务函数，返回一个Promise
    * @returns {Promise} - 返回一个Promise，当任务完成时resolve
    */
  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push(() => {
        return Promise.resolve(task()).then(resolve, reject);
      });
      this.next();
    });
  }

  /**
   * 处理下一个任务
   * 1. 当当前运行的任务数小于最大并发数且队列中有任务时，执行任务
   * 2. 从队列中取出一个任务，并增加并发数
   * 3. 任务完成后减少并发数，递归处理下一个任务
   */
  next() {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      this.running++
      task().finally(() => {
        this.running--
        this.next()
      })
    }
  }
}


// ---------------- 使用示例 ----------------
const pool = new ConcurrentPool(3)

// 模拟异步请求
function createRequest(id) {
  return () => new Promise((resolve, reject) => {
    const delay = Math.random() * 2000;
    setTimeout(() => {
      if (id === 5) {
        reject(new Error('请求失败'));
      } else {
        console.log(`请求 ${id} 完成，耗时 ${delay.toFixed(0)}ms`);
        resolve(id);
      }
    }, delay);
  });
}


// 添加任务
for (let i = 0; i < 10; i++) {
  pool.add(createRequest(i))
}


