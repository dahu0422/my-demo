// # 泛型
// 泛型在定义函数、类或接口时使用类型参数，这些参数在调用时才被具体确定。
// 泛型的核心思想是类型参数化
type Factory<T> = T | number | string

type Stringify<T> = {
  [K in keyof T]: string
}

type IsEqual<T> = T extends true ? 1 : 2
type A = IsEqual<true> // 1
type B = IsEqual<false> // 2
type C = IsEqual<"libudu"> // 2

// ## 泛型约束
// 泛型约束就是给泛性参数添加限制条件，要求传入的类型必须满足特定的条件或拥有某些属性。
// 下面是一个接口封装的例子：

type SuccessCode = 10000 | 10001 | 10002
type ErrorCode = 20000 | 20001 | 20001

type ResStatus<ResCode extends number> = ResCode extends SuccessCode
  ? "success"
  : "failure"

// <ResCode extends number> ：定义了一个泛型参数
// Rescode extends SuccessCode ? 'success' : 'failure'：条件类型判断

//定义通用的 API 响应接口
interface ApiResponse<Code extends number> {
  code: Code
  message: string
  data: any
  status: ResStatus<Code>
}

const successResponse: ApiResponse<10000> = {
  code: 10000,
  message: "操作成功",
  data: {
    /* ... */
  },
  status: "success",
}

const errorResponse: ApiResponse<20000> = {
  code: 20000,
  message: "用户不存在",
  data: null,
  status: "failure",
}

// ## 在对象类型中使用泛型

interface IRes<TData = unknown> {
  code: number
  error?: string
  data: TData
}

// IRes 描述了一个通用的响应类型结构，预留了实际相应数据的泛型坑位
// 在请求函数中传入特定的响应类型

interface IUserProfileRes {
  name: string
  homepage: string
  avatar: string
}

function fetchUserProfile(): Promise<IRes<IUserProfileRes>> {
  return new Promise(() => {})
}

// 分页相应结构

interface IPaginationRes<TItem = unknown> {
  data: TItem
  page: number
  totalCount: number
  hasNextPage: boolean
}

function fetchUserProfileList(): Promise<
  IRes<IPaginationRes<IUserProfileRes>>
> {
  return new Promise(() => {})
}

// ## 在函数中使用泛型

// function handle<T>(input: T): T {
//   return input
// }

// const author = "linbudu"
// handle(author) // 填充为字面量类型 linbudu

// let authorAge = 19
// handle(authorAge) // 填充为基础类型 number

// // 示例 2
// function swap<T, U>([start, end]: [T, U]): [U, T] {
//   return [end, start]
// }
// const swapped1 = swap(["linbudu", 599])
// const swapped2 = swap([null, 599])
// const swapped3 = swap([{ name: "linbudu" }, {}])

function handle<T extends string | number>(input: T): T {
  return input
}

function swap<T extends number, U extends number>([start, end]: [T, U]): [
  U,
  T
] {
  return [end, start]
}
