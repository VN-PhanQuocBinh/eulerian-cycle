import { UIStore } from "@/types/ui-store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GraphMode } from "@/types/ui-store";

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      mode: "view",

      setMode: (mode: GraphMode) => set({ mode }),

      // Graph operations
      clearGraph: () => {
        set(() => ({
          mode: "view",
          nodes: [],
          edges: [],
          isDirected: false,
        }));
      },

      resetGraph: () => {
        const {
          cyInstance,
          isDirected,
          drawGraphFromData,
          getCurrentEdgesData,
          getCurrentNodesData,
        } = get();
        if (!cyInstance) return;

        const nodes = getCurrentNodesData();
        const edges: GraphEdge[] = getCurrentEdgesData();

        drawGraphFromData({
          nodes,
          edges,
          isDirected,
        });
      },

      drawGraphFromData: (graphData: GraphData) => {
        const { cyInstance, clearGraph } = get();
        if (!cyInstance || !graphData) return;

        const { nodes, edges, isDirected } = graphData;
        // Clear current graph
        clearGraph();

        // Load nodes
        nodes.forEach((node: GraphNode) => {
          cyInstance.add({
            group: "nodes",
            data: { id: node.id, label: node.label },
            position: { x: node.x, y: node.y },
          });
        });

        // Load edges
        edges.forEach((edge: GraphEdge) => {
          cyInstance.add({
            group: "edges",
            data: edge,
          });
        });

        // Update store
        set({
          nodes,
          edges,
          isDirected: !!isDirected,
        });
      },

      autoLayout: () => {
        const { cyInstance, currentAlgorithm } = get();

        if (!cyInstance || !currentAlgorithm) return;

        const layoutConfig = ALGORITHM_LAYOUT_CONFIGS[currentAlgorithm];
        if (layoutConfig) {
          cyInstance.layout(layoutConfig).run();
        }
      },
    }),
    { name: "UIStore" },
  ),
);
