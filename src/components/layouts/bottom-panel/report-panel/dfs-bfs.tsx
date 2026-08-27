import { useMemo } from "react";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { DfsResult } from "@/core/types/algorithm";
import { SectionTitle } from "./components/section-title";
import { InfoRow } from "./components/info-row";

function DfsBfsReport() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const startNodeId = useAlgorithmStore((state) => state.startNodeId);
  const currentTargetNodeId = useAlgorithmStore((state) => state.targetNodeId);
  const executionResult = useAlgorithmStore((state) => state.executionResult);

  const graphUtils = useMemo(
    () =>
      createGraphUtils({
        nodes,
        edges,
        isDirected,
      }),
    [nodes, edges, isDirected],
  );

  let path: string[] = [];
  let found: boolean = false;

  // Ensure executionResult is not null and is a DfsResult before accessing its properties
  if (executionResult && (currentAlgorithm === "dfs" || currentAlgorithm === "bfs")) {
    const dfsExecutionResult = executionResult as DfsResult;
    path = dfsExecutionResult.result?.path || [];
    found = dfsExecutionResult.result?.found || false;
  }

  const startNodeLabel = graphUtils.getNode(startNodeId || "")?.label;
  const targetNodeLabel = graphUtils.getNode(currentTargetNodeId || "")?.label;

  if (currentAlgorithm !== "dfs" && currentAlgorithm !== "bfs") {
    return null;
  }

  return (
    <section>
      <SectionTitle>{currentAlgorithm.toUpperCase()} Report</SectionTitle>
      <div className="rounded-md border border-(--od-border) bg-(--od-bg-1) px-3 py-1">
        <InfoRow label="Start Node" value={startNodeLabel || "N/A"} />
        <InfoRow label="Target Node" value={targetNodeLabel || "N/A"} />
        <InfoRow
          label="Path Found"
          value={
            found ? (
              <span className="text-(--od-green)">Yes</span>
            ) : (
              <span className="text-(--od-red)">No</span>
            )
          }
        />
        {found && (
          <InfoRow label="Path" value={path.map((n) => graphUtils.getNode(n)?.label).join(" → ")} />
        )}
        {found && <InfoRow label="Path length" value={`${path.length - 1} edges`} />}
      </div>
    </section>
  );
}

export default DfsBfsReport;
