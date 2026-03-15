import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { SCCStepsTable } from "./scc";
import { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { useMemo } from "react";
import { shallow } from "zustand/shallow";

export function SCCResult({ steps }: { steps: Step[] }) {
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const currentStep = steps[currentStepIndex] ?? steps[steps.length - 1];

  if (steps.length === 0) {
    return <div>...</div>;
  }

  return (
    <div className="flex gap-4 h-full ">
      {/* Left: Steps table */}
      <div className="flex-1 max-h-full overflow-y-auto custom-scrollbar">
        <SCCStepsTable steps={steps} />
      </div>

      {/* Right: disc/lowLink panel */}
      <div className="top-0 w-56 basis-[200px] border-l p-3 overflow-y-auto custom-scrollbar">
        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">disc / low-link</div>
        <DiscLowLinkTable disc={currentStep?.dsc} lowLink={currentStep?.lowLink} />
      </div>
    </div>
  );
}

// Sub-component hiển thị Map<nodeId, number>
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
    return <span className="text-xs text-gray-400 italic">—</span>;
  }

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex text-xs font-medium text-gray-400 pb-1 border-b">
        <span className="flex-1">Node</span>
        <span className="w-10 text-center">disc</span>
        <span className="w-10 text-center">low</span>
      </div>
      {Array.from(disc.entries()).map(([nodeId, discValue]) => (
        <div key={nodeId} className="flex text-xs items-center">
          <span className="flex-1 text-gray-700">
            {graphUtils.getNode(nodeId)?.label || nodeId}
          </span>
          <span className="w-10 text-center font-mono text-blue-600">
            {discValue === -1 ? "—" : discValue}
          </span>
          <span className="w-10 text-center font-mono text-indigo-600">
            {lowLink?.get(nodeId) === -1 ? "—" : lowLink?.get(nodeId)}
          </span>
        </div>
      ))}
    </div>
  );
}
