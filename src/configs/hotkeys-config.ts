import { ClickToActionBinding, HoldToActionBinding } from "@/types/hotkey-store";

type FUNCTION_KEY =
  | "VIEW"
  | "ADD_NODE"
  | "ADD_EDGE"
  | "AUTO_LAYOUT"
  | "CLEAR_GRAPH"
  | "TOGGLE_SIDEBAR"
  | "TOGGLE_BOTTOM_PANEL"
  | "ZOOM_IN"
  | "ZOOM_OUT";

export const HOTKEYS_CONFIG: Record<
  "CLICK",
  Partial<Record<FUNCTION_KEY, ClickToActionBinding["combo"]>>
> &
  Record<"HOLD", Partial<Record<FUNCTION_KEY, HoldToActionBinding["combo"]>>> = {
  CLICK: {
    // Graph Interaction
    VIEW: "v",
    ADD_NODE: "n",
    ADD_EDGE: "e",
    AUTO_LAYOUT: "ctrl+e",
    CLEAR_GRAPH: "ctrl+shift+c",

    // UI Layout interaction
    TOGGLE_SIDEBAR: "ctrl+b",
    TOGGLE_BOTTOM_PANEL: "ctrl+a",
    ZOOM_IN: "ctrl+plus",
    ZOOM_OUT: "ctrl+minus",
  },

  HOLD: {
    // Graph Interaction
    
  },
};
