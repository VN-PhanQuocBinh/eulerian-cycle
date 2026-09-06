import {
  ALGORITHMS_WITH_TARGET_NODE,
  GraphAlgorithm,
  AlgorithmWithTarget,
} from "@/types/algorithm-store";

export const hasTargetNode = (algorithm: GraphAlgorithm): algorithm is AlgorithmWithTarget =>
  ALGORITHMS_WITH_TARGET_NODE.includes(algorithm as AlgorithmWithTarget);
