// TODO: 如何根据 widget 的 props 来配置组件。动态支持，比如 input 的 maxLength、size 等，满足 antd 组件的 props。

import React from "react"
import { Card, Form, Input, Switch, InputNumber } from "antd"

import "../style/FieldConfigPanel.css"

function FieldConfigPanel({ field, schema, setSchema }) {
  const fieldConfig = schema.properties[field]

  // 更新 schema
  const updateSchema = (key, value) => {
    const newSchema = {
      ...schema,
      properties: {
        ...schema.properties,
        [field]: {
          ...schema.properties[field],
          [key]: value,
        },
      },
    }
    setSchema(newSchema)
  }

  // 更新必填状态
  const updateRequired = (checked) => {
    const newRequired = checked
      ? [...(schema.required || []), field]
      : (schema.required || []).filter((f) => f !== field)

    setSchema({
      ...schema,
      required: newRequired,
    })
  }

  // 更新 props
  const updateProps = (key, value) => {
    const newSchema = {
      ...schema,
      properties: {
        ...schema.properties,
        [field]: {
          ...schema.properties[field],
          props: {
            ...schema.properties[field].props,
            [key]: value,
          },
        },
      },
    }
    setSchema(newSchema)
  }

  return (
    <Card className="field-config-panel" title="字段配置">
      <Form layout="vertical">
        {/* 标题 */}
        <Form.Item label="标题">
          <Input
            value={fieldConfig.title}
            onChange={(e) => updateSchema("title", e.target.value)}
            placeholder="请输入标题"
          />
        </Form.Item>

        {/* 必填 */}
        <Form.Item label="必填">
          <Switch
            checked={schema.required?.includes(field)}
            onChange={updateRequired}
          />
        </Form.Item>

        {/* 占位文本 */}
        <Form.Item label="占位文本">
          <Input
            value={fieldConfig.props?.placeholder}
            onChange={(e) => updateProps("placeholder", e.target.value)}
            placeholder="请输入占位文本"
          />
        </Form.Item>

        {/* 禁用 */}
        <Form.Item label="禁用">
          <Switch
            checked={fieldConfig.props?.disabled}
            onChange={(checked) => updateProps("disabled", checked)}
          />
        </Form.Item>

        {/* 最大长度 */}
        <Form.Item label="最大长度">
          <InputNumber
            value={fieldConfig.props?.maxLength}
            onChange={(value) => updateProps("maxLength", value)}
          />
        </Form.Item>
      </Form>
    </Card>
  )
}

export default FieldConfigPanel
