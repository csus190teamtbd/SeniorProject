const path = require('path')
const cleanWebpackPlugin = require('clean-webpack-plugin')
const htmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './src/app.js',
    oneProportion: './src/oneProportion/oneProportion.js'
  },
  output:{
    filename:'[name].bundle.js',
    path:path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  module:{
    rules:[
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  optimization:{
    splitChunks:{
      chunks:'all'
    }
  },
  plugins:[
    new cleanWebpackPlugin(['./dist']),
    new htmlWebPackPlugin({
      filename:' index.html',
      template:'./src/entry.html'
    })
  ]
}