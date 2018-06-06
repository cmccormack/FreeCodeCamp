/*eslint-env node*/
/*eslint no-console: 'off'*/

const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const bootstrapEntryPoints = require('./webpack.bootstrap.config')
const CompressionPlugin = require('compression-webpack-plugin')

const useSourceMap = true
const prodSourceMap = 'cheap-module-source-map'
const devSourceMap = 'eval-cheap-module-source-map'

// ExtractTextPlugin does not work with HotModuleReplacement
const cssDev = ['style-loader','css-loader', 'sass-loader']
const cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader', 'sass-loader'],
  publicPath: '../'
})

module.exports = (env = {}) =>{
  console.log('env: ' + JSON.stringify(env) )
  console.log('Development: ' + env.development)
  console.log('Production: ' + env.production)

  return {
    entry: {
      app: './src/index.js',
      bootstrap: env.production ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev
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
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: {
            loader: 'eslint-loader',
            options: {
              fix: true,
              cache: true
            }
          }
        },
        {
          test: /\.jsx?$/i, 
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'react', 'env']
            }
          }
        },
        {
          test: /\.s?css$/,
          use: env.production ? cssProd : cssDev
        },
        {
          test: /\.(png|ico|jpe?g|gif)$/i,
          use: [
            'file-loader?name=images/[name].[ext]',
            'image-webpack-loader'
          ]
        },
        { 
          test: /\.(woff2?|svg)$/,
          use: 'url-loader?limit=10000&name=fonts/[name].[ext]' 
        },
        { 
          test: /\.(ttf|eot)$/,
          use: 'file-loader?name=fonts/[name].[ext]' 
        }
      ]
    },
    devtool: useSourceMap && env.production ? prodSourceMap : devSourceMap,
    devServer: {                // Settings for webpack-dev-server
      contentBase: './src',    // Tells the server where to serve content from
      compress: true,           // Enable gzip compression for everything served
      stats: 'minimal',         // Only output when errors or new compilation happen
      open: true,               // The dev server will open the browser when ran
      hot: true,                // Enable webpack's Hot Module Replacement feature
      overlay: {                // WDS overlay for capturing warnings and errors
        errors: true,
        warnings: false
      }
    },

    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new HtmlWebpackPlugin({
        title: 'Global Meteorite Landings - Chris McCormack',
        favicon: './src/images/favicon.ico',
        minify: {
          collapseWhitespace: true
        },
        template: './src/index.html'
      }),

      new ExtractTextPlugin({
        filename: './styles/[name].css',
        disable: !env.production,
        allChunks: true
      }),
      // new BundleAnalyzerPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|html|css)$/,
        threshold: 10240,
        minRatio: 0.8
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      // Disabled for now, slows down dev build
      // new webpack.optimize.UglifyJsPlugin()
    ]
  }
}