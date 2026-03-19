import { useEffect, useCallback } from "react";
import {
  SkipForward,
  SkipBack,
  Play,
  Pause,
  RotateCcw,
  ListChevronsUpDown,
  ListChevronsDownUp,
} from "lucide-react";
import FunctionButton from "@/components/ui/function-button";
import { useGraphDataStore, useUIStore, useAlgorithmStore } from "@/stores";
import { graphService } from "@/services/graph-service";
import { useStepControl } from "@/hooks/use-step-control";
import SpeedControl from "./speed-control";
import { useToast } from "../ui/toast";

export const BASE_ANIMATION_SPEED = 2000; // in milliseconds

function FloatintPrimaryControl() {
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const nodes = useGraphDataStore((state) => state.nodes);
  const setIsDirected = useGraphDataStore((state) => state.setIsDirected);

  const steps = useAlgorithmStore((state) => state.steps);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const speed = useAlgorithmStore((state) => state.speed);
  const isAnimating = useAlgorithmStore((state) => state.isAnimating);
  const startNodeId = useAlgorithmStore((state) => state.startNodeId);
  const setIsAnimating = useAlgorithmStore((state) => state.setIsAnimating);
  const setCurrentAlgorithm = useAlgorithmStore((state) => state.setCurrentAlgorithm);
  const setStartNodeId = useAlgorithmStore((state) => state.setStartNodeId);
  const setCurrentStepIndex = useAlgorithmStore((state) => state.setCurrentStepIndex);
  const setSpeed = useAlgorithmStore((state) => state.setSpeed);
  const setSteps = useAlgorithmStore((state) => state.setSteps);
  
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
    <div className="  flex items-center gap-1 bg-white shadow-md px-1 rounded-md">
      <SpeedControl speed={speed} disabled={false} setSpeed={setSpeed} />

      <div className="flex items-center py-1 gap-1">
        <FunctionButton
          tooltipContent="Backward"
          icon={SkipBack}
          side="top"
          className="bg-gray-100"
          onClick={backward}
          disabled={!canBackward}
        />
        <FunctionButton
          onClick={handleToggleRun}
          tooltipContent="Toggle Run"
          icon={isAnimating ? Pause : Play}
          side="top"
          className=" bg-green-600 not-disabled:hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed!"
        />
        <FunctionButton
          onClick={forward}
          tooltipContent="Forward"
          icon={SkipForward}
          side="top"
          className="bg-gray-100"
          disabled={!canForward}
        />
      </div>

      {/* Separator */}
      <div className="w-px min-h-full bg-gray-300" />

      <FunctionButton
        tooltipContent="Reset"
        icon={RotateCcw}
        className=""
        side="top"
        onClick={handleReset}
      />
    </div>
  );
}

export default FloatintPrimaryControl;
