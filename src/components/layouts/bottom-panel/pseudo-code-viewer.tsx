import { cn } from "@/lib/utils";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { BASE_ANIMATION_SPEED } from "@/components/layouts/sidebar/control-tab";
import { useEffect, useState } from "react";
import {
  HIERHOLZER_PSEUDOCODE,
  CONNECTED_COMPONENTS_PSEUDOCODE,
  TARJAN_SCC_PSEUDOCODE,
  DFS_PSEUDOCODE,
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
  bfs: [],
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
        "h-full overflow-y-auto custom-scrollbar rounded-md border border-(--od-border) bg-(--od-bg-1)",
        className,
      )}
    >
      <div className="p-4 font-mono text-sm text-(--od-fg-1)">
        {lines.length === 0 && (
          <div className="py-8 text-center text-(--od-fg-2)">No pseudo code available.</div>
        )}

        {lines.map((line, index) => {
          const isActive = currentHighlightedIds.includes(line.id);

          return (
            <div
              key={String(line.id) + line.text}
              className={cn(
                "flex items-stretch border border-transparent px-3 transition-colors duration-200",
                {
                  "bg-(--od-bg-3) ": isActive,
                },
              )}
            >
              <span className="mr-4 inline-block w-8 shrink-0 self-center select-none text-right text-(--od-fg-2)">
                {index + 1}
              </span>

              <div className="flex items-center flex-1">
                {Array.from({ length: line.indent }).map((_, i) => (
                  <div
                    key={i}
                    className="h-full border-l border-(--od-border) mr-6 py-1"
                  ></div>
                ))}
                <span
                  className={cn("text-(--od-fg-1)", {
                    "font-semibold text-(--od-fg-0)": isActive,
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

  return (
    <div
      className={cn(
        "h-full overflow-y-auto custom-scrollbar rounded-md border border-(--od-border) bg-(--od-bg-1)",
        className,
      )}
    >
      <div className="p-4 font-mono text-sm text-(--od-fg-1)">
        {lines.length === 0 && (
          <div className="py-8 text-center text-(--od-fg-2)">No pseudo code available.</div>
        )}

        {lines.map((line, index) => {
          const isActive = currentHighlightedIds.includes(line.id);

          return (
            <div
              key={String(line.id) + line.text}
              className={cn("flex border border-transparent px-3 transition-colors duration-200", {
                "bg-(--od-bg-3) ": isActive,
              })}
            >
              <span className="mr-4 inline-block w-8 shrink-0 self-center select-none text-right text-(--od-fg-2)">
                {index + 1}
              </span>
              <div className="" style={{ paddingLeft: String((line.indent - 1) * 24) + "px" }}>
                <span
                  className={cn("text-(--od-fg-1) border-l py-1", {
                    "font-semibold text-(--od-fg-0)": isActive,
                  })}
                  style={{ paddingLeft: "24px" }}
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
