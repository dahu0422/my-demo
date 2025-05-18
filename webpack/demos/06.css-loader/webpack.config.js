const path = require("path")
const ESLintPlugin = require("eslint-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      { test: /\.ts$/, use: "ts-loader" },
      {
        test: /\.css$/, use: [
          process.env.NODE_ENV === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ['autoprefixer', 'postcss-preset-env'],
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          process.env.NODE_ENV === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ['autoprefixer', 'postcss-preset-env'],
              },
            },
          },
          "less-loader"
        ],
      },
    ],
  },
  plugins: [
    new ESLintPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin()
  ],

}