import { SelectItem, SelectContent, Select } from "@/components/ui/select";
import {} from "@/types/graph";
import { Zap, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import type { GraphAlgorithm } from "@/types/graph";

const ALGORITHM_OPTIONS: { label: string; value: GraphAlgorithm }[] = [
  { label: "Eulerian Cycle", value: "eulerian-cycle" },
  { label: "Connected Components", value: "connected-components" },
];

interface AlgorithmsSelectProps {
  className?: string;
  currentAlgorithm: GraphAlgorithm;
  isAnimating: boolean;
  onSelect: (algorithm: GraphAlgorithm) => void;
}

function AlgorithmsSelect({
  className,
  isAnimating,
  currentAlgorithm,
  onSelect,
}: AlgorithmsSelectProps) {
  return (
    <section className={cn("", className)}>
      <h3 className="text-base font-semibold text-slate-700 mb-2 flex items-center gap-2">
        <Zap size={16} />
        Algorithm
      </h3>

      <Select.Root value={currentAlgorithm as GraphAlgorithm} onValueChange={onSelect}>
        <Select.Trigger
          className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 border border-slate-300 rounded-lg text-sm text-slate-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isAnimating}
        >
          <Select.Value />
          <Select.Icon>
            <ChevronDown size={16} className="text-slate-400" />
          </Select.Icon>
        </Select.Trigger>

        <SelectContent position="popper" side="right" sideOffset={8} align="start">
          <Select.Viewport className="p-1">
            {ALGORITHM_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div>
                  <div className="text-left font-medium">{option.label}</div>
                  <div className="text-xs text-slate-400">
                    {option.value === "connected-components"
                      ? "Find graph components"
                      : "Find cycle visiting all edges"}
                  </div>
                </div>
              </SelectItem>
            ))}
          </Select.Viewport>
        </SelectContent>
      </Select.Root>
    </section>
  );
}

export default AlgorithmsSelect;
