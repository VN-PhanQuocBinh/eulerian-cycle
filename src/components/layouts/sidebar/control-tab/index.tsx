import { useMemo } from "react";
import {
  RunConfigSelect,
  FileOperation,
  GraphTypeSelect,
} from "@/components/layouts/sidebar/index";
import { GraphAlgorithm } from "@/types/algorithm-store";
import { cn } from "@/utils/cn";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { useAlgorithmOperations } from "@/hooks/use-algorithm-operations";

export const BASE_ANIMATION_SPEED = 2000; // in milliseconds

const ALGORITHM_OPTIONS: { label: string; value: GraphAlgorithm }[] = [
  { label: "Eulerian Cycle", value: "eulerian-cycle" },
  { label: "Connected Components", value: "connected-components" },
];

function ControlTab({ className }: { className?: string }) {
  // Graph store
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const isWeighted = useGraphDataStore((state) => state.isWeighted);
  const nodes = useGraphDataStore((state) => state.nodes);

  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const isAnimating = useAlgorithmStore((state) => state.isAnimating);
  const startNodeId = useAlgorithmStore((state) => state.startNodeId);
  const {
    handleAlgorithmChange,
    handleStartNodeChange,
    handleGraphTypeChange,
    handleWeightedChange,
  } = useAlgorithmOperations();

  const startNodeOptions = useMemo(
    () => nodes.map((node) => ({ label: node.label, value: node.id })),
    [nodes],
  );

  return (
    <aside
      className={cn(
        "w-full h-full bg-(--od-bg-1) border-r border-(--od-border) space-y-4 flex flex-col gap-4 overflow-y-auto text-(--od-fg-1)",
        className,
      )}
    >
      {/* GRAPH TYPE */}
      <GraphTypeSelect
        label="Graph Type"
        text={{
          active: "Directed",
          inactive: "Undirected",
        }}
        isDirected={isDirected}
        isAnimating={isAnimating}
        onSelect={handleGraphTypeChange}
      />

      {/* GRAPH WEIGHT */}
      <GraphTypeSelect
        label="Graph Weight"
        text={{
          active: "Weighted",
          inactive: "Unweighted",
        }}
        isDirected={isWeighted}
        isAnimating={isAnimating}
        onSelect={handleWeightedChange}
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
