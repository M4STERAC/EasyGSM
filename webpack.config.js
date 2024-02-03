const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  devtool: "source-map", // Sentry SourceMap upload
  target: 'electron-renderer',
  entry: "./src/ui/index.js",
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "out", "src", "ui"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "ui", "index.html"),
    }),
    sentryWebpackPlugin({
      org: "easygsm",
      project: "easygsm",
      // authToken: process.env.SENTRY_AUTH_TOKEN,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_SENTRY_DSN': JSON.stringify(process.env.REACT_APP_SENTRY_DSN),
      'process.env.SENTRY_AUTH_TOKEN': JSON.stringify(process.env.SENTRY_AUTH_TOKEN),
    }),
  ],
};
