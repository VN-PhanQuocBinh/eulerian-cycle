import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type {
  GraphNode,
  GraphEdge,
  GraphState,
  StoredStep,
  ConnectedComponentsResult,
  GraphData,
} from "@/types/graph";
import { COMPONENT_COLORS } from "@/types/styles";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

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

      // Animation state
      isAnimating: false,

      // Algorithm state
      currentAlgorithm: "eulerian-cycle",
      steps: [],

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

      // Algorithms implementation
      getAdjacencyList: (): Map<string, GraphNode[]> => {
        const state = get();
        const { nodes, edges, isDirected } = state;
        const adjacencyList: Map<string, GraphNode[]> = new Map();

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
              sourceAdj.push(targetNode);
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
                targetAdj.push(sourceNode);
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
                elements: [
                  {
                    type: "node",
                    id: current,
                    label: cyInstance.getElementById(current).data("label"),
                    classes: cyInstance.getElementById(current).classes(),
                  },
                ],
              },
              current: {
                elements: [
                  {
                    type: "node",
                    id: current,
                    label: cyInstance.getElementById(current).data("label"),
                    classes: [`component-${componentIndex % COMPONENT_COLORS.length}`],
                  },
                ],
                action: "visit",
                message: [`Visited node ${current}`],
              },
            });

            const neighbors = adjacencyList.get(current) || [];

            for (const neighbor of neighbors) {
              if (!visited.has(neighbor.id)) {
                visited.add(neighbor.id);

                // Highlight edge being explored
                let processingEdge = cyInstance.edges(
                  `[source="${current}"][target="${neighbor.id}"]`,
                );
                if (processingEdge.length === 0) {
                  processingEdge = cyInstance.edges(
                    `[source="${neighbor.id}"][target="${current}"]`,
                  );
                }

                steps.push({
                  prev: {
                    elements: [
                      {
                        type: "edge",
                        id: processingEdge[0].id(),
                        source: {
                          type: "node",
                          id: current,
                          label: cyInstance.getElementById(current).data("label"),
                        },
                        target: {
                          type: "node",
                          id: neighbor.id,
                          label: cyInstance.getElementById(neighbor.id).data("label"),
                        },
                        classes: processingEdge[0].classes(),
                      },
                    ],
                  },
                  current: {
                    elements: [
                      {
                        type: "edge",
                        id: processingEdge[0].id(),
                        source: {
                          type: "node",
                          id: current,
                          label: cyInstance.getElementById(current).data("label"),
                        },
                        target: {
                          type: "node",
                          id: neighbor.id,
                          label: cyInstance.getElementById(neighbor.id).data("label"),
                        },
                        classes: [`component-${componentIndex % COMPONENT_COLORS.length}`],
                      },
                    ],
                    action: "visit",
                    message: [`Visited edge from ${current} to ${neighbor.id}`],
                  },
                });

                // Enqueue neighbor
                queue.push(neighbor.id);
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

      // findEulerianCycle: () => {
      //   const { cyInstance, nodes, isDirected, getAdjacencyList, checkEulerianCycle } = get();
      //   const steps: StoredStep[] = [];

      //   // Logic to find Eulerian Cycle
      //   if (nodes.length === 0 || !cyInstance) {
      //     return { cycle: null, steps: [] };
      //   }

      //   const check = checkEulerianCycle();
      //   if (!check.exists) {
      //     return { cycle: null, steps: [], message: check.reason };
      //   }

      //   const adjacencyList = getAdjacencyList();

      //   // Hierholzer's Algorithm
      //   const circuit: GraphNode[] = [];
      //   const stack: GraphNode[] = [nodes[0]];
      //   const visitedEdges = new Set<string>();

      //   while (stack.length > 0) {
      //     const currentNode = stack[stack.length - 1];
      //     const currentNodeNeighbors = adjacencyList.get(currentNode.id) || [];

      //     if (currentNodeNeighbors.length > 0) {
      //       const nextNode = currentNodeNeighbors.pop()!;

      //       let processingEdge = cyInstance.edges(
      //         `edge[source = "${currentNode.id}"][target = "${nextNode.id}"]`,
      //       );
      //       if (processingEdge.length === 0 && !isDirected) {
      //         processingEdge = cyInstance.edges(
      //           `edge[source = "${nextNode.id}"][target = "${currentNode.id}"]`,
      //         );
      //       }

      //       const edgeId = Array.from(processingEdge)
      //         .find((edge) => !visitedEdges.has(edge.id()))
      //         ?.id();

      //       console.group("Debug Info");
      //       console.log("Current Node:", currentNode);
      //       console.log("Next Node:", nextNode);
      //       console.log("Edge ID:", edgeId);
      //       console.log("Already Visited Edges:", visitedEdges.has(edgeId!));
      //       console.log("Stack:", stack);
      //       console.log("Circuit:", circuit);
      //       console.groupEnd();

      //       steps.push({
      //         prev: {
      //           classes: cyInstance.getElementById(currentNode.id).classes(),
      //         },
      //         current: {
      //           element: {
      //             type: "node",
      //             id: currentNode.id,
      //             label: currentNode.label,
      //           },
      //           action: "explore",
      //           message: [`Exploring from node ${currentNode.label}`],
      //           classes: ["exploring"],
      //           stack: [...stack, nextNode],
      //           circuit: [...circuit],
      //         },
      //       });

      //       if (!edgeId) continue;

      //       if (!isDirected) {
      //         const nextNodeNeighbors = adjacencyList.get(nextNode.id) || [];
      //         const index = nextNodeNeighbors.indexOf(currentNode);
      //         if (index !== -1) nextNodeNeighbors.splice(index, 1);
      //       }

      //       steps.push({
      //         prev: {
      //           classes: processingEdge[0].classes(),
      //         },
      //         current: {
      //           element: {
      //             type: "edge",
      //             id: edgeId,
      //             source: { type: "node", id: currentNode.id, label: currentNode.label },
      //             target: { type: "node", id: nextNode.id, label: nextNode.label },
      //           },
      //           action: "traverse",
      //           message: [`Traversing edge from ${currentNode.label} to ${nextNode.label}`],
      //           classes: ["in-cycle"],
      //           stack: [...stack, nextNode],
      //           circuit: [...circuit],
      //         },
      //       });

      //       visitedEdges.add(edgeId);
      //       stack.push(nextNode);
      //     } else {
      //       circuit.push(stack.pop()!);
      //       steps.push({
      //         prev: {
      //           classes: cyInstance.getElementById(currentNode.id).classes(),
      //         },
      //         current: {
      //           element: {
      //             type: "node",
      //             id: currentNode.id,
      //             label: currentNode.label,
      //           },
      //           action: "add-to-circuit",
      //           message: [`Added ${currentNode.label} to circuit`],
      //           classes: ["in-cycle"],
      //           stack: [...stack],
      //           circuit: [...circuit],
      //         },
      //       });
      //     }
      //   }

      //   circuit.reverse();
      //   console.log("Eulerian Circuit:", circuit);

      //   return {
      //     cycle: circuit,
      //     steps: steps,
      //     message: "Eulerian cycle found successfully.",
      //   };
      // },

      findEulerianCycle: () => {
        const { cyInstance, nodes, isDirected, getAdjacencyList, checkEulerianCycle } = get();
        const steps: StoredStep[] = [];

        // Logic to find Eulerian Cycle
        if (nodes.length === 0 || !cyInstance) {
          return { cycle: null, steps: [] };
        }

        const check = checkEulerianCycle();
        if (!check.exists) {
          return { cycle: null, steps: [], message: check.reason };
        }

        const adjacencyList = getAdjacencyList();

        // Hierholzer's Algorithm
        const circuit: GraphNode[] = [];
        const stack: GraphNode[] = [nodes[0]];
        const visitedEdges = new Set<string>();

        while (stack.length > 0) {
          const currentNode = stack[stack.length - 1];
          const currentNodeNeighbors = adjacencyList.get(currentNode.id) || [];

          if (currentNodeNeighbors.length > 0) {
            const nextNode = currentNodeNeighbors.pop()!;

            let processingEdge = cyInstance.edges(
              `edge[source = "${currentNode.id}"][target = "${nextNode.id}"]`,
            );
            if (processingEdge.length === 0 && !isDirected) {
              processingEdge = cyInstance.edges(
                `edge[source = "${nextNode.id}"][target = "${currentNode.id}"]`,
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
            console.log("Stack:", stack);
            console.log("Circuit:", circuit);
            console.groupEnd();

            if (!edgeId) continue;

            if (!isDirected) {
              const nextNodeNeighbors = adjacencyList.get(nextNode.id) || [];
              const index = nextNodeNeighbors.indexOf(currentNode);
              if (index !== -1) nextNodeNeighbors.splice(index, 1);
            }

            steps.push({
              prev: {
                elements: [],
              },
              current: {
                elements: [
                  {
                    type: "node",
                    id: currentNode.id,
                    label: currentNode.label,
                    classes: ["exploring"],
                  },
                  {
                    type: "edge",
                    id: edgeId,
                    source: { type: "node", id: currentNode.id, label: currentNode.label },
                    target: { type: "node", id: nextNode.id, label: nextNode.label },
                    classes: ["in-cycle"],
                  },
                ],
                action: "traverse",
                message: [
                  `Exploring from node ${currentNode.label}`,
                  `Traversing edge from ${currentNode.label} to ${nextNode.label}`,
                  `Marking edge (${currentNode.label}, ${nextNode.label}) as visited`,
                ],
                stack: [...stack, nextNode],
                circuit: [...circuit],
              },
            });

            visitedEdges.add(edgeId);
            stack.push(nextNode);
          } else {
            circuit.push(stack.pop()!);
            steps.push({
              prev: {
                elements: [
                  {
                    type: "node",
                    id: currentNode.id,
                    label: currentNode.label,
                    classes: cyInstance.getElementById(currentNode.id).classes(),
                  },
                ],
              },
              current: {
                elements: [
                  {
                    type: "node",
                    id: currentNode.id,
                    label: currentNode.label,
                    classes: ["in-cycle"],
                  },
                ],
                action: "add-to-circuit",
                message: [
                  `Exploring from node ${currentNode.label}`,
                  `No more neighbors to explore from ${currentNode.label}`,
                  `Added ${currentNode.label} to circuit`,
                ],
                stack: [...stack],
                circuit: [...circuit],
              },
            });
          }
        }

        circuit.reverse();
        console.log("Eulerian Circuit:", circuit);

        return {
          cycle: circuit,
          steps: steps,
          message: "Eulerian cycle found successfully.",
        };
      },
    }),
    { name: "GraphStore" },
  ),
);
