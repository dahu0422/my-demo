// 组件注册
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from 'react-redux'
import App from "./App.tsx"
import { store } from './store/index.ts'
import { initStore, addComponents, addNavigations } from './store/initStoreSlice.ts'

import DefaultNavigations from "./constsnt/navigation.ts"
import DefaultComponents from './constsnt/components.ts'


/**
 * 渲染函数
 * @param {string | HTMLElement} container - 容器元素
 * @param {Object} initialStore - 初始化状态
 * @param {Object} initialStore.navigations - 导航
 * @param {Object} initialStore.componentList - 组件列表
 * @param {Object} options - 配置选项
 */

const render = (
  container: string | HTMLElement,
  initialStore: Design.Store,
  options: any
) => {
  // 根据 container 类型，获取容器元素
  const root =
    typeof container === "string"
      ? document.querySelector(container)
      : container

  // 如果容器元素不存在，则抛出错误
  if (!root) { throw new Error("容器元素不存在") }

  // 初始化 store，添加默认组件和导航
  store.dispatch(initStore(initialStore))
  store.dispatch(addComponents(DefaultComponents))
  store.dispatch(addNavigations(DefaultNavigations))

  // 创建 React 根元素
  const reactRoot = createRoot(root)

  reactRoot.render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  )
}

export default render
