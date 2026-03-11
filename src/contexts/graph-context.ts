import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type {
  GraphNode,
  GraphEdge,
  GraphState,
  ConnectedComponentsResult,
  GraphData,
} from "@/types/graph";
import { ALGORITHM_LAYOUT_CONFIGS } from "@/configs/graph-layouts";
import { findSCCs as findSCCsAlgorithm } from "@/core/algorithms/scc";
import { findEulerianCycle as findEulerianCycleAlgorithm } from "@/core/algorithms/eulerian-cycle";
import { findConnectedComponents as findConnectedComponentsAlgorithm } from "@/core/algorithms/connected-components";

export const useGraphStore = create<GraphState>()(
  devtools(
    (set, get) => ({
      // Initial state
      mode: "view",
      nodes: [],
      edges: [],
      isDirected: true,
      test: false,
      cyInstance: null,
      ehInstance: null,

      // Algorithm state
      currentAlgorithm: "connected-components",
      isAnimating: false,
      steps: [],
      currentStepIndex: -1,
      speed: 1,

      // Toast handler
      toastHandler: () => {},
      setToastHandler: (handler) => set({ toastHandler: handler }),

      // Mode actions
      setMode: (mode) => set({ mode }),
      setIsDirected: (isDirected) => set({ isDirected }),
      setCyInstance: (instance) => set({ cyInstance: instance }),
      setEhInstance: (instance) => set({ ehInstance: instance }),
      getCurrentNodesData: () => {
        const { cyInstance } = get();
        if (!cyInstance) return [];

        return cyInstance.nodes().map((el) => ({
          id: el.id(),
          label: el.data("label"),
          x: el.position().x,
          y: el.position().y,
        }));
      },
      getCurrentEdgesData: () => {
        const { cyInstance } = get();
        if (!cyInstance) return [];
        return cyInstance.edges().map((el) => ({
          id: el.id() as `e-${string}-${string}`,
          source: el.data("source"),
          target: el.data("target"),
        }));
      },

      // Algorithm state actions
      setCurrentAlgorithm: (algorithm) => set({ currentAlgorithm: algorithm }),
      setSteps: (steps) => set({ steps }),

      setIsAnimating: (isAnimating) => set({ isAnimating }),
      setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
      setSpeed: (speed) => set({ speed }),
      nextStep: () => {
        const { currentStepIndex, steps } = get();
        if (currentStepIndex < steps.length) {
          set({ currentStepIndex: currentStepIndex + 1 });
        }
      },
      prevStep: () => {
        const { currentStepIndex } = get();
        if (currentStepIndex > 0) {
          set({ currentStepIndex: currentStepIndex - 1 });
        }
      },

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
      clearGraph: () => {
        const { cyInstance } = get();
        if (!cyInstance) return;

        cyInstance.elements().remove();

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

      // File operations
      saveGraph: async () => {
        const { getCurrentEdgesData, getCurrentNodesData, toastHandler } = get();

        const graphData = {
          nodes: getCurrentNodesData(),
          edges: getCurrentEdgesData(),
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
        const { cyInstance, toastHandler, drawGraphFromData } = get();

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

          const graphData: GraphData = JSON.parse(result.data);
          drawGraphFromData(graphData);
          set({
            nodes: graphData.nodes,
            edges: graphData.edges,
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

      saveImage: async () => {
        const { cyInstance, toastHandler } = get();
        if (!cyInstance) return;
        try {
          const pngData = cyInstance.png({ full: true, bg: "white" });

          await (window as any).ipcRenderer.saveImage(pngData);

          toastHandler({
            message: "Image saved successfully.",
            type: "success",
          });
        } catch (error) {
          console.error("Error saving image:", error);
          toastHandler({
            message: "Failed to save image.",
            type: "error",
          });
        }
      },

      // Algorithms implementation
      getAdjacencyList: (): Map<string, string[]> => {
        const state = get();
        const { nodes, edges, isDirected } = state;
        const adjacencyList: Map<string, string[]> = new Map();

        // Initialize adjacency list
        nodes.forEach((node) => {
          adjacencyList.set(node.id, []);
        });

        // Populate adjacency list
        edges.forEach((edge) => {
          const sourceAdj = adjacencyList.get(edge.source);
          if (sourceAdj) {
            const targetNode = nodes.find((n) => n.id === edge.target);
            if (targetNode) {
              sourceAdj.push(targetNode.id);
            }
          } else {
            alert("Error: Source node not found in adjacency list");
          }

          // If undirected, add reverse edge
          if (!isDirected) {
            const targetAdj = adjacencyList.get(edge.target);
            if (targetAdj) {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              if (sourceNode) {
                targetAdj.push(sourceNode.id);
              }
            } else {
              alert("Error: Target node not found in adjacency list");
            }
          }
        });

        return adjacencyList;
      },

      // ========== HELPER METHODS ==========
      highlightNode: (nodeId: string, className: string[], pulse = false) => {
        const { cyInstance } = get();
        if (!cyInstance) return;

        const node = cyInstance.getElementById(nodeId);
        if (node.length === 0) return;

        node[0].addClass(className);

        if (pulse) {
          node[0].animate({
            style: { width: 50, height: 50 },
            duration: 200,
            complete: () => {
              node[0].animate({
                style: { width: 40, height: 40 },
                duration: 200,
              });
            },
          });
        }
      },

      highlightEdge: (sourceId: string, targetId: string, className: string[]) => {
        const { cyInstance, isDirected } = get();
        if (!cyInstance) return;
        // console.log("Highlighting edge:", sourceId, "->", targetId);

        let processingEdges = cyInstance.edges(`[source="${sourceId}"][target="${targetId}"]`);
        if (processingEdges.length === 0 && !isDirected) {
          processingEdges = cyInstance.edges(`[source="${targetId}"][target="${sourceId}"]`);
        }

        const highlightedEdge = Array.from(processingEdges).find(
          (edge) => !edge.classes().includes(className.join(" ")),
        );

        if (highlightedEdge) {
          highlightedEdge.addClass(className);
        }
      },

      // ========== ALGORITHM IMPLEMENTATIONS ==========
      findSCCs: () => {
        const { getAdjacencyList, cyInstance } = get();
        const adjacencyList = getAdjacencyList();
        return findSCCsAlgorithm({ adjacencyList, cyInstance });
      },

      findConnectedComponents: (startNodeId: string): ConnectedComponentsResult => {
        const { nodes, getAdjacencyList, cyInstance, isDirected, findSCCs } = get();
        const adjacencyList = getAdjacencyList();

        if (isDirected) {
          return findSCCs();
        }

        return findConnectedComponentsAlgorithm({
          params: {
            cyInstance,
            nodes,
            adjacencyList,
          },
          startNodeId,
        });
      },

      findEulerianCycle: (startNodeId?: string) => {
        const { cyInstance, nodes, edges, isDirected, getAdjacencyList } = get();
        const adjacencyList = getAdjacencyList();

        return findEulerianCycleAlgorithm({
          params: {
            cyInstance,
            nodes,
            edges,
            adjacencyList,
            isDirected,
          },
          startNodeId,
        });
      },
    }),
    { name: "GraphStore" },
  ),
);
