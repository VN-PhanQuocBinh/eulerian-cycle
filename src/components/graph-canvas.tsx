import { useEffect, useRef, useCallback } from "react";
import cytoscape from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import { useNodeInput } from "./ui/node-input";
import type { EdgeHandlesInstance, EdgeHandlesOptions } from "cytoscape-edgehandles";
import FunctionalBar from "./functional-bar";
import { useGraphStore } from "@/contexts/graph-context";

cytoscape.use(edgehandles);

const GraphCanvas = () => {
  const { openNodeInputAt } = useNodeInput();
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const ehRef = useRef<EdgeHandlesInstance | null>(null);

  const addNode = useCallback(
    (id: string, x: number, y: number) => {
      if (!cyRef.current) return;

      const currentNodes = cyRef.current.nodes().map((el) => el.id());

      console.log("Current Nodes:", currentNodes);

      // Kiểm tra xem ID đã tồn tại chưa để tránh crash
      if (!currentNodes.includes(id)) {
        cyRef.current.add({
          group: "nodes",
          data: { id, label: id },
          position: { x, y },
        });
      }
    },
    [cyRef],
  );

  // 2. Helper: Thêm Cạnh
  const addEdge = useCallback((sourceId: string, targetId: string) => {
    if (!cyRef.current) return;

    const edgeId = `e-${sourceId}-${targetId}`;

    // Chỉ thêm nếu cả 2 đỉnh tồn tại và cạnh chưa tồn tại
    if (
      !cyRef.current.getElementById(sourceId).empty() &&
      !cyRef.current.getElementById(targetId).empty() &&
      cyRef.current.getElementById(edgeId).empty()
    ) {
      cyRef.current.add({
        group: "edges",
        data: {
          id: edgeId,
          source: sourceId,
          target: targetId,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log([...(cyRef.current?.nodes().map((el) => el.id()) || [])]);

    cyRef.current = cytoscape({
      container: containerRef.current,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#3b82f6",
            label: "data(id)",
            color: "#fff",
            "text-valign": "center",
            "text-halign": "center",
            width: 40,
            height: 40,
          },
        },
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#94a3b8",
            "target-arrow-color": "#94a3b8",
            // "target-arrow-shape": "triangle", // Mũi tên cho đồ thị có hướng
            "curve-style": "bezier",
          },
        },
      ],
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
        return !sourceNode.same(targetNode); // e.g. disallow loops
      },
      edgeParams: function (
        sourceNode: cytoscape.NodeSingular,
        targetNode: cytoscape.NodeSingular,
      ): cytoscape.ElementDefinition {
        // for edges between the specified source and target
        // return element object to be passed to cy.add() for edge
        return {
          data: {
            id: `e-${sourceNode.id()}-${targetNode.id()}`,
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

    ehRef.current = cyRef.current.edgehandles(defaults);

    // Initialize with some nodes and edges for testing
    addNode("V1", 100, 100);
    addNode("V2", 300, 200);
    addEdge("V1", "V2");

    const handleDoubleClick = (event: cytoscape.EventObject) => {
      if (!cyRef.current) return;

      if (event.target === cyRef.current) {
        console.log("Zoom", cyRef.current.zoom());

        const { x, y } = event.position;

        openNodeInputAt({
          x: event.renderedPosition.x,
          y: event.renderedPosition.y,
          onComplete: (nodeId: string) => {
            addNode(nodeId, x, y);
            console.log("Adding node", nodeId, "At position", x, y);
          },
        });
      }
    };

    cyRef.current?.on("dblclick", handleDoubleClick);

    return () => {
      cyRef.current?.destroy();

      cyRef.current?.off("dblclick", handleDoubleClick);
    };
  }, [addNode, addEdge]);

  const handleClearGraph = useCallback(() => {
    if (cyRef.current) {
      cyRef.current.elements().remove();
    }
  }, []);

  return (
    // <NodeInputProvider>
    <div className="relative flex-1 h-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
      {/* <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() =>
            addNode(`V${Math.floor(Math.random() * 100)}`, Math.random() * 400, Math.random() * 400)
          }
          className="bg-white px-3 py-1 rounded shadow border text-sm"
        >
          + Thêm Đỉnh Random
        </button>
        <button
          onClick={handleClearGraph}
          className="bg-red-50 text-red-600 px-3 py-1 rounded shadow border text-sm"
        >
          Xóa hết
        </button>
      </div> */}

      {/* Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      <FunctionalBar
        onToggleViewMode={() => ehRef.current?.disableDrawMode()}
        onToggleAddMode={() => ehRef.current?.enableDrawMode()}
        onToggleClearGraphMode={handleClearGraph}
        onToggleRunEulerMode={() => console.log("Run Euler")}
      />
    </div>
    // </NodeInputProvider>
  );
};

export default GraphCanvas;
