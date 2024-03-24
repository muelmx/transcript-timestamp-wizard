const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: isDev ? 'none' : 'production',
  devtool: isDev ? 'inline-source-map' : undefined,
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inlineSource: '.(js|css)$', // embed all javascript and css inline
      cache: false
    }),
    new HtmlInlineScriptPlugin({
      htmlMatchPattern: [/index.html$/]
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: 'head', // insert style tag inside of <head>
              injectType: 'singletonStyleTag' // this is for wrap all your style in just one style tag
            },
          },
          "css-loader",
          "sass-loader"
        ],
      },
    ]
  },
  optimization: {
    minimize: !isDev,
    minimizer: [new TerserPlugin()]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true
  }
}
