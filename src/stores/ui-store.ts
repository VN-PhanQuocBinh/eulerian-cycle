import { UIStore } from "@/types/ui-store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GraphMode } from "@/types/ui-store";

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      mode: "view",
      enableSmartScroll: true,
      bottomPanelTab: "steps",
      isBottomPanelOpen: true,
      isSidebarOpen: true,
      showStack: true,
      showQueue: true,

      setMode: (mode: GraphMode) => set({ mode }),
      toggleSmartScroll: () => set((state) => ({ enableSmartScroll: !state.enableSmartScroll })),
      setBottomPanelTab: (tab) => set({ bottomPanelTab: tab }),
      toggleBottomPanel: (isOpen) => set({ isBottomPanelOpen: isOpen }),
      toggleSidebar: (isOpen) => set({ isSidebarOpen: isOpen }),
      toggleShowStack: (show) => set({ showStack: show }),
      toggleShowQueue: (show) => set({ showQueue: show }),
    }),
    { name: "UIStore" },
  ),
);
