import { GraphAlgorithm } from "@/types/algorithm-store";

export const DEFAULT_EDGE_WEIGHT = 1;

export const ALGORITHM_OPTIONS: Array<{ label: string; value: GraphAlgorithm }> = [
  { label: "Eulerian Cycle", value: "eulerian-cycle" },
  { label: "Connected Components", value: "connected-components" },
  { label: "Depth-First Search (DFS)", value: "dfs" },
  { label: "Breadth-First Search (BFS)", value: "bfs" },
  { label: "Dijkstra's Algorithm", value: "dijkstra" },
];
