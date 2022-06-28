// Copyright (c) 2022 Tobias Briones. All rights reserved.
// SPDX-License-Identifier: MIT
// This file is part of https://github.com/tobiasbriones/mathsoftware.engineer
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
