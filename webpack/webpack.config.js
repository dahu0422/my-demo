import HtmlWebpackPlugin from "html-webpack-plugin"

export default {
  mode: "production",
  // 入口
  // entry: "", 单入口
  // entry: [], // 多入口
  entry: {
    main: "./src/index.js",
  },
  // 出口
  output: {
    filename: "[name].[contenthash:8].js",
    clean: true, // 自动清理dist目录 CleanWebpackPlugin
    environment: {
      arrowFunction: false,
    },
  },
  // loader：用于对模块的源代码进行转换
  module: {
    rules: [
      { test: /\.js$/, use: "babel-loader", exclude: /node_modules/ },
    ],
  },
  // 插件：实现打包优化、资源管理、环境变量注入等
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  optimization: {
    // 压缩，其他方案 terser uglifyjs esbuild
    minimize: true,
    // 拆分
    splitChunks: {
      chunks: "all",
    },
  },
}