// src/components/SchemaEditor.jsx
import React, { useState } from "react"
import MonacoEditor from "@monaco-editor/react"

export default function SchemaEditor({ value, onChange }) {
  const [error, setError] = useState("") // 错误信息

  // 编辑器内容变化时
  const handleEditorChange = (value) => {
    try {
      const newSchema = JSON.parse(value)
      setError("")
      onChange?.(newSchema, value)
    } catch {
      setError("JSON 格式错误，请检查！")
    }
  }

  return (
    <div className="schema-editor">
      <div className="schema-editor-title">编辑 JSON Schema</div>
      <MonacoEditor
        height="500px"
        defaultLanguage="json"
        value={value}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
        }}
      />
      {error && <div className="schema-editor-error">{error}</div>}
    </div>
  )
}
