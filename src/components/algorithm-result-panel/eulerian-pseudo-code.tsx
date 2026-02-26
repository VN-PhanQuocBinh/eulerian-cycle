import { cn } from "@/lib/utils";
import { useGraphStore } from "@/contexts/graph-context";
import { BASE_ANIMATION_SPEED } from "@/components/layouts/sidebar";
import { useEffect, useRef, useState } from "react";

interface PseudoCodeLine {
  id: number;
  text: string;
  indent: number;
}

interface PseudoCodeViewerProps {
  lines: PseudoCodeLine[];
  className?: string;
}

export function PseudoCodeViewer({ lines, className }: PseudoCodeViewerProps) {
  const currentStepIndex = useGraphStore((state) => state.currentStepIndex);
  const steps = useGraphStore((state) => state.steps);
  const [currentHighlightedIndex, setCurrentHighlightedIndex] = useState<number>(0);

  const currentLineIds = steps[currentStepIndex]?.current?.highlightedPseudoCodeLineIds || [];

  useEffect(() => {
    if (!currentLineIds || currentLineIds.length === 0) {
      return;
    }

    let animationInterval: NodeJS.Timeout;

    animationInterval = setInterval(() => {
      setCurrentHighlightedIndex((prev) => {
        if (prev >= currentLineIds.length - 1) {
          clearInterval(animationInterval);
          return 0;
        }

        return prev + 1;
      });
    }, BASE_ANIMATION_SPEED / currentLineIds.length);

    return () => clearInterval(animationInterval);
  }, [currentLineIds]);

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
            key={line.id}
            className={cn(
              "py-1.5 px-3 rounded transition-colors duration-200 flex",
              line.id === currentLineIds[currentHighlightedIndex] &&
                "bg-primary/10 border-l-2 border-primary",
            )}
          >
            <span className="inline-block w-8 text-slate-400 select-none mr-4 flex-shrink-0">
              {line.id}
            </span>
            <span
              className={cn(
                "text-slate-900 dark:text-slate-300",
                line.id === currentLineIds[currentHighlightedIndex] &&
                  "font-semibold text-slate-900 dark:text-slate-100",
                "font-semibold text-slate-900 dark:text-slate-100",
              )}
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

export const HIERHOLZER_PSEUDOCODE: PseudoCodeLine[] = [
  { id: 1, text: "procedure FindEulerianCycle(Graph, start)", indent: 0 },

  { id: 2, text: "create a copy G of Graph", indent: 1 },
  { id: 3, text: "create empty stack S", indent: 1 },
  { id: 4, text: "create empty list Circuit", indent: 1 },

  { id: 5, text: "push start onto S", indent: 1 },

  { id: 6, text: "while S is not empty", indent: 1 },

  { id: 7, text: "u = top element of S", indent: 2 },

  { id: 8, text: "if G[u] has unused edges", indent: 2 },
  { id: 9, text: "select and remove an unused edge (u, v) from G[u]", indent: 3 },
  { id: 10, text: "remove edge (v, u) from G[v]", indent: 3 },
  { id: 11, text: "push v onto S", indent: 3 },

  { id: 12, text: "else", indent: 2 },
  { id: 13, text: "pop u from S", indent: 3 },
  { id: 14, text: "add u to Circuit", indent: 3 },

  { id: 15, text: "reverse Circuit", indent: 1 },
  { id: 16, text: "return Circuit", indent: 1 },
];
