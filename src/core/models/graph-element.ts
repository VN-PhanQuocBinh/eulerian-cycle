import cytoscape from "cytoscape";

export abstract class GraphElement {
  cy: cytoscape.Core;
  isDirected: boolean;

  constructor(cyInstance: cytoscape.Core, isDirected: boolean = false) {
    this.cy = cyInstance;
    this.isDirected = isDirected;
  }

  abstract highlight(classes?: string[]): void;
}
