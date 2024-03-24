const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDev ? "none" : "production",
  devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      inlineSource: ".(js|css)$", // embed all javascript and css inline
      cache: false,
    }),
    new HtmlInlineScriptPlugin({
      htmlMatchPattern: [/index.html$/],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
