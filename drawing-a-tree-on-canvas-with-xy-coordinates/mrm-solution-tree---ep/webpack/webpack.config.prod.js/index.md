---
permalink: drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/webpack/webpack.config.prod.js.html
title: "drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/webpack/webpack.config.prod.js"
---

# webpack.config.prod.js
```javascript
/*
 * It yields two configurations, say, legacy and module each for differential
 * loading for old browsers and ES Module supporting browsers respectively.
 */

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.config.common');

const copyrightHeader =
`Copyright (c) 2022 Tobias Briones. All rights reserved.
SPDX-License-Identifier: BSD-3-Clause
This file is part of https://github.com/mathsoftware/engineer`;

const mode = 'production';
const plugins = [
  new webpack.BannerPlugin(copyrightHeader),
  new FixStyleOnlyEntriesPlugin(),
  new MiniCssExtractPlugin({ filename: './css/[name].[contentHash].css' }),
  new CopyWebpackPlugin({
    patterns: [
      { from: 'static' }
    ]
  })
  // new OptimizeCSSAssetsPlugin({}) // it's not working on webpack 5
];
const cssRules = {
  test: /\.css$/i,
  exclude: /node_modules/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '../'
      }
    },
    'css-loader'
  ]
};
const fileRules = {
  test: /\.(png|jpe?g|gif|svg)$/i,
  exclude: /node_modules/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[contentHash].[ext]',
        outputPath: 'img'
      }
    }
  ]
};

const moduleConfig = {
  mode: mode,
  output: {
    filename: './js/[name].[contentHash].js'
  },
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: 3,
                targets: {
                  esmodules: true
                }
              }
            ]
          ]
        }
      },
      cssRules,
      fileRules
    ]
  }
};

module.exports = [
  merge(commonConfig, moduleConfig)
];

```
<div class="social open-gh-btn my-4">
  <a class="btn btn-github" href="https://github.com/tobiasbriones/blog/tree/main/mathswe/representation/repsymo/2dp/mrm/feat/drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/webpack/webpack.config.prod.js" target="_blank">
    <i class="fab fa-github">
      
    </i>
    <strong>
      Open in GitHub
    </strong>
  </a>
</div>