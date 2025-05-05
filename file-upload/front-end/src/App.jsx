import React, { useState, useEffect } from "react"
import {
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons"
import { Button, message, Upload, Progress, List, Tag } from "antd"
import axios from "axios"
import SparkMD5 from "spark-md5"
import "./App.css"

// 定义切片大小（1MB）
const CHUNK_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "video/quicktime",
]
const MAX_CONCURRENT = 3

const App = () => {
  const [uploadProgress, setUploadProgress] = useState({})
  const [uploading, setUploading] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState([])
  const [completedFiles, setCompletedFiles] = useState([])

  // 监听 uploadingFiles 变化，更新 uploading 状态
  useEffect(() => {
    setUploading(uploadingFiles.length > 0)
  }, [uploadingFiles])

  // 生成文件hash
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

  // 获取已上传分片索引
  const getUploadedChunks = async (fileHash, filename) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/uploaded-chunks?fileHash=${fileHash}&filename=${filename}`
      )
      return data.uploaded || []
    } catch {
      return []
    }
  }

  // 文件切片
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

  // 并发上传分片，带进度条更新
  const uploadChunks = async (
    chunks,
    fileHash,
    filename,
    uploadedIndexes,
    fileSize
  ) => {
    // 已上传的分片大小（用于断点续传场景）
    let uploadedSize = uploadedIndexes.length * CHUNK_SIZE
    let lastPercent = 0 // 上一次进度百分比
    // 过滤出未上传的分片队列
    const queue = chunks.filter(
      (chunk) => !uploadedIndexes.includes(chunk.index)
    )
    let inProgress = 0 // 当前正在上传的分片数
    let current = 0 // 当前处理到的分片索引

    return new Promise((resolve, reject) => {
      let finished = 0 // 已完成上传的分片数
      const total = queue.length // 需要上传的分片总数

      // 控制并发上传的主循环
      function next() {
        // 所有分片上传完成，resolve
        if (finished === total) {
          resolve()
          return
        }
        // 控制最大并发数，批量发起上传
        while (inProgress < MAX_CONCURRENT && current < total) {
          const chunk = queue[current++] // 取下一个分片
          inProgress++ // 正在上传数+1
          axios
            .post(
              "http://localhost:3000/upload",
              (() => {
                // 构造分片上传的表单数据
                const formData = new FormData()
                formData.append("file", chunk.file)
                formData.append("fileHash", fileHash)
                formData.append("index", chunk.index)
                formData.append("filename", filename)
                return formData
              })(),
              {
                // 上传进度回调，实时更新进度条
                onUploadProgress: (progressEvent) => {
                  const chunkUploaded = progressEvent.loaded // 当前分片已上传字节数
                  const totalUploaded = uploadedSize + chunkUploaded // 总已上传字节数
                  let percent = Math.min(
                    100,
                    Math.round((totalUploaded / fileSize) * 100)
                  )
                  if (percent > lastPercent) {
                    setUploadProgress((prev) => ({
                      ...prev,
                      [filename]: percent,
                    }))
                    lastPercent = percent
                  }
                },
              }
            )
            .then(() => {
              // 单个分片上传成功，累计已上传大小
              uploadedSize += chunk.file.size
              inProgress-- // 并发数-1
              finished++ // 完成数+1
              next() // 继续上传下一个分片
            })
            .catch(reject) // 上传失败直接 reject
        }
      }
      next() // 启动并发上传
    })
  }

  // 合并切片
  const mergeChunks = async (fileHash, filename, fileSize) => {
    await axios.post("http://localhost:3000/merge", {
      fileHash,
      filename,
      total: Math.ceil(fileSize / CHUNK_SIZE),
    })
  }

  // 上传单个文件
  const uploadFile = async (file) => {
    try {
      // 检查文件类型
      if (!ALLOWED_TYPES.includes(file.type)) {
        message.error(
          `不支持的文件格式：${file.type}，只支持上传 JPG、PNG、GIF 图片和 MP4 视频文件！`
        )
        return false
      }

      // 生成文件hash
      const fileHash = await generateFileHash(file)

      // 检查文件是否已上传
      const {
        data: { uploaded },
      } = await axios.get(
        `http://localhost:3000/check?fileHash=${fileHash}&filename=${file.name}`
      )
      if (uploaded) {
        message.success(`${file.name} 已存在，秒传成功！`)
        return true
      }

      // 获取已上传分片索引
      const uploadedIndexes = await getUploadedChunks(fileHash, file.name)
      // 切片并上传（断点续传）
      const chunks = createFileChunks(file)
      await uploadChunks(
        chunks,
        fileHash,
        file.name,
        uploadedIndexes,
        file.size
      )
      // 合并切片
      await mergeChunks(fileHash, file.name, file.size)
      message.success(`${file.name} 上传成功！`)
      return true
    } catch (error) {
      console.error("上传错误：", error)
      message.error(`${file.name} 上传失败！`)
      return false
    }
  }

  // 自定义上传方法
  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))
      setUploadingFiles((prev) => [...prev, file.name])

      const success = await uploadFile(file)
      if (success) {
        onSuccess()
        setCompletedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type,
            size: file.size,
            status: "success",
            file: file,
          },
        ])
      } else {
        onError(new Error("上传失败"))
        setCompletedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type,
            size: file.size,
            status: "error",
            file: file,
          },
        ])
      }
    } finally {
      setUploadingFiles((prev) => prev.filter((name) => name !== file.name))
      setUploadProgress((prev) => {
        const newProgress = { ...prev }
        delete newProgress[file.name]
        return newProgress
      })
    }
  }

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // 重新上传处理函数
  const handleRetry = (file) => {
    setCompletedFiles((prev) => prev.filter((f) => f.name !== file.name))
    // 取原始 File 对象
    const rawFile = file.file || file
    customRequest({
      file: rawFile,
      onSuccess: () => {},
      onError: () => {},
    })
  }

  return (
    <div className="upload-container">
      <Upload
        customRequest={customRequest}
        showUploadList={false}
        disabled={uploading}
        accept="image/jpeg,image/png,image/gif,video/mp4,video/quicktime"
        multiple
      >
        <Button icon={<UploadOutlined />} disabled={uploading}>
          {uploading ? "上传中..." : "点击上传图片或视频"}
        </Button>
      </Upload>

      {(uploadingFiles.length > 0 || completedFiles.length > 0) && (
        <div className="file-list-container">
          {uploadingFiles.length > 0 && (
            <div className="uploading-list">
              <h3>正在上传</h3>
              <List
                size="small"
                dataSource={uploadingFiles}
                renderItem={(filename) => (
                  <List.Item>
                    <div className="file-progress">
                      <span>{filename}</span>
                      <Progress
                        percent={uploadProgress[filename] || 0}
                        size="small"
                        status="active"
                      />
                    </div>
                  </List.Item>
                )}
              />
            </div>
          )}

          {completedFiles.length > 0 && (
            <div className="completed-list">
              <h3>已上传文件</h3>
              <List
                size="small"
                dataSource={completedFiles}
                renderItem={(file) => (
                  <List.Item>
                    <div className="file-item">
                      <div className="file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                      <div className="file-status">
                        {file.status === "success" ? (
                          <Tag icon={<CheckCircleOutlined />} color="success">
                            上传成功
                          </Tag>
                        ) : (
                          <>
                            <Tag icon={<CloseCircleOutlined />} color="error">
                              上传失败
                            </Tag>
                            <Button
                              size="small"
                              type="link"
                              onClick={() => handleRetry(file)}
                              style={{ marginLeft: 8 }}
                            >
                              重新上传
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
