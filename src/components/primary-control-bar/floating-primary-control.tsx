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

export const BASE_ANIMATION_SPEED = 2000; // in milliseconds

function Separator() {
  return <div className="w-px min-h-full bg-(--gl-border)" />;
}

function ButtonGroup({ children, classNames }: { children: ReactNode; classNames?: string }) {
  return <div className={cn("flex items-center py-1 gap-1", classNames)}>{children}</div>;
}

function FloatintPrimaryControl() {
  const steps = useAlgorithmStore((state) => state.steps);
  const speed = useAlgorithmStore((state) => state.speed);
  const isAnimating = useAlgorithmStore((state) => state.isAnimating);
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
    <div className="flex items-center gap-1 rounded-md bg-(--gl-bg-surface) px-1 drop-shadow-md">
      {/* <div className="py-1"> */}
        <SpeedControl
          speed={speed}
          disabled={false}
          setSpeed={setSpeed}
          className=" border-(--gl-border) text-(--gl-text-main) hover:bg-(--gl-bg-subtle)/50 focus:ring-(--gl-blue-dark)"
        />
      {/* </div> */}

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
          className="border border-(--gl-blue-dark) bg-(--gl-blue-dark) text-(--gl-text-main) not-disabled:hover:bg-(--gl-blue-dark)/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}

export default FloatintPrimaryControl;
