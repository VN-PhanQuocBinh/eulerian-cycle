import { useEffect, useState, useCallback, useMemo } from "react";
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
import { computeFinalStyles } from "@/core/helpers/compute-final-styles";
import { useStepControl } from "@/hooks/use-step-control";

export const BASE_ANIMATION_SPEED = 2000; // in milliseconds

const ALGORITHM_OPTIONS: { label: string; value: GraphAlgorithm }[] = [
  { label: "Eulerian Cycle", value: "eulerian-cycle" },
  { label: "Connected Components", value: "connected-components" },
];

function ControlTab({ className }: { className?: string }) {
  // Graph store
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const edges = useGraphDataStore((state) => state.edges);
  const nodes = useGraphDataStore((state) => state.nodes);
  const setIsDirected = useGraphDataStore((state) => state.setIsDirected);
  const getCurrentGraphData = useGraphDataStore((state) => state.getCurrentGraphData);

  const steps = useAlgorithmStore((state) => state.steps);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const speed = useAlgorithmStore((state) => state.speed);
  const isAnimating = useAlgorithmStore((state) => state.isAnimating);
  const setIsAnimating = useAlgorithmStore((state) => state.setIsAnimating);
  const setSteps = useAlgorithmStore((state) => state.setSteps);
  const nextStepStore = useAlgorithmStore((state) => state.nextStep);
  const prevStepStore = useAlgorithmStore((state) => state.prevStep);
  const setCurrentAlgorithm = useAlgorithmStore((state) => state.setCurrentAlgorithm);
  const setCurrentStepIndex = useAlgorithmStore((state) => state.setCurrentStepIndex);
  const setSpeed = useAlgorithmStore((state) => state.setSpeed);
  const findConnectedComponents = useAlgorithmStore((state) => state.findConnectedComponents);
  const findEulerianCycle = useAlgorithmStore((state) => state.findEulerianCycle);
  const findSCCs = useAlgorithmStore((state) => state.findSCCs);

  const { next, previous, jumpTo, canForward, canBackward } = useStepControl();

  // Local state
  const showToast = useToast().showToast;
  const [runMode, setRunMode] = useState<RunMode>("continuous");
  const debouncedSpeed = useDebounce(speed, 300);
  const startNodeOptions = useMemo(
    () => nodes.map((node) => ({ label: node.label, value: node.id })),
    [nodes],
  );
  const [startNodeId, setStartNodeId] = useState<string>(nodes[0]?.id || "");

  // Ensure startNodeId is valid when nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      const nodeExists = nodes.some((node) => node.id === startNodeId);
      if (!startNodeId || !nodeExists) {
        setStartNodeId(nodes[0].id);
      }
    } else {
      setStartNodeId("");
    }
  }, [nodes]);

  // Load steps when algorithm or graph changes
  useEffect(() => {
    const graphData = getCurrentGraphData();

    switch (currentAlgorithm) {
      case "connected-components": {
        if (isDirected) {
          const { steps } = findSCCs(graphData);
          setSteps(steps || []);
        } else {
          const { steps } = findConnectedComponents(graphData, startNodeId);
          setSteps(steps || []);
        }

        break;
      }
      case "eulerian-cycle": {
        const { steps, cycle } = findEulerianCycle(graphData, startNodeId);
        setSteps(steps || []);
        break;
      }
      default:
        setSteps([]);
    }
  }, [edges, nodes, startNodeId, isDirected, currentAlgorithm]);

  // Step controls
  // const nextStep = useCallback(() => {
  //   const currentStepValue = useAlgorithmStore.getState().currentStepIndex + 1;
  //   nextStepStore();

  //   if (currentStepValue >= steps.length) {
  //     showToast?.({
  //       message: "No more steps available. Please reset or run a different algorithm.",
  //       type: "info",
  //     });
  //     return;
  //   }

  //   const step = steps[currentStepValue];

  //   step.elements.forEach((element) =>
  //     graphService.highlightElement(element.id, element.classes, element.type === "node"),
  //   );

  //   setCanBackward(currentStepValue > 0);
  //   setCanForward(currentStepValue + 1 < steps.length);
  // }, [steps, isAnimating, runMode, nextStepStore]);

  // const updateUItoStep = (stepIndex: number) => {
  //   const finalStyles = computeFinalStyles(steps, stepIndex);
  //   graphService.applyStylesFromMap(finalStyles);
  // };

  // const previousStep = useCallback(() => {
  //   const currentStepValue = useAlgorithmStore.getState().currentStepIndex;

  //   if (currentStepValue > 0) {
  //     updateUItoStep(currentStepValue - 1);
  //     prevStepStore();
  //     setCanBackward(currentStepValue - 1 > 0);
  //     setCanForward(currentStepValue < steps.length);
  //   }
  // }, [steps, prevStepStore]);

  // Animation effect
  useEffect(() => {
    if (runMode === "step-by-step" || steps.length === 0 || !isAnimating) {
      return;
    }

    const animationInterval: NodeJS.Timeout = setInterval(() => {
      const currentStepValue = useAlgorithmStore.getState().currentStepIndex;

      if (currentStepValue < steps.length) {
        // nextStep();
        next();
      } else {
        clearInterval(animationInterval);
        setIsAnimating(false);
      }
    }, BASE_ANIMATION_SPEED / debouncedSpeed);

    return () => {
      clearInterval(animationInterval);
    };
  }, [isAnimating, runMode, steps, debouncedSpeed]);

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
    graphService.resetGraph();

    setCurrentStepIndex(-1);
    setIsAnimating(false);

    // setCanForward(true);
    // setCanBackward(false);
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
        currentValue={startNodeId}
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
