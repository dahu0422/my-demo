// 这是一个未优化的示例代码
function calculateTotal(price, quantity) {
  const taxRate = 0.1; // 10% 税率
  const subtotal = price * quantity;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  console.log('计算过程:', { price, quantity, subtotal, tax, total });

  return total;
}

// 未使用的函数
function unusedFunction() {
  console.log('这个函数不会被调用');
}

// 开发调试用的变量
const DEBUG = true;
if (DEBUG) {
  console.log('调试模式开启');
}

// 实际使用的代码
const result = calculateTotal(19.99, 3);
document.getElementById('app').innerHTML = `总金额: $${result.toFixed(2)}`;