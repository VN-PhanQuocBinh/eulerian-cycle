import { StepNodeElement, StoredStep } from "@/types/graph";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { CopyButton } from "@/components/copy-button";
import { Step } from "@/types/algorithm-store";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { useMemo } from "react";

const arrayToString = (arr: string[]) => {
  let result: string = arr.join(", ");
  return "[" + result + "]";
};

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
          {steps.map((step, index) => {
            const isCurrentStep = index === currentStepIndex;
            const isPastStep = index < currentStepIndex;
            const elements = step.elements;

            const currentNode: StepNodeElement | undefined = elements.filter(
              (el) => el.type === "node",
            )[0];
            const nextNode: StepNodeElement | undefined = elements.filter(
              (el) => el.type === "edge",
            )[0]?.target;

            const stackNodes = step.stack?.map((nodeId) => ({
              id: nodeId,
              label: graphUtils.getNode(nodeId)?.label || nodeId,
            }));

            const circuitNodes = step.circuit?.map((nodeId) => ({
              id: nodeId,
              label: graphUtils.getNode(nodeId)?.label || nodeId,
            }));

            return (
              <TableRow
                key={index}
                className={`
                  ${isCurrentStep ? "bg-blue-50! border-l-4 border-l-blue-500" : ""}
                  ${isPastStep ? "bg-green-50/30" : ""}
                  ${!isCurrentStep && !isPastStep ? "opacity-100" : ""}
                `}
              >
                {/* Step Number */}
                <TableCell>{index + 1}</TableCell>

                {/* Element */}
                <TableCell className="px-3 py-2 text-center">
                  {currentNode ? (
                    <span className="size-5 text-gray-700 bg-slate-100 px-2 py-0.5 rounded">
                      {currentNode.label}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">_</span>
                  )}
                </TableCell>

                {/* Element */}
                <TableCell className="px-3 py-2 text-center">
                  {nextNode ? (
                    <span className="size-5 text-gray-700 bg-slate-100 px-2 py-0.5 rounded">
                      {nextNode.label}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">_</span>
                  )}
                </TableCell>

                {/* Stack */}
                <TableCell className="px-3 py-2">
                  <div className="flex items-center max-w-[150px]">
                    {stackNodes && stackNodes.length > 0 ? (
                      <>
                        <div className="flex-1 flex items-center gap-2 flex-wrap">
                          {stackNodes.map((node, idx) => (
                            <span
                              key={idx}
                              className="size-5 w-max text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded text-xs"
                            >
                              {node.label}
                            </span>
                          ))}
                        </div>
                        <CopyButton text={arrayToString(stackNodes.map((node) => node.label))} />
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Empty stack</span>
                    )}
                  </div>
                </TableCell>

                {/* Circuit */}
                <TableCell className="px-3 py-2">
                  <div className="flex items-center max-w-[200px]">
                    {circuitNodes && circuitNodes.length > 0 ? (
                      <>
                        <div className="flex-1 flex items-center gap-2 flex-wrap">
                          {circuitNodes.map((node, idx) => (
                            <span
                              key={idx}
                              className="size-5 w-max text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded text-xs"
                            >
                              {node.label}
                            </span>
                          ))}
                        </div>
                        <CopyButton text={arrayToString(circuitNodes.map((node) => node.label))} />
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Empty circuit</span>
                    )}
                  </div>
                </TableCell>

                {/* Message */}
                <TableCell className="px-3 py-2 text-gray-600 text-left">
                  {step.message.map((msg, idx) => (
                    <div key={idx}>- {msg}</div>
                  ))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
