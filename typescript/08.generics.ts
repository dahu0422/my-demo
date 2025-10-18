// # 泛型
// 泛型：将类型作为一种参数，在使用时动态地指定。
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
// 下面是一个接口封装的例子
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

// ## 多泛型关联
// 多泛型关联指在定义泛型时，使用多个类型参数并且这些类型参数之间存在某种约束关系或依赖关系。
// 一个类型参数的值会影响另一个类型参数的可能取值

type Conditional<Type, Condition, TruthyResult, FalsyResult> =
  Type extends Condition ? TruthyResult : FalsyResult
