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
      <h3 className="text-base font-semibold text-(--gl-text-main) mb-2 flex items-center gap-2">
        {label}
      </h3>

      <div className="flex rounded-md border border-(--gl-border) overflow-hidden">
        <button
          type="button"
          onClick={() => onSelect(false)}
          disabled={isAnimating}
          className={cn(
            "flex-1 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            !isDirected
              ? "bg-(--gl-blue-dark) text-(--primary-foreground)"
              : "bg-(--gl-bg-base) text-(--gl-text-main) hover:bg-(--gl-bg-subtle)",
          )}
        >
          {text.inactive}
        </button>
        <button
          type="button"
          onClick={() => onSelect(true)}
          disabled={isAnimating}
          className={cn(
            "flex-1 py-1.5 text-sm font-medium transition-colors border-l border-(--gl-border) disabled:cursor-not-allowed disabled:opacity-50",
            isDirected
              ? "bg-(--gl-blue-dark) text-(--primary-foreground)"
              : "bg-(--gl-bg-base) text-(--gl-text-main) hover:bg-(--gl-bg-subtle)",
          )}
        >
          {text.active}
        </button>
      </div>
    </section>
  );
}

export default GraphTypeSelect;
