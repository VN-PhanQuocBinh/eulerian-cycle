import cytoscape from "cytoscape";
import { graphStyles } from "@/configs/graph";
import { generateEdgeId } from "@/utils/generate-id";
import type { EdgeHandlesInstance, EdgeHandlesOptions } from "cytoscape-edgehandles";
import { GraphEdge, GraphNode } from "@/types/graph-data-store";
import { GraphAlgorithm } from "@/types/algorithm-store";
import { ALGORITHM_LAYOUT_CONFIGS } from "@/configs/graph-layouts";

interface Position {
  x: number;
  y: number;
}

interface IGraphEditor {
  addNodeToCy(node: GraphNode): void;
  updateNodeInCy(node: Partial<GraphNode> & { id: string }): void;
  removeSelectedElements(): { nodeIds: string[]; edgeIds: string[] };
  clearCanvas(): void;
  drawGraphFromData(graphData: {
    nodes: GraphNode[];
    edges: GraphEdge[];
    isDirected: boolean;
  }): void;
}

interface IGraphVisualizer {
  autoLayout(algorithm: GraphAlgorithm): void;
  highlightElement(elementId: string, className: string[], pulse?: boolean): void;
  toggleDirected(isDirected: boolean): void;
  applyStylesFromMap(styles: Map<string, Set<string>>): void;
}

interface IGraphService extends IGraphEditor, IGraphVisualizer {
  // Initialization & Lifecycle
  init(container: HTMLDivElement): void;
  destroy(): void;
  bindEvents(callbacks: {
    onNodeAdd: (position: Position) => void;
    onNodeUpdate: (params: { id: string; position: Position }) => void;
    onEdgeAdd: (edge: GraphEdge) => void;
  }): void;

  toggleDrawMode(enable: boolean): void;
  getPNG(): string;
}

class GraphService implements IGraphService {
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

    let defaults: EdgeHandlesOptions = {
      canConnect: function (
        sourceNode: cytoscape.NodeSingular,
        targetNode: cytoscape.NodeSingular,
      ) {
        // whether an edge can be created between source and target
        // return !sourceNode.same(targetNode); // e.g. disallow loops
        return true;
      },
      edgeParams: function (
        sourceNode: cytoscape.NodeSingular,
        targetNode: cytoscape.NodeSingular,
      ): cytoscape.ElementDefinition {
        // for edges between the specified source and target
        // return element object to be passed to cy.add() for edge
        const uniqueId = generateEdgeId(sourceNode.id(), targetNode.id());

        return {
          data: {
            id: uniqueId,
            source: sourceNode.id(),
            target: targetNode.id(),
          },
        };
      },

      hoverDelay: 150, // time spent hovering over a target node before it is considered selected
      snap: true, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
      snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
      snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
      noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
      disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
    };

    const ehInstance = graphInstance.edgehandles(defaults);

    this.cy = graphInstance;
    this.eh = ehInstance;

    return {
      cy: this.cy,
      eh: this.eh,
    };
  }

  bindEvents: IGraphService["bindEvents"] = (callbacks) => {
    if (!this.cy) return;

    // Ví dụ: Click đúp vào canvas trống để thêm node
    this.cy.on("dblclick", (event) => {
      if (event.target === this.cy) {
        callbacks.onNodeAdd({
          x: event.renderedPosition.x,
          y: event.renderedPosition.y,
        });
      }
    });

    this.cy.on("dblclick", "node", (event) => {
      const node = event.target;
      console.log(node);
      callbacks.onNodeUpdate({
        id: node.id(),
        position: { x: node.position().x, y: node.position().y },
      });
    });

    // Listen event when an edge is created via edgehandles
    this.cy.on(
      "ehcomplete",
      (
        _event: cytoscape.EventObject,
        sourceNode: cytoscape.NodeSingular,
        targetNode: cytoscape.NodeSingular,
        addedEdge: cytoscape.EdgeSingular,
      ) => {
        const newEdge: GraphEdge = {
          id: addedEdge.id(),
          source: sourceNode.id(),
          target: targetNode.id(),
        };

        callbacks.onEdgeAdd(newEdge);
      },
    );

    // Lắng nghe việc chọn phần tử để xóa
    this.cy.on("select unselect", () => {
      const selected = this.cy!.$(":selected");
      // Trả về danh sách để xử lý bên ngoài
    });
  };

  autoLayout: IGraphService["autoLayout"] = (algorithm) => {
    if (!this.cy || !algorithm) return;

    const layoutConfig = ALGORITHM_LAYOUT_CONFIGS[algorithm];
    if (layoutConfig) {
      this.cy.layout(layoutConfig).run();
    }
  };

  destroy() {
    this.cy?.destroy();
    this.cy = null;
  }

  toggleDrawMode: IGraphService["toggleDrawMode"] = (enable) => {
    if (!this.eh) return;

    if (enable) {
      this.eh.enableDrawMode();
    } else {
      this.eh.disableDrawMode();
    }
  };

  toggleDirected: IGraphService["toggleDirected"] = (isDirected) => {
    if (!this.cy) return;

    this.cy.edges().data("isDirected", isDirected);
  };

  getPNG: IGraphService["getPNG"] = () => {
    if (!this.cy) return "";
    return this.cy.png({ full: true, bg: "white" });
  };

  addNodeToCy: IGraphService["addNodeToCy"] = (node) => {
    if (!this.cy) return;

    this.cy.add({
      group: "nodes",
      data: { id: node.id, label: node.label },
      position: { x: node.x, y: node.y },
    });
  };

  updateNodeInCy: IGraphService["updateNodeInCy"] = (node) => {
    if (!this.cy || !node.label) return;

    const nodeInCy = this.cy.getElementById(node.id);
    if (nodeInCy) {
      nodeInCy.data({ ...nodeInCy.data(), label: node.label });
    }
  };

  removeSelectedElements: IGraphService["removeSelectedElements"] = () => {
    if (!this.cy) return { nodeIds: [], edgeIds: [] };
    const selectedElements = this.cy.$(":selected");

    const nodeIds = selectedElements.nodes().map((node) => node.id());
    const edgeIds = selectedElements.edges().map((edge) => edge.id());

    selectedElements.remove();

    return {
      nodeIds,
      edgeIds,
    };
  };

  clearCanvas(): void {
    if (!this.cy) return;
    this.cy.elements().remove();
  }

  drawGraphFromData: IGraphService["drawGraphFromData"] = (graphData) => {
    if (!this.cy) return;

    const { nodes, edges } = graphData;
    // Clear current graph
    this.clearCanvas();

    // Load nodes
    nodes.forEach((node: GraphNode) => {
      this.cy?.add({
        group: "nodes",
        data: { id: node.id, label: node.label },
        position: { x: node.x, y: node.y },
      });
    });

    // Load edges
    edges.forEach((edge: GraphEdge) => {
      this.cy?.add({
        group: "edges",
        data: edge,
      });
    });
  };

  highlightElement: IGraphService["highlightElement"] = (elementId, className, pulse = false) => {
    if (!this.cy) return;

    const element = this.cy.getElementById(elementId);
    let addClasses: string[] = [];
    let removeClasses: string[] = [];

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
    const applyedClasses = currentClasses
      .filter((cls) => !removeClasses.includes(cls))
      .concat(addClasses);

    element.classes(applyedClasses.join(" "));

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
  };

  applyStylesFromMap(styles: Map<string, Set<string>>) {
    if (!this.cy) return;

    this.cy.batch(() => {
      // 1. Reset class của toàn bộ elements
      this.cy!.elements().classes("");

      // 2. Apply style mới
      for (const [elementId, classes] of styles.entries()) {
        const element = this.cy!.getElementById(elementId);
        if (element.length > 0) {
          element.classes(Array.from(classes).join(" "));
        }
      }
    });
  }
}

export const graphService = new GraphService();
