import { GraphData } from "./../types/graph-data-store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AlgorithmParamsMap, AlgorithmStore } from "@/types/algorithm-store";

import { ConnectedComponentsResult } from "@/core/types/algorithm";
import type { GraphAlgorithm, Step } from "@/types/algorithm-store";
import { TarjanSCC } from "@/core/algorithms/tarjan-scc";
import { EulerianCycle } from "@/core/algorithms/eulerian-cycle";
import { DFS } from "@/core/algorithms/dfs";
import { BFS } from "@/core/algorithms/bfs";
import { Dijkstra } from "@/core/algorithms/dijkstra";
import { findConnectedComponents as findConnectedComponentsAlgorithm } from "@/core/algorithms/connected-components";

const INITIAL_ALGORITHM: GraphAlgorithm = "dijkstra";

export const useAlgorithmStore = create<AlgorithmStore>()(
  devtools(
    (set, get) => ({
      // Constant values
      ALGORITHMS_WITH_TARGET_NODE: ["dfs", "bfs", "dijkstra"],

      // Algorithm state
      currentAlgorithm: INITIAL_ALGORITHM,
      isAnimating: false,
      steps: [],
      currentStepIndex: -1,
      speed: 1,

      // For further customization of algorithm parameters, we can use a generic setter
      algorithmParams: {
        "eulerian-cycle": {
          startNodeId: "",
        },
        "connected-components": {
          startNodeId: "",
        },
        dfs: {
          startNodeId: "",
          targetNodeId: "",
        },
        bfs: {
          startNodeId: "",
          targetNodeId: "",
        },
      } as AlgorithmParamsMap,
      executionResult: null,

      // Mode actions
      setIsAnimating: (isAnimating) => set({ isAnimating }),
      setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
      setSpeed: (speed) => set({ speed }),

      setSteps: (steps: Step[]) => set({ steps }),
      setCurrentAlgorithm: (algorithm) => set({ currentAlgorithm: algorithm }),

      // For further customization of algorithm parameters, we can use a generic setter
      setAlgorithmParams: (algo, params) => {
        set((state) => ({
          algorithmParams: {
            ...state.algorithmParams,
            [algo]: {
              ...state.algorithmParams[algo],
              ...params,
            },
          },
        }));
      },
      setExecutionResult: (result) => set({ executionResult: result }),

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

      jumpToStep: (index: number) => {
        const { steps } = get();
        if (index >= 0 && index < steps.length) {
          set({ currentStepIndex: index });
        }
      },

      // ========== ALGORITHM IMPLEMENTATIONS ==========
      findSCCs: (data: GraphData, startNodeId: string) => {
        const engine = new TarjanSCC(data);

        if (data.nodes.length === 0) {
          return {
            components: [],
            steps: [],
            message: "Graph is empty. Please add nodes and edges to find SCCs.",
          };
        }

        const result = engine.execute(startNodeId);
        return result;
      },

      findConnectedComponents: (
        data: GraphData,
        startNodeId: string,
      ): ConnectedComponentsResult => {
        const { findSCCs } = get();

        if (data.isDirected) {
          return findSCCs(data, startNodeId);
        }

        const result = findConnectedComponentsAlgorithm({
          data,
          startNodeId: startNodeId || data.nodes[0]?.id,
        });

        return result;
      },

      findEulerianCycle: (data: GraphData, startNodeId: string) => {
        const engine = new EulerianCycle(data);
        const result = engine.execute(startNodeId);

        return result;
      },

      recalculateSteps: (data: GraphData) => {
        const {
          currentAlgorithm,
          algorithmParams,
          setAlgorithmParams,
          setSteps,
          findSCCs,
          findConnectedComponents,
          findEulerianCycle,
          setExecutionResult,
        } = get();

        switch (currentAlgorithm) {
          case "connected-components": {
            const startNodeIdToUse =
              algorithmParams["connected-components"].startNodeId || data.nodes[0]?.id;
            setAlgorithmParams("connected-components", { startNodeId: startNodeIdToUse });

            if (data.isDirected) {
              const result = findSCCs(data, startNodeIdToUse);
              setSteps(result.steps || []);
              setExecutionResult(result);
            } else {
              const result = findConnectedComponents(data, startNodeIdToUse);
              setSteps(result.steps || []);
              setExecutionResult(result);
            }

            break;
          }
          case "eulerian-cycle": {
            const result = findEulerianCycle(
              data,
              algorithmParams["eulerian-cycle"].startNodeId || data.nodes[0]?.id,
            );
            setSteps(result.steps || []);
            setExecutionResult(result);
            break;
          }
          case "dfs": {
            const engine = new DFS(data);
            const startNodeIdToUse = algorithmParams["dfs"].startNodeId || data.nodes[0]?.id;
            const targetNodeIdToUse = algorithmParams["dfs"].targetNodeId || data.nodes[0]?.id;

            const result = engine.execute(startNodeIdToUse, targetNodeIdToUse);

            setAlgorithmParams("dfs", {
              startNodeId: startNodeIdToUse,
              targetNodeId: targetNodeIdToUse,
            });
            setSteps(result.steps || []);
            setExecutionResult(result);
            break;
          }
          case "bfs": {
            const engine = new BFS(data);
            const startNodeIdToUse = algorithmParams["bfs"].startNodeId || data.nodes[0]?.id;
            const targetNodeIdToUse = algorithmParams["bfs"].targetNodeId || startNodeIdToUse;

            const result = engine.execute(startNodeIdToUse, targetNodeIdToUse);
            setAlgorithmParams("bfs", {
              startNodeId: startNodeIdToUse,
              targetNodeId: targetNodeIdToUse,
            });
            setSteps(result.steps || []);
            setExecutionResult(result);
            break;
          }
          case "dijkstra": {
            const engine = new Dijkstra(data);
            const startNodeIdToUse = algorithmParams["dijkstra"].startNodeId || data.nodes[0]?.id;
            const targetNodeIdToUse = algorithmParams["dijkstra"].targetNodeId;

            const result =
              targetNodeIdToUse !== startNodeIdToUse
                ? engine.execute(startNodeIdToUse, targetNodeIdToUse)
                : engine.execute(startNodeIdToUse);

            setSteps(result.steps || []);
            setExecutionResult(result);
            break;
          }
          default:
            setSteps([]);
        }
      },
    }),
    { name: "GraphStore" },
  ),
);
