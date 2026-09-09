import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import FunctionButton from "@/components/ui/function-button";
import { Ellipsis } from "lucide-react";
import AlgorithmSelect from "./algorithm-select";

function MoreOptionsButton() {
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

          <AlgorithmSelect side="left" align="end" />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default MoreOptionsButton;
