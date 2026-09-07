import { useMemo } from "react";
import { DijkstraResult } from "@/core/types/algorithm";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SectionTitle } from "./components/section-title";
import { InfoRow } from "./components/info-row";

function DijkstraReport() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
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

  if (currentAlgorithm !== "dijkstra") {
    return null;
  }

  const result = executionResult as DijkstraResult | null;
  const dijkstraResult = result?.result;
  const shortestPath = dijkstraResult?.shortestPath ?? [];
  const shortestDistance = dijkstraResult?.shortestDistance ?? Infinity;
  const distances = dijkstraResult?.distances ?? new Map<string, number>();
  const previousNodes = dijkstraResult?.previousNodes ?? new Map<string, string | null>();
  const found = dijkstraResult?.found ?? false;

  return (
    <section>
      <SectionTitle>Dijkstra Report</SectionTitle>
      <div className="w-full flex flex-row gap-3">
        <div className="flex-1 rounded-md border border-(--gl-border) bg-(--gl-bg-surface) px-3 py-1">
          <InfoRow
            label="Start Node"
            value={graphUtils.getNode(dijkstraResult?.startNodeId || "")?.label || "N/A"}
          />
          <InfoRow
            label="Target Node"
            value={graphUtils.getNode(dijkstraResult?.targetNodeId || "")?.label || "N/A"}
          />
          <InfoRow
            label="Path Found"
            value={
              found ? (
                <span className="text-(--gl-green-dark)">Yes</span>
              ) : (
                <span className="text-(--gl-red-dark)">No</span>
              )
            }
          />
          <InfoRow
            label="Shortest Distance"
            value={Number.isFinite(shortestDistance) ? shortestDistance : "N/A"}
          />
          {found && (
            <>
              <InfoRow
                label="Shortest Path"
                value={shortestPath
                  .map((nodeId) => graphUtils.getNode(nodeId)?.label || nodeId)
                  .join(" → ")}
              />
              <InfoRow
                label="Path Length"
                value={`${Math.max(shortestPath.length - 1, 0)} edges`}
              />
            </>
          )}
        </div>

        <div className="min-w-0 flex-1 overflow-hidden rounded-md border border-(--gl-border) bg-(--gl-bg-surface)">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-(--gl-border)">
                <TableHead>Node</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Previous Node</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node) => {
                const distance = distances.get(node.id) ?? Infinity;
                const previousNodeId = previousNodes.get(node.id);
                const previousNode = previousNodeId
                  ? graphUtils.getNode(previousNodeId)
                  : undefined;

                return (
                  <TableRow key={node.id}>
                    <TableCell>{node.label}</TableCell>
                    <TableCell>
                      {Number.isFinite(distance) ? distance : "-"}
                    </TableCell>
                    <TableCell>
                      {previousNode?.label || previousNodeId || "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}

export default DijkstraReport;
