import { cn } from "@/utils/cn";
import { PanelHeader } from "./algorithm-state-panel";
import { Layers3 } from "lucide-react";
import { useMemo } from "react";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";

const MAX_STACK_VISIBLE = 5;

function StackItem() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const steps = useAlgorithmStore((state) => state.steps);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const values = useMemo(() => {
    const nodeLabelMap = new Map(nodes.map((node) => [node.id, node.label]));
    return (steps[currentStepIndex]?.stack ?? []).map((id) => nodeLabelMap.get(id) ?? id);
  }, [currentStepIndex, nodes, steps]);
  const visibleCards = [...values].reverse().slice(0, MAX_STACK_VISIBLE);
  const hiddenCount = Math.max(0, values.length - MAX_STACK_VISIBLE);

  return (
    <section className="overflow-hidden  ">
      <PanelHeader icon={<Layers3 size={14} />} label="Stack" />

      <div className="small-scrollbar max-h-52 space-y-1 overflow-y-auto p-3 border border-(--gl-border) bg-(--gl-bg-base) rounded-md">
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
          <div className="py-8 text-center text-xs italic text-(--gl-text-muted)">Empty stack</div>
        )}
        {hiddenCount > 0 && (
          <p className="text-[11px] font-medium text-(--gl-blue-dark)">+{hiddenCount} more</p>
        )}
      </div>
    </section>
  );
}

export default StackItem;
