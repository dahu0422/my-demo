import "./index.less"

const message: string = "entry output spa"

console.log(message)

// 箭头函数
const arr: number[] = [1, 2, 3, 4, 5]

const result = arr.map((item: number) => item + 1)

console.log(result)

// ESlint
const foo = "foo"

let bar = "bar"

console.log(foo, bar)

// CSS Loader

const node = document.createElement("div")
node.className = "container"
document.body.appendChild(node)

const contentNode = document.createElement("div")
contentNode.className = "content"
contentNode.textContent = "Hello Webpack"
node.appendChild(contentNode)
