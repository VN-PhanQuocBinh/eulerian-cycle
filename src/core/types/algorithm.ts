import { Step } from "@/types/algorithm-store";

export interface AlgorithmResult<T extends any> {
  result: T;
  steps: Step[];
  message: string;
}
