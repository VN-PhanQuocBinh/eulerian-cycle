import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import FunctionalBar from "./functional-bar";
import FloatintPrimaryControl from "./floating-primary-control";
import dagre from "cytoscape-dagre";
import { useGraphDataStore } from "@/stores/graph-data-store";
import { graphService } from "@/services/graph-service";
import { useGraphInteractions } from "@/hooks/use-graph-interactions";
import { useUIStore } from "@/stores";
import { useFileOperations } from "@/hooks/use-file-operations";

cytoscape.use(edgehandles);
cytoscape.use(dagre);

const GraphCanvas = () => {
  const { initCoreListeners } = useGraphInteractions();
  const { loadGraph, saveGraph, saveImage } = useFileOperations();

  const interactionMode = useUIStore((s) => s.mode);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const edges = useGraphDataStore((state) => state.edges);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const removeSaveListener = (window as any).ipcRenderer?.onRequestSaveGraph?.(() => {
      saveGraph();
    });

    const removeLoadListener = (window as any).ipcRenderer?.onRequestLoadGraph?.(() => {
      loadGraph();
    });

    const removeSaveImageListener = (window as any).ipcRenderer?.onRequestSaveImage?.(() => {
      saveImage();
    });

    return () => {
      if (removeSaveListener) removeSaveListener();
      if (removeLoadListener) removeLoadListener();
      if (removeSaveImageListener) removeSaveImageListener();
    };
  }, []);

  useEffect(() => {
    graphService.toggleDirected(isDirected);
  }, [isDirected, edges]);

  // Initialize Cytoscape and EdgeHandles
  useEffect(() => {
    if (!containerRef.current) return;

    graphService.init(containerRef.current);
    initCoreListeners();

    return () => {
      graphService.destroy();
    };
  }, []);

  useEffect(() => {
    console.log(useGraphDataStore.getState().nodes);
    console.log(useGraphDataStore.getState().edges);

    graphService.toggleDrawMode(interactionMode === "add-edge");
  }, [interactionMode]);

  return (
    <div className=" relative flex-1 h-full bg-slate-200 border border-slate-200 overflow-hidden">
      {/* Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      <FunctionalBar />
      <FloatintPrimaryControl />
    </div>
  );
};

export default GraphCanvas;
