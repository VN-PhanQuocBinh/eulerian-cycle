import { GraphData } from "./graph-data-store";
export type GraphMode = "view" | "add-node" | "add-edge" | "delete";

export interface UIStore {
  // State
  mode: GraphMode;

  // Actions
  setMode: (mode: GraphMode) => void;

  // Graph operations
  clearGraph: () => void;
  autoLayout: () => void;
}
