import { BottomPanelTab } from "@/components/layouts/bottom-panel";
export type GraphMode = "view" | "add-node" | "add-edge" | "delete";

export interface UIStore {
  // State
  mode: GraphMode;
  enableSmartScroll: boolean;

  bottomPanelTab: BottomPanelTab;
  isBottomPanelOpen: boolean;
  isSidebarOpen: boolean;

  // Actions
  setMode: (mode: GraphMode) => void;
  toggleSmartScroll: () => void;
  setBottomPanelTab: (tab: BottomPanelTab) => void;
  toggleBottomPanel: (isOpen: boolean) => void;
  toggleSidebar: (isOpen: boolean) => void;
}
