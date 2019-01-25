const path = require('path')
const cleanWebpackPlugin = require('clean-webpack-plugin')
const htmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  entry:"./src/app.js",
  output:{
    filename:'bundle.js',
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
  plugins:[
    new cleanWebpackPlugin(['./dist']),
    new htmlWebPackPlugin({
      filename:' index.html',
      template:'./src/entry.html'
    })
  ]
}