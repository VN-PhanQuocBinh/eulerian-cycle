import { devtools } from "zustand/middleware";
import { create } from "zustand";
import { HotkeyStore } from "@/types/hotkey-store";

export const useHotkeyStore = create<HotkeyStore>()(
  devtools((set, get) => ({
    bindings: new Map(),

    register: (combo: string, callback: () => void) => {

    },

    unregister: (combo: string) => {
      
    }
  }))
)