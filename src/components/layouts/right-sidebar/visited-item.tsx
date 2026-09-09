import { ListChecks } from "lucide-react";
import { useMemo } from "react";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import GraphElement from "../bottom-panel/graph-element";
import { PanelHeader } from "./algorithm-state-panel";

function VisitedItem() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const steps = useAlgorithmStore((state) => state.steps);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);

  const visited = useMemo(() => {
    const nodeLabelMap = new Map(nodes.map((node) => [node.id, node.label]));
    return Array.from(steps[currentStepIndex]?.visited ?? []).map((id) => ({
      id,
      label: nodeLabelMap.get(id) ?? id,
    }));
  }, [currentStepIndex, nodes, steps]);

  return (
    <section className="overflow-hidden">
      <PanelHeader icon={<ListChecks size={14} />} label="Visited" />
      <div className="rounded-md border border-(--gl-border) bg-(--gl-bg-base) p-3">
        {visited.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {visited.map((node) => (
              <GraphElement key={node.id} label={node.label} />
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-xs italic text-(--gl-text-muted)">
            No nodes visited
          </div>
        )}
        <p className="mt-2 text-[11px] font-medium text-(--gl-text-muted)">
          {visited.length} nodes
        </p>
      </div>
    </section>
  );
}

export default VisitedItem;
