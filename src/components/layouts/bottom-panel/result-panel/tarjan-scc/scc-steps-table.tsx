import { useMemo } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/components/ui/table";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import StepTableRow from "./step-table-row";

interface Props {
  steps: Step[];
}

export function SCCStepsTable({ steps }: Props) {
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const edges = useGraphDataStore((state) => state.edges);
  const nodes = useGraphDataStore((state) => state.nodes);
  const isDirected = useGraphDataStore((state) => state.isDirected);

  const graphUtils = useMemo(() => {
    return createGraphUtils({
      nodes,
      edges,
      isDirected,
    });
  }, [nodes, edges, isDirected]);

  if (steps.length === 0) {
    return (
      <div className="grid h-full place-items-center py-8 text-sm text-(--od-fg-2)">
        No steps to display. Run the algorithm first.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar rounded-md border border-(--od-border) bg-(--od-bg-1) p-4">
      <Table className="text-(--od-fg-1)">
        <TableHeader>
          <TableRow className="border-b border-(--od-border) hover:bg-transparent">
            <TableHead className="w-10 bg-(--od-bg-2) text-(--od-blue)">Step</TableHead>
            <TableHead className="bg-(--od-bg-2) text-(--od-blue) text-center">Element</TableHead>
            <TableHead className="bg-(--od-bg-2) text-(--od-blue)">Stack</TableHead>
            <TableHead className="bg-(--od-bg-2) text-(--od-blue)">SCC</TableHead>
            <TableHead className="bg-(--od-bg-2) text-(--od-blue)">Explain</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {steps.map((step, index) => (
            <StepTableRow
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
