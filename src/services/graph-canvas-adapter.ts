import cytoscape from "cytoscape";
import type { EdgeHandlesInstance, EdgeHandlesOptions } from "cytoscape-edgehandles";

import { graphStyles } from "@/configs/graph";
import { generateEdgeId } from "@/utils/generate-id";
import { applyNewClasses } from "@/utils/apply-new-classes";
import type { GraphEdge, GraphNode } from "@/types/graph-data-store";

type Position = { x: number; y: number };

export interface GraphCanvasCallbacks {
  onNodeAdd: (params: { renderedPosition: Position; position: Position }) => void;
  onNodeUpdate: (params: { id: string; position: Position }) => void;
  onEdgeAdd: (edge: GraphEdge) => void;
}

export class GraphCanvasAdapter {
  public cy: cytoscape.Core | null = null;
  private eh: EdgeHandlesInstance | null = null;

  init(container: HTMLDivElement) {
    const graphInstance = cytoscape({
      container,
      style: graphStyles,
      elements: [],
      layout: { name: "preset" },
      userZoomingEnabled: true,
      userPanningEnabled: true,
    });

    const defaults: EdgeHandlesOptions = {
      canConnect() {
        return true;
      },
      edgeParams(sourceNode, targetNode): cytoscape.ElementDefinition {
        const uniqueId = generateEdgeId(sourceNode.id(), targetNode.id());
        return {
          data: {
            id: uniqueId,
            source: sourceNode.id(),
            target: targetNode.id(),
          },
        };
      },
      hoverDelay: 150,
      snap: true,
      snapThreshold: 50,
      snapFrequency: 15,
      noEdgeEventsInDraw: true,
      disableBrowserGestures: true,
    };

    this.cy = graphInstance;
    this.eh = graphInstance.edgehandles(defaults);

    return {
      cy: this.cy,
      eh: this.eh,
    };
  }

  destroy() {
    this.cy?.destroy();
    this.cy = null;
    this.eh = null;
  }

  bindEvents(callbacks: GraphCanvasCallbacks) {
    if (!this.cy) return;

    this.cy.on("dblclick", (event) => {
      if (event.target === this.cy) {
        callbacks.onNodeAdd({
          renderedPosition: {
            x: event.renderedPosition.x,
            y: event.renderedPosition.y,
          },
          position: {
            x: event.position.x,
            y: event.position.y,
          },
        });
      }
    });

    this.cy.on("dblclick", "node", (event) => {
      const node = event.target;
      const nodeElement = this.cy!.getElementById(node.id());
      const position = nodeElement.renderedPosition();

      callbacks.onNodeUpdate({
        id: node.id(),
        position: { x: position.x, y: position.y },
      });
    });

    this.cy.on(
      "ehcomplete",
      (_event: cytoscape.EventObject, sourceNode: cytoscape.NodeSingular, targetNode: cytoscape.NodeSingular, addedEdge: cytoscape.EdgeSingular) => {
        callbacks.onEdgeAdd({
          id: addedEdge.id(),
          source: sourceNode.id(),
          target: targetNode.id(),
        });
      },
    );
  }

  toggleDrawMode(enable: boolean) {
    if (!this.eh) return;
    if (enable) this.eh.enableDrawMode();
    else this.eh.disableDrawMode();
  }

  addNodeToCy(node: GraphNode) {
    if (!this.cy) return;

    this.cy.add({
      group: "nodes",
      data: { id: node.id, label: node.label },
      position: { x: node.x, y: node.y },
    });
  }

  updateNodeInCy(node: Partial<GraphNode> & { id: string }) {
    if (!this.cy || !node.label) return;

    const nodeInCy = this.cy.getElementById(node.id);
    if (nodeInCy) {
      nodeInCy.data({ ...nodeInCy.data(), label: node.label });
    }
  }

  removeSelectedElements() {
    if (!this.cy) return { nodeIds: [], edgeIds: [] };

    const selectedElements = this.cy.$(":selected");
    const nodeIds = selectedElements.nodes().map((node) => node.id());
    const edgeIds = selectedElements.edges().map((edge) => edge.id());

    selectedElements.remove();
    return { nodeIds, edgeIds };
  }

  clearCanvas() {
    if (!this.cy) return;
    this.cy.elements().remove();
  }

  drawGraphFromData(graphData: { nodes: GraphNode[]; edges: GraphEdge[]; isDirected: boolean }) {
    if (!this.cy) return;

    const { nodes, edges } = graphData;
    this.clearCanvas();

    nodes.forEach((node) => {
      this.cy?.add({
        group: "nodes",
        data: { id: node.id, label: node.label },
        position: { x: node.x, y: node.y },
      });
    });

    edges.forEach((edge) => {
      this.cy?.add({
        group: "edges",
        data: edge,
      });
    });
  }

  getGraphSnapshot() {
    if (!this.cy) return { nodes: [], edges: [], isDirected: false };

    const nodes: GraphNode[] = this.cy.nodes().map((node) => ({
      id: node.id(),
      label: node.data("label"),
      x: node.renderedPosition().x,
      y: node.renderedPosition().y,
    }));

    const edges: GraphEdge[] = this.cy.edges().map((edge) => ({
      id: edge.id(),
      source: edge.source().id(),
      target: edge.target().id(),
    }));

    return {
      nodes,
      edges,
      isDirected: this.cy.edges().some((edge) => edge.data("isDirected")),
    };
  }

  getPNG() {
    if (!this.cy) return "";
    return this.cy.png({ full: true, bg: "white" });
  }

  toggleDirected(isDirected: boolean) {
    if (!this.cy) return;
    this.cy.edges().data("isDirected", isDirected);
  }

  applyStylesFromMap(styles: Map<string, Set<string>>) {
    if (!this.cy) return;

    this.cy.batch(() => {
      this.cy!.elements().classes("");

      for (const [elementId, classes] of styles.entries()) {
        const element = this.cy!.getElementById(elementId);
        if (element.length > 0) {
          const appliedClasses = applyNewClasses("", Array.from(classes).join(" "));
          element.classes(appliedClasses);
        }
      }
    });
  }

  applyLabelsToEdges(labels: Map<string, string>) {
    if (!this.cy) return;

    for (const [edgeId, label] of labels.entries()) {
      const edge = this.cy.getElementById(edgeId);
      edge.data("label", label);
    }
  }

  clearLabelsFromEdges({ edgeIds = [], all = false }: { edgeIds?: string[]; all?: boolean }) {
    if (!this.cy) return;

    if (all) {
      this.cy.edges().data("label", "");
      return;
    }

    edgeIds.forEach((edgeId) => {
      const edge = this.cy!.getElementById(edgeId);
      edge.data("label", "");
    });
  }

  highlightElement(elementId: string, className: string[], pulse = false) {
    if (!this.cy) return;

    const element = this.cy.getElementById(elementId);
    const addClasses: string[] = [];
    const removeClasses: string[] = [];

    if (element.length === 0) {
      console.warn(`Element with ID ${elementId} not found for highlighting.`);
      return;
    }

    className.forEach((classString) => {
      if (classString.startsWith("-")) {
        removeClasses.push(classString.substring(1));
      } else {
        addClasses.push(classString);
      }
    });

    const currentClasses = element.classes();
    const appliedClasses = currentClasses.filter((cls) => !removeClasses.includes(cls)).concat(addClasses);

    element.classes(appliedClasses.join(" "));

    if (pulse) {
      element.animate({
        style: { width: 50, height: 50 },
        duration: 200,
        complete: () => {
          element.animate({
            style: { width: 40, height: 40 },
            duration: 200,
          });
        },
      });
    }
  }

  zoomGraph(type: "in" | "out") {
    if (!this.cy) return;

    const factor = type === "in" ? 1.2 : 1 / 1.2;
    this.cy.zoom({
      level: this.cy.zoom() * factor,
      renderedPosition: {
        x: this.cy.width() / 2,
        y: this.cy.height() / 2,
      },
    });
  }

  resetGraph() {
    if (!this.cy) return;

    this.cy.batch(() => {
      this.cy!.elements().classes("");
      this.cy!.elements().unselect();
      this.cy!.edges().data("label", "");
      this.cy!.animate({
        fit: {
          eles: this.cy!.elements(),
          padding: 100,
        },
        duration: 500,
        easing: "ease-in-out-cubic",
      });
    });
  }
}
