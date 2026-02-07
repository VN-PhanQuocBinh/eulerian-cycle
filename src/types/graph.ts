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

export type StepAction =
  | "visit"
  | "explore"
  | "component-complete"
  | "deactivate"
  | "traverse"
  | "add-to-circuit";

export type BaseStep = {
  elementType: "node" | "edge";
  action: StepAction;
  classes: string[];
  message: string;
  stack?: string[];
  circuit?: string[];
};

export type NodeStep = BaseStep & {
  elementType: "node";
  elementId: string;
};

export type EdgeStep = BaseStep & {
  elementType: "edge";
  sourceElement: string;
  targetElement: string;
};

export type CurrentStep = NodeStep | EdgeStep;
export type PrevStep = Pick<CurrentStep, "classes" | "stack" | "circuit">;

export interface Step {
  prev: PrevStep;
  current: CurrentStep;
}

export type RunMode = "step-by-step" | "continuous";

export interface ConnectedComponentsResult {
  components: string[][];
  steps: Step[];
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected: boolean;
}

export interface GraphState {
  // State
  mode: GraphMode;
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected: boolean;
  cyInstance: cytoscape.Core | null;
  ehInstance: any | null;
  graphData: GraphData;

  // Actions
  setMode: (mode: GraphMode) => void;
  setIsDirected: (isDirected: boolean) => void;
  setCyInstance: (instance: cytoscape.Core | null) => void;
  setEhInstance: (instance: any) => void;
  getCurrentNodesData: () => GraphNode[];
  getCurrentEdgesData: () => GraphEdge[];

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
  drawGraphFromData: (data: GraphData) => void;

  saveGraph: () => Promise<string>;
  loadGraph: () => Promise<string>;

  // Algorithm implementations
  findConnectedComponents: () => {
    components: string[][];
    steps: Step[];
  };
  checkEulerianCycle: () => { exists: boolean; reason?: string };
  findEulerianCycle: () => { cycle: string[] | null; steps: Step[]; message?: string };

  // Algorithm operations
  getAdjacencyList: () => Map<string, string[]>;

  // Helpers
  highlightNode: (nodeId: string, className: string[], pulse?: boolean) => void;
  highlightEdge: (sourceId: string, targetId: string, className: string[]) => void;
}
