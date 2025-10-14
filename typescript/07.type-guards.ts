// # 类型守卫

// 类型守卫是 TypeScript 中一种类型收窄机制
// 它是一种表达式，在运行时检查类型，确保类型在某个作用域内符合特定的条件

// typeof 类型守卫
declare const strOrNumOrBool: string | number | boolean

if (typeof strOrNumOrBool === "string") {
  // 一定是字符串！
  strOrNumOrBool.charAt(1)
} else if (typeof strOrNumOrBool === "number") {
  // 一定是数字！
  strOrNumOrBool.toFixed()
} else if (typeof strOrNumOrBool === "boolean") {
  // 一定是布尔值！
  strOrNumOrBool === true
} else {
  // 要是走到这里就说明有问题！
  const _exhaustiveCheck: never = strOrNumOrBool
  throw new Error(`Unknown input type: ${_exhaustiveCheck}`)
}

// instanceof 类型守卫
class Dog {
  bark() {
    console.log("Woof!")
  }
}

class Cat {
  meow() {
    console.log("Meow!")
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark()
  } else {
    animal.meow()
  }
}

// in 操作符守卫
interface Circle {
  kind: "circle"
  radius: number
}

interface Square {
  kind: "square"
  sideLength: number
}

function getArea(shape: Circle | Square) {
  if ("radius" in shape) {
    // shape 被收窄为 Circle 类型
    return Math.PI * shape.radius ** 2
  } else {
    // shape 被收窄为 Square 类型
    return shape.sideLength ** 2
  }
}

// 自定义类型守卫

// 报错：类型 "string | number" 上不存在属性 “replace”
// isString 函数返回 boolean 类型，但 TS 无法根据普通布尔返回值来收窄类型
// function isString(input: unknown): boolean {
//   return typeof input === "string"
// }

// 使用类型谓词
function isString(input: unknown): input is string {
  return typeof input === "string"
}

function foo(input: string | number) {
  if (isString(input)) {
    input.replace("linbudu", "linbudu599")
  }
}

// 自定义类型守卫示例 2

interface Fish {
  swim(): void
}

interface Bird {
  fly(): void
}

function isBird(animal: Fish | Bird): animal is Bird {
  return (animal as Bird).fly !== undefined
}

function move(animal: Fish | Bird) {
  if (isBird(animal)) {
    animal.fly() // 被收窄为 Bird 类型
  } else {
    animal.swim() // 被收窄为 Fish 类型
  }
}

// 常用自定义守卫
export type Falsy = false | "" | 0 | null | undefined

const isFalsy = (val: unknown): val is Falsy => !val

export type Primitive = string | number | boolean | undefined

const isPrimitive = (val: unknown): val is Primitive =>
  ["string", "number", "boolean", "undefined"].includes(typeof val)
