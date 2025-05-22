import React from "react"
import { createRoot } from "react-dom/client"
import Component from "./component.tsx"

const app = document.getElementById("app")
const root = createRoot(app)
root.render(
  <React.StrictMode>
    <Component />
  </React.StrictMode>
)
