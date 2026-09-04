import { cn } from "@/utils/cn";

interface GraphTypeSelectProps {
  className?: string;
  isDirected: boolean;
  isAnimating: boolean;
  label: string;
  text: {
    active: string;
    inactive: string;
  };
  onSelect: (isDirected: boolean) => void;
}

function GraphTypeSelect({
  className,
  isDirected,
  isAnimating,
  label,
  text,
  onSelect,
}: GraphTypeSelectProps) {
  return (
    <section className={cn("", className)}>
      <h3 className="text-base font-semibold text-(--od-fg-0) mb-2 flex items-center gap-2">
        {label}
      </h3>

      <div className="flex rounded-md border border-(--od-border) overflow-hidden">
        <button
          type="button"
          onClick={() => onSelect(false)}
          disabled={isAnimating}
          className={cn(
            "flex-1 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            !isDirected
              ? "bg-(--od-blue) text-(--primary-foreground)"
              : "bg-(--od-bg-0) text-(--od-fg-1) hover:bg-(--od-bg-3)",
          )}
        >
          {text.inactive}
        </button>
        <button
          type="button"
          onClick={() => onSelect(true)}
          disabled={isAnimating}
          className={cn(
            "flex-1 py-1.5 text-sm font-medium transition-colors border-l border-(--od-border) disabled:cursor-not-allowed disabled:opacity-50",
            isDirected
              ? "bg-(--od-blue) text-(--primary-foreground)"
              : "bg-(--od-bg-0) text-(--od-fg-1) hover:bg-(--od-bg-3)",
          )}
        >
          {text.active}
        </button>
      </div>
    </section>
  );
}

export default GraphTypeSelect;
