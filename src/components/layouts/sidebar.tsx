import {
  Play,
  Pause,
  RotateCcw,
  Save,
  FolderOpen,
  Settings,
  Zap,
  ChevronDown,
  FastForward,
  SkipForward,
  SkipBack,
} from "lucide-react";
import { useGraphStore } from "@/contexts/graph-context";
import { useEffect, useState, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Slider } from "@/components/ui/slider";
import { SelectItem, SelectContent, Select } from "@/components/ui/select";
import type { GraphAlgorithm, RunMode } from "@/types/graph";
import { cn } from "@/utils/cn";
import { useToast } from "@/components/ui/toast";
import { generateEdgeSelector } from "@/utils";

const ALGORITHM_OPTIONS: { label: string; value: GraphAlgorithm }[] = [
  { label: "Eulerian Cycle", value: "eulerian-cycle" },
  { label: "Connected Components", value: "connected-components" },
];

export const BASE_ANIMATION_SPEED = 2000; // in milliseconds

function Sidebar() {
  // Graph store
  const isDirected = useGraphStore((state) => state.isDirected);
  const edges = useGraphStore((state) => state.edges);
  const nodes = useGraphStore((state) => state.nodes);
  const cyInstance = useGraphStore((state) => state.cyInstance);
  const steps = useGraphStore((state) => state.steps);
  const currentAlgorithm = useGraphStore((state) => state.currentAlgorithm);
  const setSteps = useGraphStore((state) => state.setSteps);
  const nextStepStore = useGraphStore((state) => state.nextStep);
  const prevStepStore = useGraphStore((state) => state.prevStep);
  const setCurrentAlgorithm = useGraphStore((state) => state.setCurrentAlgorithm);
  const setCurrentStepIndex = useGraphStore((state) => state.setCurrentStepIndex);
  const highlightNode = useGraphStore((state) => state.highlightNode);
  const highlightEdge = useGraphStore((state) => state.highlightEdge);
  const saveGraph = useGraphStore((state) => state.saveGraph);
  const loadGraph = useGraphStore((state) => state.loadGraph);
  const findConnectedComponents = useGraphStore((state) => state.findConnectedComponents);
  const findEulerianCycle = useGraphStore((state) => state.findEulerianCycle);
  const resetGraph = useGraphStore((state) => state.resetGraph);

  // Local state
  const showToast = useToast().showToast;
  const [runMode, setRunMode] = useState<RunMode>("continuous");
  const [speed, setSpeed] = useState(100);
  const debouncedSpeed = useDebounce(speed, 300);
  const [isAnimating, setIsAnimating] = useState(false);
  const [canBackward, setCanBackward] = useState(true);
  const [canForward, setCanForward] = useState(true);

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

    step.elements.forEach((element) => {
      if (element.type === "node") {
        highlightNode(element.id, element.classes, true);
      } else if (element.type === "edge") {
        highlightEdge(element.source.id, element.target.id, element.classes);
      }
    });

    nextStepStore();
    setCanBackward(currentStepValue > 0);
    setCanForward(currentStepValue + 1 < steps.length);
  }, [steps, highlightNode, highlightEdge, nextStepStore]);

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
        console.error("Mismatched step elements length");
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
    let animationInterval: NodeJS.Timeout;

    if (runMode === "continuous" && steps?.length > 0 && isAnimating) {
      animationInterval = setInterval(
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
    }

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
  };

  useEffect(() => {}, [steps, currentAlgorithm]);

  return (
    <aside className="w-full h-full bg-white border-r space-y-4 border-slate-200 flex flex-col p-4 gap-4 overflow-y-auto">
      {/* ALGORITHM SELECTION */}
      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <Zap size={16} />
          Algorithm
        </h3>

        <Select.Root
          value={currentAlgorithm as GraphAlgorithm}
          onValueChange={handleAlgorithmChange}
        >
          <Select.Trigger
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 border border-slate-300 rounded-lg text-sm text-slate-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isAnimating}
          >
            <Select.Value />
            <Select.Icon>
              <ChevronDown size={16} className="text-slate-400" />
            </Select.Icon>
          </Select.Trigger>

          <SelectContent position="popper" side="right" sideOffset={8} align="start">
            <Select.Viewport className="p-1">
              {ALGORITHM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="text-left font-medium">{option.label}</div>
                    <div className="text-xs text-slate-400">
                      {option.value === "connected-components"
                        ? "Find graph components"
                        : "Find cycle visiting all edges"}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </Select.Viewport>
          </SelectContent>
        </Select.Root>
      </section>

      {/* RUN MODE */}
      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <FastForward size={16} />
          Run Mode
        </h3>
        <div className="space-y-2 pl-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="runMode"
              value="continuous"
              checked={runMode === "continuous"}
              onChange={(e) => setRunMode(e.target.value as "continuous" | "step-by-step")}
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
              checked={runMode === "step-by-step"}
              onChange={(e) => setRunMode(e.target.value as "continuous" | "step-by-step")}
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

      {/* SPEED CONTROL */}
      <section>
        <div
          className={cn(
            "flex items-center justify-between mb-2",
            runMode === "step-by-step" ? "opacity-50" : "",
          )}
        >
          <h3 className="text-base font-semibold text-slate-700">Speed</h3>
          <span className="text-xs text-slate-500">{speed}%</span>
        </div>
        <Slider
          disabled={runMode === "step-by-step"}
          value={[speed]}
          onValueChange={(value) => setSpeed(value[0])}
          min={10}
          max={200}
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Slow</span>
          <span>Fast</span>
        </div>
        {runMode === "step-by-step" && (
          <p className="text-xs text-slate-500 italic mt-1">
            Speed control disabled in step-by-step mode
          </p>
        )}
      </section>

      {/* ALGORITHM CONTROLS */}
      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-2">Controls</h3>

        {/* Main Run/Pause/Clear Controls */}
        <div className="flex gap-2 mb-2">
          <button
            onClick={handleToggleRun}
            disabled={runMode !== "continuous"}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors font-medium",
              isAnimating && runMode === "continuous"
                ? "bg-yellow-600 not-disabled:hover:bg-yellow-700 text-white"
                : "bg-green-600 not-disabled:hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed!",
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
          <button
            onClick={handleReset}
            disabled={isAnimating}
            className="px-3 py-2 bg-slate-200 not-disabled:hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed! text-slate-700 rounded-lg transition-colors"
            title="Clear"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Step-by-Step Controls */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={previousStep}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed! text-white rounded-lg transition-colors text-sm"
              title="Previous Step"
              disabled={!canBackward || runMode !== "step-by-step" || isAnimating}
            >
              <SkipBack size={16} />
              Prev
            </button>
            <button
              onClick={nextStep}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed! text-white rounded-lg transition-colors text-sm"
              title="Next Step"
              disabled={!canForward || runMode !== "step-by-step" || isAnimating}
            >
              Next
              <SkipForward size={16} />
            </button>
          </div>

          {/* Step Counter */}
          {/* {hasSteps && (
              <div className="text-center">
                <span className="text-xs text-slate-600 font-medium">
                  Step {currentStep + 1} / {animationSteps.length}
                </span>
              </div>
            )} */}
        </div>
      </section>

      {/* FILE OPERATIONS */}
      <section className="mt-auto pt-4 border-t border-slate-200">
        <div className="flex flex-col gap-2">
          <button
            onClick={loadGraph}
            disabled={isAnimating}
            className="disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <FolderOpen size={16} />
            Open Graph
          </button>
          <button
            onClick={saveGraph}
            disabled={isAnimating}
            className="disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            <Save size={16} />
            Save Graph
          </button>
        </div>
      </section>
    </aside>
  );
}

export default Sidebar;
