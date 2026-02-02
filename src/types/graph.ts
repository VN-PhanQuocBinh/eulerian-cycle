import type cytoscape from "cytoscape";
import type { ToastHandler } from "@/components/ui/toast";

// Types
export type GraphMode = "view" | "add-node" | "add-edge" | "delete";
export type GraphAlgorithm = "eulerian-cycle" | "connected-components";

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: `e-${string}-${string}`;
  source: string;
  target: string;
}

export interface Step {
  elementId: string;
  elementType: "node" | "edge";
  action: "visit" | "explore" | "component-complete" | "deactivate";
  message: string;
}

export interface GraphState {
  // State
  mode: GraphMode;
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected: boolean;
  cyInstance: cytoscape.Core | null;
  ehInstance: any | null;
  currentAlgorithm: GraphAlgorithm;

  // Algorithm results
  connectedComponents: string[][];
  steps: Step[];

  // Animation state
  isAnimating: boolean;
  stepDuration: number;
  animationSteps: {
    type: "visit" | "explore" | "component-complete";
    nodeId?: string;
    edgeId?: string;
    componentIndex?: number;
  }[];
  currentStep: number;
  highlightedNodes: string[];
  highlightedEdges: string[];

  // Actions
  setMode: (mode: GraphMode) => void;
  setIsDirected: (isDirected: boolean) => void;
  setCyInstance: (instance: cytoscape.Core | null) => void;
  setEhInstance: (instance: any) => void;

  // Toast handler
  toastHandler: ToastHandler;
  setToastHandler: (handler: ToastHandler) => void;

  // Bulk updates
  updateNodes: (nodes: GraphNode[]) => void;
  updateEdges: (edges: GraphEdge[]) => void;

  // Node operations
  addNode: (node: GraphNode) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<Pick<GraphNode, "label">>) => void;

  // Edge operations
  addEdge: (edge: GraphEdge) => void;
  removeEdge: (edgeId: string) => void;

  // Graph operations
  clearGraph: () => void;
  resetGraph: () => void;

  saveGraph: () => Promise<string>;
  loadGraph: () => Promise<string>;

  // Euler algorithm
  findEulerianPath: () => string[] | null;
  findEulerianCycle: () => string[] | null;

  // Algorithm operations
  getAdjacencyList: () => Map<string, Set<string>>;
  setAlgorithm: (algorithm: GraphAlgorithm) => void;
  runAlgorithm: (speed?: number) => void;

  // Helpers
  highlightNode: (nodeId: string, color: string, pulse?: boolean) => void;
  highlightEdge: (sourceId: string, targetId: string, color: string) => void;
  clearHighlights: () => void;
  delay: (ms: number) => Promise<void>;

  // Algorithm implementations
  findConnectedComponents: () => string[][];
}
