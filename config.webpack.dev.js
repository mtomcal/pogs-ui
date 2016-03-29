var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css?sourceMap']
      },
      {
        test: /\.(png|jpg|woff|otf|woff2|eot|ttf|svg|gif)+$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.html$/,
        loaders: ['html']
      }
    ]
  }
};
