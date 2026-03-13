import { StoredStep } from "@/types/graph";
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
import { COMPONENT_COLORS } from "@/types/styles";
import { cn } from "@/utils/cn";
import { getLabelById } from "@/utils";

interface Props {
  steps: StoredStep[];
}

export function SCCStepsTable({ steps }: Props) {
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
      <Table>
        <TableHeader>
          <TableRow className="border-b border-blue-200">
            <TableHead className="w-10 bg-gray-100 text-blue-800">Step</TableHead>
            <TableHead className="bg-gray-100 text-blue-800 text-center">Element</TableHead>
            <TableHead className="bg-gray-100 text-blue-800">Stack</TableHead>
            <TableHead className="bg-gray-100 text-blue-800">SCC</TableHead>
            <TableHead className="bg-gray-100 text-blue-800">Explain</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {steps.map((step, index) => {
            const isCurrentStep = index === currentStepIndex;
            const isPastStep = index < currentStepIndex;
            let element: (typeof step.current.elements)[number] | undefined;

            if (step.current.elements && step.current.elements.length > 0) {
              element = step.current.elements[0];
            }

            // Detect SCC component index from element classes
            let componentIndex = -1;
            if (element) {
              const componentClass = element.classes.find((cls) => cls.startsWith("component-"));
              if (componentClass) {
                componentIndex = parseInt(componentClass.split("-")[1]);
              }
            }

            const componentColor =
              componentIndex >= 0
                ? COMPONENT_COLORS[componentIndex % COMPONENT_COLORS.length]
                : "transparent";

            const stackNodes =
              step.current.stack?.map((nodeId) => ({
                id: nodeId,
                label: getLabelById(useGraphStore.getState().cyInstance, nodeId),
              })) ?? [];

            return (
              <TableRow
                key={index}
                className={cn("", {
                  "bg-blue-50! border-l-4 border-l-blue-500": isCurrentStep,
                  "bg-green-50/30": isPastStep,
                })}
              >
                {/* Step Number */}
                <TableCell
                  className="border-l-4"
                  style={{ borderColor: componentIndex >= 0 ? componentColor : "transparent" }}
                >
                  {index + 1}
                </TableCell>

                {/* Element */}
                <TableCell className="px-3 py-2 text-center">
                  {element?.type === "node" ? (
                    <span
                      className={cn("px-2 py-0.5 rounded font-medium text-gray-700 bg-gray-100")}
                    >
                      {element.label}
                    </span>
                  ) : element?.type === "edge" ? (
                    <span className="text-gray-600">
                      {element.source.label} → {element.target.label}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">_</span>
                  )}
                </TableCell>

                {/* Tarjan Stack */}
                <TableCell className="px-3 py-2">
                  <div className="flex items-center max-w-[200px]">
                    {stackNodes.length > 0 ? (
                      <>
                        <div className="flex-1 flex items-center gap-1 flex-wrap">
                          {stackNodes.map((node) => (
                            <span
                              key={node.id}
                              className="px-1.5 py-0.5 rounded text-xs text-indigo-700 bg-indigo-100"
                            >
                              {node.label}
                            </span>
                          ))}
                        </div>
                        <CopyButton text={`[${stackNodes.map((n) => n.label).join(", ")}]`} />
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Empty</span>
                    )}
                  </div>
                </TableCell>

                {/* SCC */}
                <TableCell className="px-3 py-2">
                  {componentIndex >= 0 ? (
                    <span
                      className="px-2 py-0.5 rounded bg-gray-100 font-medium"
                      style={{ color: componentColor }}
                    >
                      SCC {componentIndex + 1}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </TableCell>

                {/* Message */}
                <TableCell className="px-3 py-2 text-gray-600 text-left">
                  {step.current.message?.map((msg, idx) => (
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
