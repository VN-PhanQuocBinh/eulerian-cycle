import { ReactNode, useMemo } from "react";
import { SkipBack, SkipForward, RotateCcw, ListChevronsDownUp, ListChevronsUpDown } from "lucide-react";
import FunctionButton from "../ui/function-button";
import { useAlgorithmStore, useUIStore } from "@/stores";
import { graphService } from "@/services/graph-service";
import { useStepControl } from "@/hooks/use-step-control";
import { GraphAlgorithm } from "@/types/algorithm-store";
import { cn } from "@/utils/cn";

const ALGORITHM_LABELS: Record<GraphAlgorithm, string> = {
  "eulerian-cycle": "Eulerian Cycle",
  "connected-components": "Connected Components",
};

function Separator() {
  return <div className="w-px min-h-full bg-gray-300" />;
}

function ButtonGroup({ children }: { children: ReactNode }) {
  return <div className="flex items-center py-1 gap-1">{children}</div>;
}

function CollapsedBottomPanel() {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const steps = useAlgorithmStore((state) => state.steps);
  const isAnimating = useAlgorithmStore((state) => state.isAnimating);
  const setCurrentStepIndex = useAlgorithmStore((state) => state.setCurrentStepIndex);
  const setIsAnimating = useAlgorithmStore((state) => state.setIsAnimating);
  const isBottomPanelOpen = useUIStore((state) => state.isBottomPanelOpen);
  const toggleBottomPanel = useUIStore((state) => state.toggleBottomPanel);

  const algorithmLabel = useMemo(
    () => ALGORITHM_LABELS[currentAlgorithm] ?? "Unknown",
    [currentAlgorithm],
  );

  const currentStepDisplay =
    steps.length === 0 ? 0 : Math.min(Math.max(currentStepIndex + 1, 0), steps.length);

  const handleReset = () => {
    graphService.resetGraph();
    setCurrentStepIndex(-1);
    setIsAnimating(false);
  };

  const handleToggleDetailsPanel = () => {
    toggleBottomPanel(!isBottomPanelOpen);
  };

  return (
    <div className="flex items-center gap-1 bg-white shadow-md px-1 rounded-md">
      <ButtonGroup>
        <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-gray-100">
          <span
            className={cn(
              "size-2 rounded-full",
              isAnimating ? "bg-emerald-500 animate-pulse" : "bg-slate-400",
            )}
          />
          <div className="leading-tight">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Algorithm</p>
            <p className="text-xs font-semibold text-slate-700">{algorithmLabel}</p>
          </div>
        </div>

        <div className="px-3 py-2 rounded-sm bg-gray-100 leading-tight">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">Step</p>
          <p className="text-xs font-semibold text-slate-700">
            {currentStepDisplay} / {steps.length}
          </p>
        </div>
      </ButtonGroup>

      <Separator />

      <FunctionButton
        onClick={handleToggleDetailsPanel}
        tooltipContent={isBottomPanelOpen ? "Hide Details Panel" : "Show Details Panel"}
        icon={isBottomPanelOpen ? ListChevronsDownUp : ListChevronsUpDown}
        className=""
        side="top"
      />
    </div>
  );
}

export default CollapsedBottomPanel;
