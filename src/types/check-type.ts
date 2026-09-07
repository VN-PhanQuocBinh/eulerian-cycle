import {
  ALGORITHMS_WITH_TARGET_NODE,
  ALGORITHMS_REQUIRING_WEIGHTED_GRAPH,
  GraphAlgorithm,
  AlgorithmWithTarget,
  AlgorithmRequiresWeightedGraph,
} from "@/types/algorithm-store";

export const hasTargetNode = (algorithm: GraphAlgorithm): algorithm is AlgorithmWithTarget =>
  ALGORITHMS_WITH_TARGET_NODE.includes(algorithm as AlgorithmWithTarget);

export const isAlgorithmRequiresWeightedGraph = (
  algorithm: GraphAlgorithm,
): algorithm is AlgorithmRequiresWeightedGraph =>
  ALGORITHMS_REQUIRING_WEIGHTED_GRAPH.includes(algorithm as AlgorithmRequiresWeightedGraph);
