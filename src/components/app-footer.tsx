import { ALGORITHM_LEGEND } from "@/constant/algorithm-legend";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { GraphAlgorithm } from "@/types/algorithm-store";
import { ALGORITHM_OPTIONS } from "@/constant/graph-constants";

const ALGORITHM_LABELS: Record<GraphAlgorithm, string> = ALGORITHM_OPTIONS.reduce(
  (acc, { label, value }) => {
    acc[value] = label;
    return acc;
  },
  {} as Record<GraphAlgorithm, string>,
);

function AppFooter() {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const legendItems = ALGORITHM_LEGEND[currentAlgorithm];
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const isWeighted = useGraphDataStore((state) => state.isWeighted);

  return (
    <footer className="flex min-h-10 w-full items-center justify-between overflow-x-auto bg-(--gl-bg-base) px-4 py-2 text-xs text-(--gl-text-muted)">
      <div className="flex gap-3">
        <span className="font-semibold text-(--gl-text-main)">{nodes.length} nodes</span>

        <span className="font-semibold text-(--gl-text-main)">{edges.length} edges</span>

        <span className="font-semibold text-(--gl-text-main)">
          {isDirected ? "Directed" : "Undirected"}
        </span>

        <span className="font-semibold text-(--gl-text-main)">
          {isWeighted ? "Weighted" : "Unweighted"}
        </span>
      </div>

      <div className="flex gap-8 ">
        <span className="shrink-0 font-semibold text-(--gl-text-main)">
          {ALGORITHM_LABELS[currentAlgorithm]}
        </span>

        <div className="flex min-w-0 items-center gap-4">
          {legendItems.map(({ color, label }) => (
            <span key={label} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
