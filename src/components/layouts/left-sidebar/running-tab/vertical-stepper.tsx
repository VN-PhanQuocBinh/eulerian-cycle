import { Search, Target } from "lucide-react";
import { useStepControl } from "@/hooks/use-step-control";
import { Tooltip } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils/cn";
import { useSmartScroll } from "@/hooks/use-smart-scroll";
import { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";

type CardType = React.ComponentType<{ step: Step; isActive?: boolean }>;
type DetailsType = React.ComponentType<{
  step: Step;
  graphUtils: ReturnType<typeof createGraphUtils>;
}>;

interface VerticalStepperProps<T> {
  items: T[];
  activeIndex: number;
  card: CardType;
  details: DetailsType;
  graphUtils: ReturnType<typeof createGraphUtils>;
  getKey?: (item: T, index: number) => string | number;
}

export function VerticalStepper<T>({
  items,
  activeIndex,
  card: Card,
  details: Details,
  getKey = (_, index) => index,
  graphUtils,
}: VerticalStepperProps<T>) {
  const jumpTo = useStepControl().jumpTo;

  return (
    <div className="smart-scroll-container h-full pt-4 overflow-y-auto pr-1 custom-scrollbar">
      <div className="relative space-y-2 pl-9">
        <div className="absolute bottom-4 left-3.25 top-4 w-px bg-(--gl-border)/50" />
        {items.map((item, index) => (
          <VerticalStepperItem
            key={getKey(item, index)}
            step={item as Step}
            index={index}
            isActive={index === activeIndex}
            jumpTo={jumpTo}
            Card={Card}
            Details={Details}
            graphUtils={graphUtils}
          />
        ))}
      </div>
    </div>
  );
}

function VerticalStepperItem({
  step,
  index,
  isActive,
  jumpTo,
  Card,
  Details,
  graphUtils,
}: {
  step: Step;
  index: number;
  isActive: boolean;
  jumpTo: (index: number) => void;
  Card: CardType;
  Details: DetailsType;
  graphUtils: ReturnType<typeof createGraphUtils>;
}) {
  const cardRef = useSmartScroll<HTMLDivElement>(isActive);

  return (
    <div ref={cardRef} className="group relative">
      <div
        className={cn(
          "absolute -left-9 top-0 z-10 grid size-7 place-items-center rounded-full border text-xs font-semibold transition-colors",
          isActive
            ? "border-(--gl-blue-dark) bg-(--gl-blue-dark) text-(--gl-bg-surface)"
            : "border-(--gl-border) bg-(--gl-bg-base) text-(--gl-text-muted)",
        )}
      >
        <Tooltip content={`Jump to step ${index + 1}`} side="right">
          <button
            type="button"
            aria-label={`Jump to step ${index + 1}`}
            onClick={() => jumpTo(index)}
            className="grid size-full place-items-center rounded-full"
          >
            <span className="group-hover:hidden">{index + 1}</span>
            <Target className="hidden size-4 group-hover:block" />
          </button>
        </Tooltip>
      </div>

      <div className="relative">
        <div
          className={cn(
            "relative rounded-md bg-(--gl-bg-surface) p-3 pr-9 text-sm text-(--gl-text-main) transition-colors",
            isActive && "border border-(--gl-blue-dark) bg-(--gl-blue-soft)/50",
          )}
        >
          <Card step={step} isActive={isActive} />
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={`Inspect details for step ${index + 1}`}
                title="Inspect step details"
                className="group-hover:opacity-100 opacity-0 absolute right-2 top-2 rounded p-1 text-(--gl-text-muted) transition-colors hover:bg-(--gl-bg-subtle) hover:text-(--gl-text-main)"
              >
                <Search className="size-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="right"
              align="start"
              sideOffset={8}
              className="w-80 max-w-[calc(100vw-2rem)] border-(--gl-border) bg-(--gl-bg-surface) p-3 text-xs text-(--gl-text-main)"
            >
              <Details step={step} graphUtils={graphUtils} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
