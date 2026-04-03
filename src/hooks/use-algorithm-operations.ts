import { useMemo } from "react";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { GraphAlgorithm } from "@/types/algorithm-store";
import { graphService } from "@/services/graph-service";
import { useCallback } from "react";
import { useToast } from "@/components/ui/toast";
import { createGraphUtils } from "@/core/helpers/graph-utils";

export const useAlgorithmOperations = () => {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const setCurrentAlgorithm = useAlgorithmStore((state) => state.setCurrentAlgorithm);
  const setSteps = useAlgorithmStore((state) => state.setSteps);
  const setCurrentStepIndex = useAlgorithmStore((state) => state.setCurrentStepIndex);
  const setStartNodeId = useAlgorithmStore((state) => state.setStartNodeId);
  const setIsAnimating = useAlgorithmStore((state) => state.setIsAnimating);
  const setIsDirected = useGraphDataStore((state) => state.setIsDirected);
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const { showToast } = useToast();
  const graphUtils = useMemo(
    () =>
      createGraphUtils({
        nodes,
        edges,
        isDirected,
      }),
    [nodes, edges, isDirected],
  );

  const handleAlgorithmChange = useCallback((algorithm: GraphAlgorithm) => {
    handleReset();
    setSteps([]);
    setCurrentAlgorithm(algorithm);
  }, []);

  const handleReset = useCallback(() => {
    graphService.resetGraph();

    setCurrentStepIndex(-1);
    setIsAnimating(false);
  }, []);

  const handleStartNodeChange = useCallback(
    (nodeId: string) => {
      const isAloneNode =
        !graphUtils.adjacencyList.get(nodeId) || graphUtils.adjacencyList.get(nodeId)?.length === 0;

      if (isAloneNode && currentAlgorithm === "eulerian-cycle") {
        showToast({
          message: "The selected start node has no outgoing edges. Please select a different node.",
          type: "error",
          duration: 3000,
        });
        return;
      }

      handleReset();
      setStartNodeId(nodeId);
    },
    [currentAlgorithm],
  );

  const handleGraphTypeChange = useCallback((directed: boolean) => {
    handleReset();
    setIsDirected(directed);
  }, []);

  return {
    handleAlgorithmChange,
    handleStartNodeChange,
    handleGraphTypeChange,
    handleReset,
  };
};
