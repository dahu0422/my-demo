// # 类型
type A = string

// 声明一组联合类型：
type StatusCode = 200 | 301 | 400 | 500 | 502
type PossibleDataTypes = string | number | (() => unknown)

const status: StatusCode = 502

// 抽离一个函数类型
type Handler = (e: Event) => void

const clickHandler: Handler = (e) => {}
const moveHandler: Handler = (e) => {}
const dragHandler: Handler = (e) => {}

// 声明一个对象类型
type ObjType = {
  name: string
  age: number
}

// 类型别名还能作为工具类型，工具类型同样基于类型别名，只是多了泛型
type Factory<T> = T | number | string
type FactoryWIthBool = Factory<boolean>
const foo: FactoryWIthBool = true

// 声明一个简单、有实际意义的工具类型
type MaybeNull<T> = T | null
function process(input: MaybeNull<{ handler: () => {} }>) {
  input?.handler()
}

// ## 交叉类型
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
