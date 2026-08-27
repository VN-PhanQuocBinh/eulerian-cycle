import { DfsResult, ConnectedComponentsResult, EulerianCycleResult } from "@/core/types/algorithm";
import { GraphData } from "./graph-data-store";

export type GraphAlgorithm = "eulerian-cycle" | "connected-components" | "dfs" | "bfs";
export type RunMode = "step-by-step" | "continuous";

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
  label?: string;
};

export type Step = {
  elements: Array<(StepNodeElement | StepEdgeElement) & { classes: string[] }>;
  message: string[];
  stack?: string[];
  queue?: string[];
  circuit?: string[];
  visited?: Set<string>;

  currentNode?: StepNodeElement & { classes: string[] };

  // scc
  dsc?: Map<string, number>;
  lowLink?: Map<string, number>;

  // Will set required after add pseudo code for connected components algorithm
  highlightedPseudoCodeLineIds?: Array<number | Array<number>>;
};

export type AlgorithmExecutionResult =
  | DfsResult
  | ConnectedComponentsResult
  | EulerianCycleResult;

export interface AlgorithmStore {
  // Algorithm state
  currentAlgorithm: GraphAlgorithm;
  steps: Step[];
  isAnimating: boolean;
  currentStepIndex: number;
  speed: number;
  startNodeId: string | null;
  targetNodeId: string | null;

  executionResult: AlgorithmExecutionResult | null;

  // Actions
  setIsAnimating: (isAnimating: boolean) => void;
  setCurrentStepIndex: (index: number) => void;
  setSpeed: (speed: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  jumpToStep: (index: number) => void;

  // Helpers
  highlightNode: (nodeId: string, className: string[], pulse?: boolean) => void;
  highlightEdge: (sourceId: string, targetId: string, className: string[]) => void;

  // Algorithm state operations
  setCurrentAlgorithm: (algorithm: GraphAlgorithm) => void;
  setSteps: (steps: Step[]) => void;
  setStartNodeId: (startNodeId: string | null) => void;
  setTargetNodeId: (targetNodeId: string | null) => void;
  setExecutionResult: (result: AlgorithmExecutionResult) => void;

  // Algorithm implementations

  findSCCs: (data: GraphData, startNodeId: string) => ConnectedComponentsResult;

  findConnectedComponents: (data: GraphData, startNodeId: string) => ConnectedComponentsResult;

  findEulerianCycle: (data: GraphData, startNodeId: string) => EulerianCycleResult;

  recalculateSteps(data: GraphData): void;
}
