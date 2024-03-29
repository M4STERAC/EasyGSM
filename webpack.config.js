const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");
const webpack = require("webpack");
const path = require("path");
require("dotenv").config();

module.exports = {
  devtool: "source-map",
  target: "electron-main",
  entry: "./src/frontend/index.tsx",
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx|json)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "out", "src", "frontend"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "frontend", "index.html"),
    }),
    sentryWebpackPlugin({
      org: "easygsm",
      project: "easygsm",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_SENTRY_DSN": JSON.stringify(
        process.env.REACT_APP_SENTRY_DSN
      ),
      "process.env.SENTRY_AUTH_TOKEN": JSON.stringify(
        process.env.SENTRY_AUTH_TOKEN
      ),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/backend/*.bat", to: "../../" },
        { from: "src/frontend/.js/", to: "./.js/"},
      ],
    }),
  ],
};
