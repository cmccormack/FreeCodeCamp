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
          test: /\.js$/, 
          exclude: /node_modules/,
          loaders: [
            'babel-loader',
            'eslint-loader'
          ]
        }
    ],
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  devServer: {
    contentBase: './dist',
  }
}