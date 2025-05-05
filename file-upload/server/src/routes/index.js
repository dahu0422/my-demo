const Router = require('koa-router');
const uploadController = require('../controllers/uploadController');

const router = new Router();

// 检查文件是否已上传
router.get('/check', uploadController.check);

// 上传切片
router.post('/upload', uploadController.upload);

// 合并切片
router.post('/merge', uploadController.merge);

// 检查已上传分片（断点续传）
router.get('/uploaded-chunks', uploadController.uploadedChunks);

module.exports = router; 