import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { generateEdgeSelector } from "@/utils";

import type {
  GraphNode,
  GraphEdge,
  GraphState,
  Step,
  ConnectedComponentsResult,
  GraphData,
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
      isAnimating: false,

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
          isDirected,
        });
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
          set({ graphData });

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
      getAdjacencyList: (): Map<string, string[]> => {
        const { nodes, edges, isDirected } = get();
        const adjacencyList: Map<string, string[]> = new Map();

        // Khởi tạo adjacency list cho tất cả nodes
        nodes.forEach((node) => {
          adjacencyList.set(node.id, []);
        });

        // Thêm edges vào adjacency list
        edges.forEach((edge) => {
          adjacencyList.get(edge.source)?.push(edge.target);

          // Nếu là đồ thị vô hướng, thêm cả chiều ngược lại
          if (!isDirected) {
            adjacencyList.get(edge.target)?.push(edge.source);
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

        let edge = cyInstance.edges(`[source="${sourceId}"][target="${targetId}"]`);
        if (edge.length === 0 && !isDirected) {
          edge = cyInstance.edges(`[source="${targetId}"][target="${sourceId}"]`);
        }

        if (edge.length > 0) {
          edge[0].addClass(className);
        }
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

            const neighbors = adjacencyList.get(current) || [];

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

      checkEulerianCycle: () => {
        const { nodes, edges, isDirected, getAdjacencyList } = get();

        if (nodes.length === 0) {
          return { exists: false, reason: "Graph is empty." };
        }

        const adjacencyList = getAdjacencyList();

        if (isDirected) {
          const inDegrees: Map<string, number> = new Map();
          const outDegrees: Map<string, number> = new Map();

          nodes.forEach((node) => {
            inDegrees.set(node.id, 0);
            outDegrees.set(node.id, 0);
          });

          edges.forEach((edge) => {
            outDegrees.set(edge.source, (outDegrees.get(edge.source) || 0) + 1);
            inDegrees.set(edge.target, (inDegrees.get(edge.target) || 0) + 1);
          });

          for (const node of nodes) {
            if (inDegrees.get(node.id) !== outDegrees.get(node.id)) {
              return {
                exists: false,
                reason: `Node ${node.id} has in-degree ${inDegrees.get(
                  node.id,
                )} ≠ out-degree ${outDegrees.get(node.id)}.`,
              };
            }
          }
        } else {
          for (const node of nodes) {
            const degree = adjacencyList.get(node.id)?.length || 0;
            if (degree % 2 !== 0) {
              return {
                exists: false,
                reason: `Node ${node.id} has odd degree ${degree}.`,
              };
            }
          }
        }

        return { exists: true };
      },

      findEulerianCycle: () => {
        const { cyInstance, nodes, edges, isDirected, getAdjacencyList, checkEulerianCycle } =
          get();

        const getEdgeKey = (from: string, to: string) => {
          return isDirected ? `${from}-${to}` : [from, to].sort().join("-");
        };

        // Logic to find Eulerian Cycle
        if (nodes.length === 0 || !cyInstance) {
          return { cycle: null, steps: [] };
        }

        const check = checkEulerianCycle();
        if (!check.exists) {
          return { cycle: null, steps: [] };
        }

        const adjacencyList = getAdjacencyList();

        const circuit: string[] = [];
        const stack: string[] = [nodes[0].id];
        let currentNode = nodes[0].id;

        const visitedEdges = new Set<string>();

        while (stack.length > 0) {
          const neighbors = adjacencyList.get(currentNode) || [];

          if (neighbors.length > 0) {
            const nextNode = neighbors.pop()!;
            let processingEdge = cyInstance.edges(
              `edge[source = "${currentNode}"][target = "${nextNode}"]`,
            );
            if (processingEdge.length === 0 && !isDirected) {
              processingEdge = cyInstance.edges(
                `edge[source = "${nextNode}"][target = "${currentNode}"]`,
              );
            }

            const edgeId = Array.from(processingEdge)
              .find((edge) => !visitedEdges.has(edge.id()))
              ?.id();

            console.group("Debug Info");
            console.log("Current Node:", currentNode);
            console.log("Next Node:", nextNode);
            console.log("Edge ID:", edgeId);
            console.log("Already Visited Edges:", visitedEdges.has(edgeId!));
            console.groupEnd();

            if (!edgeId || visitedEdges.has(edgeId)) continue;

            visitedEdges.add(edgeId);
            stack.push(currentNode);
            currentNode = nextNode!;
          } else {
            circuit.push(currentNode);
            currentNode = stack.pop()!;
          }
        }

        circuit.reverse();

        console.log("Stack:", stack);
        console.log("Eulerian Circuit:", circuit);

        return {
          cycle: circuit,
          steps: [],
        };
      },
    }),
    { name: "GraphStore" },
  ),
);
