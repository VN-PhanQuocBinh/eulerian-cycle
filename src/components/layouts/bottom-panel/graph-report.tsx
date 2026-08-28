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

import { SectionTitle } from "./report-panel/components/section-title";
import { InfoRow } from "./report-panel/components/info-row";

import ConnectedComponentReport from "./report-panel/connected-components";
import EulerianCycleReport from "./report-panel/eulerian-cycle";
import DfsBfsReport from "./report-panel/dfs-bfs";

export function GraphReport() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);

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
                        {inDegree}
                      </span>
                    </TableCell>

                    {isDirected && (
                      <TableCell>
                        <span className="inline-flex px-1.5 py-0.5 text-xs font-medium text-(--od-fg-0)">
                          {degree}
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
      {currentAlgorithm === "connected-components" && <ConnectedComponentReport />}

      {currentAlgorithm === "eulerian-cycle" && <EulerianCycleReport />}

      {(currentAlgorithm === "dfs" || currentAlgorithm === "bfs") && <DfsBfsReport />}

      {!currentAlgorithm && (
        <p className="text-center text-xs italic text-(--od-fg-2)">
          Select an algorithm to see specific reports. General graph information is always
          displayed.
        </p>
      )}
    </div>
  );
}
