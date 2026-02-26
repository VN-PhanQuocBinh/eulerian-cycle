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
import { useGraphStore } from "@/contexts/graph-context";

const arrayToString = (arr: string[]) => {
  let result: string = arr.join(", ");
  return "[" + result + "]";
};

interface Props {
  steps: StoredStep[];
}

export function EulerianCycleStepsTable({ steps }: Props) {
  const currentStepIndex = useGraphStore((state) => state.currentStepIndex);

  if (steps.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No steps to display. Run the algorithm first.
      </div>
    );
  }

  return (
    <div className="bg-white p-4">
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
            const elements = step.current.elements;

            const currentNode: StepNodeElement = elements.filter((el) => el.type === "node")[0];
            const nextNode: StepNodeElement = elements.filter((el) => el.type === "edge")[0]
              ?.target;

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
                  <span className="size-5 text-gray-700 bg-slate-100 px-2 py-0.5 rounded">
                    {currentNode.label}
                  </span>
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
                    {step.current.stack && step.current.stack.length > 0 ? (
                      <>
                        <div className="flex-1 flex items-center gap-2 flex-wrap">
                          {step.current.stack.map((node, idx) => (
                            <span
                              key={idx}
                              className="size-5 text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded text-xs"
                            >
                              {node.label}
                            </span>
                          ))}
                        </div>
                        <CopyButton
                          text={arrayToString(step.current.stack.map((node) => node.label))}
                        />
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Empty stack</span>
                    )}
                  </div>
                </TableCell>

                {/* Circuit */}
                <TableCell className="px-3 py-2">
                  <div className="flex items-center max-w-[200px]">
                    {step.current.circuit && step.current.circuit.length > 0 ? (
                      <>
                        <div className="flex-1 flex items-center gap-2 flex-wrap">
                          {step.current.circuit.map((node, idx) => (
                            <span
                              key={idx}
                              className="size-5 text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded text-xs"
                            >
                              {node.label}
                            </span>
                          ))}
                        </div>
                        <CopyButton
                          text={arrayToString(step.current.circuit.map((node) => node.label))}
                        />
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Empty circuit</span>
                    )}
                  </div>
                </TableCell>

                {/* Message */}
                <TableCell className="px-3 py-2 text-gray-600 text-left">
                  {step.current.message.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
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
