import { HotkeyProcessor } from "@/types/hotkey-store";

declare global {
  interface WindowEventMap {
    "hotkey-triggered": CustomEvent<HotkeyProcessor>;
  }
}

export {};
