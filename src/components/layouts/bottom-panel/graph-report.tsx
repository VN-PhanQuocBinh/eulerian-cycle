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
import DijkstraReport from "./report-panel/dijkstra";

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
      <div className="py-8 text-center text-sm italic text-(--gl-text-muted)">
        No graph data available. Add nodes and edges to view reports.
      </div>
    );
  }

  return (
    <div className="h-full space-y-4 overflow-y-auto rounded-md p-3 text-sm text-(--gl-text-main)">
      {/* General */}
      <section>
        <SectionTitle>General</SectionTitle>
        <div className="rounded-md border border-(--gl-border) bg-(--gl-bg-surface) px-3 py-1">
          <InfoRow label="Total Nodes" value={nodes.length} />
          <InfoRow label="Total Edges" value={edges.length} />
          <InfoRow label="Graph Type" value={isMultiGraph ? "Multi-Graph" : "Simple Graph"} />
        </div>
      </section>

      {/* Node Analysis */}
      <section>
        <SectionTitle>Node Analysis</SectionTitle>
        <div className="overflow-hidden rounded-md border border-(--gl-border) bg-(--gl-bg-surface)">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-(--gl-border)">
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
                      <span className="inline-flex px-1.5 py-0.5 text-xs font-medium text-(--gl-text-main)">
                        {inDegree}
                      </span>
                    </TableCell>

                    {isDirected && (
                      <TableCell>
                        <span className="inline-flex px-1.5 py-0.5 text-xs font-medium text-(--gl-text-main)">
                          {degree}
                        </span>
                      </TableCell>
                    )}

                    <TableCell>
                      {neighbors.length > 0 ? (
                        neighbors.map((n, idx) => (
                          <span
                            key={idx}
                            className="mr-1 inline-flex rounded border border-(--gl-border) bg-(--gl-bg-surface) px-1.5 py-0.5 text-xs text-(--gl-text-main)"
                          >
                            {graphUtils.getNode(n)?.label}
                          </span>
                        ))
                      ) : (
                        <span className="italic text-(--gl-text-muted)">—</span>
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

      {currentAlgorithm === "dijkstra" && <DijkstraReport />}

      {!currentAlgorithm && (
        <p className="text-center text-xs italic text-(--gl-text-muted)">
          Select an algorithm to see specific reports. General graph information is always
          displayed.
        </p>
      )}
    </div>
  );
}
