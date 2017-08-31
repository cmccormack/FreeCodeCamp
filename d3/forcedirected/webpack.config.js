/*eslint-env node*/

const path = require('path')
const isProd = process.env.NODE_ENV

module.exports = {
  devtool: isProd ? 'source-map' : 'cheap-module-source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
        { 
          enforce: 'pre',
          test: /\.jsx?$/, 
          exclude: /node_modules/,
          loaders: [
            'eslint-loader'
          ]
        },
        { 
          test: /\.jsx?$/, 
          exclude: /node_modules/,
          loaders: [
            'babel-loader',
          ]
        }
    ]
  },
  devServer: {
    contentBase: './dist',
  }
}