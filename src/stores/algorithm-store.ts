import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AlgorithmStore } from "@/types/algorithm-store";

import type { ConnectedComponentsResult } from "@/types/graph";
import { findSCCs as findSCCsAlgorithm } from "@/core/algorithms/scc";
import { findEulerianCycle as findEulerianCycleAlgorithm } from "@/core/algorithms/eulerian-cycle";
import { findConnectedComponents as findConnectedComponentsAlgorithm } from "@/core/algorithms/connected-components";
import { computeFinalStyles } from "@/core/helpers/compute-final-styles";

export const useAlgorithmStore = create<AlgorithmStore>()(
  devtools(
    (set, get) => ({
      // Algorithm state
      currentAlgorithm: "connected-components",
      isAnimating: false,
      steps: [],
      currentStepIndex: -1,
      speed: 1,

      // Mode actions
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
      updateUItoStep: (targetStepIndex) => {
        const { steps, cyInstance } = get();

        if (!cyInstance) return;

        cyInstance.elements().classes(""); // Reset all classes
        const finalStyles = computeFinalStyles(steps, targetStepIndex);

        cyInstance.batch(() => {
          for (const [elementId, classes] of finalStyles.entries()) {
            const element = cyInstance.getElementById(elementId);
            if (element.length > 0) {
              const classString = Array.from(classes).join(" ");
              element.classes(classString);
              console;
            }
          }
        });
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

      // ========== ALGORITHM IMPLEMENTATIONS ==========
      findSCCs: () => {
        const { getAdjacencyList, cyInstance, nodes } = get();

        if (!cyInstance || nodes.length === 0) {
          return {
            components: [],
            steps: [],
            message: "Graph is empty. Please add nodes and edges to find SCCs.",
          };
        }

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
