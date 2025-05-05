const Koa = require('koa');
const router = require('./routes');
const { ensureUploadDir, corsMiddleware, uploadMiddleware } = require('./middlewares');
const config = require('./config');

const app = new Koa();

// 使用中间件
app.use(ensureUploadDir);
app.use(corsMiddleware);
app.use(uploadMiddleware);

// 使用路由
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app; 