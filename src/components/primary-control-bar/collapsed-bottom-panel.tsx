import { ReactNode, useMemo } from "react";
import { ListChevronsDownUp, ListChevronsUpDown, Ellipsis } from "lucide-react";
import FunctionButton from "../ui/function-button";
import { useAlgorithmStore, useUIStore } from "@/stores";
import { GraphAlgorithm } from "@/types/algorithm-store";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const ALGORITHM_LABELS: Record<GraphAlgorithm, string> = {
  "eulerian-cycle": "Eulerian Cycle",
  "connected-components": "Connected Components",
};

function CollapsedBottomPanel() {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const steps = useAlgorithmStore((state) => state.steps);
  const isBottomPanelOpen = useUIStore((state) => state.isBottomPanelOpen);
  const showStack = useUIStore((state) => state.showStack);
  const showQueue = useUIStore((state) => state.showQueue);
  const toggleBottomPanel = useUIStore((state) => state.toggleBottomPanel);
  const toggleShowStack = useUIStore((state) => state.toggleShowStack);
  const toggleShowQueue = useUIStore((state) => state.toggleShowQueue);

  const algorithmLabel = useMemo(
    () => ALGORITHM_LABELS[currentAlgorithm] ?? "Unknown",
    [currentAlgorithm],
  );

  const currentStepDisplay =
    steps.length === 0 ? 0 : Math.min(Math.max(currentStepIndex + 1, 0), steps.length);

  const handleToggleDetailsPanel = () => {
    toggleBottomPanel(!isBottomPanelOpen);
  };

  return (
    <div className="flex items-stretch gap-1 rounded-md border-4 border-(--od-border) bg-(--od-bg-2) px-1 shadow-md">
      <div className="flex items-stretch gap-1 py-1">
        <Tooltip content="Algorithm in action" side="top">
          <div className="h-full flex items-center gap-2 rounded-sm px-3">
            <p className="text-base font-semibold text-nowrap text-(--od-yellow) select-none">{algorithmLabel}</p>
          </div>
        </Tooltip>

        <Tooltip content="Current step" side="top">
          <div
            className={cn(
              "h-full flex items-center rounded-sm border border-(--od-border) bg-(--od-bg-1) text-(--od-fg-1) px-3",
              { "bg-(--od-fg-0) text-(--od-bg-1)": currentStepDisplay === steps.length },
            )}
          >
            <p className="text-xs font-semibold text-nowrap select-none">
              {currentStepDisplay} / {steps.length}
            </p>
          </div>
        </Tooltip>
      </div>

      <div className="flex items-center gap-1 py-1">
        <FunctionButton
          onClick={handleToggleDetailsPanel}
          tooltipContent={isBottomPanelOpen ? "Hide Details Panel" : "Show Details Panel"}
          icon={isBottomPanelOpen ? ListChevronsDownUp : ListChevronsUpDown}
          side="top"
        />

        <Popover>
          <PopoverTrigger asChild>
            <FunctionButton tooltipContent="More options" icon={Ellipsis} side="top" />
          </PopoverTrigger>

          <PopoverContent className="w-56 border-(--od-border) bg-(--od-bg-1)" side="top">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-(--od-fg-0)">More Options</span>

              <label
                htmlFor="toggle-show-stack"
                className="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 hover:bg-(--od-bg-2)"
              >
                <span className="text-sm text-(--od-fg-1)">Show Stack</span>
                <Checkbox
                  id="toggle-show-stack"
                  checked={showStack}
                  onCheckedChange={(checked) => toggleShowStack(checked === true)}
                />
              </label>

              <label
                htmlFor="toggle-show-queue"
                className="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 hover:bg-(--od-bg-2)"
              >
                <span className="text-sm text-(--od-fg-1)">Show Queue</span>
                <Checkbox
                  id="toggle-show-queue"
                  checked={showQueue}
                  onCheckedChange={(checked) => toggleShowQueue(checked === true)}
                />
              </label>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default CollapsedBottomPanel;
