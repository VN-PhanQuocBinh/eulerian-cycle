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
import { COMPONENT_COLORS } from "@/types/styles";
import { cn } from "@/utils/cn";

const arrayToString = (arr: string[]) => {
  return "[" + arr.join(", ") + "]";
};

interface Props {
  steps: StoredStep[];
}

export function ConnectedComponentsStepsTable({ steps }: Props) {
  const currentStepIndex = useGraphStore((state) => state.currentStepIndex);

  if (steps.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No steps to display. Run the algorithm first.
      </div>
    );
  }

  // Group steps by component
  const componentGroups: { [key: number]: StoredStep[] } = {};
  let currentComponent = 0;

  steps.forEach((step) => {
    const element = step.current.elements[0];
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
    <div className="bg-white p-4">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-blue-200">
            <TableHead className="w-10 bg-gray-100 text-blue-800">Step</TableHead>
            <TableHead className="bg-gray-100 text-blue-800 text-center">Element</TableHead>
            <TableHead className="bg-gray-100 text-blue-800">Component</TableHead>
            <TableHead className="bg-gray-100 text-blue-800">Visited Nodes</TableHead>
            <TableHead className="bg-gray-100 text-blue-800">Explain</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {steps.map((step, index) => {
            const isCurrentStep = index === currentStepIndex;
            const isPastStep = index < currentStepIndex;
            const element = step.current.elements[0];

            // Determine component index from classes
            let componentIndex = -1;
            if (element) {
              const componentClass = element.classes.find((cls) => cls.startsWith("component-"));

              console.log(
                "Component class:",
                componentClass,
                "step index:",
                index,
                "color index:",
                componentIndex % COMPONENT_COLORS.length,
              );

              if (componentClass) {
                componentIndex = parseInt(componentClass.split("-")[1]);
              }
            }

            const componentColor =
              componentIndex >= 0
                ? COMPONENT_COLORS[componentIndex % COMPONENT_COLORS.length]
                : "transparent";

            const visitedNodes = Array.from(step.current.visited || new Set<string>()).map(
              (nodeId) => {
                const node = useGraphStore.getState().nodes.find((n) => n.id === nodeId);
                return node ? node.label : nodeId;
              },
            );
            // Collect all visited nodes up to this step
            // const visitedNodes = new Set<string>();
            // for (let i = 0; i <= index; i++) {
            //   const el = steps[i].current.elements[0];
            //   if (el?.type === "node") {
            //     visitedNodes.add(el.label);
            //   }
            // }

            return (
              <TableRow
                key={index}
                className={cn("", {
                  "bg-blue-50 border-l-4 border-l-blue-500": isCurrentStep,
                  "bg-green-50/30": isPastStep,
                })}
              >
                {/* Step Number */}
                <TableCell
                  className="border-l-4"
                  style={{
                    borderColor: componentColor,
                  }}
                >
                  {index + 1}
                </TableCell>

                {/* Element */}
                <TableCell className="px-3 py-2 text-center">
                  {element?.type === "node" ? (
                    <span className="px-2 py-0.5 rounded text-gray-700 bg-gray-100">
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

                {/* Component */}
                <TableCell className="px-3 py-2">
                  {componentIndex >= 0 && (
                    <span
                      className={cn("px-2 py-0.5 rounded bg-gray-100 font-medium")}
                      style={{
                        color: componentColor,
                      }}
                    >
                      Component {componentIndex + 1}
                    </span>
                  )}
                </TableCell>

                {/* Visited Nodes */}
                <TableCell className="px-3 py-2">
                  <div className="flex items-center max-w-[200px]">
                    {visitedNodes.length > 0 ? (
                      <>
                        <div className="flex-1 flex items-center gap-2 flex-wrap">
                          {visitedNodes.map((nodeLabel, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded text-xs text-gray-700 bg-gray-100"
                            >
                              {nodeLabel}
                            </span>
                          ))}
                        </div>
                        <CopyButton text={arrayToString(visitedNodes)} />
                      </>
                    ) : (
                      <span className="text-gray-400 italic">No nodes visited</span>
                    )}
                  </div>
                </TableCell>

                {/* Message */}
                <TableCell className="px-3 py-2 text-gray-600 text-left">
                  {step.current.message?.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                  ))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
        <p className="text-sm text-gray-700">
          Total components found: <strong>{Object.keys(componentGroups).length}</strong>
        </p>
        <div className="mt-3 space-y-2">
          {Object.entries(componentGroups).map(([componentIdx, componentSteps]) => {
            const nodes = new Set<string>();
            componentSteps.forEach((step) => {
              const el = step.current.elements[0];
              if (el?.type === "node") {
                nodes.add(el.label);
              }
            });

            const componentColor =
              COMPONENT_COLORS[parseInt(componentIdx) % COMPONENT_COLORS.length];

            return (
              <div key={componentIdx} className="flex items-center gap-2">
                <span className={cn("px-2 py-1 rounded text-gray-700 font-medium", componentColor)}>
                  Component {parseInt(componentIdx) + 1}
                </span>
                <span className="text-sm text-gray-600">
                  : {Array.from(nodes).join(", ")} ({nodes.size} nodes)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
