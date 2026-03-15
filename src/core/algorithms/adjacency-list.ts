import { GraphData } from "@/types/graph-data-store";

export const getAdjacencyList = (data: GraphData): Map<string, string[]> => {
  const { nodes, edges, isDirected } = data;
  const adjacencyList: Map<string, string[]> = new Map();

  // Initialize adjacency list
  nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
  });

  // Populate adjacency list
  edges.forEach((edge) => {
    const sourceAdj = adjacencyList.get(edge.source);
    if (sourceAdj) {
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (targetNode) {
        sourceAdj.push(targetNode.id);
      }
    } else {
      alert("Error: Source node not found in adjacency list");
    }

    // If undirected, add reverse edge
    if (!isDirected) {
      const targetAdj = adjacencyList.get(edge.target);
      if (targetAdj) {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        if (sourceNode) {
          targetAdj.push(sourceNode.id);
        }
      } else {
        alert("Error: Target node not found in adjacency list");
      }
    }
  });

  return adjacencyList;
};
