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
  traversalOrder: string[];
  found: boolean;
}>;

export type BfsResult = AlgorithmResult<{
  startNodeId: string;
  targetNodeId: string;
  path: string[];
  traversalOrder: string[];
  found: boolean;
}>;

export type ConnectedComponentsResult = AlgorithmResult<{
  components: string[][];
}>;

export type EulerianCycleResult = AlgorithmResult<{
  cycle: string[];
  found: boolean;
}>;

export type DijkstraResult = AlgorithmResult<{
  startNodeId: string;
  targetNodeId?: string;
  shortestPath?: string[];
  shortestDistance?: number;
  distances: Map<string, number>;
  previousNodes: Map<string, string | null>;
  found: boolean;
}>;
