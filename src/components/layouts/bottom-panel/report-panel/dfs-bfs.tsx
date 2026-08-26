import { useMemo } from "react";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { AlgorithmResult } from "@/core/types/algorithm";
import { SectionTitle } from "./components/section-title";
import { InfoRow } from "./components/info-row";
import { DFS } from "@/core/algorithms/dfs";

interface SearchAlgorithmResult {
  startNodeId: string;
  targetNodeId: string;
  path: string[];
  found: boolean;
}

function DfsBfsReport() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const startNodeId = useAlgorithmStore((state) => state.startNodeId);
  const currentTargetNodeId = useAlgorithmStore((state) => state.targetNodeId);

  const graphUtils = useMemo(
    () =>
      createGraphUtils({
        nodes,
        edges,
        isDirected,
      }),
    [nodes, edges, isDirected],
  );

  const searchResult = useMemo<AlgorithmResult<SearchAlgorithmResult> | null>(() => {
    if (!startNodeId || !currentTargetNodeId) return null;

    const graphData = { nodes, edges, isDirected };

    if (currentAlgorithm === "dfs") {
      const engine = new DFS(graphData);
      return engine.execute(startNodeId, currentTargetNodeId);
    }
    if (currentAlgorithm === "bfs") {
      // Assuming you have a BFS implementation
      // return findBfs(graphData, startNodeId, currentTargetNodeId);
    }
    return null;
  }, [currentAlgorithm, nodes, edges, isDirected, startNodeId, currentTargetNodeId]);

  const path = searchResult?.result?.path || [];
  const found = searchResult?.result?.found || false;
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
