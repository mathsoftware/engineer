---
permalink: drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/files/triangle.py.html
title: "drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/files/triangle.py"
---

# triangle.py
```python
# Copyright (c) 2022 Tobias Briones. All rights reserved.
# SPDX-License-Identifier: BSD-3-Clause
# This file is part of https://github.com/mathsoftware/engineer

from ctypes import alignment
import matplotlib.pyplot as plt

fig, ax = plt.subplots(1)
plt.plot([0, 1, 1, 0], [0, 0, 1, 0])
plt.plot([0, 2, 2, 0], [0, 0, 2, 0])
ax.set_yticklabels([])
ax.set_xticklabels([])
plt.text(0, -0.05, '(x, y)', ha='center', va='center')
plt.text(2, 2.05, 'nextCP = (nextX, nextY)', ha='center', va='center')
plt.text(0.5, 0.6, 'r', ha='center', va='center')
plt.text(1, 1.2, 'hyp', ha='center', va='center')
plt.text(1, -0.05, 'triangleX', ha='center', va='center')
plt.text(2.15, 1, 'triangleY', ha='center', va='center')
plt.text(1.35, 1, '(tangentX, tangentY)', ha='center', va='center')
plt.show()

```
<div class="social open-gh-btn my-4">
  <a class="btn btn-github" href="https://github.com/tobiasbriones/blog/tree/main/mathswe/representation/repsymo/2dp/mrm/feat/drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/files/triangle.py" target="_blank">
    <i class="fab fa-github">
      
    </i>
    <strong>
      Open in GitHub
    </strong>
  </a>
</div>