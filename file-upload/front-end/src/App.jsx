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
const CHUNK_SIZE = 1 * 1024 * 1024

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

  // 上传切片
  const uploadChunks = async (chunks, fileHash, filename) => {
    const requests = chunks.map((chunk) => {
      const formData = new FormData()
      formData.append("file", chunk.file)
      formData.append("fileHash", fileHash)
      formData.append("index", chunk.index)
      formData.append("filename", filename)
      return axios.post("http://localhost:3000/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress((prev) => ({
            ...prev,
            [filename]: percent,
          }))
        },
      })
    })

    await Promise.all(requests)
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
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"]
      if (!allowedTypes.includes(file.type)) {
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

      // 切片并上传
      const chunks = createFileChunks(file)
      await uploadChunks(chunks, fileHash, file.name)

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

  return (
    <div className="upload-container">
      <Upload
        customRequest={customRequest}
        showUploadList={false}
        disabled={uploading}
        accept="image/jpeg,image/png,image/gif,video/mp4"
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
                          <Tag icon={<CloseCircleOutlined />} color="error">
                            上传失败
                          </Tag>
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
