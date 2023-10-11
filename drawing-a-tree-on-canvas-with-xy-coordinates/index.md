---
permalink: drawing-a-tree-on-canvas-with-xy-coordinates
title: "Drawing a Tree on Canvas with XY Coordinates"
description: "A detailed design, development, and recursion analysis to draw a tree data structure with HTML Canvas and TypeScript are given from the solution tree feature implemented into the 2DP Repsymo Solver for the machine replacement model from the operations research field."
ogimage: ""
---


<!-- Copyright (c) 2022 Tobias Briones. All rights reserved. -->
<!-- SPDX-License-Identifier: CC-BY-4.0 -->
<!-- This file is part of https://github.com/mathsoftware/engineer -->

# Drawing a Tree on Canvas with XY Coordinates

A detailed design, development, and recursion analysis to draw a tree data
structure with HTML Canvas and TypeScript are given from the solution tree
feature implemented into the 2DP Repsymo Solver for the machine replacement
model from the operations research field.

The result is a
[web app that renders an MRM solution tree within 2D coordinates](mrm-solution-tree---ep/app).

## Original MRM Problem

The **Machine Replacement Model (MRM)** is a deterministic dynamic programming
model from operations research. It states that we have a machine with an
initial age. We have a number of decision years to know what to do with that
machine. Then, for each decision year, there are two options: **keep** the
machine and pay maintenance (**K**), or **replace** the machine with a new one
(**R**). All the possible outcomes starting from the first decision year can be
visually represented as a tree that grows on the horizontal axis or the same,
the independent variable (decision year).

The first solution tree version depicted below was made with HTML, CSS, and
the DOM API (`div` elements). That version can be found at
[EP: MRM](https://github.com/tobiasbriones/machine-replacement-model---ep)[^1].
It's recommended to check it out to understand the problem better and get
textbook references. It's also advisable to review the
[Repsymo Solver](https://repsymo.com) for a complete insight into this model
(and more).

[^1]: **Example Project: Machine Replacement Model** was the first and
    main OR project devised and developed by
    [Tobias Briones](https://github.com/tobiasbriones) to solve and be able
    to explain the MRM to eventually end up building the 2DP Repsymo Solver

<figure>
    <img src="solution-tree-with-html-and-css---ep-mrm.png" alt="Solution Tree with HTML and CSS | EP Mrm" />
    <figcaption>Solution Tree with HTML and CSS | EP Mrm</figcaption>
</figure>

Chances are obviously limited and the connecting lines from a node to
its next nodes are missing (hence the pairs $$(K, R)$$ as labels). The other
problem is that the data structure was a **two-dimensional array** but the
underlying model corresponds to a **tree**. This solution was a very good fit
back in the day for moving forward faster with the development.

The problem consists of **populating the binary tree data structure onto a
canvas and also the XY-axes** to establish each node's position.

A browser canvas[^2] (or canvas in general) is not the best performant
solution[^3] but is a great step for this problem in terms of rendering and
correctness.

[^2]: A Canvas is a popular, more flexible, and performant tool for specific
    graphics than a user GUI library like for example the HTML DOM API or
    Android Views, but it's a lower-level API, so it requires more work and
    design which is probably what we're looking for

[^3]: A Canvas is a lower-level tool than a GUI toolkit, but it's far from
    the advanced top-performant techniques

### Other Kinds of Trees

Another more common tree data structure is a file explorer which loads your
directories and files from your disk. For working with trees we natively
implement recursion as the natural or mathematical definition of the problem.
Here is another project showing some recursion and designed to work with file
systems
[CP: Distributed Text File System](https://github.com/tobiasbriones/distributed-text-file-system---cp)
where its left panel with a populated-root-directory is also a tree.

### Tree Data Structure

As said above, the nature of many problems is recursive.

There are many ways of representing trees, and one of them is the underlying
topic of this article: the solution tree of the MRM. Others are file
systems, and so on.

When a wrong data structure is applied (due to engineering constraints) like
two-dimensional arrays (cartesian coordinates) to model what actually is a
tree (recursive) in this case, algorithms arise, and they're limited,
convoluted, and prone to errors.

Applying the right data structure to a model has more engineering efforts,
but it homogenizes the problem down to a simple model that is elegant and
correct, in other words, the model **matches**[^4] the representation.

[^4]: Notice FP pattern matching

## EP: MRM Solution Tree

Two elements are required to draw on the canvas: the 2D axis and the tree that
grows horizontally. These two elements are what the solution tree application to
render consists of.

### Getting Started

Create into your HTML a `div` containing the `canvas` in which we are going to
draw.


<figure>
<div class="header user-select-none ">
    <div class="caption">
        index.html
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/index.html" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="&lt;div id=&quot;solutionTreeParent&quot;&gt;
  &lt;canvas id=&quot;solutionTree&quot;&gt;&lt;&#x2F;canvas&gt;
&lt;&#x2F;div&gt;
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```html
<div id="solutionTreeParent">
  <canvas id="solutionTree"></canvas>
</div>
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Canvas Parent</figcaption>
</figure>

Some styles can be added.


<figure>
<div class="header user-select-none ">
    <div class="caption">
        main.css
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/main.css" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="#solutionTreeParent {
    width: 600px;
    height: 800px;
    margin: 3% auto;
}
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```css
#solutionTreeParent {
    width: 600px;
    height: 800px;
    margin: 3% auto;
}
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>General Structure Styles</figcaption>
</figure>

Now everything will be programmatically developed.

Create the module `mrm-canvas` that is going to be developed. It's going to
contain the following specification that is going to be detailed along with this
article:

<figure>
    <img src="module-mrm-canvas---uml-class-diagram.svg" alt="Module MRM Canvas | UML Class Diagram" />
    <figcaption>Module MRM Canvas | UML Class Diagram</figcaption>
</figure>

This function is going to help with some calculations:


<figure>
<div class="header user-select-none ">
    <div class="caption">
        mrm-canvas.ts
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="function getHypotenuse(triangleX: number, triangleY: number) {
  return Math.sqrt(Math.pow(triangleX, 2) + Math.pow(triangleY, 2));
}
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
function getHypotenuse(triangleX: number, triangleY: number) {
  return Math.sqrt(Math.pow(triangleX, 2) + Math.pow(triangleY, 2));
}
```

{% endcapture %}

{{ markdownContent | markdownify }}

<div class="abstract">Application of the Pythagorean Theorem</div>

<figcaption>Triangle Hypotenuse</figcaption>
</figure>

#### Resources

- [root-node.json](mrm-solution-tree---ep/files/root-node.json): sample tree
  object to render.
- [mrm.ts](mrm-solution-tree---ep/src/mrm.ts): assumed data model.
- [mrm-canvas.ts](mrm-solution-tree---ep/src/mrm-canvas.ts): underlying module.
- [gh-pr](https://github.com/repsymo/2dp-repsymo-solver/pull/21): pull request
  containing the initial step-by-step development.

##### Other Resources

- [triangle.py](mrm-solution-tree---ep/files/triangle.py): generates the
  rectangle triangles figure.

### Tree Model

The solution tree for the machine replacement model consists of the following
data type:


<figure>
<div class="header user-select-none ">
    <div class="caption">
        mrm.ts
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="interface TreeNode {
  machineAge: number;
  decisionYear: number;
  k?: TreeNode;
  r?: TreeNode;
}
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
interface TreeNode {
  machineAge: number;
  decisionYear: number;
  k?: TreeNode;
  r?: TreeNode;
}
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>MRM Node</figcaption>
</figure>

It follows that the independent variable $$x$$ is going to be the `decisionYear`
attribute and the dependent variable $$y$$ the `machineAge`. The tree is binary
so can have two children: `k` and `r`.

Thus, we have a binary tree to draw on an XY-plane.

This data structure is an external given model, so it should be added, say,
into a `mrm.ts` module.

### Canvas Design

The following base class is going to manage the canvases. It has the
`HTMLCanvasElement` (with its respective context) member so the drawing is
performed on that canvas element. The init method sets the canvas element and
its size according to its parent element. The render method runs a standard game
loop operation when the model is updated and then the drawing is performed with
the new model values computed. That means the tree can be re-rendered in
different states if the `render` method is called.


<figure>
<div class="header user-select-none ">
    <div class="caption">
        mrm-canvas.ts
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="abstract class MrmCanvas {
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
    this.ctx = this.canvasEl.getContext(&#x27;2d&#x27;);
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
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
abstract class MrmCanvas {
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
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Abstract Canvas Design</figcaption>
</figure>

### Drawing the Axes

First, the axes lines are easily drawn:


<figure>
<div class="header user-select-none ">
    <div class="caption">
        met draw | class TreeAxesCanvas
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="ctx.font = &#x27;12px Poppins&#x27;;
ctx.fillStyle = &#x27;black&#x27;;

ctx.moveTo(this.padding, 0);
ctx.lineTo(this.padding, this.height - this.padding);
ctx.lineTo(this.width, this.height - this.padding);
ctx.lineWidth = 1;
ctx.stroke();
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
ctx.font = '12px Poppins';
ctx.fillStyle = 'black';

ctx.moveTo(this.padding, 0);
ctx.lineTo(this.padding, this.height - this.padding);
ctx.lineTo(this.width, this.height - this.padding);
ctx.lineWidth = 1;
ctx.stroke();
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Drawing the Plane Axes</figcaption>
</figure>

To draw the $$X$$ axis labels, set the text-align center and draw the abscissa
value from $$0$$ until a maximum set value. There is a variable `cellSizePx`
that tells the width and height of each cell in the XY-plane (first quadrant).


<figure>
<div class="header user-select-none ">
    <div class="caption">
        met drawXLabels | class TreeAxesCanvas
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="ctx.textAlign = &#x27;center&#x27;;

for (let i = 0; i &lt;= this.maxAbscissa; i++) {
  const x = (i * this.cellSizePx) + this.padding;
  ctx.fillText(String(i), x, this.height);
}
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
ctx.textAlign = 'center';

for (let i = 0; i <= this.maxAbscissa; i++) {
  const x = (i * this.cellSizePx) + this.padding;
  ctx.fillText(String(i), x, this.height);
}
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Abscissa Labels</figcaption>
</figure>

For drawing the $$Y$$ axis labels some minor considerations are taken into
account to draw it properly.


<figure>
<div class="header user-select-none ">
    <div class="caption">
        met drawYLabels | class TreeAxesCanvas
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="ctx.textAlign = &#x27;start&#x27;;

for (let i = 1; i &lt;= this.maxOrdinate; i++) {
  const y = this.height - (i * this.cellSizePx) - this.padding;
  ctx.fillText(String(i), 0, y);
}
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
ctx.textAlign = 'start';

for (let i = 1; i <= this.maxOrdinate; i++) {
  const y = this.height - (i * this.cellSizePx) - this.padding;
  ctx.fillText(String(i), 0, y);
}
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Ordinate Labels</figcaption>
</figure>

These results are compiled into the `TreeAxesCanvas` class:


<figure>
<div class="header user-select-none ">
    <div class="caption">
        mrm-canvas.ts
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="class TreeAxesCanvas extends MrmCanvas {
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
    this.cellSizePx = this.width &#x2F; (this.maxAbscissa + 1);
  }

  protected draw(ctx) {
    ctx.font = &#x27;12px Poppins&#x27;;
    ctx.fillStyle = &#x27;black&#x27;;
    ctx.strokeStyle = &#x27;black&#x27;;

    ctx.moveTo(this.padding, 0);
    ctx.lineTo(this.padding, this.height - this.padding);
    ctx.lineTo(this.width, this.height - this.padding);
    ctx.lineWidth = 1;
    ctx.stroke();
    this.drawXLabels(ctx);
    this.drawYLabels(ctx);
  }

  private drawXLabels(ctx) {
    ctx.textAlign = &#x27;center&#x27;;

    for (let i = 0; i &lt;= this.maxAbscissa; i++) {
      const x = (i * this.cellSizePx) + this.padding;
      ctx.fillText(String(i), x, this.height);
    }
  }

  private drawYLabels(ctx) {
    ctx.textAlign = &#x27;start&#x27;;

    for (let i = 1; i &lt;= this.maxOrdinate; i++) {
      const y = this.height - (i * this.cellSizePx) - this.padding;
      ctx.fillText(String(i), 0, y);
    }
  }
}
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
class TreeAxesCanvas extends MrmCanvas {
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
    this.cellSizePx = this.width / (this.maxAbscissa + 1);
  }

  protected draw(ctx) {
    ctx.font = '12px Poppins';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';

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
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Implementation of the Axes Canvas</figcaption>
</figure>

Then


<figure>
<div class="header user-select-none headerless">
    <div class="caption">
        
    </div>

    <div class="menu">
        

        <button type="button" data-code="const canvasEl = document.getElementById(&#x27;solutionTree&#x27;) as HTMLCanvasElement;
const axesCanvas = new TreeAxesCanvas();

axesCanvas.init(canvasEl);
axesCanvas.render();
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
const canvasEl = document.getElementById('solutionTree') as HTMLCanvasElement;
const axesCanvas = new TreeAxesCanvas();

axesCanvas.init(canvasEl);
axesCanvas.render();
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Setting up the Axes Canvas</figcaption>
</figure>

<figure>
    <img src="axes-canvas.png" alt="Axes Canvas" />
    <figcaption>Axes Canvas</figcaption>
</figure>

### Drawing the Tree

The tree canvas is quite more complicated. The class consists of the following
structure:


<figure>
<div class="header user-select-none ">
    <div class="caption">
        mrm-canvas.ts
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="class SolutionTreeCanvas extends MrmCanvas {
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
    this.radiusPx = this.axesCanvas.cellSize &#x2F; 4;
  }

  protected draw(ctx) {
    const memoization = new Set&lt;string&gt;();

    this.drawNode(ctx, this.rootNode, memoization);
  }

  private drawNode(ctx: CanvasRenderingContext2D, node: TreeNode, memoization: Set&lt;string&gt;) {&#x2F;* ... *&#x2F;}

  private drawNodeLines(ctx: CanvasRenderingContext2D, node: TreeNode, memoization: Set&lt;string&gt;) {&#x2F;* ... *&#x2F;}

  private drawNodeCircle(ctx: CanvasRenderingContext2D, node: TreeNode) {&#x2F;* ... *&#x2F;}

  private drawNodeContent(ctx: CanvasRenderingContext2D, node: TreeNode) {&#x2F;* ... *&#x2F;}

  private getNodeCP(node: TreeNode) {&#x2F;* ... *&#x2F;}
}
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
class SolutionTreeCanvas extends MrmCanvas {
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
    const memoization = new Set<string>();

    this.drawNode(ctx, this.rootNode, memoization);
  }

  private drawNode(ctx: CanvasRenderingContext2D, node: TreeNode, memoization: Set<string>) {/* ... */}

  private drawNodeLines(ctx: CanvasRenderingContext2D, node: TreeNode, memoization: Set<string>) {/* ... */}

  private drawNodeCircle(ctx: CanvasRenderingContext2D, node: TreeNode) {/* ... */}

  private drawNodeContent(ctx: CanvasRenderingContext2D, node: TreeNode) {/* ... */}

  private getNodeCP(node: TreeNode) {/* ... */}
}
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Solution Tree Canvas Structure</figcaption>
</figure>

Notice we have:

- **An axes canvas:** To draw the axes.
- **The root node:** The tree data structure that is going to be drawn.
- **A radius:** A computed value for a node's radius.
- **Memoization:** To avoid drawing nodes that have already been drawn due to
  the recursive algorithm.

Finally, yes, the `drawNode` method is going to be the recursive function. You
can start noticing it is called to draw the root node, so it ends up drawing all
the children recursively.

Regarding the helper method `getNodeCP` we have the following code to get the
center point of the given `node`:


<figure>
<div class="header user-select-none ">
    <div class="caption">
        met getNodeCP | class SolutionTreeCanvas
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="const cp = {
  x: (node.decisionYear * this.axesCanvas.cellSize) + TreeAxesCanvas.AXIS_LABEL_SIZE_PX,
  y: this.height - (node.machineAge * this.axesCanvas.cellSize) - TreeAxesCanvas.AXIS_LABEL_SIZE_PX
}
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
const cp = {
  x: (node.decisionYear * this.axesCanvas.cellSize) + TreeAxesCanvas.AXIS_LABEL_SIZE_PX,
  y: this.height - (node.machineAge * this.axesCanvas.cellSize) - TreeAxesCanvas.AXIS_LABEL_SIZE_PX
}
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Node Center Point</figcaption>
</figure>

#### Drawing a Node

This is the recursive function to populate the whole tree from the root node.
**We take care of memoization to dynamically store the drawn nodes**. For
correctness effects, we always render the node circle and its content but the
node lines and labels (which are visually significant if rendered more than
once) are only rendered once.


<figure>
<div class="header user-select-none ">
    <div class="caption">
        met drawNode | class SolutionTreeCanvas
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="const point2d = { x: node.decisionYear, y: node.machineAge };
const point2dStr = JSON.stringify(point2d);
const hasNeverBeenDrawn = !memoization.has(point2dStr);

if (hasNeverBeenDrawn) {
  this.drawNodeLines(ctx, node, memoization);
}
this.drawNodeCircle(ctx, node);
this.drawNodeContent(ctx, node);
memoization.add(point2dStr);
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
const point2d = { x: node.decisionYear, y: node.machineAge };
const point2dStr = JSON.stringify(point2d);
const hasNeverBeenDrawn = !memoization.has(point2dStr);

if (hasNeverBeenDrawn) {
  this.drawNodeLines(ctx, node, memoization);
}
this.drawNodeCircle(ctx, node);
this.drawNodeContent(ctx, node);
memoization.add(point2dStr);
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Node Drawing</figcaption>
</figure>

So, it takes three steps:

- Draw the outgoing lines with their corresponding labels.
- Draw the circle with a background and border.
- Draw the node content consisting of its `machineAge` (y-coordinate) attribute.

The method `drawNodeLines` calls back to this method so initiates the recursion
process. That one is left to the end as it's the harder.

#### Node Circle and Content

These are pretty straightforward.

To draw the circle:


<figure>
<div class="header user-select-none ">
    <div class="caption">
        met drawNodeCircle | class SolutionTreeCanvas
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="const { x, y } = this.getNodeCP(node);
ctx.beginPath();
ctx.arc(x, y, this.radiusPx, 0, 2 * Math.PI);
ctx.fillStyle = &#x27;white&#x27;;
ctx.fill();
ctx.stroke();
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
const { x, y } = this.getNodeCP(node);
ctx.beginPath();
ctx.arc(x, y, this.radiusPx, 0, 2 * Math.PI);
ctx.fillStyle = 'white';
ctx.fill();
ctx.stroke();
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Node Circle Drawing</figcaption>
</figure>

To draw the content inside the node:


<figure>
<div class="header user-select-none ">
    <div class="caption">
        met drawNodeContent | class SolutionTreeCanvas
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="ctx.font = &#x27;24px Poppins&#x27;;
ctx.textAlign = &#x27;center&#x27;;
ctx.fillStyle = &#x27;black&#x27;;
const txt = String(node.machineAge);
const txtMetrics = ctx.measureText(txt);
const txtHeight = txtMetrics.actualBoundingBoxAscent + txtMetrics.actualBoundingBoxDescent;
const { x, y } = this.getNodeCP(node);
ctx.fillText(txt, x, y + txtHeight &#x2F; 2);
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
ctx.font = '24px Poppins';
ctx.textAlign = 'center';
ctx.fillStyle = 'black';
const txt = String(node.machineAge);
const txtMetrics = ctx.measureText(txt);
const txtHeight = txtMetrics.actualBoundingBoxAscent + txtMetrics.actualBoundingBoxDescent;
const { x, y } = this.getNodeCP(node);
ctx.fillText(txt, x, y + txtHeight / 2);
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Node Content Drawing</figcaption>
</figure>

Notice in the call to `measureText`, we use an advanced Canvas API to get the
text height and be able to center it vertically. It is horizontally centered
with `ctx.textAlign = 'center'`.

By running at this stage we obtain the first node drawn representing the initial
decision year:


<figure>
<div class="header user-select-none headerless">
    <div class="caption">
        
    </div>

    <div class="menu">
        

        <button type="button" data-code="const canvasEl = document.getElementById(&#x27;solutionTree&#x27;) as HTMLCanvasElement;
const canvas = new SolutionTreeCanvas();
canvas.rootNode = this.solver.getSolutionTree(); &#x2F;&#x2F; Use your tree here

canvas.init(canvasEl);
canvas.render();
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
const canvasEl = document.getElementById('solutionTree') as HTMLCanvasElement;
const canvas = new SolutionTreeCanvas();
canvas.rootNode = this.solver.getSolutionTree(); // Use your tree here

canvas.init(canvasEl);
canvas.render();
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Setting up the Solution Tree Canvas</figcaption>
</figure>

<figure>
    <img src="drawing-node-circle-and-content.png" alt="Drawing Node Circle and Content" />
    <figcaption>Drawing Node Circle and Content</figcaption>
</figure>

#### Line with Labels from Node-to-Node

First, we need some definitions to address this challenge:


<figure>
<div class="header user-select-none ">
    <div class="caption">
        met drawNodeLines | class SolutionTreeCanvas
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="const padding = TreeAxesCanvas.AXIS_LABEL_SIZE_PX;
const { x, y } = this.getNodeCP(node);
const isNodeNext = (next: TreeNode) =&gt; node.machineAge === 1 &amp;&amp; next.machineAge === 1;
const isNodeBelow = (next: TreeNode) =&gt; node.machineAge &lt; next.machineAge;
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
const padding = TreeAxesCanvas.AXIS_LABEL_SIZE_PX;
const { x, y } = this.getNodeCP(node);
const isNodeNext = (next: TreeNode) => node.machineAge === 1 && next.machineAge === 1;
const isNodeBelow = (next: TreeNode) => node.machineAge < next.machineAge;
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Definitions for Node Lines</figcaption>
</figure>

The $$(x, y)$$ coordinates are the center of the node (Center Point). The arrows
tell us if the next node is just to the right of the current node
(iff both nodes' ordinates are the same and equal to $$1$$ for this problem).

Drawing the line is straightforward:


<figure>
<div class="header user-select-none ">
    <div class="caption">
        met drawNodeLines | class SolutionTreeCanvas
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="const nextX = (next.decisionYear * this.axesCanvas.cellSize) + padding;
const nextY = this.height - (next.machineAge * this.axesCanvas.cellSize) - padding;
ctx.beginPath();
ctx.moveTo(x, y);
ctx.lineTo(nextX, nextY);
ctx.stroke();
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
const nextX = (next.decisionYear * this.axesCanvas.cellSize) + padding;
const nextY = this.height - (next.machineAge * this.axesCanvas.cellSize) - padding;
ctx.beginPath();
ctx.moveTo(x, y);
ctx.lineTo(nextX, nextY);
ctx.stroke();
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Drawing Line from Current Node to the Next</figcaption>
</figure>

**The rectangle triangle defined by the two-node points** is going to be
useful for **computing the directions for the outgoing lines from the current
node to the next one**. We simply use **similar triangles** to obtain the
requesting points.

<figure>
    <img src="triangle-for-tangent-point-at-node--to--node-line.svg" alt="Triangle for Tangent Point at Node-to-Node Line" />
    <figcaption>Triangle for Tangent Point at Node-to-Node Line</figcaption>
</figure>


<figure>
<div class="header user-select-none ">
    <div class="caption">
        met drawNodeLines | class SolutionTreeCanvas
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="const triangle = (next: TreeNode) =&gt; {
  const nextCP = this.getNodeCP(next);
  const nextX = nextCP.x;
  const nextY = nextCP.y;
  const triangleX = nextX - x;
  const triangleY = Math.abs(nextY - y);
  const hypotenuse = getHypotenuse(triangleX, triangleY);
  return { triangleX, triangleY, hypotenuse };
};
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
const triangle = (next: TreeNode) => {
  const nextCP = this.getNodeCP(next);
  const nextX = nextCP.x;
  const nextY = nextCP.y;
  const triangleX = nextX - x;
  const triangleY = Math.abs(nextY - y);
  const hypotenuse = getHypotenuse(triangleX, triangleY);
  return { triangleX, triangleY, hypotenuse };
};
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Triangle Defined by Two Nodes</figcaption>
</figure>

With that information we can draw the lines according to the corresponding
quadrant: up, straight or right, down. **The next node is always to the right as
the decision year always increases**.


<figure>
<div class="header user-select-none ">
    <div class="caption">
        met drawNodeLines | class SolutionTreeCanvas
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="const drawUpRightLabel = (next: TreeNode, label: string) =&gt; {
  const { triangleX, triangleY, hypotenuse } = triangle(next);
  const labelX = x + (triangleX * this.radiusPx &#x2F; hypotenuse);
  const labelY = y - (triangleY * this.radiusPx &#x2F; hypotenuse) - 8;
  ctx.fillText(label, labelX, labelY);
};

const drawDownRightLabel = (next: TreeNode, label: string) =&gt; {
  const { triangleX, triangleY, hypotenuse } = triangle(next);
  const labelX = x + (triangleX * this.radiusPx &#x2F; hypotenuse) - 4;
  const labelY = y + (triangleY * this.radiusPx &#x2F; hypotenuse) + 16;
  ctx.fillText(label, labelX, labelY);
};

const drawRightLabel = (next: TreeNode, label: string) =&gt; {
  const { triangleX, triangleY, hypotenuse } = triangle(next);
  const labelX = x + (triangleX * this.radiusPx &#x2F; hypotenuse) + 4;
  const labelY = y + (triangleY * this.radiusPx &#x2F; hypotenuse) + 16;
  ctx.fillText(label, labelX, labelY);
};
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
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
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Drawing Labels at Different Directions</figcaption>
</figure>

Then just call one of these functions to draw the appropriate line:


<figure>
<div class="header user-select-none ">
    <div class="caption">
        met drawNodeLines | class SolutionTreeCanvas
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="const drawLabelTo = (next: TreeNode, label: string) =&gt; {
  ctx.font = &#x27;12px Poppins&#x27;;
  ctx.textAlign = &#x27;center&#x27;;
  ctx.fillStyle = &#x27;black&#x27;;

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
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
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
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Matching the Label Direction</figcaption>
</figure>

Finally, to implement the method `drawNodeLines` we draw the line to the
"Keep" node and to the "Replace" node by **making use of recursion**:


<figure>
<div class="header user-select-none ">
    <div class="caption">
        met drawNodeLines | class SolutionTreeCanvas
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/mrm-canvas.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="if (node.k) {
  drawLineTo(node.k);
  drawLabelTo(node.k, &#x27;K&#x27;);
  this.drawNode(ctx, node.k, memoization); &#x2F;&#x2F; Recursive call
}
if (node.r) {
  drawLineTo(node.r);
  drawLabelTo(node.r, &#x27;R&#x27;);
  this.drawNode(ctx, node.r, memoization); &#x2F;&#x2F; Recursive call
}
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
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
```

{% endcapture %}

{{ markdownContent | markdownify }}

<div class="abstract">Recursive Drawing as per Model Decision</div>

<figcaption>Drawing Line and Moving Forward</figcaption>
</figure>

The initial method `drawNode` is called recursively (recall that `drawNode` was
the caller and `drawNodeLines` is the callee) and the `memoization`
set is carried to the method call.

### Enhancing Rendering Sizes

For managing more proper rendering sizes
[this may be an idea](https://github.com/repsymo/2dp-repsymo-solver/pull/22).

Another option is to call the method `init` on window size changed, adding
scroll, etc. Performance should be considered here.

### Result

By importing the developed module, the API is then consumed as follows:


<figure>
<div class="header user-select-none ">
    <div class="caption">
        main.ts
    </div>

    <div class="menu">
        <button type="button" data-path="mrm-solution-tree---ep/src/main.ts" onclick="onOpenCodeSnippetLink(this)">
    <span class="material-symbols-rounded">
    open_in_new
    </span>
</button>

        <button type="button" data-code="const canvasEl = document.getElementById(&#x27;solutionTree&#x27;) as HTMLCanvasElement;
const canvas = new SolutionTreeCanvas();
const tree = this.solver.getSolutionTree(); &#x2F;&#x2F; Replace with your tree

canvas.rootNode = tree;
canvas.init(canvasEl);

canvas.render();
" onclick="onCopyCodeSnippet(this)">
            <span class="material-symbols-rounded">
            content_copy
            </span>

            <div class="tooltip">
                Copied
            </div>
        </button>
    </div>
</div>
{% capture markdownContent %}
```ts
const canvasEl = document.getElementById('solutionTree') as HTMLCanvasElement;
const canvas = new SolutionTreeCanvas();
const tree = this.solver.getSolutionTree(); // Replace with your tree

canvas.rootNode = tree;
canvas.init(canvasEl);

canvas.render();
```

{% endcapture %}

{{ markdownContent | markdownify }}



<figcaption>Drawing Result</figcaption>
</figure>

By running now, we get the desired result:

<figure>
    <img src="solution-tree-canvas.png" alt="Solution Tree Canvas" />
    <figcaption>Solution Tree Canvas</figcaption>
</figure>

The result is deployed to the [example project app](mrm-solution-tree---ep/app).

## Analysis

Analysis on correctness and performance is detailed.

### Memoization

**If we remove the memoization, nodes will be rendered more than once** which
is not acceptable. The results are shown below. Recall that we still render the
node circle and content to fix incorrectness but the **lines and labels must
not be drawn more than once**. Excluding the lines (and labels) drawing is a
**partial drawing**, so we only draw the circle and content.

The tree is binary, contains $$15$$ nodes, and we get the following number
of renderings:

 Technique                                     | Rendering Times |
-----------------------------------------------|-----------------|
 With Memoization (partial drawings)           | 15              |
 With Memoization (whole and partial drawings) | 21              |
 Without Memoization                           | 31              |

Hence, the `drawNode` function is called $$21$$ times to render the whole
tree but just $$15$$ of those are full rendering.

**With memoization off is visually clear that nodes are being rendered on top of
themselves**, so it's easy to spot that flaw (notice node $$(4, 1)$$ for
instance):

<figure>
    <img src="memoization-off.png" alt="Memoization Off" />
    <figcaption>Memoization Off</figcaption>
</figure>

The problem, if we use full memoization, is as said before, correctness:

<figure>
    <img src="full-memoization.png" alt="Full Memoization" />
    <figcaption>Full Memoization</figcaption>
</figure>

The optimization can be addressed by computing a *more accurate model* and just
drawing the exact required line tangent to the nodes, so they don't overlap with
the other content.

### Order of Rendering

By counting the time a node was drawn with full memoization and drawing that
position on top of the node as a blue/purple counter we can easily debug or
follow the recursion process.

Recall that, as said above, the last nodes from the bottom are *partially
drawn* more times later.

<figure>
    <img src="drawing-order.png" alt="Drawing Order" />
    <figcaption>Drawing Order</figcaption>
</figure>

## More Recursion

From the equipment replacement problem, we have one or more solutions that
tell us what to do with the machine from the first decision year (result
chains). For a given year, it might turn out that **both options, keep and
replace, yield the exact same effect**, hence we have a **bifurcation or fork**:
we have to follow two branches if we keep and if we replace. This produces a
directed graph structure that looks similar to the tree that was developed.

**Result Chains:** Replace the first year and then, two ways can be taken for
the next year.

<figure>
    <img src="result-chains.png" alt="Result Chains" />
    <figcaption>Result Chains</figcaption>
</figure>

Since the solution tree is the **set of all possible solutions** to the problem,
and particularly, the **model solution belongs to the tree** which, with more
clever work can be traced onto the same solution tree:

**Traced Solution Tree:** The model solution can be drawn into the tree.

<figure>
    <img src="traced-solution-tree.png" alt="Traced Solution Tree" />
    <figcaption>Traced Solution Tree</figcaption>
</figure>

Check out
[Pull Request: Implement solution tracing on mrm solutions-tree](https://github.com/repsymo/2dp-repsymo-solver/pull/24)
to learn more about it.

### Caveats on Recursion

Many design and performance issues should be deeply addressed but that's another
topic. The problem is that languages like TS/JS and platforms like web browser
runtimes are not good for these problems.

Recall that, just functional languages implement TCE and TCO at first class so
the engineer or mathematician must be careful when using recursion. For
mainstream languages, imperative loops are to be used instead.

When it comes to mathematical models it's key to design declarative systems but
general-purpose computers don't support many abstractions and unfortunately,
recursion is not so widely used due to the hardware being imperative as an
obstacle.

In other words, be careful when using recursion. Recursion is key for
defining mathematical models but computers don't understand math really well
and imperative loops are preferred for most implementations unless you know
what you're doing.

That is not a problem of recursion as is, but a problem of computers, so use
recursion as a mathematician but think about it when engineering.

## Solution Tree Feature

This case study for the feature `Solution Tree | MRM | 2DP Repsymo Solver`
is taken to obtain insight and then employ the machine replacement model and
the HTML5 Canvas API to address the modeling and design of this feature into a
typescript module providing rendering for XY-axis and the solution tree.

Basic trigonometry is needed to render some elements, like similar triangles
which are useful to position the node labels.

Standard memoization with a `Set` helps to fix and optimize the recursive tree
traversal rendering and detailed analysis on the recursion used as well as
further insight on how this feature is evolving in the Repsymo Solver
complements the understanding of this topic.





<div class="my-4">
  <div class="subdir-btn my-4">
    <a class="btn" href="mrm-solution-tree---ep">
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDQwIDIwNDAiIHdpZHRoPSIyMDQwIiBoZWlnaHQ9IjIwNDAiPgoJPHN0eWxlPgoJCXRzcGFuIHsgd2hpdGUtc3BhY2U6cHJlIH0KCQkuc2hwMCB7IGZpbGw6ICNmNWY1ZjUgfSAKCQkuc2hwMSB7IGZpbGw6ICMwMjc3YmQgfSAKCQkuc2hwMiB7IGZpbGw6ICNlZjZjMDAgfSAKCQkuc2hwMyB7IGZpbGw6ICMwMDY5NWMgfSAKCTwvc3R5bGU+Cgk8cGF0aCBpZD0iQmFja2dyb3VuZCIgY2xhc3M9InNocDAiIGQ9Ik0wIDBMMjA0MCAwTDIwNDAgMjA0MEwwIDIwNDBMMCAwWiIgLz4KCTxnIGlkPSJFIj4KCQk8cGF0aCBpZD0iRSBCYXIiIGNsYXNzPSJzaHAxIiBkPSJNMCAwTDIyOS41IDBMMjI5LjUgMTE0Ny41TDAgMTE0Ny41TDAgMFoiIC8+CgkJPHBhdGggaWQ9IkUgVG9wIiBjbGFzcz0ic2hwMSIgZD0iTTIwNCAwTDkxOCAwTDkxOCAyMjkuNUwyMDQgMjI5LjVMMjA0IDBaIiAvPgoJCTxwYXRoIGlkPSJFIE1pZGRsZSIgY2xhc3M9InNocDEiIGQ9Ik0yMDQgNDU5TDkxOCA0NTlMOTE4IDY4OC41TDIwNCA2ODguNUwyMDQgNDU5WiIgLz4KCQk8cGF0aCBpZD0iRSBCb3R0b20iIGNsYXNzPSJzaHAxIiBkPSJNMjA0IDkxOEw5MTggOTE4TDkxOCAxMTQ3LjVMMjA0IDExNDcuNUwyMDQgOTE4WiIgLz4KCTwvZz4KCTxnIGlkPSJQIj4KCQk8cGF0aCBpZD0iUCBCYXIiIGNsYXNzPSJzaHAyIiBkPSJNOTE4IDBMMTE0Ny41IDBMMTE0Ny41IDExNDcuNUw5MTggMTE0Ny41TDkxOCAwWiIgLz4KCQk8cGF0aCBpZD0iUCBSaWdodCIgY2xhc3M9InNocDIiIGQ9Ik0xNjA2LjUgMEwxODM2IDBMMTgzNiA2ODguNUwxNjA2LjUgNjg4LjVMMTYwNi41IDBaIiAvPgoJCTxwYXRoIGlkPSJQIFRvcCIgY2xhc3M9InNocDIiIGQ9Ik0xMDMyLjc1IDBMMTcyMS4yNSAwTDE3MjEuMjUgMjI5LjVMMTAzMi43NSAyMjkuNUwxMDMyLjc1IDBaIiAvPgoJCTxwYXRoIGlkPSJQIEJvdHRvbSIgY2xhc3M9InNocDIiIGQ9Ik0xMDMyLjc1IDQ1OUwxNzIxLjI1IDQ1OUwxNzIxLjI1IDY4OC41TDEwMzIuNzUgNjg4LjVMMTAzMi43NSA0NTlaIiAvPgoJPC9nPgoJPHBhdGggaWQ9IlJ1biIgY2xhc3M9InNocDMiIGQ9Ik0yMDQwIDE1MzBMMTE0OCAyMDQwTDExNDggMTAyMEwyMDQwIDE1MzBaIiAvPgo8L3N2Zz4=" alt="Example Project" />
      <span>
        MRM Solution Tree
      </span>
    </a>
  </div>
</div>