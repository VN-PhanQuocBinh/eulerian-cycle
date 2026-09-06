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
    <div className="h-full overflow-y-auto custom-scrollbar rounded-md border border-(--od-border) bg-(--od-bg-1)">
      <Table className="text-(--od-fg-1)">
        <TableHeader>
          <TableRow className="border-b border-(--od-border) hover:bg-transparent">
            <TableHead className="w-10 bg-(--od-bg-2) text-(--od-blue)">Step</TableHead>
            <TableHead className="bg-(--od-bg-2) text-(--od-blue) text-center">Processing</TableHead>
            <TableHead className="bg-(--od-bg-2) text-(--od-blue)">Explain</TableHead>
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