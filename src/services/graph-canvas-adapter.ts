import cytoscape from "cytoscape";
import type { EdgeHandlesInstance, EdgeHandlesOptions } from "cytoscape-edgehandles";

import { graphStyles } from "@/configs/graph";
import { generateEdgeId } from "@/utils/generate-id";
import { applyNewClasses } from "@/utils/apply-new-classes";
import type { GraphData, GraphEdge, GraphNode } from "@/types/graph-data-store";
import {
  GraphEdgeSnapshot,
  GraphNodeSnapshot,
  Position,
  NodePositionChange,
} from "@/types/command";
import { UpdateEdgePayload, UpdateNodePayload } from "@/types/service";

export interface GraphCanvasCallbacks {
  onNodeAdd: (params: { renderedPosition: Position; position: Position }) => void;
  onNodeUpdate: (params: UpdateNodePayload) => void;
  onEdgeAdd: (edge: GraphEdge) => void;
  onNodePositionChange: (params: NodePositionChange[]) => void;
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
        x: position.x,
        y: position.y,
      });
    });

    this.cy.on(
      "ehcomplete",
      (
        _event: cytoscape.EventObject,
        sourceNode: cytoscape.NodeSingular,
        targetNode: cytoscape.NodeSingular,
        addedEdge: cytoscape.EdgeSingular,
      ) => {
        // Remove the edge drawn by eh and trigger the callback to handle edge addition
        this.cy!.remove(addedEdge);
        callbacks.onEdgeAdd({
          id: addedEdge.id(),
          source: sourceNode.id(),
          target: targetNode.id(),
        });
      },
    );

    {
      const initialPositions = new Map<string, Position>();
      const pendingChangedNodes = new Map<string, Position>();
      let timeoutId: NodeJS.Timeout | null = null;

      // Store the initial positions of all selected nodes when a node is grabbed
      this.cy.on("grab", "node", (_e) => {
        if (!this.cy) return;

        // Store the initial positions of all selected nodes when a node is grabbed
        initialPositions.clear();

        // Get all selected nodes and store their initial positions
        let nodes = this.cy.$(":selected");

        // If no nodes are selected, store the position of the grabbed node
        if (nodes.length === 0) {
          const grabbedNode = this.cy.getElementById(_e.target.id());
          nodes = nodes.add(grabbedNode);
        }

        nodes.forEach((node) => {
          initialPositions.set(node.id(), { x: node.position().x, y: node.position().y });
        });
      });

      this.cy.on("dragfree", "node", (event) => {
        if (!this.cy) return;

        const movedNode = event.target;
        const oldPosition = initialPositions.get(movedNode.id());

        if (!oldPosition) return;

        const newPosition = { x: movedNode.position().x, y: movedNode.position().y };

        // If the position has changed, trigger the callback
        if (oldPosition.x !== newPosition.x || oldPosition.y !== newPosition.y) {
          pendingChangedNodes.set(movedNode.id(), newPosition);
        }

        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
          if (pendingChangedNodes.size > 0) {
            const changesData = Array.from(pendingChangedNodes.entries()).map(
              ([nodeId, position]) => ({
                id: nodeId,
                position: {
                  old: initialPositions.get(nodeId) || { x: 0, y: 0 },
                  new: position,
                },
              }),
            );

            callbacks.onNodePositionChange(changesData);
          }

          initialPositions.clear();
          pendingChangedNodes.clear();
        }, 0);
      });
    }
  }

  toggleDrawMode(enable: boolean) {
    if (!this.eh) return;
    if (enable) this.eh.enableDrawMode();
    else this.eh.disableDrawMode();
  }

  addNodesToCy(nodes: GraphNodeSnapshot[]) {
    if (!this.cy) return;

    this.cy.batch(() => {
      nodes.forEach((node) => {
        const { data, style, classes } = node;

        this.cy?.add({
          group: "nodes",
          data: { id: data.id, label: data.label },
          position: { x: data.x, y: data.y },
          style: style || {},
          classes: classes?.join(" ") || "",
        });
      });
    });
  }

  addEdgesToCy(edges: GraphEdgeSnapshot[]) {
    if (!this.cy) return;

    this.cy.batch(() => {
      edges.forEach((edge) => {
        const { data, style, classes } = edge;

        this.cy?.add({
          group: "edges",
          data: {
            id: data.id,
            source: data.source,
            target: data.target,
            label: data.label,
          },
          style: style || {},
          classes: classes?.join(" ") || "",
        });
      });
    });
  }

  updateNodesInCy(nodes: UpdateNodePayload[]) {
    if (!this.cy) return;

    this.cy.batch(() => {
      nodes.forEach((node) => {
        const nodeInCy = this.cy!.getElementById(node.id);

        if (!nodeInCy) {
          throw new Error(`Node with ID ${node.id} not found in Cytoscape instance.`);
        }

        if (node.label !== undefined) {
          nodeInCy.data({ ...nodeInCy.data(), label: node.label });
        }

        if (node.x && node.y) {
          nodeInCy.position({
            x: node.x,
            y: node.y,
          });
        }
      });
    });
  }

  updateEdgesInCy(edges: UpdateEdgePayload[]) {
    if (!this.cy) return;

    this.cy.batch(() => {
      edges.forEach((edge) => {
        const edgeInCy = this.cy!.getElementById(edge.id);

        if (!edgeInCy) {
          throw new Error(`Edge with ID ${edge.id} not found in Cytoscape instance.`);
        }

        edgeInCy.data({ ...edgeInCy.data(), ...edge });
      });
    });
  }

  removeElementById(elementId: string) {
    if (!this.cy) return;

    const element = this.cy.getElementById(elementId);
    if (element) {
      element.remove();
    }
  }

  removeElementsByIds(elementIds: string[]) {
    if (!this.cy) return;

    this.cy.batch(() => {
      elementIds.forEach((id) => {
        const element = this.cy!.getElementById(id);
        if (element) {
          element.remove();
        }
      });
    });
  }

  getSelectedElements(): { nodes: GraphNodeSnapshot[]; edges: GraphEdgeSnapshot[] } {
    if (!this.cy) return { nodes: [], edges: [] };

    const selectedElements = this.cy.$(":selected");

    // Get snapshots of selected nodes
    const nodes = selectedElements.nodes().map((node) => {
      const snapshot = this.getNodeSnapshotById(node.id());
      if (!snapshot) {
        throw new Error(`Node with ID ${node.id()} not found for snapshot.`);
      }
      return snapshot;
    });

    // Get snapshots of selected edges
    const edges = selectedElements.edges().map((edge) => {
      const snapshot = this.getEdgeSnapshotById(edge.id());
      if (!snapshot) {
        throw new Error(`Edge with ID ${edge.id()} not found for snapshot.`);
      }
      return snapshot;
    });

    return { nodes, edges };
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

    this.cy.batch(() => {
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
    });
  }

  getClassesByElementId(elementId: string) {
    if (!this.cy) return [];
    return this.cy.getElementById(elementId).classes();
  }

  getNodeSnapshotById(nodeId: string): GraphNodeSnapshot | null {
    if (!this.cy) return null;

    const node = this.cy.getElementById(nodeId);
    if (node.empty()) return null;

    return {
      data: {
        id: node.id(),
        label: node.data("label"),
        x: node.position().x,
        y: node.position().y,
      },
      style: {},
      classes: node.classes(),
    };
  }

  getEdgeSnapshotById(edgeId: string): GraphEdgeSnapshot | null {
    if (!this.cy) return null;

    const edge = this.cy.getElementById(edgeId);
    if (edge.empty()) return null;

    return {
      data: {
        id: edge.id(),
        source: edge.source().id(),
        target: edge.target().id(),
        label: edge.data("label"),
      },
      style: {},
      classes: edge.classes(),
    };
  }

  getGraphSnapshot() {
    if (!this.cy) return { nodes: [], edges: [], isDirected: false };

    const nodes: GraphNode[] = this.cy.nodes().map((node) => ({
      id: node.id(),
      label: node.data("label"),
      x: node.position().x,
      y: node.position().y,
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
    const appliedClasses = currentClasses
      .filter((cls) => !removeClasses.includes(cls))
      .concat(addClasses);

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

  createHeadlessCyInstance(data: GraphData) {
    if (!this.cy) {
      throw new Error("Cytoscape instance is not initialized.");
    }

    const container = document.createElement("div");
    container.style.width = `${this.cy.width()}px`;
    container.style.height = `${this.cy.height()}px`;
    document.body.appendChild(container);

    const headlessCy = cytoscape({
      headless: true,
      styleEnabled: true,
      container,
      elements: [
        ...data.nodes.map((node) => ({
          data: { id: node.id, label: node.label },
          position: { x: node.x, y: node.y },
        })),
        ...data.edges.map((edge) => ({
          data: { id: edge.id, source: edge.source, target: edge.target, label: edge.label },
        })),
      ],
    });

    // document.body.removeChild(container);

    return headlessCy;
  }
}
