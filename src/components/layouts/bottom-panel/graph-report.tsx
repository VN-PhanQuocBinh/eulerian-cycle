import { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--od-fg-2)">
      {children}
    </h4>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b border-(--od-border) py-1.5 text-sm last:border-0">
      <span className="text-(--od-fg-1)">{label}</span>
      <span className="font-medium text-(--od-fg-0)">{value}</span>
    </div>
  );
}

export function GraphReport() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const currentStartNodeId = useAlgorithmStore((state) => state.startNodeId);
  const findConnectedComponents = useAlgorithmStore((state) => state.findConnectedComponents);
  const findEulerianCycle = useAlgorithmStore((state) => state.findEulerianCycle);
  const getCurrentGraphData = useGraphDataStore((state) => state.getCurrentGraphData);
  const findSCCs = useAlgorithmStore((state) => state.findSCCs);

  const graphUtils = useMemo(
    () =>
      createGraphUtils({
        nodes,
        edges,
        isDirected,
      }),
    [nodes, edges, isDirected],
  );

  const isMultiGraph = useMemo(() => {
    const seen = new Set<string>();
    for (const e of edges) {
      const key = [e.source, e.target].sort().join("|");
      if (seen.has(key)) return true;
      seen.add(key);
    }
    return false;
  }, [edges]);

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

  if (nodes.length === 0) {
    return (
      <div className="py-8 text-center text-sm italic text-(--od-fg-2)">
        No graph data available. Add nodes and edges to view reports.
      </div>
    );
  }

  return (
    <div className="h-full space-y-4 overflow-y-auto bg-(--od-bg-0) p-3 text-sm text-(--od-fg-1)">
      {/* General */}
      <section>
        <SectionTitle>General</SectionTitle>
        <div className="rounded-md border border-(--od-border) bg-(--od-bg-1) px-3 py-1">
          <InfoRow label="Total Nodes" value={nodes.length} />
          <InfoRow label="Total Edges" value={edges.length} />
          <InfoRow label="Graph Type" value={isMultiGraph ? "Multi-Graph" : "Simple Graph"} />
        </div>
      </section>

      {/* Node Analysis */}
      <section>
        <SectionTitle>Node Analysis</SectionTitle>
        <div className="overflow-hidden rounded-md border border-(--od-border) bg-(--od-bg-1)">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-(--od-border)">
                <TableHead>Node</TableHead>
                {!isDirected ? (
                  <TableHead>Degree</TableHead>
                ) : (
                  <>
                    <TableHead>In-Degree</TableHead>
                    <TableHead>Out-Degree</TableHead>
                  </>
                )}
                <TableHead>Adjacent List</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node) => {
                const neighbors = graphUtils.adjacencyList.get(node.id) ?? [];
                const degree = graphUtils.adjacencyList.get(node.id)?.length ?? 0;
                const inDegree = graphUtils.reverseAdjacencyList.get(node.id)?.length ?? 0;

                return (
                  <TableRow key={node.id}>
                    <TableCell>{node.label}</TableCell>

                    <TableCell>
                      <span className="inline-flex px-1.5 py-0.5 text-xs font-medium text-(--od-fg-0)">
                        {degree}
                      </span>
                    </TableCell>

                    {isDirected && (
                      <TableCell>
                        <span className="inline-flex px-1.5 py-0.5 text-xs font-medium text-(--od-fg-0)">
                          {inDegree}
                        </span>
                      </TableCell>
                    )}

                    <TableCell>
                      {neighbors.length > 0 ? (
                        neighbors.map((n, idx) => (
                          <span
                            key={idx}
                            className="mr-1 inline-flex rounded border border-(--od-border) bg-(--od-bg-1) px-1.5 py-0.5 text-xs text-(--od-fg-1)"
                          >
                            {graphUtils.getNode(n)?.label}
                          </span>
                        ))
                      ) : (
                        <span className="italic text-(--od-fg-2)">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Algorithm-specific */}
      {currentAlgorithm === "connected-components" && (
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
      )}

      {currentAlgorithm === "eulerian-cycle" && (
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
      )}

      {!currentAlgorithm && (
        <p className="text-center text-xs italic text-(--od-fg-2)">
          Select an algorithm to see specific reports. General graph information is always
          displayed.
        </p>
      )}
    </div>
  );
}
