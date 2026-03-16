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
      <div className="text-center py-8 text-gray-400 text-sm">
        No steps to display. Run the algorithm first.
      </div>
    );
  }

  return (
    <div className="bg-white px-4 h-full overflow-y-auto custom-scrollbar">
      <Table className="">
        <TableHeader className="">
          <TableRow className="top-0 border-b border-blue-200">
            <TableHead className="w-10 bg-gray-100 text-blue-800">Step</TableHead>
            <TableHead className="bg-gray-100 text-blue-800 text-center">Current</TableHead>
            <TableHead className="bg-gray-100 text-blue-800 text-center">Next</TableHead>
            <TableHead className="bg-gray-100 text-blue-800">Stack</TableHead>
            <TableHead className="bg-gray-100 text-blue-800">Circuit</TableHead>
            <TableHead className="bg-gray-100 text-blue-800">Explain</TableHead>
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
