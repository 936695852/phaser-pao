const { resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
    app: './src/index.js',
  },
  externalsPresets: {
    web: true,
  },
  externalsType: 'script',
  externals: {
    phaser: ['https://cdn.bootcdn.net/ajax/libs/phaser/3.50.0-beta.12/phaser.min.js', 'Phaser'],
  },
  output: {
    filename: 'js/[name].[contenthash:8].js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/', // 资源引入路径前缀
    chunkFilename: 'js/[name].[contenthash:8].chunk.js', // 非入口chunk名称
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      // 默认值
      // minSize: 30 * 1024,
      // maxSize: 0,
      // minChunks: 1, // 最少被引用一次
      // name: true,
      cacheGroups: {
        // 分割chunk得组
        vendors: {
          // node_modules 文件会被打包到venders组得chunk中， --> venders~xxx.js
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          // 优先级
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          // 如果重复 就会复用
          reuseExistingChunk: true,
        }
      }
    },
    minimizer: [new TerserWebpackPlugin({}), new OptimizeCssAssetsWebpackPlugin({})],
  },
  // loader的配置
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            include: resolve(__dirname, 'src'),
            use: [
              'thread-loader', //开启多进程
              {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                },
              },
            ],
          },
          {
            test: /\.css$/,
            use: [{ loader: MiniCssExtractPlugin.loader }, { loader: 'css-loader' }],
          },
          {
            test: /\.scss$/,
            use: [
              { loader: MiniCssExtractPlugin.loader },
              {
                loader: 'css-loader', // 将 CSS 转化成 CommonJS 模块
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
  resolve: {
    alias: {
      $css: resolve(__dirname, 'src/style'),
    },
    extensions: ['.js', '.json'],
    // modules: [], // 解析模块去哪里找目录
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css', //输出的文件名字
    }),
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
          from: resolve(__dirname, 'assets'),
          to: 'assets',
        },
      ],
    }),
    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(false),
      'typeof WEBGL_RENDERER': JSON.stringify(true),
    }),
  ],
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    compress: true,
    port: 9000,
    open: true,
    hot: true,
    // clientLogLevel: 'none',
    quiet: true,
  },
}
