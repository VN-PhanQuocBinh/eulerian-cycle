import { useGraphDataStore } from "@/stores";
import { useCallback } from "react";
import { GraphData } from "@/types/graph-data-store";
import { useToast } from "@/components/ui/toast";
import { graphService } from "@/services/graph-service";

export interface FileData {
  graph: GraphData;
  metadata: {
    version: string;
    createdAt: string;
  };
}

export const useFileOperations = () => {
  const updateNodes = useGraphDataStore((state) => state.updateNodes);
  const updateEdges = useGraphDataStore((state) => state.updateEdges);
  const setIsDirected = useGraphDataStore((state) => state.setIsDirected);
  const { showToast } = useToast();

  const loadGraph = useCallback(async () => {
    try {
      const result = await (window as any).ipcRenderer.loadGraph();

      if (!result.success || !result.data) {
        showToast({
          message: result.error || "Failed to load graph",
          type: "error",
        });
        return;
      }

      const parsedData: FileData = JSON.parse(result.data);
      const graphData: GraphData = parsedData.graph;

      graphService.drawGraphFromData(graphData);

      updateNodes(graphData.nodes);
      updateEdges(graphData.edges);
      setIsDirected(graphData.isDirected);

      showToast({
        message: "Graph loaded successfully!",
        type: "success",
      });
    } catch (error) {
      showToast({
        message: "Failed to parse graph file",
        type: "error",
      });
    }
  }, []);

  const saveGraph = useCallback(async () => {
    const graphData: FileData = {
      graph: graphService.getGraphSnapshot(),
      metadata: {
        version: "1.0",
        createdAt: new Date().toISOString(),
      },
    };

    try {
      const result = await (window as any).ipcRenderer.saveGraph(
        JSON.stringify(graphData, null, 2),
      );

      if (result.success) {
        showToast({
          message: "Graph saved successfully.",
          type: "success",
        });
      } else {
        showToast({
          message: `Failed to save graph. ${result.error || ""}`,
          type: "error",
        });
      }
    } catch (error) {
      showToast({
        message: "Failed to save graph.",
        type: "error",
      });
    }
  }, []);

  const saveImage = useCallback(async () => {
    try {
      const pngData = graphService.getPNG();

      const result = await (window as any).ipcRenderer.saveImage(pngData);

      if (result.success) {
        showToast({
          message: "Image saved successfully.",
          type: "success",
        });
      } else {
        showToast({
          message: `Failed to save image. ${result.error || ""}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error saving image:", error);
      showToast({
        message: "Failed to save image.",
        type: "error",
      });
    }
  }, []);

  return { loadGraph, saveGraph, saveImage };
};
