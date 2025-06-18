// App.jsx
import React, { useState } from "react"
import MonacoEditor from "@monaco-editor/react"
import userFormJsonSchema from "./schemas/userFormJsonSchema"
import DynamicFormBySchema from "./components/DynamicFormBySchema"

import "./App.css"

function App() {
  const [schema, setSchema] = useState(userFormJsonSchema) // 用于存储当前 schema
  const [editorValue, setEditorValue] = useState(
    JSON.stringify(userFormJsonSchema, null, 2)
  ) // 编辑器内容
  const [error, setError] = useState("") // 错误信息

  // 编辑器内容变化时
  const handleEditorChange = (value) => {
    setEditorValue(value)
    try {
      const newSchema = JSON.parse(value)
      setSchema(newSchema)
      setError("")
    } catch {
      setError("JSON 格式错误，请检查！")
    }
  }

  return (
    <div className="app-flex-container">
      <div className="app-editor-panel">
        <div style={{ fontWeight: "bold", marginBottom: 8 }}>
          编辑 JSON Schema
        </div>
        <MonacoEditor
          height="500px"
          defaultLanguage="json"
          value={editorValue}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
        />
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </div>
      <div className="app-form-panel">
        <DynamicFormBySchema schema={schema} />
      </div>
    </div>
  )
}

export default App
