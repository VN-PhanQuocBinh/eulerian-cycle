export interface HotkeyBinding {
  combo: string;
  callback: () => void;
}

export interface HotkeyStore {
  bindings: Map<string, HotkeyBinding>;

  register(combo: string, callback: () => void): void;
  unregister(combo: string): void;
}
