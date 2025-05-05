// eslint-disable-next-line no-undef
importScripts('https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/spark-md5.min.js')

self.onmessage = async function (e) {
  const { fileBuffer, chunkSize } = e.data
  const spark = new self.SparkMD5.ArrayBuffer()
  const totalSize = fileBuffer.byteLength
  const totalChunks = Math.ceil(totalSize / chunkSize)
  let currentChunk = 0

  while (currentChunk < totalChunks) {
    const start = currentChunk * chunkSize
    const end = Math.min(totalSize, start + chunkSize)
    const chunk = fileBuffer.slice(start, end)
    spark.append(chunk)
    currentChunk++
    self.postMessage({ progress: currentChunk / totalChunks })
  }
  self.postMessage({ hash: spark.end() })
} 