import { useMemo, useState, useEffect } from "react";
import { GripVertical } from "lucide-react";
import { useAlgorithmStore, useUIStore } from "@/stores";
import { Sortable, SortableItem, SortableItemHandle } from "@/components/reui/sortable";
import DijkstraDistanceItem from "./dijkstra/dijkstra-distance";
import StackItem from "./stack-item";
import QueueItem from "./queue-item";
import { cn } from "@/utils/cn";
import { GraphAlgorithm } from "@/types/algorithm-store";

type StateItemId = `${GraphAlgorithm}-${number}` | "stack" | "queue";
type StateItemComponent = { id: StateItemId; label: string; component: React.ReactNode };

const AlgorithmStateComponents: Record<GraphAlgorithm, StateItemComponent[]> = {
  dijkstra: [
    { id: "dijkstra-1", label: "Distance / previous", component: <DijkstraDistanceItem /> },
  ],
  bfs: [],
  dfs: [],
  "eulerian-cycle": [],
  "connected-components": [],
};

function AlgorithmStatePanel() {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const showStack = useUIStore((state) => state.showStack);
  const showQueue = useUIStore((state) => state.showQueue);
  const [itemOrder, setItemOrder] = useState<StateItemId[]>(["stack", "queue"]);

  useEffect(() => {
    const availableIds: Set<StateItemId> = new Set([
      "stack",
      "queue",
      ...AlgorithmStateComponents[currentAlgorithm].map((item) => item.id),
    ]);

    setItemOrder(Array.from(availableIds));
  }, [currentAlgorithm]);

  const items = useMemo<StateItemComponent[]>(() => {
    const available: StateItemComponent[] = [];
    if (showStack)
      available.push({
        id: "stack",
        label: "Stack",
        component: <StackItem />,
      });
    if (showQueue)
      available.push({
        id: "queue",
        label: "Queue",
        component: <QueueItem />,
      });

    available.push(...AlgorithmStateComponents[currentAlgorithm]);

    const availableIds = new Set(available.map((item) => item.id));

    return itemOrder
      .map((id) => available.find((item) => item.id === id))
      .filter((item): item is StateItemComponent => Boolean(item && availableIds.has(item.id)));
  }, [currentAlgorithm, itemOrder, showQueue, showStack]);

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
            {item.component}
          </SortableItem>
        ))}
      </Sortable>
    </div>
  );
}

export function PanelHeader({
  icon,
  label,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 p-2 text-xs font-semibold text-(--gl-text-main)",
        className,
      )}
    >
      {icon}
      <span>{label}</span>

      <SortableItemHandle className="ml-auto p-0.5 text-(--gl-text-muted) hover:text-(--gl-text-main)">
        <GripVertical size={14} aria-label={`Reorder ${label}`} />
      </SortableItemHandle>
    </div>
  );
}

export default AlgorithmStatePanel;
