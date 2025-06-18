/**
 * demoFormSchema 结构说明：
 * 
 * title:        表单的标题
 * type:         顶层类型，通常为 "object"，表示这是一个对象（表单）
 * properties:   表单字段定义对象，每个 key 是字段名，value 是该字段的详细描述
 *   - type:         字段类型（如 "string"、"number"、"array"）
 *   - title:        字段显示名称（label）
 *   - widget:       渲染组件类型（自定义，input/number/select/radio/checkbox 等，对应 antd 组件）
 *   - props:        传递给组件的额外属性（如 placeholder、min、max 等）
 *   - enumOptions:  枚举选项数组（用于 select、radio、checkbox），每项包含 label（显示）和 value（实际值）
 *   - items:        当 type 为 "array" 时，定义数组元素的类型
 * required:     必填字段名数组，指定哪些字段必须填写
 */

const userFormJsonSchema = {
  title: "用户信息",
  type: "object",
  properties: {
    username: {
      type: "string",
      title: "用户名",
      widget: "input",
      props: {
        placeholder: "请输入用户名"
      }
    },
    age: {
      type: "number",
      title: "年龄",
      widget: "number",
      props: {
        min: 0,
        max: 120
      }
    },
    country: {
      type: "string",
      title: "国家",
      widget: "select",
      enumOptions: [
        { label: "中国", value: "china" },
        { label: "美国", value: "usa" },
        { label: "日本", value: "japan" }
      ]
    },
    gender: {
      type: "string",
      title: "性别",
      widget: "radio",
      enumOptions: [
        { label: "男", value: "male" },
        { label: "女", value: "female" }
      ]
    },
    hobbies: {
      type: "array",
      title: "兴趣爱好",
      widget: "checkbox",
      items: {
        type: "string"
      },
      enumOptions: [
        { label: "篮球", value: "basketball" },
        { label: "足球", value: "football" },
        { label: "羽毛球", value: "badminton" }
      ]
    }
  },
  required: ["username"]
};

export default userFormJsonSchema;