import { cn } from "@/utils/cn";

function GraphElement({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "rounded border border-(--gl-border) bg-(--gl-bg-subtle) min-w-5 w-max px-1.5 py-0.5 text-xs font-medium text-(--gl-text-main)",
        className,
      )}
    >
      {label}
    </div>
  );
}

export default GraphElement;
