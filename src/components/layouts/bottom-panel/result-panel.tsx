import { EulerianCycleStepsTable } from "./result-panel/eulerian-cycle/eulerian-cycle";
import { ConnectedComponentsStepsTable } from "./result-panel/connected-components/connected-components";
import { SCCResult } from "./result-panel/tarjan-scc/scc-result";
import { DfsStepsTable } from "./result-panel/dfs/dfs";
import { useAlgorithmStore } from "@/stores";
import { useGraphDataStore } from "@/stores";

function ResultPanel() {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const steps = useAlgorithmStore((state) => state.steps);

  return (
    <div className="flex-1 h-full ">
      {steps.length > 0 ? (
        currentAlgorithm === "connected-components" && isDirected ? (
          <SCCResult steps={steps} />
        ) : currentAlgorithm === "connected-components" ? (
          <ConnectedComponentsStepsTable steps={steps} />
        ) : currentAlgorithm === "eulerian-cycle" ? (
          <EulerianCycleStepsTable steps={steps} />
        ) : currentAlgorithm === "bfs" || currentAlgorithm === "dfs" ? (
          <DfsStepsTable steps={steps} />
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">
            Run an algorithm to see steps
          </div>
        )
      ) : (
        <div className="p-8 text-center text-slate-400 text-sm">Run an algorithm to see steps</div>
      )}
    </div>
  );
}

export default ResultPanel;
