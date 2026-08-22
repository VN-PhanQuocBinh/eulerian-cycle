

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
  label?: string;
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
  nodeSet: Set<string>; // For quick node existence checks
  nodeById: Map<string, GraphNode>;
  edgeById: Map<string, GraphEdge>;

  // Actions
  setIsDirected: (isDirected: boolean) => void;
  getCurrentNodesData: () => GraphNode[];
  getCurrentEdgesData: () => GraphEdge[];
  getCurrentGraphData: () => GraphData;
  getEdgeDataById: (edgeId: string) => GraphEdge | undefined;
  getNodeDataById: (nodeId: string) => GraphNode | undefined;

  // Bulk updates
  updateNodes: (nodes: GraphNode[]) => void;
  updateEdges: (edges: GraphEdge[]) => void;
  updateGraphData: (graphData: GraphData) => void;

  // Node operations
  addNode: (node: GraphNode) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<Pick<GraphNode, "label">>) => void;
  isNodeExists: (nodeId: string) => boolean;

  // Edge operations
  addEdge: (edge: GraphEdge) => void;
  removeEdge: (edgeId: string) => void;

  clearGraphData: () => void;
}
