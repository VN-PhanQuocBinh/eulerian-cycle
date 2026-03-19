import { useMemo } from "react";
import {
  RunConfigSelect,
  FileOperation,
  GraphTypeSelect,
} from "@/components/layouts/sidebar/index";
import { GraphAlgorithm } from "@/types/algorithm-store";
import { cn } from "@/utils/cn";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { graphService } from "@/services/graph-service";

export const BASE_ANIMATION_SPEED = 2000; // in milliseconds

const ALGORITHM_OPTIONS: { label: string; value: GraphAlgorithm }[] = [
  { label: "Eulerian Cycle", value: "eulerian-cycle" },
  { label: "Connected Components", value: "connected-components" },
];

function ControlTab({ className }: { className?: string }) {
  // Graph store
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const nodes = useGraphDataStore((state) => state.nodes);
  const setIsDirected = useGraphDataStore((state) => state.setIsDirected);

  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const isAnimating = useAlgorithmStore((state) => state.isAnimating);
  const startNodeId = useAlgorithmStore((state) => state.startNodeId);
  const setIsAnimating = useAlgorithmStore((state) => state.setIsAnimating);
  const setCurrentAlgorithm = useAlgorithmStore((state) => state.setCurrentAlgorithm);
  const setStartNodeId = useAlgorithmStore((state) => state.setStartNodeId);
  const setCurrentStepIndex = useAlgorithmStore((state) => state.setCurrentStepIndex);
  const setSteps = useAlgorithmStore((state) => state.setSteps);

  const startNodeOptions = useMemo(
    () => nodes.map((node) => ({ label: node.label, value: node.id })),
    [nodes],
  );

  const handleAlgorithmChange = (algorithm: GraphAlgorithm) => {
    handleReset();
    setSteps([]);
    setCurrentAlgorithm(algorithm);
  };

  const handleReset = () => {
    graphService.resetGraph();

    setCurrentStepIndex(-1);
    setIsAnimating(false);
  };

  const handleStartNodeChange = (nodeId: string) => {
    handleReset();
    setStartNodeId(nodeId);
  };

  const handleGraphTypeChange = (directed: boolean) => {
    handleReset();
    setIsDirected(directed);
  };

  return (
    <aside
      className={cn(
        "w-full h-full bg-(--od-bg-0) border-r border-(--od-border) space-y-4 flex flex-col gap-4 overflow-y-auto text-(--od-fg-1)",
        className,
      )}
    >
      {/* GRAPH TYPE */}
      <GraphTypeSelect
        isDirected={isDirected}
        isAnimating={isAnimating}
        onSelect={handleGraphTypeChange}
      />

      {/* ALGORITHM SELECTION */}
      <RunConfigSelect<GraphAlgorithm>
        title="Algorithm"
        options={ALGORITHM_OPTIONS}
        currentValue={currentAlgorithm || "eulerian-cycle"}
        isAnimating={isAnimating}
        onSelect={handleAlgorithmChange}
      />

      <RunConfigSelect
        title="Starting Node"
        options={startNodeOptions}
        currentValue={startNodeId || ""}
        isAnimating={isAnimating}
        onSelect={handleStartNodeChange}
      />

      {/* FILE OPERATIONS */}
      <FileOperation disabled={isAnimating} />
    </aside>
  );
}

export default ControlTab;
