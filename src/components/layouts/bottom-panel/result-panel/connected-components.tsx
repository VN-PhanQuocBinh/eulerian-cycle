import { GraphNode, StoredStep } from "@/types/graph";
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
    <div className="bg-white px-4 h-full overflow-y-auto custom-scrollbar">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-blue-200">
            <TableHead className="w-10 bg-gray-100 text-blue-800">Step</TableHead>
            <TableHead className="bg-gray-100 text-blue-800 text-center">Element</TableHead>
            <TableHead className="bg-gray-100 text-blue-800">Component</TableHead>
            <TableHead className="bg-gray-100 text-blue-800">Visited Nodes</TableHead>
            <TableHead className="bg-gray-100 text-blue-800">Queue</TableHead>
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

            const queueNodes = step.current.queue?.map((nodeId) => {
              return {
                id: nodeId,
                label: getLabelById(useGraphStore.getState().cyInstance, nodeId),
              };
            }) as Array<GraphNode>;

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

                {/* Queue */}
                <TableCell className="px-3 py-2">
                  <div className="flex items-center max-w-[150px]">
                    {queueNodes && queueNodes.length > 0 ? (
                      <>
                        <div className="flex-1 flex items-center gap-2 flex-wrap">
                          {queueNodes.map((node) => (
                            <span
                              key={node.id}
                              className="size-5 w-max text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded text-xs"
                            >
                              {node?.label}
                            </span>
                          ))}
                        </div>
                        <CopyButton text={arrayToString(queueNodes.map((node) => node?.label))} />
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Empty Queue</span>
                    )}
                  </div>
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
