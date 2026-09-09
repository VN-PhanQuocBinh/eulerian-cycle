import { Route } from "lucide-react";
import { useMemo } from "react";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import GraphElement from "../bottom-panel/graph-element";
import { PanelHeader } from "./algorithm-state-panel";

function CircuitItem() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const steps = useAlgorithmStore((state) => state.steps);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const circuit = useMemo(() => {
    const nodeLabelMap = new Map(nodes.map((node) => [node.id, node.label]));
    return (steps[currentStepIndex]?.circuit ?? []).map((id) => ({
      id,
      label: nodeLabelMap.get(id) ?? id,
    }));
  }, [currentStepIndex, nodes, steps]);

  return (
    <section className="overflow-hidden">
      <PanelHeader icon={<Route size={14} />} label="Circuit" />
      <div className="rounded-md border border-(--gl-border) bg-(--gl-bg-base) p-3">
        {circuit.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {circuit.map((node, index) => (
              <span key={`${node.id}-${index}`} className="flex items-center gap-1.5">
                <GraphElement
                  label={node.label}
                  className="bg-(--gl-amber-soft) text-(--gl-amber-dark)"
                />
                {index < circuit.length - 1 && (
                  <span className="text-xs text-(--gl-text-muted)">-&gt;</span>
                )}
              </span>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-xs italic text-(--gl-text-muted)">
            Empty circuit
          </div>
        )}
      </div>
    </section>
  );
}

export default CircuitItem;