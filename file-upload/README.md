# 文件切片上传


### generateFileHash 

生成 Hash 值

使用 readAsArrayBuffer 将文件读取为 ArrayBuffer 格式，并通过 SparkMD5.ArrayBuffer 生成文件 MD5 哈希值。

### uploadChunks

上传切片

接收三个参数 chunks 文件切片数组、fileHash 文件哈希值、filename 文件名

通过 map 遍历每个切片，为每个切片创建一个 FormData 对象，添加文件切片、文件哈希值、切片索引和文件名。

上传切片，通过 Promise.all 等待所有切片请求成功