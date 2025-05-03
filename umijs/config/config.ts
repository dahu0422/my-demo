import { defineConfig } from '@umijs/max';
import routes from './routes';

export default defineConfig({
  locale: {
    // 默认使用 src/locales/zh-CN.ts 作为多语言文件
    default: 'zh-CN',
    antd: true,
    baseNavigator: true, // 添加这行，启用浏览器语言自动检测
  },
  layout: {
    locale: true,
  },
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  routes,
  npmClient: 'pnpm',
});
