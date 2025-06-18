import React from "react"
import {
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  Checkbox,
  Button,
  Typography,
} from "antd"
import "../style/DynamicFormBySchema.css" // 引入样式文件

const { Title } = Typography

const widgetMap = {
  input: Input,
  number: InputNumber,
  select: Select,
  radio: Radio.Group,
  checkbox: Checkbox.Group,
}

export default function DynamicFormBySchema({ schema }) {
  const [form] = Form.useForm()
  const { properties = {}, required = [], title } = schema

  return (
    <>
      {title && (
        <Title level={3} className="dfb-schema-title">
          {title}
        </Title>
      )}
      <Form
        form={form}
        onFinish={(values) => console.log(values)}
        layout="vertical"
        size="large"
        className="dfb-schema-form"
      >
        {Object.entries(properties).map(([field, prop]) => {
          const {
            type,
            title,
            widget = "input",
            enumOptions = [],
            props: compProps = {},
          } = prop

          const Comp = widgetMap[widget] || Input

          // 校验规则
          const rules = []
          if (required.includes(field)) {
            rules.push({ required: true, message: `请输入${title}` })
          }

          // 渲染不同类型的表单项
          let content = null
          if (widget === "select") {
            content = (
              <Comp {...compProps} className="dfb-schema-field">
                {enumOptions.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Comp>
            )
          } else if (widget === "radio") {
            content = (
              <Comp {...compProps} className="dfb-schema-field">
                {enumOptions.map((opt) => (
                  <Radio key={opt.value} value={opt.value}>
                    {opt.label}
                  </Radio>
                ))}
              </Comp>
            )
          } else if (widget === "checkbox" && type === "array") {
            content = (
              <Comp
                options={enumOptions.map((opt) => ({
                  label: opt.label,
                  value: opt.value,
                }))}
                {...compProps}
                className="dfb-schema-field"
              />
            )
          } else {
            content = <Comp {...compProps} className="dfb-schema-field" />
          }

          return (
            <Form.Item
              key={field}
              label={title}
              name={field}
              rules={rules}
              className="dfb-schema-form-item"
            >
              {content}
            </Form.Item>
          )
        })}
        <Form.Item className="dfb-schema-form-btn">
          <Button type="primary" htmlType="submit" size="large">
            提交
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
