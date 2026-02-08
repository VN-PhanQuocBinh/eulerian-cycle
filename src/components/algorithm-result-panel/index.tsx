import { useState, useRef } from "react";
import { useGraphStore } from "@/contexts/graph-context";
import { EulerianCycleStepsTable } from "./eulerian-cycle";

function ResultPanel() {
  const currentAlgorithm = useGraphStore((state) => state.currentAlgorithm);
  const steps = useGraphStore((state) => state.steps);

  const currentStep = useRef<number>(-1);

  console.log("Result table steps", steps);

  return (
    <div className="flex-1 max-h-full bg-white border border-slate-200 rounded-lg overflow-y-auto">
      {currentAlgorithm === "eulerian-cycle" && steps.length > 0 ? (
        <EulerianCycleStepsTable steps={steps} currentStepIndex={currentStep.current} />
      ) : currentAlgorithm === "connected-components" && steps.length > 0 ? (
        <div className="p-3 text-xs text-slate-500 italic">
          Connected Components steps table coming soon...
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 text-sm">Run an algorithm to see steps</div>
      )}
    </div>
  );
}

export default ResultPanel;
