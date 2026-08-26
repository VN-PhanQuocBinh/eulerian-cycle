import { useMemo } from "react";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";

import { SectionTitle } from "./components/section-title";
import { InfoRow } from "./components/info-row";

function EulerianCycleReport() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const currentStartNodeId = useAlgorithmStore((state) => state.startNodeId);
  const findEulerianCycle = useAlgorithmStore((state) => state.findEulerianCycle);

  const graphUtils = useMemo(
    () =>
      createGraphUtils({
        nodes,
        edges,
        isDirected,
      }),
    [nodes, edges, isDirected],
  );

  const circuit = useMemo(() => {
    if (currentAlgorithm !== "eulerian-cycle") return null;
    const { cycle } = findEulerianCycle(
      {
        nodes,
        edges,
        isDirected,
      },
      currentStartNodeId || nodes[0].id,
    );
    return cycle;
  }, [currentAlgorithm, nodes, edges, isDirected]);

  const oddDegreeNodes = useMemo(
    () =>
      nodes.filter((node) => {
        const adjacentNodes = graphUtils.adjacencyList.get(node.id) || [];
        const nodeDegree = adjacentNodes.length;
        return nodeDegree % 2 !== 0;
      }),
    [nodes, graphUtils],
  );

  return (
    <section>
      <SectionTitle>Eulerian Cycle</SectionTitle>
      <div className="rounded-md border border-(--od-border) bg-(--od-bg-1) px-3 py-1">
        <InfoRow
          label="Odd-Degree Nodes"
          value={
            oddDegreeNodes.length === 0 ? (
              <span className="text-(--od-green)">None</span>
            ) : (
              <span className="text-(--od-yellow)">
                {oddDegreeNodes.map((n) => n.label).join(", ")}
              </span>
            )
          }
        />
        {circuit && <InfoRow label="Circuit length" value={`${circuit.length - 1} edges`} />}
        {circuit && (
          <InfoRow
            label="Circuit"
            value={circuit.map((n) => graphUtils.getNode(n)?.label).join(" → ")}
          />
        )}
      </div>
    </section>
  );
}

export default EulerianCycleReport;
