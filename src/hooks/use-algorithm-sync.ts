import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { useEffect } from "react";
import { hasTargetNode } from "@/types/check-type";
import { ALGORITHMS_WITH_TARGET_NODE } from "@/types/algorithm-store";

export const useAlgorithmSync = () => {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const algorithmParams = useAlgorithmStore((state) => state.algorithmParams);
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const setAlgorithmParams = useAlgorithmStore((state) => state.setAlgorithmParams);
  const recalculateSteps = useAlgorithmStore((state) => state.recalculateSteps);
  const isNodeExists = useGraphDataStore((state) => state.isNodeExists);

  useEffect(() => {
    const graphData = { nodes, edges, isDirected };
    const { startNodeId } = algorithmParams[currentAlgorithm] || {};

    if (nodes.length > 0) {
      if (!startNodeId || !isNodeExists(startNodeId)) {
        setAlgorithmParams(currentAlgorithm, {
          startNodeId: nodes[0].id,
        });
      }

      if (hasTargetNode(currentAlgorithm)) {
        const { targetNodeId } = algorithmParams[currentAlgorithm] || {};

        if (
          ALGORITHMS_WITH_TARGET_NODE.includes(currentAlgorithm) &&
          (!targetNodeId || !isNodeExists(targetNodeId))
        ) {
          setAlgorithmParams(currentAlgorithm, {
            targetNodeId: nodes[0].id,
          });
        }
      }
    } else if (startNodeId !== "") {
      // Prevent unnecessary updates when startNodeId is already an empty string
      setAlgorithmParams(currentAlgorithm, {
        startNodeId: "",
      });
    }

    recalculateSteps(graphData);
  }, [currentAlgorithm, nodes, edges, isDirected, algorithmParams, recalculateSteps]);
};
