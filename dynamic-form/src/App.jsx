// App.jsx
import React from "react"
import userFormJsonSchema from "./schemas/userFormJsonSchema"
import DynamicFormBySchema from "./components/DynamicFormBySchema"

function App() {
  return <DynamicFormBySchema schema={userFormJsonSchema} />
}

export default App
