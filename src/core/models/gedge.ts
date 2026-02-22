import { GraphElement } from "./graph-element";

export class GEdge extends GraphElement {
  source: string;
  target: string;

  constructor(cyInstance: cytoscape.Core, isDirected: boolean, source: string, target: string) {
    super(cyInstance, isDirected);
    this.source = source;
    this.target = target;
  }

  highlight(classes: string[] = []) {
    if (!this.cy) return;

    let processingEdges = this.cy.edges(`[source="${this.source}"][target="${this.target}"]`);
    if (processingEdges.length === 0 && !this.isDirected) {
      processingEdges = this.cy.edges(`[source="${this.target}"][target="${this.source}"]`);
    }

    const highlightedEdge = Array.from(processingEdges).find(
      (edge) => !edge.classes().includes(classes.join(" ")),
    );

    if (highlightedEdge) {
      highlightedEdge.addClass(classes);
    }
  }
}
