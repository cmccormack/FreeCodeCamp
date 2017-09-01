/*eslint-env node*/

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isProd = process.env.NODE_ENV
const sourceMapConfig = isProd ? 'source-map' : 'cheap-module-source-map'

// ExtractTextPlugin does not work with HotModuleReplacement
const cssDev = ['style-loader','css-loader', 'sass-loader']
const cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader', 'sass-loader'],
  publicPath: '../'
})

module.exports = {
  devtool: sourceMapConfig,
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
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
        { test: /\.(woff2?|svg)$/, loader: 'url-loader?limit=10000' },
        { test: /\.(ttf|eot)$/, loader: 'file-loader' }
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