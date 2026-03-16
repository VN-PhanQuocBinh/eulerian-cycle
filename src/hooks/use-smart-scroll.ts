import { useRef, useEffect } from "react";

export const useSmartScroll = (isActive: boolean) => {
  const ref = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    if (!isActive || !ref.current) return;

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
  }, [isActive]);

  return ref;
};
