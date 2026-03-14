export type GraphAlgorithm = "eulerian-cycle" | "connected-components";

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

type GenericStepType = Array<StepNodeElement | StepEdgeElement> | StepNodeElement | StepEdgeElement;

export type CurrentStep<T extends GenericStepType = StepNodeElement | StepEdgeElement> = {
  elements: Array<T & { classes: string[] }>;
  message: string[];
  stack?: string[];
  queue?: string[];
  circuit?: string[];
  visited?: Set<string>;

  // scc
  dsc?: Map<string, number>;
  lowLink?: Map<string, number>;

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

export interface AlgorithmStore {
  // Algorithm state
  currentAlgorithm: GraphAlgorithm | null;
  steps: StoredStep[];
  isAnimating: boolean;
  currentStepIndex: number;
  speed: number;

  // Actions
  setIsAnimating: (isAnimating: boolean) => void;
  setCurrentStepIndex: (index: number) => void;
  setSpeed: (speed: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateUItoStep: (targetStepIndex: number) => void;

  // Helpers
  highlightNode: (nodeId: string, className: string[], pulse?: boolean) => void;
  highlightEdge: (sourceId: string, targetId: string, className: string[]) => void;

  // Algorithm state operations
  setCurrentAlgorithm: (algorithm: GraphAlgorithm | null) => void;
  setSteps: (steps: StoredStep[]) => void;

  // Algorithm implementations
  getAdjacencyList: () => Map<string, string[]>;

  findSCCs: () => {
    components: string[][];
    steps: StoredStep[];
    message: string;
  };

  findConnectedComponents: (startNodeId: string) => {
    components: string[][];
    steps: StoredStep[];
    message: string;
  };

  findEulerianCycle: (startNodeId?: string) => {
    cycle: string[] | null;
    steps: StoredStep[];
    message?: string;
  };
}
