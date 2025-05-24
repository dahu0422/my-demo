// 组件注册
import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"

/**
 * 渲染函数
 * @param container 容器元素
 * @param initStore 初始化状态
 * @param options 配置选项
 */

const render = (
  container: string | HTMLElement,
  initStore: any,
  options: any
) => {
  // 根据 container 类型，获取容器元素
  const root =
    typeof container === "string"
      ? document.querySelector(container)
      : container

  // 如果容器元素不存在，则抛出错误
  if (!root) {
    throw new Error("容器元素不存在")
  }

  // 创建 React 根元素
  const reactRoot = createRoot(root)

  reactRoot.render(
    React.createElement(
      StrictMode,
      null,
      React.createElement(App, { initStore: initStore, options: options })
    )
  )
}

export default render
