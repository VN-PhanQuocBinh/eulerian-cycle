import { cn } from "@/lib/utils";
import { useGraphStore } from "@/contexts/graph-context";
import { BASE_ANIMATION_SPEED } from "@/components/layouts/sidebar";
import { useEffect, useState } from "react";
import { HIERHOLZER_PSEUDOCODE, CONNECTED_COMPONENTS_PSEUDOCODE } from "@/constant/pseudo-code";
import { PseudoCodeLine } from "@/types/pseudo-code";
import { GraphAlgorithm } from "@/types/graph";

interface PseudoCodeViewerProps {
  className?: string;
}

const pseudoCodeMap: Record<GraphAlgorithm, PseudoCodeLine[]> = {
  "eulerian-cycle": HIERHOLZER_PSEUDOCODE,
  "connected-components": CONNECTED_COMPONENTS_PSEUDOCODE,
};

export function PseudoCodeViewer({ className }: PseudoCodeViewerProps) {
  const currentStepIndex = useGraphStore((state) => state.currentStepIndex);
  const currentAlgorithm = useGraphStore((state) => state.currentAlgorithm);
  const speed = useGraphStore((state) => state.speed);
  const steps = useGraphStore((state) => state.steps);

  const [lines, setLines] = useState(
    currentAlgorithm === "eulerian-cycle" ? HIERHOLZER_PSEUDOCODE : CONNECTED_COMPONENTS_PSEUDOCODE,
  );
  const [currentHighlightedIndex, setCurrentHighlightedIndex] = useState<number>(0);
  const [currentHighlightedIds, setCurrentHighlightedIds] = useState<number[]>([]);

  // Update pseudo-code lines when algorithm changes
  useEffect(() => {
    if (!currentAlgorithm || !pseudoCodeMap[currentAlgorithm]) {
      setLines([]);
      return;
    }

    setLines(pseudoCodeMap[currentAlgorithm]);
  }, [currentAlgorithm]);

  // Reset highlights when step changes
  useEffect(() => {
    setCurrentHighlightedIndex(0);
    setCurrentHighlightedIds([]);
  }, [currentStepIndex]);

  // Highlight pseudo-code lines based on current step
  useEffect(() => {
    if (currentStepIndex < 0) {
      setCurrentHighlightedIds([]);
      return;
    }

    const currentLineIds = steps[currentStepIndex]?.current.highlightedPseudoCodeLineIds || [];

    if (!currentLineIds || currentLineIds.length === 0) {
      setCurrentHighlightedIds([]);
      return;
    }

    // If all lines have been highlighted, stop the animation
    if (currentHighlightedIndex >= currentLineIds.length) {
      return;
    }

    const duration =
      (BASE_ANIMATION_SPEED - 100) / (speed / 100) / (currentLineIds.length + 1 || 1);

    const timer = setTimeout(() => {
      const lineToHighlight = currentLineIds[currentHighlightedIndex];
      const newIds = Array.isArray(lineToHighlight) ? lineToHighlight : [lineToHighlight];

      // Accumulate: giữ lại các dòng đã highlight trước đó
      setCurrentHighlightedIds(() => [...newIds]);
      setCurrentHighlightedIndex((prev) => prev + 1);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentStepIndex, currentHighlightedIndex, speed, steps]);

  return (
    <div
      className={cn(
        "h-full overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900/50",
        className,
      )}
    >
      <div className="p-4 font-mono text-sm">
        {lines.map((line) => (
          <div
            key={line.id + line.text} // Add timestamp to force re-render when lines change
            className={cn("py-1.5 px-3 rounded transition-colors duration-200 flex", {
              "bg-primary/10": currentHighlightedIds.includes(line.id),
            })}
          >
            <span className="inline-block w-8 text-slate-400 select-none mr-4 shrink-0">
              {line.id}
            </span>
            <span
              className={cn("text-slate-900 dark:text-slate-300", {
                "font-semibold text-slate-900 dark:text-slate-100": currentHighlightedIds.includes(
                  line.id,
                ),
              })}
              style={{ paddingLeft: `${line.indent * 24}px` }}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
