import { useEffect, useRef } from "react";

export function useAppHotkeys() {
  const pressedKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (event.repeat) {
        return; // Ignore repeated keydown events
      }

      pressedKeysRef.current.add(key);

      console.log("Pressed Combo:", Array.from(pressedKeysRef.current).join(" + "));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      pressedKeysRef.current.delete(key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
}
