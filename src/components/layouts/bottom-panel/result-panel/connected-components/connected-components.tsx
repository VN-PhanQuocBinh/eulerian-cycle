import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/components/ui/table";
import { Step } from "@/types/algorithm-store";
import StepTableRow from "./step-table-row";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { useMemo } from "react";

interface Props {
  steps: Step[];
}

export function ConnectedComponentsStepsTable({ steps }: Props) {
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

  // Group steps by component
  const componentGroups: { [key: number]: Step[] } = {};
  let currentComponent = 0;

  steps.forEach((step) => {
    const element = step.elements[0];
    if (element?.type === "node") {
      const componentClass = element.classes.find((cls) => cls.startsWith("component-"));
      if (componentClass) {
        const componentIndex = parseInt(componentClass.split("-")[1]);
        if (!componentGroups[componentIndex]) {
          componentGroups[componentIndex] = [];
        }
        componentGroups[componentIndex].push(step);
        currentComponent = componentIndex;
      }
    } else if (element?.type === "edge") {
      if (!componentGroups[currentComponent]) {
        componentGroups[currentComponent] = [];
      }
      componentGroups[currentComponent].push(step);
    }
  });

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-(--od-bg-0)">
      <Table className="text-[#ABB2BF]">
        <TableHeader>
          <TableRow className="border-b border-[#3E4451]">
            <TableHead className="w-10 bg-[#282C34] text-[#61AFEF]">Step</TableHead>
            <TableHead className="bg-[#282C34] text-[#61AFEF] text-center">Element</TableHead>
            <TableHead className="bg-[#282C34] text-[#61AFEF]">Component</TableHead>
            <TableHead className="bg-[#282C34] text-[#61AFEF]">Visited Nodes</TableHead>
            <TableHead className="bg-[#282C34] text-[#61AFEF]">Queue</TableHead>
            <TableHead className="bg-[#282C34] text-[#61AFEF]">Explain</TableHead>
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
