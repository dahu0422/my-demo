import React from "react"
import { Form, Input, Button, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export default function ArrayInput({ name, ...props }) {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => {
            const { key, name: fieldName, ...restField } = field;
            return (
              <Space key={key} align="baseline" style={{ display: "flex", marginBottom: 8 }}>
                <Form.Item
                  {...restField}
                  name={[fieldName]}
                  rules={[
                    { required: true, message: "请输入邮箱" },
                    { type: "email", message: "邮箱格式不正确" },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder={props?.props?.placeholder || "请输入邮箱"} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(fieldName)} />
              </Space>
            );
          })}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
              添加邮箱
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  )
}

