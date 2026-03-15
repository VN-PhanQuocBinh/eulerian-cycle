import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AlgorithmStore } from "@/types/algorithm-store";

import type { ConnectedComponentsResult, Step } from "@/types/algorithm-store";
import { TarjanSCC } from "@/core/algorithms/tarjan-scc";
import { EulerianCycle } from "@/core/algorithms/eulerian-cycle";
import { findConnectedComponents as findConnectedComponentsAlgorithm } from "@/core/algorithms/connected-components";
import { GraphData } from "@/types/graph-data-store";

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

      setSteps: (steps: Step[]) => set({ steps }),
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

      // ========== ALGORITHM IMPLEMENTATIONS ==========
      findSCCs: (data: GraphData) => {
        const engine = new TarjanSCC(data);

        if (data.nodes.length === 0) {
          return {
            components: [],
            steps: [],
            message: "Graph is empty. Please add nodes and edges to find SCCs.",
          };
        }

        const result = engine.execute();
        return result;
      },

      findConnectedComponents: (
        data: GraphData,
        startNodeId: string,
      ): ConnectedComponentsResult => {
        const { findSCCs } = get();

        if (data.isDirected) {
          return findSCCs();
        }

        return findConnectedComponentsAlgorithm({
          data,
          startNodeId,
        });
      },

      findEulerianCycle: (data: GraphData, startNodeId?: string) => {
        const engine = new EulerianCycle(data);
        const result = engine.execute(startNodeId);

        return result;
      },
    }),
    { name: "GraphStore" },
  ),
);
