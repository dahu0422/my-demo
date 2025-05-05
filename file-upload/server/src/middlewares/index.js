const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const config = require('../config');
const fs = require('fs');
const path = require('path');

// 确保上传目录存在
const ensureUploadDir = async (ctx, next) => {
  if (!fs.existsSync(config.upload.dir)) {
    fs.mkdirSync(config.upload.dir, { recursive: true });
  }
  await next();
};

// 配置 CORS 中间件
const corsMiddleware = cors();

// 配置文件上传中间件
const uploadMiddleware = koaBody({
  multipart: true,
  formidable: {
    uploadDir: config.upload.dir,
    keepExtensions: true,
    maxFileSize: config.upload.maxFileSize,
  }
});

module.exports = {
  ensureUploadDir,
  corsMiddleware,
  uploadMiddleware
}; 