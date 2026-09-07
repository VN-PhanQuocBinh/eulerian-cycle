import { cn } from "@/lib/utils";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { BASE_ANIMATION_SPEED } from "@/components/layouts/sidebar/control-tab";
import { useEffect, useState } from "react";
import {
  HIERHOLZER_PSEUDOCODE,
  CONNECTED_COMPONENTS_PSEUDOCODE,
  TARJAN_SCC_PSEUDOCODE,
  DFS_PSEUDOCODE,
  BFS_PSEUDOCODE,
  DIJKSTRA_PSEUDOCODE,
} from "@/constant/pseudo-code";
import { PseudoCodeLine } from "@/types/pseudo-code";
import { GraphAlgorithm } from "@/types/algorithm-store";

interface PseudoCodeViewerProps {
  className?: string;
}

const pseudoCodeMap: Record<GraphAlgorithm | "strongly-connected-components", PseudoCodeLine[]> = {
  "eulerian-cycle": HIERHOLZER_PSEUDOCODE,
  "connected-components": CONNECTED_COMPONENTS_PSEUDOCODE,
  "strongly-connected-components": TARJAN_SCC_PSEUDOCODE,
  dfs: DFS_PSEUDOCODE,
  bfs: BFS_PSEUDOCODE,
  dijkstra: DIJKSTRA_PSEUDOCODE,
};

export function PseudoCodeViewer({ className }: PseudoCodeViewerProps) {
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const speed = useAlgorithmStore((state) => state.speed);
  const steps = useAlgorithmStore((state) => state.steps);

  const [lines, setLines] = useState(() => {
    if (!currentAlgorithm || !pseudoCodeMap[currentAlgorithm]) return [];
    if (currentAlgorithm === "connected-components" && isDirected)
      return pseudoCodeMap["strongly-connected-components"];
    return pseudoCodeMap[currentAlgorithm];
  });
  const [currentHighlightedIndex, setCurrentHighlightedIndex] = useState<number>(0);
  const [currentHighlightedIds, setCurrentHighlightedIds] = useState<number[]>([]);

  // Update pseudo-code lines when algorithm changes
  useEffect(() => {
    if (!currentAlgorithm || !pseudoCodeMap[currentAlgorithm]) {
      setLines([]);
      return;
    }

    if (currentAlgorithm === "connected-components" && isDirected) {
      setLines(pseudoCodeMap["strongly-connected-components"]);
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

    const currentLineIds = steps[currentStepIndex]?.highlightedPseudoCodeLineIds || [];

    if (!currentLineIds || currentLineIds.length === 0) {
      setCurrentHighlightedIds([]);
      return;
    }

    // If all lines have been highlighted, stop the animation
    if (currentHighlightedIndex >= currentLineIds.length) {
      return;
    }

    const duration = (BASE_ANIMATION_SPEED - 100) / speed / (currentLineIds.length + 1 || 1);

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
        "h-full overflow-y-auto custom-scrollbar rounded-md border border-(--gl-border) bg-(--gl-bg-base)",
        className,
      )}
    >
      <div className="p-3 font-mono text-sm text-(--gl-text-main)">
        {lines.length === 0 && (
          <div className="py-8 text-center text-(--gl-text-muted)">No pseudo code available.</div>
        )}

        {lines.map((line, index) => {
          const isActive = currentHighlightedIds.includes(line.id);

          return (
            <div
              key={String(line.id) + line.text + index}
              className={cn(
                "flex items-stretch border border-transparent transition-colors duration-200",
                {
                  "bg-(--gl-green-soft) ": isActive,
                },
              )}
            >
              <span className={cn("mr-4 inline-block w-8 shrink-0 self-center select-none text-right text-(--gl-text-muted)", {
                "text-(--gl-green-dark) font-semibold": isActive,
              })}>
                {index + 1}
              </span>

              <div className="flex items-center flex-1">
                {Array.from({ length: line.indent }).map((_, i) => (
                  <div key={i} className="h-full border-l border-(--gl-border) mr-6 py-1"></div>
                ))}
                <span
                  className={cn("text-(--gl-text-main)", {
                    "font-semibold text-(--gl-text-main)": isActive,
                  })}
                >
                  {line.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
