---
permalink: drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/src/mrm-canvas.ts.html
title: "drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/src/mrm-canvas.ts"
---

# mrm-canvas.ts
```typescript
// Copyright (c) 2022 Tobias Briones. All rights reserved.
// SPDX-License-Identifier: BSD-3-Clause
// This file is part of https://github.com/mathsoftware/engineer
//
// This file is also available at https://github.com/repsymo/2dp-repsymo-solver
// under a different license.

import { TreeNode, newTreeNode } from './model';

export const parentElId = 'solutionsTreeParent';

export abstract class MrmCanvas {
  public padding: number;
  private canvasEl: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  protected constructor() {
    this.padding = 0;
  }

  get width() {
    return this.canvasEl.width;
  }

  get height() {
    return this.canvasEl.height;
  }

  init(canvasEl: HTMLCanvasElement) {
    this.canvasEl = canvasEl;
    this.ctx = this.canvasEl.getContext('2d');
    this.updateCanvasSize();
    this.update();
  }

  render() {
    this.update();
    this.draw(this.ctx);
  }

  private updateCanvasSize() {
    const parentEl = document.getElementById(parentElId);
    this.canvasEl.width = parentEl.offsetWidth - this.padding;
    this.canvasEl.height = parentEl.offsetHeight - this.padding;
  }

  protected abstract update();

  protected abstract draw(ctx: CanvasRenderingContext2D);
}

// You should delete the @ts-ignore comments //

export class SolutionsTreeCanvas extends MrmCanvas {
  private readonly axesCanvas: TreeAxesCanvas;
  public rootNode: TreeNode;
  private radiusPx: number;

  constructor() {
    super();
    this.axesCanvas = new TreeAxesCanvas();
    this.rootNode = newTreeNode();
  }

  init(canvasEl) {
    super.init(canvasEl);
    this.axesCanvas.init(canvasEl);
  }

  render() {
    super.render();
    this.axesCanvas.render();
  }

  protected update() {
    this.radiusPx = this.axesCanvas.cellSize / 4;
  }

  protected draw(ctx) {
    // @ts-ignore
    const memoization = new Set<string>();

    this.drawNode(ctx, this.rootNode, memoization);
  }

  // @ts-ignore
  private drawNode(ctx: CanvasRenderingContext2D, node: TreeNode, memoization: Set<string>) {
    const point2d = { x: node.decisionYear, y: node.machineAge };
    const point2dStr = JSON.stringify(point2d);
    const hasNeverBeenDrawn = !memoization.has(point2dStr);

    if (hasNeverBeenDrawn) {
      this.drawNodeLines(ctx, node, memoization);
    }
    this.drawNodeCircle(ctx, node);
    this.drawNodeContent(ctx, node);
    memoization.add(point2dStr);
  }

  // @ts-ignore
  private drawNodeLines(ctx: CanvasRenderingContext2D, node: TreeNode, memoization: Set<string>) {
    const padding = TreeAxesCanvas.AXIS_LABEL_SIZE_PX;
    const { x, y } = this.getNodeCP(node);
    const isNodeNext = (next: TreeNode) => node.machineAge === 1 && next.machineAge === 1;
    const isNodeBelow = (next: TreeNode) => node.machineAge < next.machineAge;

    const drawLineTo = (next: TreeNode) => {
      const nextX = (next.decisionYear * this.axesCanvas.cellSize) + padding;
      const nextY = this.height - (next.machineAge * this.axesCanvas.cellSize) - padding;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nextX, nextY);
      ctx.stroke();
    };

    /**
     * Computes the rectangle triangle given by this node's (x, y) and the next
     * node's (nextX, nextY) points.
     */
    const triangle = (next: TreeNode) => {
      const nextCP = this.getNodeCP(next);
      const nextX = nextCP.x;
      const nextY = nextCP.y;
      const triangleX = nextX - x;
      const triangleY = Math.abs(nextY - y);
      const hypotenuse = getHypotenuse(triangleX, triangleY);
      return { triangleX, triangleY, hypotenuse };
    };

    const drawUpRightLabel = (next: TreeNode, label: string) => {
      const { triangleX, triangleY, hypotenuse } = triangle(next);
      const labelX = x + (triangleX * this.radiusPx / hypotenuse);
      const labelY = y - (triangleY * this.radiusPx / hypotenuse) - 8;
      ctx.fillText(label, labelX, labelY);
    };

    const drawDownRightLabel = (next: TreeNode, label: string) => {
      const { triangleX, triangleY, hypotenuse } = triangle(next);
      const labelX = x + (triangleX * this.radiusPx / hypotenuse) - 4;
      const labelY = y + (triangleY * this.radiusPx / hypotenuse) + 16;
      ctx.fillText(label, labelX, labelY);
    };

    const drawRightLabel = (next: TreeNode, label: string) => {
      const { triangleX, triangleY, hypotenuse } = triangle(next);
      const labelX = x + (triangleX * this.radiusPx / hypotenuse) + 4;
      const labelY = y + (triangleY * this.radiusPx / hypotenuse) + 16;
      ctx.fillText(label, labelX, labelY);
    };

    const drawLabelTo = (next: TreeNode, label: string) => {
      ctx.font = '12px Poppins';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'black';

      if (isNodeBelow(next)) {
        drawUpRightLabel(next, label);
      }
      else if (isNodeNext(next)) {
        drawRightLabel(next, label);
      }
      else {
        drawDownRightLabel(next, label);
      }
    };

    if (node.k) {
      drawLineTo(node.k);
      drawLabelTo(node.k, 'K');
      this.drawNode(ctx, node.k, memoization); // Recursive call
    }
    if (node.r) {
      drawLineTo(node.r);
      drawLabelTo(node.r, 'R');
      this.drawNode(ctx, node.r, memoization); // Recursive call
    }
  }

  private drawNodeCircle(ctx: CanvasRenderingContext2D, node: TreeNode) {
    const { x, y } = this.getNodeCP(node);
    ctx.beginPath();
    ctx.arc(x, y, this.radiusPx, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
  }

  private drawNodeContent(ctx: CanvasRenderingContext2D, node: TreeNode) {
    ctx.font = '24px Poppins';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    const txt = String(node.machineAge);
    const txtMetrics = ctx.measureText(txt);
    const txtHeight = txtMetrics.actualBoundingBoxAscent + txtMetrics.actualBoundingBoxDescent;
    const { x, y } = this.getNodeCP(node);
    ctx.fillText(txt, x, y + txtHeight / 2);
  }

  private getNodeCP(node: TreeNode) {
    return {
      x: (node.decisionYear * this.axesCanvas.cellSize) + TreeAxesCanvas.AXIS_LABEL_SIZE_PX,
      y: this.height - (node.machineAge * this.axesCanvas.cellSize) - TreeAxesCanvas.AXIS_LABEL_SIZE_PX
    };
  }
}

export class TreeAxesCanvas extends MrmCanvas {
  public static readonly AXIS_LABEL_SIZE_PX = 24;
  public maxAbscissa: number;
  public maxOrdinate: number;
  private cellSizePx: number;

  constructor() {
    super();
    this.padding = TreeAxesCanvas.AXIS_LABEL_SIZE_PX;
    this.maxAbscissa = 5;
    this.maxOrdinate = 8;
  }

  get cellSize() {
    return this.cellSizePx;
  }

  protected update() {
    this.cellSizePx = this.width / 6;
  }

  protected draw(ctx) {
    ctx.font = '12px Poppins';
    ctx.fillStyle = 'black';

    ctx.moveTo(this.padding, 0);
    ctx.lineTo(this.padding, this.height - this.padding);
    ctx.lineTo(this.width, this.height - this.padding);
    ctx.lineWidth = 1;
    ctx.stroke();
    this.drawXLabels(ctx);
    this.drawYLabels(ctx);
  }

  private drawXLabels(ctx) {
    ctx.textAlign = 'center';

    for (let i = 0; i <= this.maxAbscissa; i++) {
      const x = (i * this.cellSizePx) + this.padding;
      ctx.fillText(String(i), x, this.height);
    }
  }

  private drawYLabels(ctx) {
    ctx.textAlign = 'start';

    for (let i = 1; i <= this.maxOrdinate; i++) {
      const y = this.height - (i * this.cellSizePx) - this.padding;
      ctx.fillText(String(i), 0, y);
    }
  }
}

function getHypotenuse(triangleX: number, triangleY: number) {
  return Math.sqrt(Math.pow(triangleX, 2) + Math.pow(triangleY, 2));
}

```
<div class="social open-gh-btn my-4">
  <a class="btn btn-github" href="https://github.com/tobiasbriones/blog/tree/main/mathswe/representation/repsymo/2dp/mrm/feat/drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/src/mrm-canvas.ts" target="_blank">
    <i class="fab fa-github">
      
    </i>
    <strong>
      Open in GitHub
    </strong>
  </a>
</div>