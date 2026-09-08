import { ALGORITHM_GRAPH_COLORS } from "@/configs/graph";
import { GraphAlgorithm } from "@/types/algorithm-store";

export interface AlgorithmLegendItem {
  color: string;
  label: string;
}

export const ALGORITHM_LEGEND: Record<GraphAlgorithm, AlgorithmLegendItem[]> = {
  "eulerian-cycle": [
    { color: ALGORITHM_GRAPH_COLORS["eulerian-cycle"].exploring, label: "Exploring" },
    { color: ALGORITHM_GRAPH_COLORS["eulerian-cycle"].inCycle, label: "In Cycle" },
  ],
  "connected-components": [
    { color: ALGORITHM_GRAPH_COLORS["connected-components"].visiting, label: "Visiting" },
    { color: ALGORITHM_GRAPH_COLORS["connected-components"].inStack, label: "In Stack" },
    {
      color: ALGORITHM_GRAPH_COLORS["connected-components"].processingNeighbor,
      label: "Processing Neighbor",
    },
  ],
  dfs: [
    { color: ALGORITHM_GRAPH_COLORS.dfs.processingNeighbor, label: "Processing Neighbor" },
    { color: ALGORITHM_GRAPH_COLORS.dfs.visitingNeighbor, label: "Visiting Neighbor" },
    { color: ALGORITHM_GRAPH_COLORS.dfs.inPath, label: "In Path" },
  ],
  bfs: [
    { color: ALGORITHM_GRAPH_COLORS.bfs.processingNeighbor, label: "Processing Neighbor" },
    { color: ALGORITHM_GRAPH_COLORS.bfs.visitingNeighbor, label: "Visiting Neighbor" },
    { color: ALGORITHM_GRAPH_COLORS.bfs.inPath, label: "In Path" },
  ],
  dijkstra: [
    { color: ALGORITHM_GRAPH_COLORS.dijkstra.considering, label: "Considering" },
    { color: ALGORITHM_GRAPH_COLORS.dijkstra.relaxed, label: "Relaxed" },
    { color: ALGORITHM_GRAPH_COLORS.dijkstra.visited, label: "Visited" },
    { color: ALGORITHM_GRAPH_COLORS.dijkstra.shortestPath, label: "Shortest Path" },
  ],
};
