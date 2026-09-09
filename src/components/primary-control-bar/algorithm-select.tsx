import { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { ALGORITHM_OPTIONS } from "@/constant/graph-constants";
import { GraphAlgorithm } from "@/types/algorithm-store";
import { useAlgorithmStore } from "@/stores";
import { useAlgorithmOperations } from "@/hooks/use-algorithm-operations";

type AlgorithmProps = {} & ComponentProps<typeof SelectContent>;

function AlgorithmSelect(props: AlgorithmProps) {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const isAnimating = useAlgorithmStore((state) => state.isAnimating);
  const { handleAlgorithmChange } = useAlgorithmOperations();

  return (
    <div className="min-w-52">
      <Select.Root
        value={currentAlgorithm}
        onValueChange={(value) => handleAlgorithmChange(value as GraphAlgorithm)}
        disabled={isAnimating}
      >
        <Select.Trigger
          className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-(--gl-border) bg-(--gl-bg-surface) px-3 text-sm font-semibold text-(--gl-amber-dark) outline-none transition-all hover:bg-(--gl-bg-subtle) disabled:opacity-60"
          aria-label="Select algorithm"
        >
          <Select.Value className="select-none" />
          <Select.Icon>
            <ChevronDown size={14} strokeWidth={4} className="text-(--gl-text-muted)" />
          </Select.Icon>
        </Select.Trigger>

        <SelectContent
          position={props.position || "popper"}
          side={props.side}
          sideOffset={props.sideOffset || 8}
          align={props.align}
          className="w-52 bg-(--gl-bg-surface) p-1"
        >
          <Select.Viewport>
            {ALGORITHM_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <p className="w-max">{option.label}</p>
              </SelectItem>
            ))}
          </Select.Viewport>
        </SelectContent>
      </Select.Root>
    </div>
  );
}

export default AlgorithmSelect;
