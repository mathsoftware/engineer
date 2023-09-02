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
