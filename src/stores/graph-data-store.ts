import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { GraphDataStore } from "@/types/graph-data-store";

export const useGraphDataStore = create<GraphDataStore>()(
  devtools(
    (set, get) => ({
      nodes: [],
      edges: [],
      isDirected: false,
      nodeSet: new Set(),

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

      updateNodes: (nodes) => {
        const { nodeSet } = get();
        const newNodeSet = new Set(nodeSet);
        nodes.forEach((node) => newNodeSet.add(node.id));
        set({ nodes, nodeSet: newNodeSet });
      },

      updateEdges: (edges) => set({ edges }),
      updateGraphData: (graphData) => {
        const newNodeSet = new Set<string>();
        graphData.nodes.forEach((node) => newNodeSet.add(node.id));

        set({ ...graphData, nodeSet: newNodeSet });
      },

      addNode: (node) => {
        if (!node.label.trim()) return new Error("Node label cannot be empty.");

        set((state) => {
          const newSet = new Set(state.nodeSet);
          newSet.add(node.id);
          return { 
            nodes: [...state.nodes, node],
            nodeSet: newSet 
          };
        });
      },

      removeNode: (nodeId) => {
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== nodeId),
          // Also remove connected edges
          edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
        }));
        set((state) => {
          const newSet = new Set(state.nodeSet);
          newSet.delete(nodeId);
          return { nodeSet: newSet };
        });
      },

      updateNode: (nodeId, updates) => {
        set((state) => ({
          nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)),
        }));
      },

      isNodeExists: (nodeId) => {
        const { nodeSet } = get();
        return nodeSet.has(nodeId);
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

      clearGraphData: () => set({ nodes: [], edges: [], nodeSet: new Set() }),
    }),
    { name: "GraphDataStore" },
  ),
);
