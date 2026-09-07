import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/components/ui/table";
import { Step } from "@/types/algorithm-store";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { useMemo } from "react";
import StepTableRow from "./step-table-row";

interface Props {
  steps: Step[];
}

export function EulerianCycleStepsTable({ steps }: Props) {
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
      <div className="grid h-full place-items-center py-8 text-sm text-(--gl-text-muted)">
        No steps to display. Run the algorithm first.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar rounded-md border border-(--gl-border) bg-(--gl-bg-base)">
      <Table className="text-(--gl-text-main)">
        <TableHeader>
          <TableRow className="top-0 border-b border-(--gl-border) hover:bg-transparent">
            <TableHead className="w-10 bg-(--gl-bg-subtle) text-(--gl-blue-dark)">Step</TableHead>
            <TableHead className="bg-(--gl-bg-subtle) text-(--gl-blue-dark) text-center">Current</TableHead>
            <TableHead className="bg-(--gl-bg-subtle) text-(--gl-blue-dark) text-center">Next</TableHead>
            <TableHead className="bg-(--gl-bg-subtle) text-(--gl-blue-dark)">Stack</TableHead>
            <TableHead className="bg-(--gl-bg-subtle) text-(--gl-blue-dark)">Circuit</TableHead>
            <TableHead className="bg-(--gl-bg-subtle) text-(--gl-blue-dark)">Explain</TableHead>
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
