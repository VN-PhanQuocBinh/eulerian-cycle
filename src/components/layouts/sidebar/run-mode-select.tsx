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
      <h3 className="text-base font-semibold text-(--gl-text-main) mb-2 flex items-center gap-2">
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
            className="w-4 h-4 text-(--gl-blue-dark) disabled:cursor-not-allowed"
          />
          <div className="flex-1">
            <span className="text-sm text-(--gl-text-main) group-hover:text-(--gl-blue-dark) font-medium">
              Continuous
            </span>
            <p className="text-xs text-(--gl-text-muted)">Auto-play animation</p>
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
            className="w-4 h-4 text-(--gl-blue-dark) disabled:cursor-not-allowed"
          />
          <div className="flex-1">
            <span className="text-sm text-(--gl-text-main) group-hover:text-(--gl-blue-dark) font-medium">
              Step-by-Step
            </span>
            <p className="text-xs text-(--gl-text-muted)">Manual control each step</p>
          </div>
        </label>
      </div>
    </section>
  );
}

export default RunModeSelect;
