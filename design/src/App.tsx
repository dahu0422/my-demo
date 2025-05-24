import { Layout } from "antd"

const { Sider, Content } = Layout

export default function App() {
  return (
    <Layout className="h-screen overflow-hidden">
      <Sider width="25%" className="text-center text-white bg-blue-400!">
        Sider
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
