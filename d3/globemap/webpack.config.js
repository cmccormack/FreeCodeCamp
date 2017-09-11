/*eslint-env node*/
/*eslint no-console: 'off'*/

const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const bootstrapEntryPoints = require('./webpack.bootstrap.config')
const CompressionPlugin = require('compression-webpack-plugin')

const isProd = process.env.NODE_ENV

const useSourceMap = false
const prodSourceMap = 'cheap-module-source-map'
const devSourceMap = 'eval-cheap-module-source-map'
const sourceMapConfig = isProd ? prodSourceMap : devSourceMap

// ExtractTextPlugin does not work with HotModuleReplacement
const cssDev = ['style-loader','css-loader', 'sass-loader']
const cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [
    {
      loader: 'css-loader',
      options: {
        camelCase: true,
        modules: false
      }
    }, 
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true
      }
    }
  ],
  publicPath: '../'
})

const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev


module.exports = (env = {}) =>{
  console.log(env)
  return {
    devtool: useSourceMap && sourceMapConfig,
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
          use: isProd ? cssProd : cssDev
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
    devServer: {                // Settings for webpack-dev-server
      contentBase: './dist',    // Tells the server where to serve content from
      compress: false,           // Enable gzip compression for everything served
      stats: 'minimal',         // Only output when errors or new compilation happen
      open: true,               // The dev server will open the browser when ran
      hot: true,                // Enable webpack's Hot Module Replacement feature
      overlay: {                // WDS overlay for capturing warnings and errors
        errors: true,
        warnings: true
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
        disable: !isProd,
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
      new webpack.optimize.UglifyJsPlugin(),
    ]
  }
}