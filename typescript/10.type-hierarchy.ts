// # TypeScript 类型层级示例

// ==================== Top Types (顶层类型) ====================

// 1. any 类型 - 关闭类型检查
let anyValue: any = "hello"
anyValue = 42 // ✅ 可以赋值任何类型
anyValue = true // ✅ 可以赋值任何类型

// any 可以赋值给任何类型（但不安全）
let str: string = anyValue // ✅ 编译通过，但不安全

// 2. unknown 类型 - 类型安全的顶层类型
let unknownValue: unknown = "hello"
unknownValue = 42 // ✅ 可以赋值任何类型

// ❌ 错误：不能直接使用 unknown 类型
// unknownValue.toUpperCase() // 编译错误

// ✅ 正确：需要先进行类型检查（类型守卫）
if (typeof unknownValue === "string") {
  unknownValue.toUpperCase() // ✅ 类型收窄为 string
}

// unknown 不能直接赋值给其他类型
// let str2: string = unknownValue // ❌ 错误
let str2: string = unknownValue as string // ✅ 需要类型断言

// ==================== Bottom Types (底层类型) ====================

// never 类型 - 表示永远不存在的值
function throwError(): never {
  throw new Error("发生错误")
}

// 不可能的类型交集
type Impossible = string & number // never

// never 可以赋值给任何类型
const neverValue: never = throwError()
let str3: string = neverValue // ✅
let num: number = neverValue // ✅

// ==================== 类型层级关系 ====================

/*
 * 类型层级从高到低：
 *
 * Top Types (顶层，最通用)
 *   ↓
 * 联合类型 (string | number)
 *   ↓
 * 原始类型 (string)
 *   ↓
 * 字面量类型 ("hello")
 *   ↓
 * Bottom Types (底层，最具体/不可能)
 *
 * 赋值规则：
 * - 子类型（低层级）可以赋值给父类型（高层级）✅
 * - 父类型（高层级）不能直接赋值给子类型（低层级）❌
 */

// 层级：Top Types -> 联合类型 -> 原始类型 -> 字面量类型 -> Bottom Types

// 1. 字面量类型 -> 原始类型
type LiteralStr = "hello"
type PrimitiveStr = string

const literal: LiteralStr = "hello"
const primitive: PrimitiveStr = literal // ✅ 字面量可以赋值给原始类型

// 2. 原始类型 -> 联合类型
const strValue: string = "hello"
const union: string | number = strValue // ✅ 原始类型可以赋值给联合类型

// 3. 联合类型 -> Top Types
const unionValue: string | number = "hello"
const anyVal: any = unionValue // ✅ 联合类型可以赋值给 any
const unknownVal: unknown = unionValue // ✅ 联合类型可以赋值给 unknown

// 4. any 可以赋值给任何类型（不安全）
const anyType: any = "hello"
const anyToStr: string = anyType // ✅ any 可以赋值给任何类型

// 5. unknown 不能直接赋值给其他类型
const unknownType: unknown = "hello"
// const unknownToStr: string = unknownType // ❌ 错误

// 6. never 可以赋值给任何类型
function getNever(): never {
  throw new Error()
}
const neverVal: never = getNever()
const neverToStr: string = neverVal // ✅ never 可以赋值给任何类型

// ==================== 对象类型层级 ====================

interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
}

const dog: Dog = { name: "Buddy", breed: "Lab" }
const animal: Animal = dog // ✅ 子类型可以赋值给父类型（协变）

// 父类型不能赋值给子类型
// const dog2: Dog = animal // ❌ 错误：缺少 breed 属性
