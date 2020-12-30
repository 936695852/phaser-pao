const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  // loader的配置
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader', //先执行
        exclude: /node_modules/,
        enforce: 'pre',
        options: {},
      },
      {
        oneOf: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
              presets: ['@babel/preset-env'],
            },
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.scss$/,
            use: [
              {
                loader: 'style-loader', // 将 JS 字符串生成为 style 节点
              },
              {
                loader: 'css-loader', // 将 CSS 转化成 CommonJS 模块
              },
              {
                loader: 'sass-loader', // 将 Sass 编译成 CSS
              },
            ],
          },
          {
            test: /\.(jpg|png|gif)$/,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              name: '[hash:10].[ext]',
              outputPath: 'images',
            },
          },
          // 打包其他资源
          {
            exclude: /\.(html|js|css|scss|jpg|png|gif)$/,
            loader: 'file-loader',
            options: {
              name: '[hash:5].[ext]',
              outputPath: 'media',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, 'src/assets'),
          to: 'assets',
        },
      ],
    }),
  ],
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    compress: true,
    port: 9000,
    open: true,
    hot: true,
  },
  // mode: 'development',
  mode: 'production',
}
