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
      <div className="grid h-full place-items-center text-sm text-(--gl-text-muted)">
        No steps to display. Run the algorithm first.
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4 bg-(--gl-bg-base) text-(--gl-text-main)">
      <div className="min-w-0 flex-1 max-h-full overflow-y-auto rounded-md border border-(--gl-border) bg-(--gl-bg-surface) custom-scrollbar">
        <DijkstraStepsTable steps={steps} />
      </div>
      <div className="top-0 w-72 basis-[280px] overflow-y-auto rounded-md border border-(--gl-border) bg-(--gl-bg-surface) p-3 custom-scrollbar">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-(--gl-text-muted)">
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
    return <span className="text-xs italic text-(--gl-text-muted)">-</span>;
  }

  return (
    <div className="space-y-1">
      <div className="flex border-b border-(--gl-border) pb-1 text-xs font-medium text-(--gl-text-muted)">
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
            className="flex items-center rounded px-1 py-1 text-xs transition-colors hover:bg-(--gl-bg-subtle)"
          >
            <span className="flex-1 truncate text-(--gl-text-main)" title={node.label}>
              {node.label}
            </span>
            <span className="w-16 text-center font-mono text-(--gl-blue-dark)">
              {distance === undefined || distance === Infinity ? "-" : distance}
            </span>
            <span className="w-20 truncate text-center font-mono text-(--gl-blue-dark)" title={previousLabel}>
              {previousLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}