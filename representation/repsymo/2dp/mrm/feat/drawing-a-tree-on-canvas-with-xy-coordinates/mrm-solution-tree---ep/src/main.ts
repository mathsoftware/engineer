// Copyright (c) 2022 Tobias Briones. All rights reserved.
// SPDX-License-Identifier: BSD-3-Clause
// This file is part of https://github.com/mathsoftware/engineer

import './index.html';
import './main.css';
import { newTreeNode, TreeNode } from './model';
import { SolutionTreeCanvas } from './mrm-canvas';

main().then(console.log);

async function main() {
  const path = 'root-node.json';
  const tree = await fetchTree(path);

  window.onresize = () => render(tree);
  render(tree);
  return 'Initialized';
}

function render(tree: TreeNode) {
  const canvasEl = document.getElementById('solutionTree') as HTMLCanvasElement;
  const canvas = new SolutionTreeCanvas();
  canvas.rootNode = tree;

  canvas.init(canvasEl);
  canvas.render();
}

function fetchTree(path: string): Promise<TreeNode> {
  return fetch(path)
    .then(res => res.ok ? res : Promise.reject(res.statusText))
    .then(res => res.json())
    .catch(reason => {
      showError({ reason, msg: 'Failed to fetch tree' });
      console.error(reason);
      return newTreeNode();
    });
}

interface Error {
  reason: any;
  msg: string;
}

function showError(error: Error) {
  document.getElementById('error').innerText = errorMsg(error);
  return error;
}

function errorMsg(error: Error): string {
  const { reason, msg } = error;
  return `${ msg }: ${ reason }`;
}
