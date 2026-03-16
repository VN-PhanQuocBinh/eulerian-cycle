import { useRef, useEffect } from "react";
import { useUIStore } from "@/stores";

export const useSmartScroll = (isActive: boolean) => {
  const ref = useRef<HTMLTableRowElement | null>(null);
  const enableSmartScroll = useUIStore((state) => state.enableSmartScroll);

  useEffect(() => {
    if (!isActive || !ref.current || !enableSmartScroll) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 1) {
          ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      },
      {
        root: ref.current.closest(".smart-scroll-container"),
        threshold: 1,
      },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [isActive, enableSmartScroll]);

  return ref;
};
