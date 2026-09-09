import { cn } from "@/utils/cn";
import { PanelHeader } from "./algorithm-state-panel";
import { Layers3 } from "lucide-react";
import { useMemo } from "react";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";

function StackItem() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const steps = useAlgorithmStore((state) => state.steps);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const values = useMemo(() => {
    const nodeLabelMap = new Map(nodes.map((node) => [node.id, node.label]));
    return (steps[currentStepIndex]?.stack ?? []).map((id) => nodeLabelMap.get(id) ?? id);
  }, [currentStepIndex, nodes, steps]);
  const visibleCards = [...values].reverse();
  const count = values.length;

  return (
    <section className="overflow-hidden  ">
      <PanelHeader icon={<Layers3 size={14} />} label="Stack" />

      <div className=" max-h-52 space-y-1 flex flex-col p-3 border border-(--gl-border) bg-(--gl-bg-base) rounded-md">
        <div className="flex flex-col flex-1 overflow-y-auto small-scrollbar pr-2">
          {visibleCards.length > 0 ? (
            visibleCards.map((value, index) => (
              <div
                key={`${value}-${index}`}
                className={cn(
                  "rounded-md border border-(--gl-border) bg-(--gl-bg-subtle) px-2 py-1.5 text-center text-xs font-medium",
                  index === 0 && "bg-(--gl-blue-dark) text-(--gl-bg-surface)",
                )}
              >
                {value}
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs italic text-(--gl-text-muted)">
              Empty stack
            </div>
          )}
        </div>
        {count > 0 && (
          <p className="text-[11px] font-medium text-(--gl-blue-dark) py-1">{count} items</p>
        )}
      </div>
    </section>
  );
}

export default StackItem;
