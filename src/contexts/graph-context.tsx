import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type cytoscape from "cytoscape";

// Types
export type GraphMode = "view" | "add" | "delete";

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

interface GraphState {
  // State
  mode: GraphMode;
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected: boolean;
  cyInstance: cytoscape.Core | null;
  ehInstance: any | null;

  // Actions
  setMode: (mode: GraphMode) => void;
  setIsDirected: (isDirected: boolean) => void;
  setCyInstance: (instance: cytoscape.Core | null) => void;
  setEhInstance: (instance: any) => void;

  // Node operations
  addNode: (node: GraphNode) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<GraphNode>) => void;

  // Edge operations
  addEdge: (edge: GraphEdge) => void;
  removeEdge: (edgeId: string) => void;

  // Graph operations
  clearGraph: () => void;
  resetGraph: () => void;

  // Euler algorithm
  findEulerianPath: () => string[] | null;
  findEulerianCycle: () => string[] | null;
}

export const useGraphStore = create<GraphState>()(
  devtools(
    (set, get) => ({
      // Initial state
      mode: "view",
      nodes: [],
      edges: [],
      isDirected: false,
      cyInstance: null,
      ehInstance: null,
      // Mode actions
      setMode: (mode) => set({ mode }),
      setIsDirected: (isDirected) => set({ isDirected }),
      setCyInstance: (instance) => set({ cyInstance: instance }),
      setEhInstance: (instance) => set({ ehInstance: instance }),
      // Node operations
      addNode: (node) =>
        set((state) => {
          // Kiểm tra node đã tồn tại chưa
          if (state.nodes.find((n) => n.id === node.id)) {
            return state;
          }
          return { nodes: [...state.nodes, node] };
        }),

      removeNode: (nodeId) =>
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== nodeId),
          // Xóa luôn các cạnh liên quan
          edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
        })),

      updateNode: (nodeId, updates) =>
        set((state) => ({
          nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)),
        })),

      // Edge operations
      addEdge: (edge) =>
        set((state) => {
          // Kiểm tra cạnh đã tồn tại chưa
          if (state.edges.find((e) => e.id === edge.id)) {
            return state;
          }
          // Kiểm tra cả 2 node có tồn tại không
          const sourceExists = state.nodes.find((n) => n.id === edge.source);
          const targetExists = state.nodes.find((n) => n.id === edge.target);

          if (!sourceExists || !targetExists) {
            return state;
          }

          return { edges: [...state.edges, edge] };
        }),

      removeEdge: (edgeId) =>
        set((state) => ({
          edges: state.edges.filter((e) => e.id !== edgeId),
        })),

      // Graph operations
      clearGraph: () =>
        set(() => ({
          nodes: [],
          edges: [],
        })),

      resetGraph: () =>
        set(() => ({
          mode: "view",
          nodes: [],
          edges: [],
          isDirected: false,
        })),

      // Euler algorithm (placeholder)
      findEulerianPath: () => {
        const { nodes, edges } = get();
        // TODO: Implement Eulerian path algorithm
        console.log("Finding Eulerian path...", { nodes, edges });
        return null;
      },

      findEulerianCycle: () => {
        const { nodes, edges } = get();
        // TODO: Implement Eulerian cycle algorithm
        console.log("Finding Eulerian cycle...", { nodes, edges });
        return null;
      },
    }),
    { name: "GraphStore" },
  ),
);
