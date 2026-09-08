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

function ButtonItem({
  disabled,
  isActive,
  label,
  onClick,
}: {
  disabled: boolean;
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex-1 py-1 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        isActive
          ? "bg-(--gl-bg-subtle) text-(--gl-text-main)"
          : "bg-(--gl-bg-surface) text-(--gl-text-main) hover:bg-(--gl-bg-base) rounded-md ",
      )}
    >
      {label}
    </button>
  );
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
      <span className="text-[12px] font-semibold text-(--gl-text-main)/70 mb-2 flex items-center gap-2">
        {label}
      </span>

      <div className="flex rounded-md border border-(--gl-border) overflow-hidden p-1">
        {/* <button
          type="button"
          onClick={() => onSelect(false)}
          disabled={isAnimating}
          className={cn(
            "flex-1 py-1 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            !isDirected
              ? "bg-(--gl-bg-subtle) text-(--primary-foreground)"
              : "bg-(--gl-bg-surface) text-(--gl-text-main) hover:bg-(--gl-bg-base) rounded-md ",
          )}
        >
          {text.inactive}
        </button> */}
        <ButtonItem
          disabled={isAnimating}
          isActive={!isDirected}
          label={text.inactive}
          onClick={() => onSelect(false)}
        />

        <ButtonItem
          disabled={isAnimating}
          isActive={isDirected}
          label={text.active}
          onClick={() => onSelect(true)}
        />

        {/* <button
          type="button"
          onClick={() => onSelect(true)}
          disabled={isAnimating}
          className={cn(
            "flex-1 py-1 text-sm font-medium transition-colors border-l border-(--gl-border) disabled:cursor-not-allowed disabled:opacity-50",
            isDirected
              ? "bg-(--gl-bg-subtle) text-(--primary-foreground)"
              : "bg-(--gl-bg-surface) text-(--gl-text-main) hover:bg-(--gl-bg-base) rounded-md",
          )}
        >
          {text.active}
        </button> */}
      </div>
    </section>
  );
}

export default GraphTypeSelect;
