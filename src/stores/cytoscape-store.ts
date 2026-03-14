import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CytoscapeStore } from "@/types/cytoscape-store";

export const useCytoscapeStore = create<CytoscapeStore>()(
  devtools(
    (set) => ({
      cyInstance: null,
      ehInstance: null,

      setCyInstance: (instance) => set({ cyInstance: instance }),
      setEhInstance: (instance) => set({ ehInstance: instance }),
    }),
    { name: "CytoscapeStore" },
  ),
);
