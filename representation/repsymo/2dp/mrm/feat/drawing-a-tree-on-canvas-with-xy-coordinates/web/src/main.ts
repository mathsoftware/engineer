// Copyright (c) 2022 Tobias Briones. All rights reserved.
// SPDX-License-Identifier: MIT
// This file is part of https://github.com/mathsoftware/engineer

import './index.html';
import './main.css';
import { newTreeNode, TreeNode } from './model';
import { SolutionsTreeCanvas } from './mrm-canvas';

const main = Main();
main.init().then(console.log);

function Main() {
  let tree = newTreeNode();
  return {
    async init() {
      tree = await loadTree();
      window.onresize = () => render(tree);
      render(tree);
    }
  };
}

function render(tree) {
  const canvasEl = document.getElementById('solutionsTree') as HTMLCanvasElement;
  const canvas = new SolutionsTreeCanvas();
  canvas.rootNode = tree;

  canvas.init(canvasEl);
  canvas.render();
}

async function loadTree(): Promise<TreeNode> {
  try {
    const res = await fetch(getTreeUrl());
    return await res.json();
  }
  catch (e) {
    console.log(e);
  }
  return newTreeNode();
}

function getTreeUrl() {
  return `https://mathsoftware.engineer/drawing-a-tree-on-canvas-with-xy-coordinates/web/root-node.json`
}
