---
permalink: drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/src/model.ts.html
title: "drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/src/model.ts"
---

# model.ts
```typescript
// Copyright (c) 2022 Tobias Briones. All rights reserved.
// SPDX-License-Identifier: BSD-3-Clause
// This file is part of https://github.com/mathsoftware/engineer
//
// This file is also available at https://github.com/repsymo/2dp-repsymo-solver
// under a different license.

export interface TreeNode {
  machineAge: number;
  decisionYear: number;
  k?: TreeNode;
  r?: TreeNode;
}

export function newTreeNode(): TreeNode {
  return {
    machineAge: 0,
    decisionYear: 0,
    k: null,
    r: null
  };
}

```
<div class="social open-gh-btn my-4">
  <a class="btn btn-github" href="https://github.com/tobiasbriones/blog/tree/main/mathswe/representation/repsymo/2dp/mrm/feat/drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/src/model.ts" target="_blank">
    <i class="fab fa-github">
      
    </i>
    <strong>
      Open in GitHub
    </strong>
  </a>
</div>