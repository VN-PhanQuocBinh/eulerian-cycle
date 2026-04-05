import { useEffect, useRef } from "react";
import { HotkeyProcessor } from "@/types/hotkey-store";
import { useHotkeyStore } from "@/stores/hotkey-store";

export function useRegisterHotkey(binding: HotkeyProcessor) {
  const register = useHotkeyStore((s) => s.register);
  const unregister = useHotkeyStore((s) => s.unregister);

  const clickHandler = useRef<() => void | undefined>();
  const keyDownHandler = useRef<() => void | undefined>();
  const keyUpHandler = useRef<() => void | undefined>();

  useEffect(() => {
    if (binding.type === "click") {
      clickHandler.current = binding.handler;
    } else if (binding.type === "hold") {
      keyDownHandler.current = binding.keyDownHandler;
      keyUpHandler.current = binding.keyUpHandler;
    }
  });

  useEffect(() => {
    const lowerCaseCombo = new String(binding.combo).toLowerCase() as any; // Type assertion to KeyCombo

    const stableBinding =
      binding.type === "click"
        ? {
            ...binding,
            handler: () => clickHandler.current?.(),
          }
        : {
            ...binding,
            keyDownHandler: () => keyDownHandler.current?.(),
            keyUpHandler: () => keyUpHandler.current?.(),
          };

    register({ ...stableBinding, combo: lowerCaseCombo });

    return () => {
      unregister(binding.combo);
    };
  }, [binding.combo, binding.type, register, unregister]);
}
