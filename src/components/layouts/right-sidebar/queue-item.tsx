import { useRef } from "react";
import { cn } from "@/utils/cn";
import { PanelHeader } from "./algorithm-state-panel";
import { ListOrdered } from "lucide-react";
import { useMemo } from "react";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";

function QueueItem() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const steps = useAlgorithmStore((state) => state.steps);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const values = useMemo(() => {
    const nodeLabelMap = new Map(nodes.map((node) => [node.id, node.label]));
    return (steps[currentStepIndex]?.queue ?? []).map((id) => nodeLabelMap.get(id) ?? id);
  }, [currentStepIndex, nodes, steps]);
  const railRef = useRef<HTMLDivElement>(null);
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!railRef.current || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    railRef.current.scrollLeft += event.deltaY;
    event.preventDefault();
  };

  return (
    <section className="overflow-hidden rounded-md  ">
      <PanelHeader icon={<ListOrdered size={14} />} label="Queue" />
      <div className="bg-(--gl-bg-base) border border-(--gl-border) rounded-md">
        <div ref={railRef} onWheel={handleWheel} className="overflow-x-auto px-3 py-3 ">
          {values.length > 0 ? (
            <div className="flex min-w-max items-center gap-1.5">
              {values.map((value, index) => (
                <span
                  key={`${value}-${index}`}
                  className={cn(
                    "rounded-sm border border-(--gl-border) bg-(--gl-bg-subtle) px-2.5 py-1 text-xs font-medium text-(--gl-text-main)",
                    index === 0 &&
                      "border-(--gl-green-dark) bg-(--gl-green-dark) text-(--gl-bg-surface) font-semibold",
                  )}
                >
                  {value}
                </span>
              ))}
            </div>
          ) : (
            <div className="py-6 text-xs italic text-(--gl-text-muted) text-center">
              Empty queue
            </div>
          )}
        </div>
        <div className="flex justify-between px-3 pb-2 text-[10px] uppercase tracking-wide text-(--gl-text-muted)">
          <span>Front</span>
          <span>{values.length > 0 ? values[values.length - 1] : "None"} Items</span>
          <span>Rear</span>
        </div>
      </div>
    </section>
  );
}

export default QueueItem;
