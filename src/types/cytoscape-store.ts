import type cytoscape from "cytoscape";

export interface CytoscapeStore {
  cyInstance: cytoscape.Core | null;
  ehInstance: any | null;

  setCyInstance: (instance: cytoscape.Core | null) => void;
  setEhInstance: (instance: any) => void;
}
