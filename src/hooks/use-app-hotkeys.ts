import { HOTKEYS_CONFIG } from '@/configs/hotkeys-config';
import { useHotkeyStore } from "@/stores/hotkey-store";
import { KeyCombo } from "@/types/hotkey-store";
import { useEffect, useRef } from "react";
import { useRegisterHotkey } from "./use-register-hotkey";
import commandManager from "@/stores/command-manager";
import { useCommandManager } from './use-command-manager';

function mappingKeyToCombo(key: string): string {
  const lowerKey = key.toLowerCase();
  if (lowerKey === "control") return "ctrl";
  if (lowerKey === " ") return "space";
  if (lowerKey === "+") return "plus";
  if (lowerKey === "-") return "minus";
  return lowerKey;
}

export function useAppHotkeys() {
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const hotkeysBindings = useHotkeyStore((s) => s.bindings);
  const { undo, redo } = useCommandManager();

  useRegisterHotkey({
    type: "click",
    combo: HOTKEYS_CONFIG.CLICK.UNDO,
    handler: () => {
      undo();
    },
  })

  useRegisterHotkey({
    type: "click",
    combo: HOTKEYS_CONFIG.CLICK.REDO,
    handler: () => {
      redo();
    },
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")
      ) {
        return; // Ignore key events when focused on input fields
      }

      const key = mappingKeyToCombo(event.key);

      if (event.repeat) {
        return; // Ignore repeated keydown events
      }

      pressedKeysRef.current.add(key);

      const lowerCaseCombo =
        pressedKeysRef.current.size > 1 ? Array.from(pressedKeysRef.current).join("+") : key;
      const binding = hotkeysBindings.get(lowerCaseCombo as KeyCombo);

      if (binding) {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("hotkey-triggered", { detail: binding }));

        if (binding.type === "click") {
          binding.handler();
        } else if (binding.type === "hold") {
          binding.keyDownHandler();
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = mappingKeyToCombo(event.key);

      if (pressedKeysRef.current.has(key)) {
        const binding = hotkeysBindings.get(key as KeyCombo);

        if (binding && binding.type === "hold") {
          binding.keyUpHandler();
        }

        pressedKeysRef.current.delete(key);
      }
    };

    const handleBlur = () => {
      pressedKeysRef.current.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [hotkeysBindings]);
}
