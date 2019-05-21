const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const isDev = process.env.NODE_ENV !== 'production'

const config = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    polyfill: 'babel-polyfill',
    app: path.resolve(__dirname, 'app', 'index.js'),
  },
  resolve: {
    extensions: [ '.js', '.vue' ],
    alias: {
      '@': path.resolve(__dirname, 'app'),
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!{css,javascript,images}', '!css/site.scss', '!images/**/*'],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: path.resolve(__dirname, 'app', 'scripts.template.html'),
      filename: path.resolve(__dirname, 'site', '_includes', 'scripts.html'),
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: path.resolve(__dirname, 'app', 'styles.template.html'),
      filename: path.resolve(__dirname, 'site', '_includes', 'styles.html'),
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
  output: {
    publicPath: '/ghp-boilerplate/assets/',
    path: path.resolve(__dirname, 'site', 'assets'),
    filename: 'javascript/[name].[contenthash].js',
    chunkFilename: 'javascript/[name].[contenthash].js',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        styles: {
          test: /\.css$/,
          name: 'styles',
          chunks: 'all',
          enforce: true,
        },
      },
    },
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: [ 'default', { discardComments: { removeAll: true } } ],
        },
      }),
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [ path.resolve(__dirname, 'app') ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [ path.resolve(__dirname, 'app') ],
      },
      {
        test: /\.(c|sa|sc)ss$/,
        use: [
          { loader: MiniCSSExtractPlugin.loader, options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
    ]
  }
}

module.exports = isDev ? config : merge(config, {
  mode: 'production',
  devtool: 'source-map',
})
