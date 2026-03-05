import { useGraphStore } from "@/contexts/graph-context";
import { EulerianCycleStepsTable } from "./eulerian-cycle";
import { ConnectedComponentsStepsTable } from "./connected-components";

function ResultPanel() {
  const currentAlgorithm = useGraphStore((state) => state.currentAlgorithm);
  const steps = useGraphStore((state) => state.steps);

  return (
    <div className="flex-1 max-h-full overflow-y-auto custom-scrollbar">
      {currentAlgorithm === "eulerian-cycle" && steps.length > 0 ? (
        <EulerianCycleStepsTable steps={steps} />
      ) : currentAlgorithm === "connected-components" && steps.length > 0 ? (
        <ConnectedComponentsStepsTable steps={steps} />
      ) : (
        <div className="p-8 text-center text-slate-400 text-sm">Run an algorithm to see steps</div>
      )}
    </div>
  );
}

export default ResultPanel;
