import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { NODE_STYLES, EDGE_STYLES } from "@/configs/graph";
import type {
  GraphNode,
  GraphEdge,
  GraphState,
  Step,
  ConnectedComponentsResult,
} from "@/types/graph";
import { COMPONENT_COLORS } from "@/types/styles";

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

      // Animation state
      connectedComponents: [],
      steps: [],

      // Animation state
      isAnimating: false,
      highlightedNodes: [],
      highlightedEdges: [],

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

      // Algorithms implementation
      getAdjacencyList: (): Map<string, Set<string>> => {
        const { nodes, edges, isDirected } = get();
        const adjacencyList: Map<string, Set<string>> = new Map();

        // Khởi tạo adjacency list cho tất cả nodes
        nodes.forEach((node) => {
          adjacencyList.set(node.id, new Set());
        });

        // Thêm edges vào adjacency list
        edges.forEach((edge) => {
          adjacencyList.get(edge.source)?.add(edge.target);

          // Nếu là đồ thị vô hướng, thêm cả chiều ngược lại
          if (!isDirected) {
            adjacencyList.get(edge.target)?.add(edge.source);
          }
        });

        return adjacencyList;
      },

      // ========== HELPER METHODS ==========
      highlightNode: (nodeId: string, className: string, pulse = false) => {
        const { cyInstance } = get();
        if (!cyInstance) return;

        const node = cyInstance.getElementById(nodeId);
        if (node.length === 0) return;

        node.addClass(className);

        if (pulse) {
          node.animate({
            style: { width: 50, height: 50 },
            duration: 200,
            complete: () => {
              node.animate({
                style: { width: 40, height: 40 },
                duration: 200,
              });
            },
          });
        }
      },

      highlightEdge: (sourceId: string, targetId: string, className: string) => {
        const { cyInstance, isDirected } = get();
        if (!cyInstance) return;

        let edge = cyInstance.edges(`[source="${sourceId}"][target="${targetId}"]`);
        if (edge.length === 0 && !isDirected) {
          edge = cyInstance.edges(`[source="${targetId}"][target="${sourceId}"]`);
        }

        if (edge.length > 0) {
          edge[0].addClass(className);
        }
      },

      clearHighlights: () => {
        const { cyInstance } = get();
        if (!cyInstance) return;

        // Reset all nodes and edges to default style
        // cyInstance.nodes().style(NODE_STYLES);
        // cyInstance.edges().style(EDGE_STYLES);
        cyInstance.nodes().classes("");
        cyInstance.edges().classes("");

        set({
          highlightedNodes: [],
          highlightedEdges: [],
        });
      },

      // ========== ALGORITHM IMPLEMENTATIONS ==========
      findConnectedComponents: (): ConnectedComponentsResult => {
        const { nodes, cyInstance, getAdjacencyList } = get();

        const steps: ConnectedComponentsResult["steps"] = [];

        if (nodes.length === 0 || !cyInstance) {
          return {
            components: [],
            steps: [],
          };
        }

        const adjacencyList = getAdjacencyList();
        const visited = new Set<string>();
        const components: string[][] = [];

        // BFS with animation
        const animatedBFS = (startNode: string, componentIndex: number): string[] => {
          const queue: string[] = [startNode];
          const component: string[] = [];

          visited.add(startNode);

          while (queue.length > 0) {
            const current = queue.shift()!;
            component.push(current);

            // Record step for visiting node
            steps.push({
              prev: {
                classes: cyInstance.getElementById(current).classes(),
              },
              current: {
                elementId: current,
                elementType: "node",
                action: "visit",
                message: `Visited node ${current}`,
                classes: [`component-${componentIndex % COMPONENT_COLORS.length}`],
              },
            });

            const neighbors = adjacencyList.get(current) || new Set();

            for (const neighbor of neighbors) {
              if (!visited.has(neighbor)) {
                visited.add(neighbor);

                // Highlight edge being explored
                let processingEdge = cyInstance.edges(
                  `[source="${current}"][target="${neighbor}"]`,
                );
                if (processingEdge.length === 0) {
                  processingEdge = cyInstance.edges(`[source="${neighbor}"][target="${current}"]`);
                }

                steps.push({
                  prev: {
                    classes: processingEdge[0].classes(),
                  },
                  current: {
                    sourceElement: current,
                    targetElement: neighbor,
                    elementType: "edge",
                    action: "visit",
                    message: `Visited edge from ${current} to ${neighbor}`,
                    classes: [`component-${componentIndex % COMPONENT_COLORS.length}`],
                  },
                });

                // Enqueue neighbor
                queue.push(neighbor);
              }
            }
          }

          return component;
        };

        // Main algorithm loop
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if (!visited.has(node.id)) {
            const component = animatedBFS(node.id, components.length);
            components.push(component);
          }
        }

        return {
          components,
          steps,
        };
      },

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
