/*eslint-env node*/

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const bootstrapEntryPoints = require('./webpack.bootstrap.config')

const isProd = process.env.NODE_ENV
const sourceMapConfig = isProd ? 'source-map' : 'cheap-module-source-map'

// ExtractTextPlugin does not work with HotModuleReplacement
const cssDev = ['style-loader','css-loader', 'sass-loader']
const cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader', 'sass-loader'],
  publicPath: '../'
})

const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev



module.exports = {
  devtool: sourceMapConfig,
  entry: {
    app: './src/index.js',
    bootstrap: bootstrapConfig
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
        { 
          enforce: 'pre', // Replaces preLoaders from webpack v1
          test: /\.jsx?$/i, 
          exclude: /node_modules/,
          use: [
            'eslint-loader'
          ]
        },
        { 
          test: /\.jsx?$/i, 
          exclude: /node_modules/,
          use: [
            'babel-loader',
          ]
        },
        {
          test: /\.s?css$/,
          use: isProd ? cssProd : cssDev
        },
        {
          test: /\.(png|ico|jpe?g|gif)$/i,
          use: [
            'file-loader?name=images/[name].[ext]',
            'image-webpack-loader'
          ]
        },
        { test: /\.(woff2?|svg)$/, use: 'url-loader?limit=10000&name=fonts/[name].[ext]' },
        { test: /\.(ttf|eot)$/, use: 'file-loader?name=fonts/[name].[ext]' }
    ]
  },
  devServer: {                // Settings for webpack-dev-server
    contentBase: './dist',    // Tells the server where to serve content from
    compress: true,           // Enable gzip compression for everything served
    stats: 'minimal',         // Only output when errors or new compilation happen
    open: true,               // The dev server will open the browser when ran
    hot: true                 // Enable webpack's Hot Module Replacement feature
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'National Contiguity using Force Directed Graph with d3 - Christopher McCormack',
      style: './styles/app.scss',
      minify: {
        collapseWhitespace: true
      },
      template: './src/index.ejs'
    }),

    new ExtractTextPlugin({
      filename: './styles/[name].css',
      disable: !isProd,
      allChunks: true
    }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}