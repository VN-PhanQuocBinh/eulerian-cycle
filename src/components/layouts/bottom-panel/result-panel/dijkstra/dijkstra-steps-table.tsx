import { useMemo } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { Step } from "@/types/algorithm-store";
import DijkstraStepTableRow from "./dijkstra-step-table-row";

export function DijkstraStepsTable({ steps }: { steps: Step[] }) {
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const graphUtils = useMemo(
    () => createGraphUtils({ nodes, edges, isDirected }),
    [nodes, edges, isDirected],
  );

  return (
    <div className="h-full overflow-y-auto custom-scrollbar rounded-md border border-(--gl-border) bg-(--gl-bg-surface)">
      <Table className="text-(--gl-text-main)">
        <TableHeader>
          <TableRow className="border-b border-(--gl-border) hover:bg-transparent">
            <TableHead className="w-10 bg-(--gl-bg-subtle) text-(--gl-blue-dark)">Step</TableHead>
            <TableHead className="bg-(--gl-bg-subtle) text-(--gl-blue-dark) text-center">Processing</TableHead>
            <TableHead className="bg-(--gl-bg-subtle) text-(--gl-blue-dark)">Explain</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {steps.map((step, index) => (
            <DijkstraStepTableRow
              key={index}
              step={step}
              index={index}
              isActive={index === currentStepIndex}
              graphUtils={graphUtils}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}