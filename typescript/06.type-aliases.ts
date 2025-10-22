// # 类型别名
// type 是 TypeScript 中用于创建类型别名的关键字，它允许为现有的类型创建一个新的名称。
// 类型别名不会创建新的类型，只是给现有类型起一个更易读的名字。

// 基本类型别名
type A = string

// 联合类型
type StatusCode = 200 | 301 | 400 | 500 | 502
type PossibleDataTypes = string | number | (() => unknown)

// 函数类型
type Handler = (e: Event) => void
const clickHandler: Handler = (e) => {}

// 对象类型
type ObjType = {
  name: string
  age: number
}

// 泛型类型别名
type Factory<T> = T | number | string
type FactoryWIthBool = Factory<boolean>
type MaybeNull<T> = T | null

// 交叉类型：需要同时满足 A 与 B 两个类型，符号为 `&`
interface NameStruct {
  name: string
}

interface AgeStruct {
  age: number
}

type ProfileStruct = NameStruct & AgeStruct

const profile: ProfileStruct = {
  name: "linbudu",
  age: 18,
}

// 对于原始类型，是根本不存在的类型，所以是 never
type StrAndNum = string & number // never

// 对于对象类型的交叉属性，内部的同名属性同样会按照交叉类型进行合并
type Struct1 = {
  primitiveProp: string
  objectProp: {
    name: string
  }
}

type Struct2 = {
  primitiveProp: number
  objectProp: {
    age: number
  }
}

type Composed = Struct1 & Struct2

type PrimitivePropType = Composed["primitiveProp"] // never
type ObjectPropType = Composed["objectProp"] // { name: string; age: number; }

// ## 索引类型
// ### 索引签名类型

type AllStringTypes = {
  [key: string]: string
}
type PropType1 = AllStringTypes["linbudu"] // string
type PropType2 = AllStringTypes["599"] // string

// 索引签名可以和具体键值对类型声明并存，键值类型需要符合索引签名类型的声明：

type StringOrBooleanTypes = {
  propA: number
  porpB: boolean
  [key: string]: number | boolean
}

// ### 索引类型访问
// 使用 string 类型来访问 NumberRecord
interface NumberRecord {
  [key: string]: number
}
type PropType = NumberRecord[string] // number

// 通过键的字面量类型访问这个键对应的键值类型
interface Foo {
  propA: number
  propB: boolean
  propC: string
}

type PropAType = Foo["propA"] // number
type PropBType = Foo["propB"] // boolean

// 使用 keyof 操作符获得对象所有的键的字面量类型
type PropTypeUnion = Foo[keyof Foo] // string | number | boolean
