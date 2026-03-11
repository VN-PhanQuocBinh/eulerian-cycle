import { GraphElement } from "./graph-element";

export class GNode extends GraphElement {
  id: string;
  label: string;

  constructor(cyInstance: cytoscape.Core, isDirected: boolean, id: string, label: string) {
    super(cyInstance, isDirected);
    this.id = id;
    this.label = label;
  }

  highlight(classes: string[] = []) {
    if (!this.cy) return;

    const node = this.cy.getElementById(this.id);
    if (node.length === 0) return;

    node[0].addClass("highlighted");
    classes.forEach((cls) => node.addClass(cls));

    // Pulse animation
    node[0].animate({
      style: { width: 50, height: 50 },
      duration: 200,
      complete: () => {
        node[0].animate({
          style: { width: 40, height: 40 },
          duration: 200,
        });
      },
    });
  }
}
