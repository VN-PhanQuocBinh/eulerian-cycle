import { useHotkeyStore } from "@/stores/hotkey-store";
import { KeyCombo } from "@/types/hotkey-store";
import { useEffect, useRef } from "react";

export function useAppHotkeys() {
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const hotkeysBindings = useHotkeyStore((s) => s.bindings);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")
      ) {
        return; // Ignore key events when focused on input fields
      }

      const key = event.key.toLowerCase();

      if (event.repeat) {
        return; // Ignore repeated keydown events
      }

      pressedKeysRef.current.add(key);

      console.log("Pressed Combo:", Array.from(pressedKeysRef.current).join(" + "));

      const lowerCaseCombo =
        pressedKeysRef.current.size > 1 ? Array.from(pressedKeysRef.current).join(" + ") : key;
      const binding = hotkeysBindings.get(lowerCaseCombo as KeyCombo);

      console.log("Matching Binding:", binding);

      if (binding) {
        if (binding.type === "click") {
          binding.handler();
        } else if (binding.type === "hold") {
          binding.keyDownHandler();
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      pressedKeysRef.current.delete(key);
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
