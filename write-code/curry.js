// 支持多参数、支持多次调用，如 curry(fn)(1)(2)(3) 或 curry(fn)(1,2)(3)

function curry(fn) {
  // 返回一个新的函数 curried，可以接受任意数量的参数
  return function curried(...args) {
    // 如果任意数量的参数 >= 原函数的参数个数
    if (args.length >= fn.length) {
      // 直接用所有参数调用原函数，返回结果
      return fn.apply(this, args)
    } else {
      // 否则返回一个新函数，继续收集参数
      return function (...nextArgs) {
        // 将当前收集的参数和新的参数合并，递归调用 curried
        return curried.apply(this, args.concat(nextArgs))
      }
    }
  }
}

// 测试
function add(a, b, c) {
  return a + b + c
}

debugger
const curried = curry(add)

console.log(curried(1)(2)(3)) // 6
// console.log(curried(1, 2)(3)) // 6
// console.log(curried(1, 2, 3)) // 6
