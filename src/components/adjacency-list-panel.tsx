import { useGraphStore } from "@/contexts/graph-context";
import { useMemo, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/utils/cn";

interface AdjacencyList {
  [nodeId: string]: string[];
}

const AdjacencyListPanel = () => {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);

  const [isExpanded, setIsExpanded] = useState(false);

  const adjacencyList = useMemo<AdjacencyList>(() => {
    const list: AdjacencyList = {};

    // Initialize all nodes with empty arrays
    nodes.forEach((node) => {
      list[node.id] = [];
    });

    // Build adjacency list based on edges
    edges.forEach((edge) => {
      if (list[edge.source]) {
        list[edge.source].push(edge.target);
      }
    });

    return list;
  }, [nodes, edges]);

  const getDegree = (nodeId: string) => {
    return adjacencyList[nodeId]?.length || 0;
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-slate-200 p-4 max-w-[200px]">
      <div className="flex flex-col items-center justify-between mb-3">
        <button onClick={toggleExpand} className="p-1 rounded hover:bg-slate-100">
          <ChevronUp className={cn("w-4 h-4 text-slate-500", { "rotate-180": isExpanded })} />
        </button>

        <h3 className="font-semibold text-slate-700">Adjacency List</h3>
      </div>

      {nodes.length === 0 ? (
        <p className="text-sm text-slate-400 italic">No nodes in graph</p>
      ) : (
        <div
          className={cn(
            "space-y-2 transition-all duration-300 ease-in-out overflow-y-auto custom-scrollbar pr-1",
            { "max-h-0 overflow-hidden": !isExpanded, "max-h-75": isExpanded },
          )}
        >
          {nodes.map((node) => {
            const neighbors = adjacencyList[node.id] || [];
            const degree = getDegree(node.id);

            return (
              <div key={node.id} className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-700">{node.label}</span>
                  <span className="text-xs text-slate-500">(deg: {degree})</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">→</span>
                  {neighbors.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {neighbors.map((neighborId, idx) => {
                        const neighborNode = nodes.find((n) => n.id === neighborId);
                        return (
                          <span
                            key={`${neighborId}-${idx}`}
                            className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                          >
                            {neighborNode?.label || neighborId}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-xs">No neighbors</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdjacencyListPanel;
