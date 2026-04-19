import { devtools } from "zustand/middleware";
import { create } from "zustand";
import { HotkeyStore, HotkeyProcessor, KeyCombo } from "@/types/hotkey-store";

export const useHotkeyStore = create<HotkeyStore>()(
  devtools((set, get) => ({
    bindings: new Map(),

    register: (binding: HotkeyProcessor) => {
      const currentBindings = get().bindings;

      if (currentBindings.has(binding.combo)) {
        throw new Error(`Hotkey combo "${binding.combo}" is already registered.`);
      }

      set((state) => {
        const newBindings = new Map(state.bindings);
        newBindings.set(binding.combo, binding);
        return { ...state, bindings: newBindings };
      });
    },

    unregister: (combo: KeyCombo) => {
      set((state) => {
        const newBindings = new Map(state.bindings);
        newBindings.delete(combo);
        return { ...state, bindings: newBindings };
      });
    },
  })),
);
