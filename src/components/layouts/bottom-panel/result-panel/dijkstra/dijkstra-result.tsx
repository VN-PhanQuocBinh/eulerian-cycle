import { useMemo } from "react";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { DijkstraStepsTable } from "./dijkstra-steps-table";
import GraphElement from "../../graph-element";
import { cn } from "@/utils/cn";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export function DijkstraResult({ steps }: { steps: Step[] }) {
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const currentStep = steps[currentStepIndex] ?? steps[steps.length - 1];

  if (steps.length === 0) {
    return (
      <div className="grid h-full place-items-center text-sm text-(--gl-text-muted)">
        No steps to display. Run the algorithm first.
      </div>
    );
  }

  return (
    <div className="flex h-full gap-2 text-(--gl-text-main)">
      <div className="min-w-0 flex-1 max-h-full overflow-y-auto rounded-md bg-(--gl-bg-surface) custom-scrollbar">
        <DijkstraStepsTable steps={steps} />
      </div>
      <div className="top-0 w-72 basis-[280px] overflow-y-auto rounded-md border border-(--gl-border) bg-(--gl-bg-surface) p-3 custom-scrollbar">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-(--gl-text-muted)">
          distance / previous
        </div>
        <DistanceTable
          distances={currentStep?.distances}
          previousNodes={currentStep?.previousNodes}
        />
      </div>
    </div>
  );
}

function DistanceTable({
  distances,
  previousNodes,
}: {
  distances?: Map<string, number>;
  previousNodes?: Map<string, string | null>;
}) {
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const graphUtils = useMemo(
    () => createGraphUtils({ nodes, edges, isDirected }),
    [nodes, edges, isDirected],
  );

  if (!distances || distances.size === 0) {
    return <span className="text-xs italic text-(--gl-text-muted)">-</span>;
  }

  return (
    <div className="rounded-md border border-(--gl-border) bg-(--gl-bg-base)">
      <Table className="space-y-1 border-collapse">
        <TableHeader className="">
          <TableRow className=" pb-1 text-xs font-medium text-(--gl-text-muted) )">
            <TableHead className="border-r border-(--gl-border) font-semibold bg-(--gl-bg-base)">Node</TableHead>
            <TableHead className=" text-center border-r border-(--gl-border) font-semibold bg-(--gl-bg-base)">
              Distance
            </TableHead>
            <TableHead className=" text-center font-semibold bg-(--gl-bg-base)">
              Previous
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nodes.map((node, idx) => {
            const distance = distances.get(node.id);
            const previousNode = previousNodes?.get(node.id);
            const previousLabel = previousNode
              ? graphUtils.getNode(previousNode)?.label || previousNode
              : "-";

            return (
              <TableRow
                key={node.id}
                className={cn(
                  " rounded px-1 py-1 text-base transition-colors hover:bg-(--gl-bg-subtle)",
                )}
              >
                <TableCell className="border-r border-(--gl-border)">
                  <GraphElement label={node.label} className="m-auto" />
                </TableCell>
                <TableCell className="border-r border-(--gl-border) text-center font-semibold text-(--gl-blue-dark)">
                  {distance === undefined || distance === Infinity ? "-" : distance}
                </TableCell>
                <TableCell className="text-center">
                  {previousLabel === "-" ? (
                    <span className=" italic text-(--gl-text-muted)">-</span>
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
  );
}
