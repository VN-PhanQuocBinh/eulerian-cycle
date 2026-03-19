import { useMemo } from "react";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { SCCStepsTable } from "./scc-steps-table";
import { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";

export function SCCResult({ steps }: { steps: Step[] }) {
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
        <SCCStepsTable steps={steps} />
      </div>

      <div className="top-0 w-56 basis-[220px] overflow-y-auto rounded-md border border-(--od-border) bg-(--od-bg-1) p-3 custom-scrollbar">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-(--od-fg-2)">
          disc / low-link
        </div>
        <DiscLowLinkTable disc={currentStep?.dsc} lowLink={currentStep?.lowLink} />
      </div>
    </div>
  );
}

function DiscLowLinkTable({
  disc,
  lowLink,
}: {
  disc?: Map<string, number>;
  lowLink?: Map<string, number>;
}) {
  const edges = useGraphDataStore((state) => state.edges);
  const nodes = useGraphDataStore((state) => state.nodes);
  const isDirected = useGraphDataStore((state) => state.isDirected);

  const graphUtils = useMemo(() => {
    return createGraphUtils({
      nodes,
      edges,
      isDirected,
    });
  }, [nodes, edges, isDirected]);

  if (!disc || disc.size === 0) {
    return <span className="text-xs italic text-(--od-fg-2)">—</span>;
  }

  return (
    <div className="space-y-1">
      <div className="flex border-b border-(--od-border) pb-1 text-xs font-medium text-(--od-fg-2)">
        <span className="flex-1">Node</span>
        <span className="w-10 text-center">disc</span>
        <span className="w-10 text-center">low</span>
      </div>

      {Array.from(disc.entries()).map(([nodeId, discValue]) => {
        const lowValue = lowLink?.get(nodeId);
        return (
          <div
            key={nodeId}
            className="flex items-center rounded px-1 py-1 text-xs transition-colors hover:bg-(--od-bg-2)"
          >
            <span className="flex-1 truncate text-(--od-fg-0)">
              {graphUtils.getNode(nodeId)?.label || nodeId}
            </span>
            <span className="w-10 text-center font-mono text-(--od-blue)">
              {discValue === -1 ? "—" : discValue}
            </span>
            <span className="w-10 text-center font-mono text-(--od-purple)">
              {lowValue === -1 || lowValue === undefined ? "—" : lowValue}
            </span>
          </div>
        );
      })}
    </div>
  );
}
