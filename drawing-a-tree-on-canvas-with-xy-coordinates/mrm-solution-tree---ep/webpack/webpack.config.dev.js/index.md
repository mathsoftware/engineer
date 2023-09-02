---
permalink: drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/webpack/webpack.config.dev.js.html
title: "drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/webpack/webpack.config.dev.js"
---

# webpack.config.dev.js
```javascript
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

```
<div class="social open-gh-btn my-4">
  <a class="btn btn-github" href="https://github.com/tobiasbriones/blog/tree/main/mathswe/representation/repsymo/2dp/mrm/feat/drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/webpack/webpack.config.dev.js" target="_blank">
    <i class="fab fa-github">
      
    </i>
    <strong>
      Open in GitHub
    </strong>
  </a>
</div>