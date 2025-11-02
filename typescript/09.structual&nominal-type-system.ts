// # 结构化类型系统

// 如果两个类型具有相同的结构（属性和方法），即使名称不同，它们也被视为兼容。

// ## 示例1
// class Cat {
//   eat() {}
// }

// class Dog {
//   eat() {}
// }

// function feedCat(cat: Cat) {}
// feedCat(new Dog())

// ## 示例2
// class Cat {
//   eat() {}
//   meow() {}
// }

// class Dog {
//   eat() {}
// }

// function feedCat(cat: Cat) {}
// 报错：Dog 类型不具备 Cat 类型中的 meow 方法，不认为是相同类型
// feedCat(new Dog())

// ## 示例 3
// class Cat {
//   eat() {}
// }

// class Dog {
//   eat() {}
//   bark() {}
// }

// function feedCat(cat: Cat) {}
// feedCat(new Dog())

// 结构化类型系统认为 Dog 类型完全实现了 cat 类型

// # 标称类型系统：两个可兼容的类型其名称是完全一致

// type USD = number
// type CNY = number

// const CNYCount: CNY = 200
// const USDCount: USD = 200

// function addCNY(source: CNY, input: CNY) {
//   return source + input
// }

// addCNY(CNYCount, USDCount)

// 在结构化类型系统中，USD 和 CNY 被认为是完全一致的类型，在执行 addCNY 时含义却完全不一样。

// ## 在 TypeScript 中模拟标称类型系统

// 通过交叉类型的方式实现信息的附加

// export declare class TagProtector<T extends string> {
//   protected __tag__: T
// }

// declare class 声明类型不提供实现
// T extends string 泛型参数必须是字符串字面量类型
// protected __tag__:T 创建一个受保护的标记属性，类型为泛型 T

// export type Nominal<T, U extends string> = T & TagProtector<U>

// 交叉类型：将原始类型 T 与标记保护类 TagProtector<U> 合并

// export type CNY = Nominal<number, "CNY">
// export type USD = Nominal<number, "USD">

// const CNYCount = 100 as CNY
// const USDCount = 100 as USD

// function addCNY(source: CNY, input: CNY) {
//   return (source + input) as CNY
// }

// addCNY(CNYCount, CNYCount)
// addCNY(USDCount, USDCount) 报错

// 这种方式是在类型层面做了数据的处理，在运行时无法进行进一步的限制。
// 还可以从逻辑层面入手，进一步确保安全性

// class CNY {
//   private __tag!: void
//   constructor(public value: number) {}
// }
// class USD {
//   private __tag!: void
//   constructor(public value: number) {}
// }

// const CNYCount = new CNY(100)
// const USDCount = new USD(100)

// function addCNY(source: CNY, input: CNY) {
//   return source.value + input.value
// }

// addCNY(CNYCount, CNYCount)
// 报错了！
// addCNY(CNYCount, USDCount)

// 虽然两个类型结构完全相同，但 private / protected 的额外属性实现了类型附加。
// TypeScript 认为来自不同声明的 private 成员是不兼容的，这是一种安全特性，防止意外的类型混淆。
// 从而使得结构化类型系统将结构一致的两个类型也被视为不兼容的。
