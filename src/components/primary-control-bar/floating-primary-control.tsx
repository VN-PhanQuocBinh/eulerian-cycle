import { ReactNode, useEffect } from "react";
import { SkipForward, SkipBack, Play, Pause, RotateCcw } from "lucide-react";
import FunctionButton from "@/components/ui/function-button";
import { useAlgorithmStore } from "@/stores";
import { graphService } from "@/services/graph-service";
import { useStepControl } from "@/hooks/use-step-control";
import SpeedControl from "./speed-control";
import { useToast } from "../ui/toast";

export const BASE_ANIMATION_SPEED = 2000; // in milliseconds

function Separator() {
  return <div className="w-px min-h-full bg-(--od-border)" />;
}

function ButtonGroup({ children }: { children: ReactNode }) {
  return <div className="flex items-center py-1 gap-1">{children}</div>;
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

  const handleReset = () => {
    graphService.resetGraph();

    setCurrentStepIndex(-1);
    setIsAnimating(false);
  };

  return (
    <div className="flex items-center gap-1 rounded-md border-4 border-(--od-border) bg-(--od-bg-2) px-1 shadow-md">
      <SpeedControl
        speed={speed}
        disabled={false}
        setSpeed={setSpeed}
        className="border-(--od-border) bg-(--od-bg-2) text-(--od-fg-1) hover:bg-(--od-bg-3) focus:ring-(--od-blue)"
      />

      <ButtonGroup>
        <FunctionButton
          tooltipContent="Backward"
          icon={SkipBack}
          side="top"
          className="border border-(--od-border) text-(--od-fg-1) hover:bg-(--od-bg-3)"
          onClick={backward}
          disabled={!canBackward}
        />
        <FunctionButton
          onClick={handleToggleRun}
          tooltipContent="Toggle Run"
          icon={isAnimating ? Pause : Play}
          side="top"
          className="border border-(--od-blue) bg-(--od-blue) text-(--od-fg-0) not-disabled:hover:bg-(--od-blue)/50 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <FunctionButton
          onClick={forward}
          tooltipContent="Forward"
          icon={SkipForward}
          side="top"
          className="border border-(--od-border) text-(--od-fg-1) hover:bg-(--od-bg-3)"
          disabled={!canForward}
        />
      </ButtonGroup>

      <Separator />

      <FunctionButton
        tooltipContent="Reset"
        icon={RotateCcw}
        side="top"
        onClick={handleReset}
        className="border border-(--od-border) text-(--od-fg-1) hover:bg-(--od-bg-3)"
      />
    </div>
  );
}

export default FloatintPrimaryControl;
