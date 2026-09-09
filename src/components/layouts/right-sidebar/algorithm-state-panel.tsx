import { useMemo, useState, useEffect } from "react";
import { GripVertical } from "lucide-react";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { Sortable, SortableItem, SortableItemHandle } from "@/components/reui/sortable";
import DijkstraDistanceItem from "./dijkstra/dijkstra-distance";
import StackItem from "./stack-item";
import QueueItem from "./queue-item";
import VisitedItem from "./visited-item";
import DiscLowLinkItem from "./disc-low-link-item";
import CircuitItem from "./circuit-item";
import { cn } from "@/utils/cn";
import { GraphAlgorithm } from "@/types/algorithm-store";

type StateItemId = `${GraphAlgorithm}-${number}`;
type StateItemComponent = { id: StateItemId; label: string; component: React.ReactNode };

const STATE_ITEM_LABELS: Record<string, string> = {
  STACK: "Stack",
  QUEUE: "Queue",
  VISITED: "Visited",
  DISC_LOW_LINK: "Disc / Low Link",
  DISTANCE_PREVIOUS: "Distance / Previous",
  CIRCUIT: "Circuit",
};

const AlgorithmStateComponents: Record<GraphAlgorithm, StateItemComponent[]> = {
  dijkstra: [
    { id: "dijkstra-1", label: "Distance / previous", component: <DijkstraDistanceItem /> },
  ],
  bfs: [
    {
      id: "bfs-1",
      label: STATE_ITEM_LABELS.VISITED,
      component: <VisitedItem />,
    },
    {
      id: "bfs-2",
      label: STATE_ITEM_LABELS.QUEUE,
      component: <QueueItem />,
    },
  ],
  dfs: [
    {
      id: "dfs-1",
      label: STATE_ITEM_LABELS.VISITED,
      component: <VisitedItem />,
    },
    {
      id: "dfs-2",
      label: STATE_ITEM_LABELS.STACK,
      component: <StackItem />,
    },
  ],
  "eulerian-cycle": [
    {
      id: "eulerian-cycle-1",
      label: STATE_ITEM_LABELS.CIRCUIT,
      component: <CircuitItem />,
    },
    {
      id: "eulerian-cycle-2",
      label: STATE_ITEM_LABELS.STACK,
      component: <StackItem />,
    },
  ],
  "connected-components": [
    {
      id: "connected-components-1",
      label: STATE_ITEM_LABELS.VISITED,
      component: <VisitedItem />,
    },
    {
      id: "connected-components-2",
      label: STATE_ITEM_LABELS.DISC_LOW_LINK,
      component: <DiscLowLinkItem />,
    },
    {
      id: "connected-components-3",
      label: STATE_ITEM_LABELS.STACK,
      component: <StackItem />,
    },
    {
      id: "connected-components-4",
      label: STATE_ITEM_LABELS.QUEUE,
      component: <QueueItem />,
    },
  ],
};

function AlgorithmStatePanel() {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const [itemOrder, setItemOrder] = useState<StateItemId[]>([]);

  useEffect(() => {
    const availableIds: Set<StateItemId> = new Set([
      ...AlgorithmStateComponents[currentAlgorithm].map((item) => item.id),
    ]);

    setItemOrder(Array.from(availableIds));
  }, [currentAlgorithm]);

  const items = useMemo<StateItemComponent[]>(() => {
    const available: StateItemComponent[] = [];

    AlgorithmStateComponents[currentAlgorithm].forEach((item) => {
      if (currentAlgorithm === "connected-components" && isDirected) {
        if ([STATE_ITEM_LABELS.DISC_LOW_LINK, STATE_ITEM_LABELS.STACK].includes(item.label)) {
          available.push(item);
        }
      } else {
        if (![STATE_ITEM_LABELS.DISC_LOW_LINK, STATE_ITEM_LABELS.STACK].includes(item.label)) {
          available.push(item);
        }
      }
    });

    const availableIds = new Set(available.map((item) => item.id));

    return itemOrder
      .map((id) => available.find((item) => item.id === id))
      .filter((item): item is StateItemComponent => Boolean(item && availableIds.has(item.id)));
  }, [currentAlgorithm, itemOrder, isDirected]);

  return (
    <div className="h-full min-h-0 overflow-y-auto small-scrollbar p-1 custom-scrollbar">
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
