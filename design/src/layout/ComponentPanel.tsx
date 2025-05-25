import { useSelector } from 'react-redux'
import { Collapse, type CollapseProps } from "antd"
import Component from './Component'
import type { RootState } from '../store'

export default () => {
  const navigations = useSelector((state: RootState) => state.initStore.navigations)
  const componentList = useSelector((state: RootState) => state.initStore.componentList)

  // 组件列表
  const items: CollapseProps['items'] = Object.entries(navigations).map(([key, nav]) => ({
    key,
    label: nav.name,
    classNames: {
      body: 'grid grid-cols-2 gap-2'
    },
    children: componentList.map((component) => {
      return (
        <Component key={component.name} component={component} />
      )
    })
  }))

  return (
    <Collapse items={items} bordered={false} size="small" />
  )
}