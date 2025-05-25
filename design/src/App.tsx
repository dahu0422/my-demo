import { Layout } from "antd"
import ComponentPanel from "./layout/ComponentPanel"

import type { FC, ReactElement } from 'react'

const { Sider, Content } = Layout

const App: FC = (): ReactElement => {
  return (
    <Layout className="h-screen overflow-hidden">
      <Sider width={300} theme="light" className="text-center text-white">
        <ComponentPanel />
      </Sider>
      <Content className="w-auto text-center text-white bg-blue-700!">
        Content
      </Content>
      <Sider width="25%" className="text-center text-white bg-blue-400!">
        Sider
      </Sider>
    </Layout>
  )
}

export default App