import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type cytoscape from "cytoscape";
import type { ToastHandler } from "@/components/ui/toast";

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

  // Toast handler
  toastHandler: ToastHandler;
  setToastHandler: (handler: ToastHandler) => void;

  // Bulk updates
  updateNodes: (nodes: GraphNode[]) => void;
  updateEdges: (edges: GraphEdge[]) => void;

  // Node operations
  addNode: (node: GraphNode) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<Pick<GraphNode, "label">>) => void;

  // Edge operations
  addEdge: (edge: GraphEdge) => void;
  removeEdge: (edgeId: string) => void;

  // Graph operations
  clearGraph: () => void;
  resetGraph: () => void;

  saveGraph: () => Promise<string>;
  loadGraph: () => Promise<string>;

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

      // Toast handler
      toastHandler: () => {},
      setToastHandler: (handler) => set({ toastHandler: handler }),

      // Mode actions
      setMode: (mode) => set({ mode }),
      setIsDirected: (isDirected) => set({ isDirected }),
      setCyInstance: (instance) => set({ cyInstance: instance }),
      setEhInstance: (instance) => set({ ehInstance: instance }),

      // Node operations
      addNode: (node) => {
        const { cyInstance, toastHandler } = get();
        if (!cyInstance) return;

        const { id: nodeId, label: nodeLabel } = node;
        const currentNodes = cyInstance?.nodes().map((el) => el.id()) || [];
        const isExistingLabel = cyInstance.nodes().some((el) => el.data("label") === nodeLabel);
        const isExistingId = currentNodes.includes(nodeId);

        if (!isExistingId && !isExistingLabel && nodeId.trim() !== "" && nodeLabel.trim() !== "") {
          cyInstance?.add({
            group: "nodes",
            data: { id: node.id, label: node.label },
            position: { x: node.x, y: node.y },
          });

          set((state) => ({ nodes: [...state.nodes, node] }));
        } else {
          toastHandler({
            message: "Node with the same ID or label already exists or ID is empty.",
            type: "error",
          });
        }
      },

      removeNode: (nodeId) =>
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== nodeId),
          // Also remove connected edges
          edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
        })),

      updateNode: (nodeId, updates) => {
        const { cyInstance } = get();
        if (!cyInstance || !updates.label) return;

        const nodeInCy = cyInstance.getElementById(nodeId);
        if (nodeInCy) {
          nodeInCy.data({ ...nodeInCy.data(), label: updates.label });
        }

        set((state) => ({
          nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)),
        }));
      },

      // Edge operations
      addEdge: (edge) => {
        const { cyInstance, edges, nodes } = get();
        if (!cyInstance) return;

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

      // File operations
      saveGraph: async () => {
        const { nodes, edges, toastHandler } = get();

        const graphData = {
          nodes,
          edges,
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
            toastHandler({
              message: "Graph saved successfully.",
              type: "success",
            });
          } else {
            toastHandler({
              message: `Failed to save graph. ${result.error || ""}`,
              type: "error",
            });
          }
        } catch (error) {
          toastHandler({
            message: "Failed to save graph.",
            type: "error",
          });
        }
      },

      loadGraph: async () => {
        const { cyInstance, toastHandler } = get();

        if (!cyInstance) {
          toastHandler({
            message: "Graph canvas not initialized",
            type: "error",
          });
          return;
        }

        try {
          const result = await (window as any).ipcRenderer.loadGraph();

          if (!result.success || !result.data) {
            toastHandler({
              message: result.error || "Failed to load graph",
              type: "error",
            });
            return;
          }

          const graphData = JSON.parse(result.data);

          // Clear current graph
          cyInstance.elements().remove();

          // Load nodes
          graphData.nodes.forEach((node: GraphNode) => {
            cyInstance.add({
              group: "nodes",
              data: { id: node.id, label: node.label },
              position: { x: node.x, y: node.y },
            });
          });

          // Load edges
          graphData.edges.forEach((edge: GraphEdge) => {
            cyInstance.add({
              group: "edges",
              data: edge,
            });
          });

          // Update store
          set({
            nodes: graphData.nodes,
            edges: graphData.edges,
            isDirected: graphData.isDirected,
          });

          toastHandler({
            message: "Graph loaded successfully!",
            type: "success",
          });
        } catch (error) {
          toastHandler({
            message: "Failed to parse graph file",
            type: "error",
          });
        }
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
