import { cn } from "@/utils/cn";
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from "lucide-react";
import { RunMode } from "@/types/graph";

interface PrimaryControlButtonsProps {
  className?: string;
  canForward: boolean;
  canBackward: boolean;
  isAnimating: boolean;
  runMode: RunMode;
  onToggleRun: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

function PrimaryControlButtons({
  onToggleRun,
  onReset,
  onNext,
  onPrevious,
  canForward,
  canBackward,
  isAnimating,
  runMode,
}: PrimaryControlButtonsProps) {
  const stepButtonDisabled = isAnimating || runMode === "continuous";

  return (
    <section>
      <h3 className="text-base font-semibold text-slate-700 mb-2">Controls</h3>

      {/* Main Run/Pause/Clear Controls */}
      <div className="flex gap-2 mb-2">
        <PlayPauseButton isAnimating={isAnimating} onToggleRun={onToggleRun} runMode={runMode} />
        <button
          onClick={onReset}
          disabled={isAnimating}
          className="px-3 py-2 bg-slate-200 not-disabled:hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed! text-slate-700 rounded-lg transition-colors"
          title="Clear"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Step-by-Step Controls */}
      <div className="flex gap-2">
        <StepButton
          onClick={onPrevious}
          disabled={!canBackward || stepButtonDisabled}
          title="Previous"
          type="previous"
        />
        <StepButton
          onClick={onNext}
          disabled={!canForward || stepButtonDisabled}
          title="Next"
          type="next"
        />
      </div>
    </section>
  );
}

function PlayPauseButton({
  className,
  isAnimating,
  runMode,
  onToggleRun,
}: Pick<PrimaryControlButtonsProps, "isAnimating" | "onToggleRun" | "runMode" | "className">) {
  return (
    <button
      onClick={onToggleRun}
      disabled={runMode !== "continuous"}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors font-medium",
        isAnimating && runMode === "continuous"
          ? "bg-yellow-600 not-disabled:hover:bg-yellow-700 text-white"
          : "bg-green-600 not-disabled:hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed!",
        className,
      )}
    >
      {isAnimating && runMode === "continuous" ? (
        <>
          <Pause size={16} />
          Pause
        </>
      ) : (
        <>
          <Play size={16} />
          Run
        </>
      )}
    </button>
  );
}

function StepButton({
  className,
  disabled,
  title,
  type,
  onClick,
}: {
  className?: string;
  disabled: boolean;
  title: string;
  type: "next" | "previous";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed! text-white rounded-lg transition-colors text-sm",
        className,
      )}
      title={title}
      disabled={disabled}
    >
      {type === "previous" ? (
        <>
          <SkipBack size={16} />
          Prev
        </>
      ) : (
        <>
          Next
          <SkipForward size={16} />
        </>
      )}
    </button>
  );
}

export default PrimaryControlButtons;
