# Copyright (c) 2022 Tobias Briones. All rights reserved.
# SPDX-License-Identifier: MIT
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
