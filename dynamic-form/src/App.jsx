// App.jsx
import React, { useState, useEffect } from "react"
import { Form } from "antd"
import SchemaEditor from "./components/SchemaEditor"
import userFormJsonSchema from "./schemas/userFormJsonSchema"
import DynamicFormBySchema from "./components/DynamicFormBySchema"
import FieldConfigPanel from "./components/FieldConfigPanel"

import "./App.css"

function App() {
  const [form] = Form.useForm() // 创建 form 实例
  const [schema, setSchema] = useState(userFormJsonSchema) // 当前 schema
  const [selectedField, setSelectedField] = useState(null) // 当前选中的字段
  const [editorValue, setEditorValue] = useState(
    JSON.stringify(userFormJsonSchema, null, 2)
  ) // 编辑器内容

  // 监听 schema 的改变，当 schema 变化时，同步更新 editorValue
  useEffect(() => {
    setEditorValue(JSON.stringify(schema, null, 2))
  }, [schema])

  // 处理 schema 编辑器的变化
  const handleSchemaChange = (newSchema, newValue) => {
    setSchema(newSchema)
    setEditorValue(newValue)
  }

  return (
    <div className="app-flex-container">
      <div className="app-editor-panel">
        <SchemaEditor value={editorValue} onChange={handleSchemaChange} />
      </div>
      <div className="app-main-panel">
        <div className="app-form-panel">
          <DynamicFormBySchema
            form={form}
            schema={schema}
            selectedField={selectedField}
            setSelectedField={setSelectedField}
          />
        </div>
        {selectedField && (
          <div className="app-config-panel">
            <FieldConfigPanel
              field={selectedField}
              schema={schema}
              // 当 schema 更新时，重置对应字段的校验状态
              setSchema={(newSchema) => {
                setSchema(newSchema)
                if (selectedField) {
                  form.setFields([{ name: selectedField, errors: [] }])
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
