type Modifier = "ctrl" | "control" | "shift" | "alt" | "meta";

type Hotkey =
  | "enter"
  | "escape"
  | "tab"
  | "backspace"
  | "delete"
  | "space"
  | "arrowup"
  | "arrowdown"
  | "arrowleft"
  | "arrowright"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";
// Add more keys as needed;

export type KeyCombo = Hotkey | `${Modifier}+${Hotkey}` | `${Modifier}+${Modifier}+${Hotkey}`;

interface HotkeyBinding {
  combo: KeyCombo;
}

export interface ClickToActionBinding extends HotkeyBinding {
  type: "click";
  handler: () => void;
}

export interface HoldToActionBinding extends HotkeyBinding {
  type: "hold";
  keyDownHandler: () => void;
  keyUpHandler: () => void;
}

export type HotkeyProcessor = ClickToActionBinding | HoldToActionBinding;

export interface HotkeyStore {
  bindings: Map<KeyCombo, HotkeyProcessor>;

  register(binding: HotkeyProcessor): void;
  unregister(combo: KeyCombo): void;
}
