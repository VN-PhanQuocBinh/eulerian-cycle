import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { useEffect } from "react";

export const useAlgorithmSync = () => {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const startNodeId = useAlgorithmStore((state) => state.startNodeId);
  const targetNodeId = useAlgorithmStore((state) => state.targetNodeId);
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const recalculateSteps = useAlgorithmStore((state) => state.recalculateSteps);
  const setStartNodeId = useAlgorithmStore((state) => state.setStartNodeId);
  const setTargetNodeId = useAlgorithmStore((state) => state.setTargetNodeId);
  const isNodeExists = useGraphDataStore((state) => state.isNodeExists);

  useEffect(() => {
    const graphData = { nodes, edges, isDirected };

    if (nodes.length > 0) {
      if (!startNodeId || !isNodeExists(startNodeId)) {
        setStartNodeId(nodes[0].id);
      }

      if (
        ["dfs", "bfs"].includes(currentAlgorithm) &&
        (!targetNodeId || !isNodeExists(targetNodeId))
      ) {
        setTargetNodeId(nodes[0].id);
      }
    } else {
      setStartNodeId(null);
    }

    recalculateSteps(graphData);
  }, [currentAlgorithm, nodes, edges, isDirected, startNodeId, targetNodeId, recalculateSteps]);
};
