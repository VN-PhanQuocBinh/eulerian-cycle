import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type cytoscape from "cytoscape";

// Types
export type GraphMode = "view" | "add-node" | "add-edge" | "delete";

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: `e-${string}-${string}`;
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

  // Bulk updates
  updateNodes: (nodes: GraphNode[]) => void;
  updateEdges: (edges: GraphEdge[]) => void;

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
      addNode: (node) => {
        const { cyInstance } = get();
        if (!cyInstance) return;

        const currentNodes = cyInstance?.nodes().map((el) => el.id()) || [];

        if (!currentNodes.includes(node.id)) {
          cyInstance?.add({
            group: "nodes",
            data: { id: node.id, label: node.label },
            position: { x: node.x, y: node.y },
          });

          set((state) => ({ nodes: [...state.nodes, node] }));
        }
      },

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
      addEdge: (edge) => {
        const { cyInstance, edges, nodes } = get();
        if (!cyInstance) return;

        // Kiểm tra cạnh đã tồn tại chưa
        if (edges.find((e) => e.id === edge.id)) {
          return;
        }
        // Kiểm tra cả 2 node có tồn tại không
        const sourceExists = nodes.find((n) => n.id === edge.source);
        const targetExists = nodes.find((n) => n.id === edge.target);

        if (!sourceExists || !targetExists) {
          return;
        }

        cyInstance?.add({
          group: "edges",
          data: edge,
        });

        set((state) => ({ edges: [...state.edges, edge] }));
      },

      removeEdge: (edgeId) =>
        set((state) => ({
          edges: state.edges.filter((e) => e.id !== edgeId),
        })),

      updateNodes: (nodes) => set({ nodes }),
      updateEdges: (edges) => set({ edges }),

      // Graph operations
      clearGraph: () =>
        set(() => ({
          nodes: [],
          edges: [],
        })),

      resetGraph: () => {
        const { cyInstance } = get();
        if (!cyInstance) return;

        cyInstance?.elements().remove();

        set(() => ({
          mode: "view",
          nodes: [],
          edges: [],
          isDirected: false,
        }));
      },

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
