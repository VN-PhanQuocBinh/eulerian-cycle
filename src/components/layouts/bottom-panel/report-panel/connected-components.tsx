import { useMemo } from "react";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";

import { SectionTitle } from "./components/section-title";
import { InfoRow } from "./components/info-row";

function ConnectedComponentReport() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const findConnectedComponents = useAlgorithmStore((state) => state.findConnectedComponents);
  const getCurrentGraphData = useGraphDataStore((state) => state.getCurrentGraphData);
  const findSCCs = useAlgorithmStore((state) => state.findSCCs);

  const components = useMemo(() => {
    if (nodes.length === 0) return [];

    let components: string[][] = [];
    const graphData = getCurrentGraphData();

    const startNodeIdToUse = useAlgorithmStore.getState().startNodeId || nodes[0].id;

    if (isDirected) {
      const { components: sccs } = findSCCs(graphData, startNodeIdToUse);
      components = sccs;
    } else {
      const { components: undirectedComps } = findConnectedComponents(graphData, startNodeIdToUse);
      components = undirectedComps;
    }

    return components;
  }, [nodes, edges, currentAlgorithm, isDirected]);

  return (
    <section>
      <SectionTitle>Connected Components</SectionTitle>
      <div className="mb-2 rounded-md border border-(--od-border) bg-(--od-bg-1) px-3 py-1">
        <InfoRow label="Number of Connected Components" value={components.length} />
      </div>
      <div className="space-y-1.5">
        {components.map((comp, i) => {
          const labels = comp.map((id) => nodes.find((n) => n.id === id)?.label ?? id);
          return (
            <div
              key={i}
              className="flex items-center gap-2 rounded-md border border-(--od-border) bg-(--od-bg-1) px-3 py-1.5"
            >
              <span className="shrink-0 text-xs font-bold text-(--od-fg-0)">
                Component {i + 1} ({comp.length} nodes):
              </span>
              <span className="text-(--od-fg-1)">{labels.join(", ")}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ConnectedComponentReport;
