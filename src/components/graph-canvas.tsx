import { useEffect, useRef } from "react";
import cytoscape, { use } from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import { useNodeInput } from "./ui/node-input";
import type { EdgeHandlesInstance, EdgeHandlesOptions } from "cytoscape-edgehandles";
import FunctionalBar from "./functional-bar";
import ZoomBar from "./zoom-bar";
// import AdjacencyListPanel from "./adjacency-list-panel";
import { useGraphStore } from "@/stores/graph-context";
import type { GraphEdge, GraphNode } from "@/types/graph";
import { useToast } from "./ui/toast";
import { graphStyles } from "@/configs/graph";
import dagre from "cytoscape-dagre";
import { generateNodeId, generateEdgeId } from "@/utils/generate-id";
import { useGraphDataStore } from "@/stores/graph-data-store";
import { graphService } from "@/services/graph-service";
import { useGraphInteractions } from "@/hooks/use-graph-interactions";
import { useUIStore } from "@/stores";

cytoscape.use(edgehandles);
cytoscape.use(dagre);

const GraphCanvas = () => {
  const { showToast } = useToast();
  const { initCoreListeners } = useGraphInteractions();

  const interactionMode = useUIStore((s) => s.mode);
  const edges = useGraphStore((state) => state.edges);
  const nodes = useGraphStore((state) => state.nodes);
  const isDirected = useGraphStore((state) => state.isDirected);
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

    const removeSaveImageListener = (window as any).ipcRenderer?.onRequestSaveImage?.(() => {
      const { saveImage } = useGraphStore.getState();
      saveImage();
    });

    return () => {
      if (removeSaveListener) removeSaveListener();
      if (removeLoadListener) removeLoadListener();
      if (removeSaveImageListener) removeSaveImageListener();
    };
  }, []);

  useEffect(() => {
    if (!cyRef.current) return;

    if (isDirected) {
      cyRef.current.edges().data("isDirected", true);
    } else {
      cyRef.current.edges().data("isDirected", false);
    }
  }, [cyRef.current, isDirected, edges]);

  // Set toast handler in graph store
  useEffect(() => {
    setToastHandler(showToast);
  }, [setToastHandler, showToast]);

  // Initialize Cytoscape and EdgeHandles
  useEffect(() => {
    if (!containerRef.current) return;

    graphService.init(containerRef.current);
    initCoreListeners();

    return () => {
      graphService.destroy();
    };
  }, [addNode, addEdge]);

  useEffect(() => {
    console.log(useGraphDataStore.getState().nodes);
    console.log(useGraphDataStore.getState().edges);

    graphService.toggleDrawMode(interactionMode === "add-edge");
  }, [interactionMode]);

  return (
    // <NodeInputProvider>
    <div className=" relative flex-1 h-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
      {/* Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      <FunctionalBar />
      <ZoomBar />
    </div>
  );
};

export default GraphCanvas;
