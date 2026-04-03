import { SelectItem, SelectContent, Select } from "@/components/ui/select";
import {} from "@/types/graph";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface AlgorithmsSelectProps<T> {
  className?: string;
  title: string;
  placeholder?: string;
  currentValue: T;
  isAnimating: boolean;
  options: Array<{
    label: string;
    value: T;
  }>;
  onSelect: (value: T) => void;
}

function RunConfigSelect<T extends string>({
  className,
  title,
  placeholder = "Select an option",
  isAnimating,
  currentValue,
  options,
  onSelect,
}: AlgorithmsSelectProps<T>) {
  return (
    <section className={cn("", className)}>
      <h3 className="text-base font-semibold text-(--od-fg-0) mb-2 flex items-center gap-2">
        {title}
      </h3>

      <Select.Root defaultValue={currentValue} value={currentValue as T} onValueChange={onSelect}>
        <Select.Trigger
          className="w-full flex items-center data-placeholder:text-(--od-fg-2) data-placeholder:italic justify-between px-3 py-2 bg-(--od-bg-0) border border-(--od-border) rounded-lg text-sm text-(--od-fg-1) hover:border-(--od-border-strong) focus:outline-none focus:ring-2 focus:ring-(--od-blue) transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isAnimating || options.length === 0}
        >
          <Select.Value placeholder={placeholder} defaultValue={currentValue} className="" />

          <Select.Icon>
            <ChevronDown size={16} className="text-(--od-fg-2)" />
          </Select.Icon>
        </Select.Trigger>

        <SelectContent position="popper" side="right" sideOffset={8} align="start">
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div>
                  <div className="text-left font-medium">{option.label}</div>
                  {/* <div className="text-xs text-slate-400">
                    {option.value === "connected-components"
                      ? "Find graph components"
                      : "Find cycle visiting all edges"}
                  </div> */}
                </div>
              </SelectItem>
            ))}
          </Select.Viewport>
        </SelectContent>
      </Select.Root>
    </section>
  );
}

export default RunConfigSelect;
