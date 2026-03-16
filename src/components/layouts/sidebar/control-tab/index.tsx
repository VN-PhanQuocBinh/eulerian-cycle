import { useEffect, useState, useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  RunConfigSelect,
  RunModeSelect,
  SpeedControl,
  FileOperation,
  PrimaryControlButtons,
  GraphTypeSelect,
} from "@/components/layouts/sidebar/index";
import { GraphAlgorithm, RunMode } from "@/types/algorithm-store";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/utils/cn";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { graphService } from "@/services/graph-service";
import { useStepControl } from "@/hooks/use-step-control";

export const BASE_ANIMATION_SPEED = 2000; // in milliseconds

const ALGORITHM_OPTIONS: { label: string; value: GraphAlgorithm }[] = [
  { label: "Eulerian Cycle", value: "eulerian-cycle" },
  { label: "Connected Components", value: "connected-components" },
];

function ControlTab({ className }: { className?: string }) {
  // Graph store
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

  const { next, previous, isLastStep, canForward, canBackward } = useStepControl();

  // Local state
  const showToast = useToast().showToast;
  const [runMode, setRunMode] = useState<RunMode>("continuous");
  const debouncedSpeed = useDebounce(speed, 300);
  const startNodeOptions = useMemo(
    () => nodes.map((node) => ({ label: node.label, value: node.id })),
    [nodes],
  );

  // Animation effect
  useEffect(() => {
    if (runMode === "step-by-step" || steps.length === 0 || !isAnimating) {
      return;
    }

    const animationInterval: NodeJS.Timeout = setInterval(() => {
      const currentStepValue = useAlgorithmStore.getState().currentStepIndex;

      if (!isLastStep(currentStepValue)) {
        next();
      } else {
        clearInterval(animationInterval);
        setIsAnimating(false);
      }
    }, BASE_ANIMATION_SPEED / debouncedSpeed);

    return () => {
      clearInterval(animationInterval);
    };
  }, [isAnimating, runMode, steps, debouncedSpeed, isLastStep, next]);

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

  const handleAlgorithmChange = (algorithm: GraphAlgorithm) => {
    handleReset();
    setSteps([]);
    setCurrentAlgorithm(algorithm);
  };

  const handleReset = () => {
    graphService.resetGraph();

    setCurrentStepIndex(-1);
    setIsAnimating(false);
  };

  const handleStartNodeChange = (nodeId: string) => {
    handleReset();
    setStartNodeId(nodeId);
  };

  const handleGraphTypeChange = (directed: boolean) => {
    handleReset();
    setIsDirected(directed);
  };

  return (
    <aside
      className={cn(
        "w-full h-full bg-white border-r space-y-4 border-slate-200 flex flex-col gap-4 overflow-y-auto",
        className,
      )}
    >
      {/* GRAPH TYPE */}
      <GraphTypeSelect
        isDirected={isDirected}
        isAnimating={isAnimating}
        onSelect={handleGraphTypeChange}
      />

      {/* ALGORITHM SELECTION */}
      <RunConfigSelect<GraphAlgorithm>
        title="Algorithm"
        options={ALGORITHM_OPTIONS}
        currentValue={currentAlgorithm || "eulerian-cycle"}
        isAnimating={isAnimating}
        onSelect={handleAlgorithmChange}
      />

      <RunConfigSelect
        title="Starting Node"
        options={startNodeOptions}
        currentValue={startNodeId || ""}
        isAnimating={isAnimating}
        onSelect={handleStartNodeChange}
      />

      {/* RUN MODE */}
      <RunModeSelect currentRunMode={runMode} isAnimating={isAnimating} onSelect={setRunMode} />

      {/* SPEED CONTROL */}
      <SpeedControl
        speed={speed}
        setSpeed={setSpeed}
        disabled={isAnimating || runMode === "step-by-step"}
      />

      {/* ALGORITHM CONTROLS */}
      <PrimaryControlButtons
        onToggleRun={handleToggleRun}
        onReset={handleReset}
        onNext={next}
        onPrevious={previous}
        canForward={canForward}
        canBackward={canBackward}
        isAnimating={isAnimating}
        runMode={runMode}
      />

      {/* FILE OPERATIONS */}
      <FileOperation disabled={isAnimating} />
    </aside>
  );
}

export default ControlTab;
