import { UIStore } from "@/types/ui-store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GraphMode } from "@/types/ui-store";

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      mode: "view",

      setMode: (mode: GraphMode) => set({ mode }),

      // Graph operations
      clearGraph: () => {
        set(() => ({
          mode: "view",
          nodes: [],
          edges: [],
          isDirected: false,
        }));
      },

      
    }),
    { name: "UIStore" },
  ),
);
