import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { GraphAlgorithm } from "@/types/algorithm-store";
import { graphService } from "@/services/graph-service";
import { useCallback } from "react";

export const useAlgorithmOperations = () => {
  const setCurrentAlgorithm = useAlgorithmStore((state) => state.setCurrentAlgorithm);
  const setSteps = useAlgorithmStore((state) => state.setSteps);
  const setCurrentStepIndex = useAlgorithmStore((state) => state.setCurrentStepIndex);
  const setStartNodeId = useAlgorithmStore((state) => state.setStartNodeId);
  const setIsAnimating = useAlgorithmStore((state) => state.setIsAnimating);
  const setIsDirected = useGraphDataStore((state) => state.setIsDirected);

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

  const handleStartNodeChange = useCallback((nodeId: string) => {
    handleReset();
    setStartNodeId(nodeId);
  }, []);

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
