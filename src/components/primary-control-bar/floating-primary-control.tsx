import { ReactNode, useEffect } from "react";
import { SkipForward, SkipBack, Play, Pause, RotateCcw } from "lucide-react";
import FunctionButton from "@/components/ui/function-button";
import { useAlgorithmStore } from "@/stores";
import { graphService } from "@/services/graph-service";
import { useStepControl } from "@/hooks/use-step-control";
import SpeedControl from "./speed-control";
import { useToast } from "../ui/toast";
import { useRegisterHotkey } from "@/hooks/use-register-hotkey";
import { HOTKEYS_CONFIG } from "@/configs/hotkeys-config";
import { cn } from "@/utils/cn";
import { Tooltip } from "@/components/ui/tooltip";
import AlgorithmSelect from "./algorithm-select";
import MoreOptionsButton from "./more-options-button";

export const BASE_ANIMATION_SPEED = 2000; // in milliseconds

function Separator() {
  return <div className="h-8 w-px self-center bg-(--gl-border)/30" />;
}

function ButtonGroup({ children, classNames }: { children: ReactNode; classNames?: string }) {
  return <div className={cn("flex items-center py-1 gap-1", classNames)}>{children}</div>;
}

function FloatintPrimaryControl() {
  const steps = useAlgorithmStore((state) => state.steps);
  const speed = useAlgorithmStore((state) => state.speed);
  const isAnimating = useAlgorithmStore((state) => state.isAnimating);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const setIsAnimating = useAlgorithmStore((state) => state.setIsAnimating);
  const setCurrentStepIndex = useAlgorithmStore((state) => state.setCurrentStepIndex);
  const setSpeed = useAlgorithmStore((state) => state.setSpeed);

  const { showToast } = useToast();

  const {
    next: forward,
    previous: backward,
    isLastStep,
    canForward,
    canBackward,
  } = useStepControl();

  const currentStepDisplay =
    steps.length === 0 ? 0 : Math.min(Math.max(currentStepIndex + 1, 0), steps.length);

  useEffect(() => {
    if (steps.length === 0 || !isAnimating) {
      return;
    }

    const animationInterval: NodeJS.Timeout = setInterval(() => {
      const currentStepValue = useAlgorithmStore.getState().currentStepIndex;

      if (!isLastStep(currentStepValue)) {
        forward();
      } else {
        clearInterval(animationInterval);
        setIsAnimating(false);
      }
    }, BASE_ANIMATION_SPEED / speed);

    return () => {
      clearInterval(animationInterval);
    };
  }, [isAnimating, steps, isLastStep, forward, speed]);

  const handleToggleRun = async () => {
    const currentStepValue = useAlgorithmStore.getState().currentStepIndex;

    if (isAnimating) {
      // Pause animation
      setIsAnimating(false);
    } else {
      // Start or resume animation
      if (steps?.length === 0) {
        showToast?.({
          message: "No steps to animate. Please run the algorithm first.",
          type: "warning",
        });
        return;
      }

      if (currentStepValue >= steps.length - 1) {
        handleReset();
      }

      setIsAnimating(true);
    }
  };

  useRegisterHotkey({
    type: "click",
    combo: HOTKEYS_CONFIG.CLICK.TOGGLE_RUN,
    handler: handleToggleRun,
  });

  useRegisterHotkey({
    type: "click",
    combo: HOTKEYS_CONFIG.CLICK.BACKWARD,
    handler: backward,
  });

  useRegisterHotkey({
    type: "click",
    combo: HOTKEYS_CONFIG.CLICK.FORWARD,
    handler: forward,
  });

  const handleReset = () => {
    graphService.resetGraph();

    setCurrentStepIndex(-1);
    setIsAnimating(false);
  };

  return (
    <div className="min-h-12 flex items-center gap-1 rounded-md bg-(--gl-bg-surface) px-1 drop-shadow-md border border-(--gl-border)/50">
      <AlgorithmSelect />

      <SpeedControl
        speed={speed}
        disabled={false}
        setSpeed={setSpeed}
        className=" border-(--gl-border) text-(--gl-text-main) hover:bg-(--gl-bg-subtle)/50 focus:ring-(--gl-blue-dark)"
      />

      <Separator />

      <ButtonGroup classNames="py-0">
        <FunctionButton
          tooltipContent="Backward"
          icon={SkipBack}
          side="top"
          className="bg-transparent border border-(--gl-border) text-(--gl-text-main) hover:bg-(--gl-bg-subtle)"
          onClick={backward}
          disabled={!canBackward}
        />
        <FunctionButton
          onClick={handleToggleRun}
          tooltipContent="Toggle Run"
          icon={isAnimating ? Pause : Play}
          side="top"
          className="border border-(--gl-blue-dark) bg-(--gl-blue-dark) text-(--gl-bg-surface) not-disabled:hover:bg-(--gl-blue-dark)/50 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <FunctionButton
          onClick={forward}
          tooltipContent="Forward"
          icon={SkipForward}
          side="top"
          className="bg-transparent border border-(--gl-border) text-(--gl-text-main) hover:bg-(--gl-bg-subtle)"
          disabled={!canForward}
        />
      </ButtonGroup>

      <Separator />

      <FunctionButton
        tooltipContent="Reset"
        icon={RotateCcw}
        side="top"
        onClick={handleReset}
        className="border border-(--gl-border) text-(--gl-text-main) hover:bg-(--gl-bg-subtle)"
      />

      <Tooltip content="Current step" side="top">
        <div
          className={cn(
            "flex items-center rounded-sm border border-(--gl-border) bg-(--gl-bg-surface) text-(--gl-text-main) px-3 py-2",
            { "bg-(--gl-text-main) text-(--gl-bg-surface)": currentStepDisplay === steps.length },
          )}
        >
          <p className="text-xs font-semibold text-nowrap select-none">
            {currentStepDisplay} / {steps.length}
          </p>
        </div>
      </Tooltip>

      <MoreOptionsButton />
    </div>
  );
}

export default FloatintPrimaryControl;
