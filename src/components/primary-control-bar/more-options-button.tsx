import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import FunctionButton from "@/components/ui/function-button";
import { Ellipsis } from "lucide-react";
import { GraphTypeSelect } from "../layouts/left-sidebar";
import { useGraphDataStore } from "@/stores/graph-data-store";
import { useUIStore } from "@/stores/ui-store";
import { useAlgorithmOperations } from "@/hooks/use-algorithm-operations";
import { Checkbox } from "../ui/checkbox";
import { useAlgorithmStore } from "@/stores/algorithm-store";

function MoreOptionsButton() {
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const isWeighted = useGraphDataStore((state) => state.isWeighted);
  const showStack = useUIStore((state) => state.showStack);
  const showQueue = useUIStore((state) => state.showQueue);
  const isAnimating = useAlgorithmStore((state) => state.isAnimating);
  const toggleShowStack = useUIStore((state) => state.toggleShowStack);
  const toggleShowQueue = useUIStore((state) => state.toggleShowQueue);
  const { handleGraphTypeChange, handleWeightedChange } = useAlgorithmOperations();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FunctionButton tooltipContent="More options" icon={Ellipsis} side="top" />
      </PopoverTrigger>

      <PopoverContent
        className="w-72 border-(--gl-border) bg-(--gl-bg-surface)"
        side="top"
        sideOffset={10}
      >
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-(--gl-text-main)">More Options</span>

          <GraphTypeSelect
            label="Graph Type"
            text={{ active: "Directed", inactive: "Undirected" }}
            isDirected={isDirected}
            isAnimating={isAnimating}
            onSelect={handleGraphTypeChange}
            className="[&>h3]:mb-1 [&>h3]:text-sm"
          />

          <GraphTypeSelect
            label="Graph Weight"
            text={{ active: "Weighted", inactive: "Unweighted" }}
            isDirected={isWeighted}
            isAnimating={isAnimating}
            onSelect={handleWeightedChange}
            className="[&>h3]:mb-1 [&>h3]:text-sm"
          />

          <div className="h-px w-full bg-(--gl-border)/30" />

          <label
            htmlFor="toggle-show-stack"
            className="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 hover:bg-(--gl-bg-subtle)"
          >
            <span className="text-sm text-(--gl-text-main)">Show Stack</span>
            <Checkbox
              id="toggle-show-stack"
              checked={showStack}
              onCheckedChange={(checked) => toggleShowStack(checked === true)}
            />
          </label>

          <label
            htmlFor="toggle-show-queue"
            className="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 hover:bg-(--gl-bg-subtle)"
          >
            <span className="text-sm text-(--gl-text-main)">Show Queue</span>
            <Checkbox
              id="toggle-show-queue"
              checked={showQueue}
              onCheckedChange={(checked) => toggleShowQueue(checked === true)}
            />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default MoreOptionsButton;
