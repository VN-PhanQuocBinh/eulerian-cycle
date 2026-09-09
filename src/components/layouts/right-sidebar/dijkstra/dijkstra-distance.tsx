import { useGraphDataStore, useAlgorithmStore } from "@/stores";
import { useMemo } from "react";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { PanelHeader } from "../algorithm-state-panel";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import GraphElement from "../../bottom-panel/graph-element";

export default function DijkstraDistanceItem() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const steps = useAlgorithmStore((state) => state.steps);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const graphUtils = useMemo(
    () => createGraphUtils({ nodes, edges, isDirected }),
    [nodes, edges, isDirected],
  );
  const currentStep = steps[currentStepIndex] ?? steps[steps.length - 1];
  const distances = currentStep?.distances;

  return (
    <section className="overflow-hidden rounded-md border border-(--gl-border) bg-(--gl-bg-base)">
      <PanelHeader
        icon={<span className="text-[11px] font-bold">D</span>}
        label="Distance / previous"
      />
      {!distances || distances.size === 0 ? (
        <div className="p-3 text-xs italic text-(--gl-text-muted)">No distance data</div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="border-collapse text-xs">
            <TableHeader>
              <TableRow>
                <TableHead>Node</TableHead>
                <TableHead className="text-center">Distance</TableHead>
                <TableHead className="text-center">Previous</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node) => {
                const distance = distances.get(node.id);
                const previousNode = currentStep?.previousNodes?.get(node.id);
                const previousLabel = previousNode
                  ? graphUtils.getNode(previousNode)?.label || previousNode
                  : "-";
                return (
                  <TableRow key={node.id} className="hover:bg-(--gl-bg-subtle)">
                    <TableCell>
                      <GraphElement label={node.label} className="m-auto" />
                    </TableCell>
                    <TableCell className="text-center font-semibold text-(--gl-blue-dark)">
                      {distance === undefined || distance === Infinity ? "-" : distance}
                    </TableCell>
                    <TableCell className="text-center">
                      {previousLabel === "-" ? (
                        <span className="italic text-(--gl-text-muted)">-</span>
                      ) : (
                        <GraphElement label={previousLabel} className="m-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
