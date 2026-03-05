import type cytoscape from "cytoscape";
import type { ToastHandler } from "@/components/ui/toast";
import { GNode } from "@/core/models/gnode";
import { GEdge } from "@/core/models/gedge";

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

export type StepNodeElement = {
  type: "node";
  id: string;
  label: string;
};

export type StepEdgeElement = {
  type: "edge";
  id: string;
  source: StepNodeElement;
  target: StepNodeElement;
};

// This type is used for the current step's element,
// which can be either a node or an edge,
// and can be either a StepNodeElement/StepEdgeElement (from stored steps) or a GNode/GEdge (from rendered steps).
type GenericStepType =
  | Array<StepNodeElement | StepEdgeElement>
  | StepNodeElement
  | StepEdgeElement
  | GEdge
  | GNode;

export type CurrentStep<T extends GenericStepType = StepNodeElement | StepEdgeElement> = {
  elements: Array<T & { classes: string[] }>;
  action: StepAction;
  message: string[];
  stack?: GraphNode[];
  circuit?: GraphNode[];
  visited?: Set<string>;

  // Will set required after add pseudo code for connected components algorithm
  highlightedPseudoCodeLineIds?: Array<number | Array<number>>;
};
export type PrevStep = Pick<CurrentStep, "stack" | "circuit" | "elements">;

interface Step<T extends GenericStepType = StepNodeElement | StepEdgeElement> {
  prev: PrevStep;
  current: CurrentStep<T>;
}

// export type StoredStep = Step<StepNodeElement | StepEdgeElement>;
export type StoredStep = Step<StepNodeElement | StepEdgeElement>;
export type RenderedStep = Step<GNode | GEdge>;

export type RunMode = "step-by-step" | "continuous";

export interface ConnectedComponentsResult {
  components: string[][];
  steps: StoredStep[];
  message: string;
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

  // Algorithm state
  currentAlgorithm: GraphAlgorithm | null;
  steps: StoredStep[];
  isAnimating: boolean;
  currentStepIndex: number;
  speed: number;

  // Actions
  setMode: (mode: GraphMode) => void;
  setIsDirected: (isDirected: boolean) => void;
  setCyInstance: (instance: cytoscape.Core | null) => void;
  setEhInstance: (instance: any) => void;
  getCurrentNodesData: () => GraphNode[];
  getCurrentEdgesData: () => GraphEdge[];

  setIsAnimating: (isAnimating: boolean) => void;
  setCurrentStepIndex: (index: number) => void;
  setSpeed: (speed: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Algorithm state operations
  setCurrentAlgorithm: (algorithm: GraphAlgorithm | null) => void;
  setSteps: (steps: StoredStep[]) => void;

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
  autoLayout: () => void;

  saveGraph: () => Promise<string>;
  loadGraph: () => Promise<string>;
  saveImage: () => Promise<string>;

  // Algorithm implementations
  findConnectedComponents: (startNodeId?: string) => {
    components: string[][];
    steps: StoredStep[];
    message: string;
  };
  checkEulerianCycle: () => { exists: boolean; reason?: string };
  findEulerianCycle: (startNodeId?: string) => {
    cycle: string[] | null;
    steps: Step[];
    message?: string;
  };

  // Algorithm operations
  getAdjacencyList: () => Map<string, GraphNode[]>;

  // Helpers
  highlightNode: (nodeId: string, className: string[], pulse?: boolean) => void;
  highlightEdge: (sourceId: string, targetId: string, className: string[]) => void;
}
