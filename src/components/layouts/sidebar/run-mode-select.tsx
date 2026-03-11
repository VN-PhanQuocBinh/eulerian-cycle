import { cn } from "@/utils/cn";

export type RunMode = "continuous" | "step-by-step";

interface RunModeSelectProps {
  className?: string;
  currentRunMode: RunMode;
  isAnimating: boolean;
  onSelect: (runMode: RunMode) => void;
}

function RunModeSelect({ className, currentRunMode, isAnimating, onSelect }: RunModeSelectProps) {
  return (
    <section className={cn("", className)}>
      <h3 className="text-base font-semibold text-slate-700 mb-2 flex items-center gap-2">
        Run Mode
      </h3>
      <div className="space-y-2 pl-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name="runMode"
            value="continuous"
            checked={currentRunMode === "continuous"}
            onChange={(e) => onSelect(e.target.value as RunMode)}
            disabled={isAnimating}
            className="w-4 h-4 text-blue-600 disabled:cursor-not-allowed"
          />
          <div className="flex-1">
            <span className="text-sm text-slate-700 group-hover:text-blue-600 font-medium">
              Continuous
            </span>
            <p className="text-xs text-slate-500">Auto-play animation</p>
          </div>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name="runMode"
            value="step-by-step"
            checked={currentRunMode === "step-by-step"}
            onChange={(e) => onSelect(e.target.value as RunMode)}
            disabled={isAnimating}
            className="w-4 h-4 text-blue-600 disabled:cursor-not-allowed"
          />
          <div className="flex-1">
            <span className="text-sm text-slate-700 group-hover:text-blue-600 font-medium">
              Step-by-Step
            </span>
            <p className="text-xs text-slate-500">Manual control each step</p>
          </div>
        </label>
      </div>
    </section>
  );
}

export default RunModeSelect;
