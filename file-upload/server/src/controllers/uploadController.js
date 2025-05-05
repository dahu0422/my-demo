const fs = require('fs');
const path = require('path');
const config = require('../config');

// 文件类型映射
const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4'
};

class UploadController {
  // 检查文件是否已上传
  async check(ctx) {
    const { fileHash, filename } = ctx.query;
    const ext = path.extname(filename);
    const filePath = path.join(config.upload.dir, `${fileHash}${ext}`);
    const uploaded = fs.existsSync(filePath);
    ctx.body = { uploaded };
  }

  // 上传切片
  async upload(ctx) {
    try {
      const { fileHash, index, filename } = ctx.request.body;
      const file = ctx.request.files.file;

      if (!file) {
        ctx.status = 400;
        ctx.body = { success: false, message: '文件上传失败' };
        return;
      }

      console.log('上传文件信息：', {
        name: file.originalFilename,
        type: file.mimetype,
        size: file.size,
        ext: path.extname(filename)
      });

      // 通过文件扩展名获取 MIME 类型
      const ext = path.extname(filename).toLowerCase();
      const mimeType = MIME_TYPES[ext];

      console.log('允许的文件类型：', config.upload.allowedTypes);
      console.log('文件扩展名：', ext);
      console.log('对应的 MIME 类型：', mimeType);
      console.log('是否在允许列表中：', mimeType && config.upload.allowedTypes.includes(mimeType));

      // 检查文件类型
      if (!mimeType || !config.upload.allowedTypes.includes(mimeType)) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: `不支持的文件类型：${ext}`,
          allowedTypes: config.upload.allowedTypes
        };
        return;
      }

      // 检查文件大小
      if (file.size > config.upload.maxFileSize) {
        ctx.status = 400;
        ctx.body = { success: false, message: '文件大小超过限制' };
        return;
      }

      // 创建临时目录
      const chunkDir = path.join(config.upload.dir, 'chunks', fileHash);
      if (!fs.existsSync(chunkDir)) {
        fs.mkdirSync(chunkDir, { recursive: true });
      }

      // 保存切片
      const chunkPath = path.join(chunkDir, index);
      fs.renameSync(file.filepath, chunkPath);

      ctx.body = {
        success: true,
        message: '切片上传成功'
      };
    } catch (error) {
      console.error('切片上传失败', error);
      ctx.status = 500;
      ctx.body = { success: false, message: '切片上传失败' };
    }
  }

  // 合并切片
  async merge(ctx) {
    try {
      const { fileHash, filename, total } = ctx.request.body;
      const ext = path.extname(filename);
      const chunkDir = path.join(config.upload.dir, 'chunks', fileHash);
      const filePath = path.join(config.upload.dir, `${fileHash}${ext}`);

      // 检查切片是否完整
      const chunks = fs.readdirSync(chunkDir);
      if (chunks.length !== total) {
        ctx.status = 400;
        ctx.body = { success: false, message: '切片数量不完整' };
        return;
      }

      // 按序号排序
      chunks.sort((a, b) => a - b);

      // 创建写入流
      const writeStream = fs.createWriteStream(filePath);

      // 合并切片
      for (const chunk of chunks) {
        const chunkPath = path.join(chunkDir, chunk);
        const chunkContent = fs.readFileSync(chunkPath);
        writeStream.write(chunkContent);
      }

      writeStream.end();

      // 清理临时文件
      fs.rmSync(chunkDir, { recursive: true });

      ctx.body = {
        success: true,
        message: '文件合并成功',
        data: {
          path: `/uploads/${fileHash}${ext}`,
          filename: filename
        }
      };
    } catch (error) {
      console.error('文件合并失败', error);
      ctx.status = 500;
      ctx.body = { success: false, message: '文件合并失败' };
    }
  }
}

module.exports = new UploadController(); 