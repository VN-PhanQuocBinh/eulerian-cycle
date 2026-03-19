import { useMemo, useRef } from "react";
import { Layers3, ListOrdered } from "lucide-react";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { useUIStore } from "@/stores";

const MAX_STACK_VISIBLE = 5;

function StackDeck({ values }: { values: string[] }) {
  const visibleCards = useMemo(() => values.reverse(), [values]);
  const hiddenCount = Math.max(0, values.length - MAX_STACK_VISIBLE);

  return (
    <div className="min-w-[200px] max-w-[200px] rounded-lg border border-(--od-border) bg-(--od-bg-2) p-1 px-3 py-2 shadow-md">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-(--od-fg-1)">
        <Layers3 size={14} />
        <span>Stack</span>
        <span className="flex-1 text-right text-(--od-fg-2)">{values.length} items</span>
      </div>

      <div className="relative h-[200px]">
        <div className="small-scrollbar h-full space-y-1 overflow-y-auto py-2 pr-1">
          {visibleCards.length > 0 ? (
            visibleCards.map((value, index) => {
              return (
                <div
                  key={String(value) + "-" + String(index)}
                  className="left-0 right-0 origin-top rounded-md border border-(--od-border-strong) bg-(--od-bg-2) px-2 py-1.5 shadow-sm"
                >
                  <span className="block truncate text-center text-xs font-medium text-(--od-purple)">
                    {value}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="grid h-full place-items-center text-xs italic text-(--od-fg-2)">
              Empty stack
            </div>
          )}
        </div>
      </div>

      {hiddenCount > 0 && (
        <p className="text-[11px] font-medium text-(--od-purple)">+{hiddenCount} more</p>
      )}
    </div>
  );
}

function QueueRail({ values }: { values: string[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!railRef.current) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    railRef.current.scrollLeft += event.deltaY;
    event.preventDefault();
  };

  return (
    <div className="min-w-[200px] max-w-[360px] rounded-lg border border-(--od-border) bg-(--od-bg-2) p-1 px-3 py-2 shadow-md">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-(--od-fg-1)">
        <ListOrdered size={14} />
        <span>Queue</span>
        <span className="flex-1 text-right text-(--od-fg-2)">{values.length} items</span>
      </div>

      <div
        ref={railRef}
        onWheel={handleWheel}
        className="overflow-x-auto overflow-y-hidden whitespace-nowrap px-2 py-1"
      >
        {values.length > 0 ? (
          <div className="inline-flex min-w-max items-center gap-1.5">
            {values.map((value, index) => {
              return (
                <span
                  key={String(value) + "-" + String(index)}
                  className={
                    index === 0
                      ? "rounded-sm border border-(--od-green) bg-(--od-green) px-2.5 py-1 text-xs font-semibold text-(--primary-foreground)"
                      : "rounded-sm border border-(--od-border-strong) bg-(--od-bg-2) px-2.5 py-1 text-xs font-medium text-(--od-fg-1)"
                  }
                >
                  {value}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="py-1 text-xs italic text-(--od-fg-2)">Empty queue</div>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between text-[10px] uppercase tracking-wide text-(--od-fg-2)">
        <span>Front</span>
        <span>Rear</span>
      </div>
    </div>
  );
}

function FloatingStackQueuePanel() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const steps = useAlgorithmStore((state) => state.steps);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const showStack = useUIStore((state) => state.showStack);
  const showQueue = useUIStore((state) => state.showQueue);

  const nodeLabelMap = useMemo(() => {
    return new Map(nodes.map((node) => [node.id, node.label]));
  }, [nodes]);

  const currentStep =
    currentStepIndex >= 0 && currentStepIndex < steps.length ? steps[currentStepIndex] : undefined;

  const stackValues = (currentStep?.stack ?? []).map((nodeId) => {
    return nodeLabelMap.get(nodeId) ?? nodeId;
  });

  const queueValues = (currentStep?.queue ?? []).map((nodeId) => {
    return nodeLabelMap.get(nodeId) ?? nodeId;
  });

  return (
    <div className="absolute bottom-4 right-4 z-20 flex max-w-[min(96vw,640px)] flex-col items-end space-y-2">
      {showStack && <StackDeck values={stackValues} />}
      {showQueue && <QueueRail values={queueValues} />}
    </div>
  );
}

export default FloatingStackQueuePanel;
