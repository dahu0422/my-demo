import { IApi } from '@umijs/max';
import fs from 'fs';
import path from 'path';

// 辅助函数：首字母大写
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 递归复制模板文件并替换内容
 * @param templateDir 模板目录路径
 * @param targetDir 目标目录路径
 * @param replaceMap 替换变量映射
 * @returns
 */
function copyTemplateFiles(
  templateDir: string,
  targetDir: string,
  replaceMap: Record<string, string>,
) {
  // 如果模板目录不存在，直接返回
  if (!fs.existsSync(templateDir)) return;

  // 遍历模板目录中的文件
  fs.readdirSync(templateDir).forEach((file) => {
    const srcPath = path.join(templateDir, file); // 源文件路径
    const destPath = path.join(targetDir, file); // 目标文件路径
    const stat = fs.statSync(srcPath); // 获取文件状态
    if (stat.isDirectory()) {
      // 如果是目录，递归创建目录并复制文件
      fs.mkdirSync(destPath, { recursive: true });
      copyTemplateFiles(srcPath, destPath, replaceMap);
    } else {
      // 如果是文件，读取内容并替换变量
      let content = fs.readFileSync(srcPath, 'utf-8');
      Object.keys(replaceMap).forEach((key) => {
        content = content.replace(
          new RegExp(`{{${key}}}`, 'g'),
          replaceMap[key],
        );
      });
      // 写入替换后的内容到目标文件
      fs.writeFileSync(destPath, content, 'utf-8');
    }
  });
}

// 执行 npx max create-page '文件名称' 创建文件夹
export default (api: IApi) => {
  api.registerCommand({
    name: 'create-page',
    fn: async ({ args }) => {
      const [pageName] = args._;
      if (!pageName) {
        console.error('请指定页面名称，例如 npx umi create-page user');
        return;
      }

      // 目标目录
      const pageDir = path.join(api.cwd, 'src/pages', pageName);

      // 如果目标目录已存在，提示并退出
      if (fs.existsSync(pageDir)) {
        console.error(`页面 ${pageName} 已存在`);
        return;
      }

      // 创建目录
      fs.mkdirSync(pageDir, { recursive: true });

      // 模板目录
      const templateDir = path.join(api.cwd, 'src/template/page');
      // 替换变量
      const replaceMap = {
        pageName,
        PageName: capitalize(pageName),
      };

      copyTemplateFiles(templateDir, pageDir, replaceMap);

      console.log(`页面 ${pageName} 创建成功`);
    },
  });
};
