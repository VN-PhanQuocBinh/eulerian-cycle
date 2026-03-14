import { useGraphStore } from "@/contexts/graph-context";
import { EulerianCycleStepsTable } from "./result-panel/eulerian-cycle";
import { ConnectedComponentsStepsTable } from "./result-panel/connected-components";
import { SCCResult } from "./result-panel/scc-result";

function ResultPanel() {
  const currentAlgorithm = useGraphStore((state) => state.currentAlgorithm);
  const isDirected = useGraphStore((state) => state.isDirected);
  const steps = useGraphStore((state) => state.steps);

  return (
    <div className="flex-1 h-full ">
      {steps.length > 0 ? (
        currentAlgorithm === "connected-components" && isDirected ? (
          <SCCResult steps={steps} />
        ) : currentAlgorithm === "connected-components" ? (
          <ConnectedComponentsStepsTable steps={steps} />
        ) : currentAlgorithm === "eulerian-cycle" ? (
          <EulerianCycleStepsTable steps={steps} />
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">
            Run an algorithm to see steps
          </div>
        )
      ) : (
        <div className="p-8 text-center text-slate-400 text-sm">Run an algorithm to see steps</div>
      )}
      {/* {currentAlgorithm === "eulerian-cycle" && steps.length > 0 ? (
        <EulerianCycleStepsTable steps={steps} />
      ) : currentAlgorithm === "connected-components" && steps.length > 0 ? (
        <ConnectedComponentsStepsTable steps={steps} />
      ) : (
        <div className="p-8 text-center text-slate-400 text-sm">Run an algorithm to see steps</div>
      )} */}
    </div>
  );
}

export default ResultPanel;
