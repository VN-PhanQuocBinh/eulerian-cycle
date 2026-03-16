import { GraphEdge, GraphData } from "@/types/graph-data-store";
import { getAdjacencyList } from "@/core/algorithms/adjacency-list";

export const createGraphUtils = (data: GraphData) => {
  const { nodes, edges, isDirected } = data;
  const nodesMap = new Map(nodes.map((n) => [n.id, n]));
  const edgesMap = new Map(edges.map((e) => [e.id, e]));
  const adj = getAdjacencyList({ nodes, edges, isDirected });
  const reverseAdj: Map<string, string[]> = isDirected
    ? getAdjacencyList({ nodes, edges, isDirected: false })
    : new Map();

  // 1. Hỗ trợ Đa đồ thị: Key trỏ tới mảng các Edges
  const edgeLookup = new Map<string, GraphEdge[]>();

  edges.forEach((e) => {
    // Xử lý lookup cạnh
    const key = `${e.source}-${e.target}`;
    if (!edgeLookup.has(key)) {
      edgeLookup.set(key, []);
    }
    edgeLookup.get(key)!.push(e);
  });

  return {
    getNode: (id: string) => nodesMap.get(id),
    getEdges: (source: string, target: string) => edgeLookup.get(`${source}-${target}`) || [],
    getEdgeById: (id: string) => edgesMap.get(id),
    getNeighbors: (id: string) => adj.get(id) || [],
    allNodeIds: nodes.map((n) => n.id),
    adjacencyList: adj,
    reverseAdjacencyList: reverseAdj,
  };
};
