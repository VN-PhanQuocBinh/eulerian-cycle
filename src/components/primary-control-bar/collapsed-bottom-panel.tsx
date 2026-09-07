import FunctionButton from "../ui/function-button";
import { useAlgorithmStore, useUIStore } from "@/stores";
import { GraphAlgorithm } from "@/types/algorithm-store";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ListChevronsDownUp, ListChevronsUpDown, Ellipsis, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { useAlgorithmOperations } from "@/hooks/use-algorithm-operations";

const algorithmOptions: Array<{ label: string; value: GraphAlgorithm }> = [
  { label: "Eulerian Cycle", value: "eulerian-cycle" },
  { label: "Connected Components", value: "connected-components" },
  { label: "Depth-First Search (DFS)", value: "dfs" },
  { label: "Breadth-First Search (BFS)", value: "bfs" },
  { label: "Dijkstra's Algorithm", value: "dijkstra" },
];

function CollapsedBottomPanel() {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const isAnimating = useAlgorithmStore((state) => state.isAnimating);
  const steps = useAlgorithmStore((state) => state.steps);

  const isBottomPanelOpen = useUIStore((state) => state.isBottomPanelOpen);
  const showStack = useUIStore((state) => state.showStack);
  const showQueue = useUIStore((state) => state.showQueue);
  const toggleBottomPanel = useUIStore((state) => state.toggleBottomPanel);
  const toggleShowStack = useUIStore((state) => state.toggleShowStack);
  const toggleShowQueue = useUIStore((state) => state.toggleShowQueue);

  const { handleAlgorithmChange } = useAlgorithmOperations();

  const currentStepDisplay =
    steps.length === 0 ? 0 : Math.min(Math.max(currentStepIndex + 1, 0), steps.length);

  const handleToggleDetailsPanel = () => {
    toggleBottomPanel(!isBottomPanelOpen);
  };

  return (
    <div className="flex items-stretch gap-1 rounded-md border-2 border-(--od-border) bg-(--od-bg-2) px-1 shadow-md">
      <div className="flex items-stretch gap-1 py-1">
        <div className="h-full min-w-52">
          <Select.Root
            value={currentAlgorithm}
            onValueChange={(value) => handleAlgorithmChange(value as GraphAlgorithm)}
            disabled={isAnimating}
          >
            <Select.Trigger className="h-full w-full flex items-center gap-2 justify-between rounded-sm border border-(--od-border) outline-none hover:bg-(--od-bg-1) px-3 text-sm font-semibold text-(--od-yellow) hover:border-(--od-border-strong) disabled:opacity-60">
              <Select.Value />
              <Select.Icon>
                <ChevronDown size={14} strokeWidth={4} className="text-(--od-fg-2) " />
              </Select.Icon>
            </Select.Trigger>

            <SelectContent
              position="popper"
              side="top"
              sideOffset={8}
              align="start"
              className="w-52 border-(--od-border) bg-(--od-bg-1) p-1"
            >
              <Select.Viewport>
                {algorithmOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <p className="w-max">{option.label}</p>
                  </SelectItem>
                ))}
              </Select.Viewport>
            </SelectContent>
          </Select.Root>
        </div>

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

          <PopoverContent
            className="w-56 border-(--od-border) bg-(--od-bg-0)"
            side="top"
            sideOffset={10}
          >
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
