export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected: boolean;
}
export interface GraphDataStore {
  // State
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected: boolean;
  graphData: GraphData;

  // Actions
  setIsDirected: (isDirected: boolean) => void;
  getCurrentNodesData: () => GraphNode[];
  getCurrentEdgesData: () => GraphEdge[];
  getCurrentGraphData: () => GraphData;

  // Bulk updates
  updateNodes: (nodes: GraphNode[]) => void;
  updateEdges: (edges: GraphEdge[]) => void;
  updateGraphData: (graphData: GraphData) => void;

  // Node operations
  addNode: (node: GraphNode) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<Pick<GraphNode, "label">>) => void;

  // Edge operations
  addEdge: (edge: GraphEdge) => void;
  removeEdge: (edgeId: string) => void;

  clearGraphData: () => void;
}
