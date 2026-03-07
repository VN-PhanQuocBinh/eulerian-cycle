import { cn } from "@/utils/cn";

interface GraphTypeSelectProps {
  className?: string;
  isDirected: boolean;
  isAnimating: boolean;
  onSelect: (isDirected: boolean) => void;
}

function GraphTypeSelect({ className, isDirected, isAnimating, onSelect }: GraphTypeSelectProps) {
  return (
    <section className={cn("", className)}>
      <h3 className="text-base font-semibold text-slate-700 mb-2 flex items-center gap-2">
        Graph Type
      </h3>
      <div className="flex rounded-md border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => onSelect(false)}
          disabled={isAnimating}
          className={cn(
            "flex-1 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            !isDirected ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50",
          )}
        >
          Undirected
        </button>
        <button
          type="button"
          onClick={() => onSelect(true)}
          disabled={isAnimating}
          className={cn(
            "flex-1 py-1.5 text-sm font-medium transition-colors border-l border-slate-200 disabled:cursor-not-allowed disabled:opacity-50",
            isDirected ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50",
          )}
        >
          Directed
        </button>
      </div>
    </section>
  );
}

export default GraphTypeSelect;
