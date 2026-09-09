import { useMemo, useState } from "react";
import { GripVertical } from "lucide-react";
import { useAlgorithmStore, useGraphDataStore, useUIStore } from "@/stores";
import { Sortable, SortableItem, SortableItemHandle } from "@/components/reui/sortable";
import DijkstraDistanceItem from "./dijkstra/dijkstra-distance";
import StackItem from "./stack-item";
import QueueItem from "./queue-item";

type StateItemId = "stack" | "queue" | "dijkstra-distance";
type StateItem = { id: StateItemId; label: string; content: React.ReactNode };

export function PanelHeader({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-1.5 border-b border-(--gl-border) px-3 py-2 text-xs font-semibold text-(--gl-text-main)">
      {icon}
      <span>{label}</span>
      {count !== undefined && <span className="ml-auto text-(--gl-text-muted)">{count} items</span>}
      <SortableItemHandle className="ml-auto p-0.5 text-(--gl-text-muted) hover:text-(--gl-text-main)">
        <GripVertical size={14} aria-label={`Reorder ${label}`} />
      </SortableItemHandle>
    </div>
  );
}

function AlgorithmStatePanel() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const steps = useAlgorithmStore((state) => state.steps);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const showStack = useUIStore((state) => state.showStack);
  const showQueue = useUIStore((state) => state.showQueue);
  const [itemOrder, setItemOrder] = useState<StateItemId[]>([
    "stack",
    "queue",
    "dijkstra-distance",
  ]);
  const nodeLabelMap = useMemo(() => new Map(nodes.map((node) => [node.id, node.label])), [nodes]);
  const currentStep = steps[currentStepIndex];
  const stackValues = (currentStep?.stack ?? []).map((id) => nodeLabelMap.get(id) ?? id);
  const queueValues = (currentStep?.queue ?? []).map((id) => nodeLabelMap.get(id) ?? id);

  const items = useMemo<StateItem[]>(() => {
    const available: StateItem[] = [];
    if (showStack)
      available.push({ id: "stack", label: "Stack", content: <StackItem values={stackValues} /> });
    if (showQueue)
      available.push({ id: "queue", label: "Queue", content: <QueueItem values={queueValues} /> });
    if (currentAlgorithm === "dijkstra" && steps.length > 0)
      available.push({
        id: "dijkstra-distance",
        label: "Distance / previous",
        content: <DijkstraDistanceItem />,
      });
    const availableIds = new Set(available.map((item) => item.id));
    return itemOrder
      .map((id) => available.find((item) => item.id === id))
      .filter((item): item is StateItem => Boolean(item && availableIds.has(item.id)));
  }, [currentAlgorithm, itemOrder, queueValues, showQueue, showStack, stackValues, steps.length]);

  if (items.length === 0)
    return (
      <div className="grid h-full place-items-center p-6 text-center text-sm text-(--gl-text-muted)">
        Run an algorithm to view its state.
      </div>
    );

  return (
    <div className="h-full min-h-0 overflow-y-auto p-1 custom-scrollbar">
      <Sortable
        value={items}
        onValueChange={(nextItems) => setItemOrder(nextItems.map((item) => item.id))}
        getItemValue={(item) => item.id}
        className="space-y-2"
      >
        {items.map((item) => (
          <SortableItem key={item.id} value={item.id}>
            {item.content}
          </SortableItem>
        ))}
      </Sortable>
    </div>
  );
}

export default AlgorithmStatePanel;
