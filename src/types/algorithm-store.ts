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

export type AlgorithmExecutionResult = DfsResult | ConnectedComponentsResult | EulerianCycleResult;

export interface AlgorithmParamsMap {
  "eulerian-cycle": {
    startNodeId: string;
  };
  "connected-components": {
    startNodeId: string;
  };
  dfs: {
    startNodeId: string;
    targetNodeId: string;
  };
  bfs: {
    startNodeId: string;
    targetNodeId: string;
  };
}

// This type assertion ensures that the keys of AlgorithmParamsMap are exactly the same as the values of GraphAlgorithm. If there is any mismatch, TypeScript will throw an error, helping to maintain consistency between the two types.
type AssertKeysEqual = [GraphAlgorithm] extends [keyof AlgorithmParamsMap]
  ? [keyof AlgorithmParamsMap] extends [GraphAlgorithm]
    ? true
    : "Lỗi: AlgorithmParamsMap chứa key không thuộc GraphAlgorithm"
  : "Lỗi: AlgorithmParamsMap thiếu một số key từ GraphAlgorithm";

// If the assertion fails, TypeScript will show an error message indicating which keys are missing or extra. This helps maintain consistency between the two types.
const _assertion: AssertKeysEqual = true;

export interface AlgorithmStore {
  // Algorithm state
  currentAlgorithm: GraphAlgorithm;
  steps: Step[];
  isAnimating: boolean;
  currentStepIndex: number;
  speed: number;
  startNodeId: string | null;
  targetNodeId: string | null;
  algorithmParams: AlgorithmParamsMap;

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
  setAlgorithmParams: <T extends GraphAlgorithm>(
    algo: T,
    params: Partial<AlgorithmParamsMap[T]>,
  ) => void;
  setExecutionResult: (result: AlgorithmExecutionResult) => void;

  // Algorithm implementations

  findSCCs: (data: GraphData, startNodeId: string) => ConnectedComponentsResult;

  findConnectedComponents: (data: GraphData, startNodeId: string) => ConnectedComponentsResult;

  findEulerianCycle: (data: GraphData, startNodeId: string) => EulerianCycleResult;

  recalculateSteps(data: GraphData): void;
}
