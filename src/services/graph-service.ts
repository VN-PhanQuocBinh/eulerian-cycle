import cytoscape from "cytoscape";
import { graphStyles } from "@/configs/graph";
import { generateEdgeId } from "@/utils/generate-id";
import type { EdgeHandlesInstance, EdgeHandlesOptions } from "cytoscape-edgehandles";
import { GraphEdge, GraphNode } from "@/types/graph-data-store";

interface Position {
  x: number;
  y: number;
}

interface IGraphService {
  // Initialization & Lifecycle
  init(container: HTMLDivElement): { cy: cytoscape.Core; eh: EdgeHandlesInstance };
  destroy(): void;
  toggleDrawMode(enable: boolean): void;
  bindEvents(callbacks: {
    onNodeAdd: (position: Position) => void;
    onNodeUpdate: (params: { id: string; position: Position }) => void;
    onEdgeAdd: (edge: GraphEdge) => void;
  }): void;

  // Node & Edge Operations
  addNodeToCy(node: GraphNode): void;
  removeNodeFromCy(nodeId: string): void;
  updateNodeInCy(node: Partial<GraphNode> & { id: string }): void;
  removeSelectedElements(): { nodeIds: string[]; edgeIds: string[] };
  clearCanvas(): void;
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

  destroy() {
    this.cy?.destroy();
    this.cy = null;
  }

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

  removeNodeFromCy: IGraphService["removeNodeFromCy"] = (nodeId) => {};

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

  toggleDrawMode: IGraphService["toggleDrawMode"] = (enable) => {
    if (!this.eh) return;

    if (enable) {
      this.eh.enableDrawMode();
    } else {
      this.eh.disableDrawMode();
    }
  };

  clearCanvas(): void {
    if (!this.cy) return;
    this.cy.elements().remove();
  }
}

export const graphService = new GraphService();
