import { GraphData } from "./../types/graph-data-store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AlgorithmStore } from "@/types/algorithm-store";

import type { ConnectedComponentsResult, GraphAlgorithm, Step } from "@/types/algorithm-store";
import { TarjanSCC } from "@/core/algorithms/tarjan-scc";
import { EulerianCycle } from "@/core/algorithms/eulerian-cycle";
import { DFS } from "@/core/algorithms/dfs";
import { findConnectedComponents as findConnectedComponentsAlgorithm } from "@/core/algorithms/connected-components";

const INITIAL_ALGORITHM: GraphAlgorithm = "dfs";

export const useAlgorithmStore = create<AlgorithmStore>()(
  devtools(
    (set, get) => ({
      // Algorithm state
      currentAlgorithm: INITIAL_ALGORITHM,
      isAnimating: false,
      steps: [],
      currentStepIndex: -1,
      speed: 1,
      startNodeId: null,

      // Mode actions
      setIsAnimating: (isAnimating) => set({ isAnimating }),
      setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
      setSpeed: (speed) => set({ speed }),

      setSteps: (steps: Step[]) => set({ steps }),
      setCurrentAlgorithm: (algorithm) => set({ currentAlgorithm: algorithm }),
      setStartNodeId: (startNodeId) => set({ startNodeId }),

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
          startNodeId,
          setSteps,
          findSCCs,
          findConnectedComponents,
          findEulerianCycle,
        } = get();

        const startNodeIdToUse = startNodeId || data.nodes[0]?.id || "";

        switch (currentAlgorithm) {
          case "connected-components": {
            if (data.isDirected) {
              const { steps } = findSCCs(data, startNodeIdToUse);
              // console.log("SCC Steps:", steps);
              setSteps(steps || []);
            } else {
              const { steps } = findConnectedComponents(data, startNodeIdToUse);
              setSteps(steps || []);
            }

            break;
          }
          case "eulerian-cycle": {
            const { steps } = findEulerianCycle(data, startNodeIdToUse);
            setSteps(steps || []);
            break;
          }
          case "dfs": {
            const engine = new DFS(data);
            const result = engine.execute(startNodeIdToUse, data.nodes[2]?.id || startNodeIdToUse);
            console.log("DFS Steps:", result);
            setSteps(result.steps || []);
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
