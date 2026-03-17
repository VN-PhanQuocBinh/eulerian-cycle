import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { GraphDataStore } from "@/types/graph-data-store";

export const useGraphDataStore = create<GraphDataStore>()(
  devtools(
    (set, get) => ({
      nodes: [],
      edges: [],
      isDirected: false,

      setIsDirected: (isDirected) => set({ isDirected }),
      getCurrentNodesData: () => {
        const { nodes } = get();
        return nodes;
      },
      getCurrentEdgesData: () => {
        const { edges } = get();
        return edges;
      },
      getCurrentGraphData: () => {
        const { nodes, edges, isDirected } = get();
        return { nodes, edges, isDirected };
      },

      updateNodes: (nodes) => set({ nodes }),
      updateEdges: (edges) => set({ edges }),
      updateGraphData: (graphData) => set({ ...graphData }),

      addNode: (node) => {
        if (!node.label.trim()) return;

        set((state) => ({ nodes: [...state.nodes, node] }));
      },

      removeNode: (nodeId) =>
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== nodeId),
          // Also remove connected edges
          edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
        })),

      updateNode: (nodeId, updates) => {
        set((state) => ({
          nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)),
        }));
      },

      // Edge operations
      addEdge: (edge) => {
        const { edges, nodes } = get();

        // Check if edge already exists
        if (edges.find((e) => e.id === edge.id)) {
          return;
        }
        // Check if both nodes exist
        const sourceExists = nodes.find((n) => n.id === edge.source);
        const targetExists = nodes.find((n) => n.id === edge.target);

        if (!sourceExists || !targetExists) {
          return;
        }

        set((state) => ({ edges: [...state.edges, edge] }));
      },

      removeEdge: (edgeId) =>
        set((state) => ({
          edges: state.edges.filter((e) => e.id !== edgeId),
        })),

      clearGraphData: () => set({ nodes: [], edges: [] }),
    }),
    { name: "GraphDataStore" },
  ),
);
