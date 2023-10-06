---
permalink: drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/webpack/webpack.config.common.js.html
title: "drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/webpack/webpack.config.common.js"
---

# webpack.config.common.js
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

const plugins = [
  new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
  new HtmlWebpackPlugin(
    {
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['main'],
    }
  ),
  new CopyWebpackPlugin({
    patterns: [
      { from: 'files' }
    ]
  })
];

module.exports = {
  entry: {
    main: './src/main.ts',
  },
  output: {
    path: path.resolve(__dirname, '..', 'app'),
    publicPath: './'
  },
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.html$/i,
        exclude: /node_modules/,
        use: ['html-loader']
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

```
<div class="social open-gh-btn my-4">
  <a class="btn btn-github" href="https://github.com/mathsoftware/engineer/tree/main/representation/repsymo/2dp/mrm/feat/drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/webpack/webpack.config.common.js" target="_blank">
    <i class="fab fa-github">
      
    </i>
    <span>
      Open in GitHub
    </span>
  </a>
</div>