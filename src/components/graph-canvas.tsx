import { useEffect, useRef, useCallback } from "react";
import cytoscape from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import { useNodeInput } from "./ui/node-input";
import type { EdgeHandlesInstance, EdgeHandlesOptions } from "cytoscape-edgehandles";
import FunctionalBar from "./functional-bar";
import { useGraphStore } from "@/contexts/graph-context";

cytoscape.use(edgehandles);

const GraphCanvas = () => {
  const addNode = useGraphStore((state) => state.addNode);
  const addEdge = useGraphStore((state) => state.addEdge);
  const setCyInstance = useGraphStore((state) => state.setCyInstance);
  const setEhInstance = useGraphStore((state) => state.setEhInstance);

  const { openNodeInputAt } = useNodeInput();
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const ehRef = useRef<EdgeHandlesInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const graphInstance = cytoscape({
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

    cyRef.current = graphInstance;
    setCyInstance(graphInstance);

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

    ehRef.current = graphInstance.edgehandles(defaults);
    setEhInstance(graphInstance.edgehandles(defaults));

    const handleDoubleClick = (event: cytoscape.EventObject) => {
      if (event.target === graphInstance) {
        const { x, y } = event.position;

        openNodeInputAt({
          x: event.renderedPosition.x,
          y: event.renderedPosition.y,
          onComplete: (nodeId: string) => {
            addNode({ id: nodeId.toLowerCase(), label: nodeId, x, y });
          },
        });
      }
    };

    graphInstance.on("dblclick", handleDoubleClick);

    // Initialize with some nodes and edges for testing
    addNode({ id: "v1", label: "1", x: 100, y: 100 });
    addNode({ id: "v2", label: "2", x: 300, y: 200 });
    addEdge({ id: "e-v1-v2", source: "v1", target: "v2" });

    return () => {
      graphInstance.off("dblclick", handleDoubleClick);
      graphInstance.destroy();
    };
  }, [addNode, addEdge]);

  return (
    // <NodeInputProvider>
    <div className="relative flex-1 h-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
      {/* Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      <FunctionalBar />
    </div>
  );
};

export default GraphCanvas;
