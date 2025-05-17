const path = require("path")
const ESLintPlugin = require("eslint-webpack-plugin")

module.exports = {
  entry: "./src/index",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
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
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  plugins: [new ESLintPlugin()],
  resolve: {
    extensions: [".ts", ".js"],
  },
}