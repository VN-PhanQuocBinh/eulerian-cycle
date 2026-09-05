import { useMemo } from "react";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { DijkstraStepsTable } from "./dijkstra-steps-table";

export function DijkstraResult({ steps }: { steps: Step[] }) {
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const currentStep = steps[currentStepIndex] ?? steps[steps.length - 1];

  if (steps.length === 0) {
    return (
      <div className="grid h-full place-items-center text-sm text-(--od-fg-2)">
        No steps to display. Run the algorithm first.
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4 bg-(--od-bg-0) text-(--od-fg-1)">
      <div className="min-w-0 flex-1 max-h-full overflow-y-auto rounded-md border border-(--od-border) bg-(--od-bg-1) custom-scrollbar">
        <DijkstraStepsTable steps={steps} />
      </div>
      <div className="top-0 w-72 basis-[280px] overflow-y-auto rounded-md border border-(--od-border) bg-(--od-bg-1) p-3 custom-scrollbar">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-(--od-fg-2)">
          distance / previous
        </div>
        <DistanceTable distances={currentStep?.distances} previousNodes={currentStep?.previousNodes} />
      </div>
    </div>
  );
}

function DistanceTable({
  distances,
  previousNodes,
}: {
  distances?: Map<string, number>;
  previousNodes?: Map<string, string | null>;
}) {
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const graphUtils = useMemo(
    () => createGraphUtils({ nodes, edges, isDirected }),
    [nodes, edges, isDirected],
  );

  if (!distances || distances.size === 0) {
    return <span className="text-xs italic text-(--od-fg-2)">-</span>;
  }

  return (
    <div className="space-y-1">
      <div className="flex border-b border-(--od-border) pb-1 text-xs font-medium text-(--od-fg-2)">
        <span className="flex-1">Node</span>
        <span className="w-16 text-center">Distance</span>
        <span className="w-20 text-center">Previous</span>
      </div>
      {nodes.map((node) => {
        const distance = distances.get(node.id);
        const previousNode = previousNodes?.get(node.id);
        const previousLabel = previousNode
          ? graphUtils.getNode(previousNode)?.label || previousNode
          : "-";

        return (
          <div
            key={node.id}
            className="flex items-center rounded px-1 py-1 text-xs transition-colors hover:bg-(--od-bg-2)"
          >
            <span className="flex-1 truncate text-(--od-fg-0)" title={node.label}>
              {node.label}
            </span>
            <span className="w-16 text-center font-mono text-(--od-blue)">
              {distance === undefined || distance === Infinity ? "-" : distance}
            </span>
            <span className="w-20 truncate text-center font-mono text-(--od-purple)" title={previousLabel}>
              {previousLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}