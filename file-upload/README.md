# 文件分片上传（前后端分离实现）

本项目演示了如何在前后端分离架构下实现大文件分片上传、断点续传、秒传等功能。

---

## 一、核心原理

1. **分片上传**：前端将大文件切片为多个小块，逐块上传，后端接收并保存每个分片。
2. **断点续传**：前端上传前询问后端哪些分片已上传，只上传未完成的分片。
3. **秒传**：前端先计算文件 hash，上传前询问后端是否已存在该文件，已存在则直接返回成功。
4. **合并分片**：所有分片上传完成后，前端通知后端合并分片为完整文件。

---

## 二、前端实现要点（React + Ant Design + axios）

### 1. 文件切片
```js
const createFileChunks = (file) => {
  const chunks = []
  let current = 0
  while (current < file.size) {
    chunks.push({
      file: file.slice(current, current + CHUNK_SIZE),
      index: chunks.length,
    })
    current += CHUNK_SIZE
  }
  return chunks
}
```

### 2. 计算文件 hash（主线程 FileReader + SparkMD5）
```js
const generateFileHash = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (e) => {
      const spark = new SparkMD5.ArrayBuffer()
      spark.append(e.target.result)
      const hash = spark.end()
      resolve(hash)
    }
  })
}
```
> 如需避免大文件卡主线程，可用 Web Worker 方式，详见项目 `hashWorker.js`。

### 3. 断点续传：获取已上传分片
```js
const getUploadedChunks = async (fileHash, filename) => {
  const { data } = await axios.get(`/uploaded-chunks?fileHash=${fileHash}&filename=${filename}`)
  return data.uploaded || []
}
```

### 4. 并发上传分片（限制最大并发数）
```js
const uploadChunks = async (chunks, fileHash, filename, uploadedIndexes, fileSize) => {
  let uploadedSize = uploadedIndexes.length * CHUNK_SIZE
  let lastPercent = 0
  const queue = chunks.filter(chunk => !uploadedIndexes.includes(chunk.index))
  let inProgress = 0, current = 0
  return new Promise((resolve, reject) => {
    let finished = 0, total = queue.length
    function next() {
      if (finished === total) return resolve()
      while (inProgress < MAX_CONCURRENT && current < total) {
        const chunk = queue[current++]
        inProgress++
        axios.post('/upload', (() => {
          const formData = new FormData()
          formData.append('file', chunk.file)
          formData.append('fileHash', fileHash)
          formData.append('index', chunk.index)
          formData.append('filename', filename)
          return formData
        })(), {
          onUploadProgress: (progressEvent) => {
            const chunkUploaded = progressEvent.loaded
            const totalUploaded = uploadedSize + chunkUploaded
            let percent = Math.min(100, Math.round((totalUploaded / fileSize) * 100))
            if (percent > lastPercent) {
              // 更新进度条
              lastPercent = percent
            }
          }
        }).then(() => {
          uploadedSize += chunk.file.size
          inProgress--
          finished++
          next()
        }).catch(reject)
      }
    }
    next()
  })
}
```

### 5. 合并分片
```js
await axios.post('/merge', {
  fileHash,
  filename,
  total: Math.ceil(file.size / CHUNK_SIZE)
})
```

### 6. 主要流程整合
```js
const fileHash = await generateFileHash(file)
const { data: { uploaded } } = await axios.get(`/check?fileHash=${fileHash}&filename=${file.name}`)
if (uploaded) return // 秒传
const uploadedIndexes = await getUploadedChunks(fileHash, file.name)
const chunks = createFileChunks(file)
await uploadChunks(chunks, fileHash, file.name, uploadedIndexes, file.size)
await mergeChunks(fileHash, file.name, file.size)
```

### 7. 分片上传进度条的计算原理

分片上传时，前端进度条的计算方式如下：

- **累计已上传字节数**：每完成一个分片上传，就将该分片的字节数累加到 `uploadedSize`。
- **实时分片进度**：当前正在上传的分片，会通过 `onUploadProgress` 获取其已上传字节数（`progressEvent.loaded`）。
- **总进度估算**：每次分片上传进度变化时，都会用 `uploadedSize + chunkUploaded` 作为"当前总已上传字节数"。
- **百分比计算**：用 `percent = Math.min(100, Math.round((totalUploaded / fileSize) * 100))` 计算当前进度百分比。
- **进度条刷新**：只有当进度有提升时才会刷新进度条，避免频繁渲染。

这种方式可以做到：
- 多分片并发时，进度条能实时反映所有分片的累计进度。
- 支持断点续传，已上传分片会直接计入进度。
- 进度条显示的是"全局进度"，而不是单个分片的进度。

**示意流程**：
1. 统计所有已完成分片的字节数（`uploadedSize`）。
2. 当前有分片正在上传时，实时加上该分片的已上传字节数（`chunkUploaded`）。
3. 用"已上传总字节数 / 文件总字节数"得到进度百分比。
4. 进度条随上传过程动态增长，直至 100%。

## 三、后端实现要点（Koa）

本项目后端采用 Koa 框架，目录结构清晰、易于扩展，便于多人协作和维护。各部分职责如下：

```
server/
├── uploads/                # 文件上传存储目录（分片和合并后的文件）
├── src/
│   ├── app.js              # Koa 应用主入口，加载中间件和路由
│   ├── index.js            # 启动文件，监听端口
│   ├── config/             # 配置目录（如端口、上传限制、允许类型等）
│   │   └── index.js
│   ├── controllers/        # 控制器目录，处理具体业务逻辑
│   │   └── uploadController.js  # 文件上传、分片、合并、断点续传等核心逻辑
│   ├── middlewares/        # 中间件目录，处理跨域、上传参数校验等
│   │   └── index.js
│   ├── routes/             # 路由目录，定义各 API 路由
│   │   └── index.js
│   └── utils/              # 工具函数目录（可扩展，如分片校验、日志等）
├── package.json
└── package-lock.json
```

#### 主要模块说明

- **uploads/**  
  存放所有上传的文件和分片。分片临时存储在 `uploads/chunks/{fileHash}/`，合并后文件存储在 `uploads/` 根目录。

- **src/app.js**  
  Koa 应用主入口，负责加载全局中间件（如 CORS、上传参数校验、上传目录检查）和挂载所有路由。

- **src/index.js**  
  启动文件，读取配置端口，启动 Koa 服务。

- **src/config/**  
  配置相关，集中管理服务端口、上传目录、文件大小限制、允许的文件类型等。

- **src/controllers/**  
  控制器层，负责处理具体的业务逻辑。  
  例如 `uploadController.js` 包含：  
  - 文件分片上传
  - 查询已上传分片（断点续传）
  - 合并分片
  - 秒传检查

- **src/middlewares/**  
  中间件层，处理如跨域（CORS）、上传参数校验、上传目录检查等通用逻辑。

- **src/routes/**  
  路由层，定义所有 API 路由，并将请求分发到对应的控制器方法。

- **src/utils/**  
  工具函数层，便于后续扩展，如分片校验、日志、通用工具等。

#### uploadController.js 主要方法说明

- **check(ctx)**
  - 检查某个文件是否已上传（用于前端"秒传"判断）。
  - 前端传入 fileHash 和 filename，后端判断合并后的文件是否存在。
  - 返回 `{ uploaded: true/false }`。

- **upload(ctx)**
  - 处理单个分片的上传。
  - 校验文件类型、大小，保存分片到 `uploads/chunks/{fileHash}/{index}`。
  - 返回上传结果。

- **merge(ctx)**
  - 合并所有分片为完整文件。
  - 校验分片数量，按顺序合并，合并后删除分片目录。
  - 返回合并结果和文件路径。

- **uploadedChunks(ctx)**
  - 查询某个文件已上传的分片索引（断点续传用）。
  - 前端传入 fileHash 和 filename，后端返回已存在的分片 index 数组。
  - 返回 `{ uploaded: [0, 1, 2, ...] }`。

---

## 四、面试要点/仿写指引

- 为什么要分片上传？（大文件、断点续传、秒传、网络不稳定）
- 如何实现断点续传？（前端询问后端已上传分片，只补传未完成分片）
- 如何实现秒传？（前端 hash，后端查找）
- 如何优化上传体验？（并发控制、进度条、Web Worker 计算 hash）
- 如何保证安全？（校验 hash、校验分片、鉴权等）

---

## 五、参考/扩展

- 支持更多类型、文件夹上传、拖拽上传
- 支持分片校验、失败重试、暂停/恢复
- 支持大文件 hash 断点续算、分布式存储

---

如需完整代码或有疑问，欢迎参考本项目源码或联系作者。
