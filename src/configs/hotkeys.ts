export type Hotkey = {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean; // Command key on macOS
};

export type HotkeyAction = "toggleFullscreen" | "deleteSelection";

export const hotkeys: Record<HotkeyAction, Hotkey> = {
  toggleFullscreen: { key: "f", ctrlKey: true },
  deleteSelection: { key: "Delete" },
};
