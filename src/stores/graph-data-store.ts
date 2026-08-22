import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { GraphDataStore } from "@/types/graph-data-store";

const buildNodeById = (nodes: GraphDataStore["nodes"]) => new Map(nodes.map((node) => [node.id, node]));
const buildEdgeById = (edges: GraphDataStore["edges"]) => new Map(edges.map((edge) => [edge.id, edge]));
const buildNodeSet = (nodes: GraphDataStore["nodes"]) => new Set(nodes.map((node) => node.id));

export const useGraphDataStore = create<GraphDataStore>()(
  devtools(
    (set, get) => ({
      nodes: [],
      edges: [],
      isDirected: false,
      nodeSet: new Set(),
      nodeById: new Map(),
      edgeById: new Map(),

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

      getEdgeDataById: (edgeId) => {
        const { edgeById } = get();
        return edgeById.get(edgeId);
      },

      getNodeDataById: (nodeId) => {
        const { nodeById } = get();
        return nodeById.get(nodeId);
      },

      updateNodes: (nodes) => {
        set({
          nodes,
          nodeSet: buildNodeSet(nodes),
          nodeById: buildNodeById(nodes),
        });
      },

      updateEdges: (edges) =>
        set({
          edges,
          edgeById: buildEdgeById(edges),
        }),
      updateGraphData: (graphData) => {
        const nodeSet = buildNodeSet(graphData.nodes);
        const nodeById = buildNodeById(graphData.nodes);
        const edgeById = buildEdgeById(graphData.edges);

        set({ ...graphData, nodeSet, nodeById, edgeById });
      },

      addNode: (node) => {
        if (!node.label.trim()) throw new Error("Node label cannot be empty.");

        set((state) => {
          const nodeSet = new Set(state.nodeSet);
          nodeSet.add(node.id);

          const nodeById = new Map(state.nodeById);
          nodeById.set(node.id, node);

          return {
            nodes: [...state.nodes, node],
            nodeSet,
            nodeById,
          };
        });
      },

      removeNode: (nodeId) => {
        set((state) => {
          const nodeSet = new Set(state.nodeSet);
          nodeSet.delete(nodeId);

          const nodeById = new Map(state.nodeById);
          nodeById.delete(nodeId);

          const edges = state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);

          return {
            nodeSet,
            nodeById,
            nodes: state.nodes.filter((n) => n.id !== nodeId),
            // Also remove connected edges
            edges,
            edgeById: buildEdgeById(edges),
          };
        });
      },

      updateNode: (nodeId, updates) => {
        set((state) => {
          const nodes = state.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n));
          const updatedNode = nodes.find((node) => node.id === nodeId);

          const nodeById = new Map(state.nodeById);
          if (updatedNode) {
            nodeById.set(nodeId, updatedNode);
          }

          return { nodes, nodeById };
        });
      },

      isNodeExists: (nodeId) => {
        const { nodeSet } = get();
        return nodeSet.has(nodeId);
      },

      // Edge operations
      addEdge: (edge) => {
        const { edgeById, nodeById } = get();

        // Check if edge already exists
        if (edgeById.has(edge.id)) {
          return;
        }

        // Check if both nodes exist
        const sourceExists = nodeById.has(edge.source);
        const targetExists = nodeById.has(edge.target);

        if (!sourceExists || !targetExists) {
          return;
        }

        set((state) => {
          const edgeById = new Map(state.edgeById);
          edgeById.set(edge.id, edge);

          return {
            edges: [...state.edges, edge],
            edgeById,
          };
        });
      },

      removeEdge: (edgeId) =>
        set((state) => {
          const edgeById = new Map(state.edgeById);
          edgeById.delete(edgeId);

          return {
            edges: state.edges.filter((e) => e.id !== edgeId),
            edgeById,
          };
        }),

      clearGraphData: () =>
        set({
          nodes: [],
          edges: [],
          nodeSet: new Set(),
          nodeById: new Map(),
          edgeById: new Map(),
        }),
    }),
    { name: "GraphDataStore" },
  ),
);
