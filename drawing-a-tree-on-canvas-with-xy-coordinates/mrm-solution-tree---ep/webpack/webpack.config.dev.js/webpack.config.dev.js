const commonConfig = require('./webpack.config.common');
const { merge } = require('webpack-merge');

module.exports = merge(commonConfig, {
  mode: 'development',
  output: {
    filename: './js/[name].js'
  },
  devServer: {
    static: './out',
    compress: true,
    hot: true,
    devMiddleware: {
      writeToDisk: true
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img'
            }
          }
        ]
      }
    ]
  }
});
