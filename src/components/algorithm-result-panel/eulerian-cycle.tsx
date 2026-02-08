import { Step } from "@/types/graph";
import { ArrowRight } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface Props {
  steps: Step[];
  currentStepIndex: number;
}

export function EulerianCycleStepsTable({ steps, currentStepIndex }: Props) {
  if (steps.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No steps to display. Run the algorithm first.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100 border-b border-slate-200">
            <TableHead className="w-10">Step</TableHead>
            <TableHead className="w-36">Action</TableHead>
            <TableHead className="">Element</TableHead>
            <TableHead className="">Stack</TableHead>
            <TableHead className="">Circuit</TableHead>
            <TableHead className="">Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {steps.map((step, index) => {
            const isCurrentStep = index === currentStepIndex;
            const isPastStep = index < currentStepIndex;
            const element = step.current.element;

            return (
              <TableRow
                key={index}
                className={`
                  ${isCurrentStep ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}
                  ${isPastStep ? "bg-green-50/30" : ""}
                  ${!isCurrentStep && !isPastStep ? "opacity-100" : ""}
                `}
              >
                {/* Step Number */}
                <TableCell>
                  {index + 1}
                  {isCurrentStep && <span className="ml-1 text-blue-600">●</span>}
                </TableCell>

                {/* Action */}
                <TableCell className="px-3 py-2">
                  <span
                    className={`
                      px-2 py-0.5 rounded text-xs font-medium
                      ${getActionBadgeClass(step.current.action)}
                    `}
                  >
                    {formatAction(step.current.action)}
                  </span>
                </TableCell>

                {/* Element */}
                <TableCell className="px-3 py-2">
                  {element.type === "node" ? (
                    <span className=" text-gray-700 bg-slate-100 px-2 py-0.5 rounded">
                      {element.label}
                    </span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className=" text-gray-700 bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                        {element.source.label}
                      </span>
                      <ArrowRight size={12} className="text-gray-400" />
                      <span className=" text-gray-700 bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                        {element.target.label}
                      </span>
                    </div>
                  )}
                </TableCell>

                {/* Stack */}
                <TableCell className="px-3 py-2">
                  <div className="flex gap-1 flex-wrap max-w-[150px]">
                    {step.current.stack && step.current.stack.length > 0 ? (
                      step.current.stack.map((nodeId, idx) => (
                        <span
                          key={idx}
                          className=" text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded text-xs"
                        >
                          {nodeId}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">[ ]</span>
                    )}
                  </div>
                </TableCell>

                {/* Circuit */}
                <TableCell className="px-3 py-2">
                  <div className="max-w-[200px]">
                    {step.current.circuit && step.current.circuit.length > 0 ? (
                      <span className=" text-green-700 text-xs">
                        {step.current.circuit.join(" → ")}
                      </span>
                    ) : (
                      <span className="text-gray-400">[ ]</span>
                    )}
                  </div>
                </TableCell>

                {/* Message */}
                <TableCell className="px-3 py-2 text-gray-600">{step.current.message}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// Helper functions
function getActionBadgeClass(action: string): string {
  switch (action) {
    case "explore":
      return "bg-yellow-100 text-yellow-700";
    case "traverse":
      return "bg-blue-100 text-blue-700";
    case "add-to-circuit":
      return "bg-green-100 text-green-700";
    case "visit":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-slate-100 text-gray-700";
  }
}

function formatAction(action: string): string {
  return action
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
