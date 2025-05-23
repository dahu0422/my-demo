const path = require("path")
const ESLintPlugin = require("eslint-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.jsx",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
  },
  resolve: {
    extensions: [".ts", ".js", ".jsx", ".tsx"],
  },
  resolveLoader: {
    alias: {
      "custome-loader": path.join(__dirname, "./src/custome-loader/index.js"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "custome-loader",
            options: { name: true },
          },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      {
        test: /\.jsx$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-react", { "runtime": "automatic" }]
              ],
            },
          },
        ],
      },
      { test: /\.tsx?$/, use: "ts-loader" },
      {
        test: /\.css$/,
        use: [
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
    new HtmlWebpackPlugin({
      templateContent: `
      <!DOCTYPE html>
        <html>
          <head>
            <title>Webpack Demo</title>
          </head>
          <body>
            <div id="app">react</div>
          </body>
        </html>
      `,
    })
  ],
  devServer: {
    hot: true,
    open: true,
  }

}