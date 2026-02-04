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

export type StepAction = "visit" | "explore" | "component-complete" | "deactivate";

export type Step =
  | {
      elementId: string;
      elementType: "node";
      action: StepAction;
      class: string;
      message: string;
    }
  | {
      sourceElement: string;
      targetElement: string;
      elementType: "edge";
      action: StepAction;
      class: string;
      message: string;
    };

export type RunMode = "step-by-step" | "continuous";

export interface GraphState {
  // State
  mode: GraphMode;
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected: boolean;
  cyInstance: cytoscape.Core | null;
  ehInstance: any | null;

  // Algorithm results
  connectedComponents: string[][];
  steps: Step[];

  // Animation state
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

  // Algorithm implementations
  findConnectedComponents: () => {
    components: string[][];
    steps: Step[];
  };
  findEulerianPath: () => string[] | null;
  findEulerianCycle: () => string[] | null;

  // Algorithm operations
  getAdjacencyList: () => Map<string, Set<string>>;

  // Helpers
  highlightNode: (nodeId: string, className: string, pulse?: boolean) => void;
  highlightEdge: (sourceId: string, targetId: string, className: string) => void;
  clearHighlights: () => void;
}
