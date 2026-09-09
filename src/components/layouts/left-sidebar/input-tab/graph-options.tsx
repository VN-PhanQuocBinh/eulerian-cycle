import { useGraphDataStore, useAlgorithmStore } from "@/stores";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import GraphTypeSelect from "../graph-type-select";
import { useAlgorithmOperations } from "@/hooks/use-algorithm-operations";

function GraphOptions() {
  const isWeighted = useGraphDataStore((state) => state.isWeighted);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const isAnimating = useAlgorithmStore((state) => state.isAnimating);
  const { handleGraphTypeChange, handleWeightedChange } = useAlgorithmOperations();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1! size-8">
          <Ellipsis size={16} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-72 border-(--gl-border) bg-(--gl-bg-surface)"
        side="right"
        align="start"
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
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default GraphOptions;
