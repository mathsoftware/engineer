// Copyright (c) 2022 Tobias Briones. All rights reserved.
// SPDX-License-Identifier: MIT
// This file is part of https://github.com/tobiasbriones/mathsoftware.engineer

import './index.html';
import './main.css';
import { SolutionsTreeCanvas } from './mrm-canvas';

main().then(console.log);

async function main() {
  const canvasEl = document.getElementById('solutionsTree') as HTMLCanvasElement;
  const canvas = new SolutionsTreeCanvas();
  canvas.rootNode = await loadTree();

  canvas.init(canvasEl);
  canvas.render();
}

async function loadTree() {
  try {
    const res = await fetch(getTreeUrl());
    console.log(res);
    return await res.json()
  }
  catch (e) {
    console.log(e);
  }
  return {}
}

function getTreeUrl() {
  const entry = 'draw-a-tree-on-canvas-with-xy-coordinates';
  const path = 'web/src/root-node.json';
  return `https://raw.githubusercontent.com/tobiasbriones/mathsoftware.engineer/${ entry }/representation/${ entry }/${ path }`;
}
