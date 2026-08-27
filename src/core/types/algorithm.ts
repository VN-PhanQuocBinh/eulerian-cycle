import { Step } from "@/types/algorithm-store";

export interface AlgorithmResult<T extends any> {
  result: T;
  steps: Step[];
  message: string;
}

export type DfsResult = AlgorithmResult<{
  startNodeId: string;
  targetNodeId: string;
  path: string[];
  found: boolean;
}>;

export type ConnectedComponentsResult = AlgorithmResult<{
  components: string[][];
}>;

export type EulerianCycleResult = AlgorithmResult<{
  cycle: string[];
  found: boolean;
}>;
