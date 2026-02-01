import { useEffect, useRef, useCallback } from "react";
import cytoscape, { use } from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import { useNodeInput } from "./ui/node-input";
import type { EdgeHandlesInstance, EdgeHandlesOptions } from "cytoscape-edgehandles";
import FunctionalBar from "./functional-bar";
import AdjacencyListPanel from "./adjacency-list-panel";
import { useGraphStore } from "@/contexts/graph-context";
import type { GraphEdge, GraphNode } from "@/contexts/graph-context";
import { generateNodeId } from "@/utils/generate-node-id";
import { useToast } from "./ui/toast";
import { graphStyles } from "@/configs/graph";

cytoscape.use(edgehandles);

const GraphCanvas = () => {
  const { showToast } = useToast();

  const graphMode = useGraphStore((state) => state.mode);
  const edges = useGraphStore((state) => state.edges);
  const addNode = useGraphStore((state) => state.addNode);
  const updateNode = useGraphStore((state) => state.updateNode);
  const addEdge = useGraphStore((state) => state.addEdge);
  const setCyInstance = useGraphStore((state) => state.setCyInstance);
  const setEhInstance = useGraphStore((state) => state.setEhInstance);
  const updateNodes = useGraphStore((state) => state.updateNodes);
  const updateEdges = useGraphStore((state) => state.updateEdges);
  const setToastHandler = useGraphStore((state) => state.setToastHandler);

  const { openNodeInputAt } = useNodeInput();
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const ehRef = useRef<EdgeHandlesInstance | null>(null);

  useEffect(() => {
    const removeSaveListener = (window as any).ipcRenderer?.onRequestSaveGraph?.(() => {
      const { saveGraph } = useGraphStore.getState();
      saveGraph();
    });

    const removeLoadListener = (window as any).ipcRenderer?.onRequestLoadGraph?.(() => {
      const { loadGraph } = useGraphStore.getState();
      loadGraph();
    });

    return () => {
      if (removeSaveListener) removeSaveListener();
      if (removeLoadListener) removeLoadListener();
    };
  }, []);

  // Set toast handler in graph store
  useEffect(() => {
    setToastHandler(showToast);
  }, [setToastHandler, showToast]);

  // Initialize Cytoscape and EdgeHandles
  useEffect(() => {
    if (!containerRef.current) return;

    const graphInstance = cytoscape({
      container: containerRef.current,
      style: graphStyles,
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
        // return !sourceNode.same(targetNode); // e.g. disallow loops
        return true;
      },
      edgeParams: function (
        sourceNode: cytoscape.NodeSingular,
        targetNode: cytoscape.NodeSingular,
      ): cytoscape.ElementDefinition {
        // for edges between the specified source and target
        // return element object to be passed to cy.add() for edge
        const uniqueId = `edge-${sourceNode.id()}-${targetNode.id()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        return {
          data: {
            // id: `e-${sourceNode.id()}-${targetNode.id()}`,
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
    ehRef.current = ehInstance;
    setEhInstance(ehInstance);

    // Pending for implementation: custom context menu on nodes
    graphInstance.on("cxttapstart ", "node", function (evt) {
      const node = evt.target;
      console.log("tapped " + node.id());
    });

    return () => {
      graphInstance.destroy();
    };
  }, [addNode, addEdge]);

  useEffect(() => {
    if (!cyRef.current || !["view", "add-edge"].includes(graphMode)) return;

    cyRef.current.on("dblclick", "node", (event) => {
      const node = event.target;
      console.log("Double clicked on node", node.id());
      // Prevent adding node when double-clicking on existing node
      openNodeInputAt({
        x: event.target.position().x,
        y: event.target.position().y,
        onComplete: (label: string) => {
          updateNode(node.id(), { label });
        },
      });
    });

    return () => {
      cyRef.current?.off("dblclick", "node");
    };
  }, [graphMode, openNodeInputAt]);

  // Enable/disable edge drawing mode based on graphMode
  useEffect(() => {
    if (!cyRef.current || !ehRef.current) return;

    if (graphMode === "add-edge") {
      ehRef.current.enableDrawMode();
    } else {
      ehRef.current.disableDrawMode();
    }

    const handleDoubleClick = (event: cytoscape.EventObject) => {
      if (event.target === cyRef.current) {
        const { x, y } = event.position;

        openNodeInputAt({
          x: event.renderedPosition.x,
          y: event.renderedPosition.y,
          onComplete: (label: string) => {
            // const nodeId = generateNodeId();
            const nodeId = `node_${label}`;
            addNode({ id: nodeId.toLowerCase(), label, x, y });
          },
        });
      }
    };

    if (graphMode === "add-node") {
      cyRef.current.on("dblclick", handleDoubleClick);
    }

    return () => {
      cyRef.current?.off("dblclick", handleDoubleClick);
    };
  }, [graphMode, updateEdges]);

  // Update store when edges are added via edgehandles
  useEffect(() => {
    if (!cyRef.current) return;

    const handleEdgeAdded = (
      _event: cytoscape.EventObject,
      sourceNode: cytoscape.NodeSingular,
      targetNode: cytoscape.NodeSingular,
      addedEdge: cytoscape.EdgeSingular,
    ) => {
      const newEdge: GraphEdge = {
        id: addedEdge.id() as `e-${string}-${string}`,
        source: sourceNode.id(),
        target: targetNode.id(),
      };

      updateEdges([...edges, newEdge]);
    };

    cyRef.current.on("ehcomplete", handleEdgeAdded);
    return () => {
      cyRef.current?.off("ehcomplete", handleEdgeAdded);
    };
  }, [updateEdges, edges]);

  // Delete selected nodes or edges on Delete or Backspace key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!cyRef.current) return;

      if (event.key === "Delete" || event.key === "Backspace") {
        const selectedElements = cyRef.current?.$(":selected");
        selectedElements?.remove();

        // Update store
        const remainingNodes =
          cyRef.current.nodes().map((el) => {
            const position = el.position();
            return {
              id: el.id(),
              label: el.data("label"),
              x: position.x,
              y: position.y,
            } as GraphNode;
          }) || [];
        updateNodes(remainingNodes);

        const remainingEdges =
          cyRef.current.edges().map((el) => {
            return {
              id: el.id() as string,
              source: el.data("source") as string,
              target: el.data("target") as string,
            } as GraphEdge;
          }) || [];
        updateEdges(remainingEdges);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cyRef.current, updateEdges, updateNodes]);

  return (
    // <NodeInputProvider>
    <div className="relative flex-1 h-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
      {/* Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      <FunctionalBar />
      <AdjacencyListPanel />
    </div>
  );
};

export default GraphCanvas;
