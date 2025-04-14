import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const isDev = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

export default {
  mode: isProduction ? 'production' : 'development',
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
      {
        test: /\.css$/, use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 4KB
          },
        },
        generator: {
          filename: "images/[name].[hash:8][ext]",
        },
      },
      {
        test: /\.(svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[hash:8][ext]",
        },
      },
    ],
  },
  // 插件：实现打包优化、资源管理、环境变量注入等
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack5-demo",
      template: "./public/index.html",
      filename: "index.html",
      favicon: "./public/favicon.ico",
      minify: {
        collapseWhitespace: isProduction, // 删除空格
        removeComments: isProduction, // 删除注释
        removeRedundantAttributes: isProduction, // 删除多余属性
        removeScriptTypeAttributes: isProduction, // 删除script类型属性
        removeStyleLinkTypeAttributes: isProduction, // 删除style类型属性
      },
    }),
    isProduction &&
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "css/[id].[contenthash:8].css",
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
  // 开发服务器
  devServer: {
    port: 9000,
    hot: true, // 热更新
    open: true, // 自动打开浏览器
    compress: true, // gzip压缩
  }
}