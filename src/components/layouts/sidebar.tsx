import { useGraphStore } from "@/contexts/graph-context";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  AlgorithmsSelect,
  RunModeSelect,
  SpeedControl,
  FileOperation,
  PrimaryControlButtons,
} from "@/components/layouts/sidebar/index";
import type { GraphAlgorithm, RunMode, StoredStep } from "@/types/graph";
import { useToast } from "@/components/ui/toast";
import { generateEdgeSelector } from "@/utils";

export const BASE_ANIMATION_SPEED = 2000; // in milliseconds

function Sidebar() {
  // Graph store
  const isDirected = useGraphStore((state) => state.isDirected);
  const edges = useGraphStore((state) => state.edges);
  const nodes = useGraphStore((state) => state.nodes);
  const cyInstance = useGraphStore((state) => state.cyInstance);
  const steps = useGraphStore((state) => state.steps);
  const currentAlgorithm = useGraphStore((state) => state.currentAlgorithm);
  const speed = useGraphStore((state) => state.speed);
  const setSteps = useGraphStore((state) => state.setSteps);
  const nextStepStore = useGraphStore((state) => state.nextStep);
  const prevStepStore = useGraphStore((state) => state.prevStep);
  const setCurrentAlgorithm = useGraphStore((state) => state.setCurrentAlgorithm);
  const setCurrentStepIndex = useGraphStore((state) => state.setCurrentStepIndex);
  const setSpeed = useGraphStore((state) => state.setSpeed);
  const highlightNode = useGraphStore((state) => state.highlightNode);
  const highlightEdge = useGraphStore((state) => state.highlightEdge);
  const findConnectedComponents = useGraphStore((state) => state.findConnectedComponents);
  const findEulerianCycle = useGraphStore((state) => state.findEulerianCycle);
  const resetGraph = useGraphStore((state) => state.resetGraph);

  // Local state
  const showToast = useToast().showToast;
  const [runMode, setRunMode] = useState<RunMode>("continuous");
  const debouncedSpeed = useDebounce(speed, 300);
  const [isAnimating, setIsAnimating] = useState(false);
  const [canBackward, setCanBackward] = useState(true);
  const [canForward, setCanForward] = useState(true);

  const highlightElement = useCallback(
    (element: StoredStep["current"]["elements"][number]) => {
      if (element.type === "node") {
        highlightNode(element.id, element.classes, true);
      } else if (element.type === "edge") {
        highlightEdge(element.source.id, element.target.id, element.classes);
      }
    },
    [highlightEdge, highlightNode],
  );

  // Load steps when algorithm or graph changes
  useEffect(() => {
    switch (currentAlgorithm) {
      case "connected-components": {
        const { steps } = findConnectedComponents();
        setSteps(steps || []);

        break;
      }
      case "eulerian-cycle": {
        const { steps } = findEulerianCycle();
        setSteps(steps || []);
        break;
      }
      default:
        setSteps([]);
    }
  }, [edges, nodes, isDirected, currentAlgorithm]);

  // Step controls
  const nextStep = useCallback(() => {
    const currentStepValue = useGraphStore.getState().currentStepIndex;

    if (currentStepValue >= steps.length) {
      showToast?.({
        message: "No more steps available. Please reset or run a different algorithm.",
        type: "info",
      });
      return;
    }

    const step = steps[currentStepValue].current;

    step.elements.forEach(highlightElement);
    nextStepStore();

    setCanBackward(currentStepValue > 0);
    setCanForward(currentStepValue + 1 < steps.length);
  }, [steps, isAnimating, runMode, debouncedSpeed, highlightElement, nextStepStore]);

  const previousStep = useCallback(() => {
    const currentStepValue = useGraphStore.getState().currentStepIndex;

    if (currentStepValue > 0 && cyInstance) {
      const currentStepData = steps[currentStepValue - 1].current;
      const prevStepData = steps[currentStepValue - 1].prev;
      const currentStepElements = currentStepData.elements;
      const prevStepElements = prevStepData.elements;

      if (
        !prevStepData ||
        !currentStepElements ||
        currentStepElements.length !== prevStepElements.length
      ) {
        showToast?.({
          message: "Cannot revert step due to inconsistent step data.",
          type: "error",
        });
        return;
      }

      currentStepElements.forEach((element, index) => {
        if (element.type === "node") {
          const revertNode = cyInstance.getElementById(element.id);
          if (revertNode) {
            revertNode.removeClass(element.classes);
            revertNode.addClass(prevStepElements[index].classes);
          }
        } else if (element.type === "edge") {
          const revertEdge = cyInstance.edges(
            generateEdgeSelector(element.source.id, element.target.id),
          );
          if (revertEdge) {
            revertEdge.removeClass(element.classes);
            revertEdge.addClass(prevStepElements[index].classes);
          }
        }
      });

      prevStepStore();
      setCanBackward(currentStepValue > 0);
      setCanForward(currentStepValue < steps.length);
    }
  }, [steps, cyInstance, prevStepStore]);

  // Animation effect
  useEffect(() => {
    if (runMode === "step-by-step" || steps.length === 0 || !isAnimating) {
      return;
    }

    const animationInterval: NodeJS.Timeout = setInterval(
      () => {
        const currentStepValue = useGraphStore.getState().currentStepIndex;

        if (currentStepValue < steps.length) {
          nextStep();
        } else {
          clearInterval(animationInterval);
          setIsAnimating(false);
        }
      },
      BASE_ANIMATION_SPEED / (debouncedSpeed / 100),
    );

    return () => {
      clearInterval(animationInterval);
    };
  }, [isAnimating, runMode, steps, debouncedSpeed]);

  const handleToggleRun = async () => {
    const currentStepValue = useGraphStore.getState().currentStepIndex;

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

      if (currentStepValue >= steps.length) {
        handleReset();
      }

      setIsAnimating(true);
    }
  };

  const handleAlgorithmChange = (algorithm: GraphAlgorithm) => {
    handleReset();
    setCurrentAlgorithm(algorithm);
  };

  const handleReset = () => {
    resetGraph();
    setCurrentStepIndex(0);
    setIsAnimating(false);
    setSteps([]);

    setCanForward(true);
    setCanBackward(false);
  };

  return (
    <aside className="w-full h-full bg-white border-r space-y-4 border-slate-200 flex flex-col p-4 gap-4 overflow-y-auto">
      {/* ALGORITHM SELECTION */}
      <AlgorithmsSelect
        currentAlgorithm={currentAlgorithm || "eulerian-cycle"}
        isAnimating={isAnimating}
        onSelect={handleAlgorithmChange}
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
        onNext={nextStep}
        onPrevious={previousStep}
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

export default Sidebar;
