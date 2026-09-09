import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import GraphElement from "@/components/layouts/bottom-panel/graph-element";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { cn } from "@/utils/cn";

export function NodeListSlider({
  nodeIds,
  graphUtils,
  initialPosition = "start",
  itemClassName,
}: {
  nodeIds: string[];
  graphUtils: ReturnType<typeof createGraphUtils>;
  initialPosition?: "start" | "end";
  itemClassName?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const nodeKey = nodeIds.join("|");

  const updateScrollState = () => {
    const rail = railRef.current;
    if (!rail) return;

    const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
    setCanScrollBack(rail.scrollLeft > 1);
    setCanScrollNext(rail.scrollLeft < maxScrollLeft - 1);
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    rail.scrollTo({
      left: initialPosition === "end" ? rail.scrollWidth : 0,
      behavior: "auto",
    });
    updateScrollState();
  }, [initialPosition, nodeKey]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    rail.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    updateScrollState();

    return () => {
      rail.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [nodeKey]);

  const scrollByNode = (direction: "back" | "next") => {
    const rail = railRef.current;
    const firstNode = rail?.firstElementChild;
    if (!rail || !(firstNode instanceof HTMLElement)) return;

    const styles = getComputedStyle(rail);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const distance = firstNode.getBoundingClientRect().width + gap;

    rail.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex min-w-0 items-center gap-1">
      <button
        type="button"
        aria-label="Previous nodes"
        disabled={!canScrollBack}
        onClick={() => scrollByNode("back")}
        className="grid size-6 shrink-0 place-items-center rounded text-(--gl-text-muted) transition-colors hover:bg-(--gl-bg-subtle) hover:text-(--gl-text-main) disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronLeft className="size-4" />
      </button>

      <div
        ref={railRef}
        className="flex min-w-0 flex-1 snap-x snap-mandatory gap-1.5 overflow-x-auto scroll [scrollbar-width:none] scroll-smooth custom-scrollbar"
      >
        {nodeIds.map((nodeId, index) => (
          <GraphElement
            key={`${nodeId}-${index}`}
            label={graphUtils.getNode(nodeId)?.label ?? nodeId}
            className={cn(
              "shrink-0 snap-start",
              {
                "bg-(--gl-amber-dark)/50":
                  initialPosition === "end" && index === nodeIds.length - 1,
                "bg-(--gl-green-soft)": initialPosition === "start" && index === 0,
              },
              itemClassName,
            )}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Next nodes"
        disabled={!canScrollNext}
        onClick={() => scrollByNode("next")}
        className="grid size-6 shrink-0 place-items-center rounded text-(--gl-text-muted) transition-colors hover:bg-(--gl-bg-subtle) hover:text-(--gl-text-main) disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
