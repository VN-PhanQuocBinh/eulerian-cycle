import { useRef, useEffect } from "react";
import { useUIStore } from "@/stores";

export const useSmartScroll = <T extends HTMLElement = HTMLElement>(isActive: boolean) => {
  const ref = useRef<T | null>(null);
  const enableSmartScroll = useUIStore((state) => state.enableSmartScroll);

  useEffect(() => {
    if (!isActive || !ref.current || !enableSmartScroll) return;

    const scrollContainer = ref.current.closest<HTMLElement>(".smart-scroll-container");
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 1) {
          const elementRect = entry.boundingClientRect;
          const containerRect = scrollContainer.getBoundingClientRect();
          const scrollPadding = 8;

          if (elementRect.top < containerRect.top) {
            scrollContainer.scrollBy({
              top: elementRect.top - containerRect.top - scrollPadding,
              behavior: "smooth",
            });
          } else if (elementRect.bottom > containerRect.bottom) {
            scrollContainer.scrollBy({
              top: elementRect.bottom - containerRect.bottom + scrollPadding,
              behavior: "smooth",
            });
          }
        }
      },
      {
        root: scrollContainer,
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
