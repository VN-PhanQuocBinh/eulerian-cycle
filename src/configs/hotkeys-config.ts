import { KeyCombo } from "@/types/hotkey-store";

type FUNCTION_KEY =
  | "VIEW"
  | "ADD_NODE"
  | "ADD_EDGE"
  | "AUTO_LAYOUT"
  | "CLEAR_GRAPH"
  | "TOGGLE_SIDEBAR"
  | "TOGGLE_BOTTOM_PANEL"
  | "TOGGLE_SIDEBAR"
  | "ZOOM_IN"
  | "ZOOM_OUT"
  | "FORWARD"
  | "BACKWARD"
  | "TOGGLE_RUN"
  | "UNDO"
  | "REDO"

export const HOTKEYS_CONFIG: Record<
  "CLICK",
  Record<FUNCTION_KEY, KeyCombo>
> &
  Record<"HOLD", Partial<Record<FUNCTION_KEY, KeyCombo>>> = {
  CLICK: {
    // Graph Interaction
    VIEW: "v",
    ADD_NODE: "n",
    ADD_EDGE: "e",
    AUTO_LAYOUT: "ctrl+e",
    CLEAR_GRAPH: "ctrl+shift+c",
    UNDO: "ctrl+z",
    REDO: "ctrl+y",

    // UI Layout interaction
    TOGGLE_SIDEBAR: "ctrl+b",
    TOGGLE_BOTTOM_PANEL: "ctrl+a",
    ZOOM_IN: "ctrl+plus",
    ZOOM_OUT: "ctrl+minus",

    // Visualization Interaction
    FORWARD: "arrowright",
    BACKWARD: "arrowleft",
    TOGGLE_RUN: "space",
  },

  HOLD: {
    // Graph Interaction
    
  },
};
