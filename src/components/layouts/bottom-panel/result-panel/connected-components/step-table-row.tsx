import { useMemo, memo } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { COMPONENT_COLORS } from "@/types/styles";
import { CopyButton } from "@/components/copy-button";
import { GraphNode } from "@/types/graph-data-store";
import { cn } from "@/utils/cn";
import { useSmartScroll } from "@/hooks/use-smart-scroll";
import JumpButton from "@/components/layouts/bottom-panel/jump-button";
import { arrayToString } from "@/utils";

interface Props {
  step: Step;
  index: number;
  isActive: boolean;
  graphUtils: ReturnType<typeof createGraphUtils>;
}

function StepTableRow({ step, index, isActive, graphUtils }: Props) {
  const rowRef = useSmartScroll(isActive);
  const element = step.elements[0];

  const componentIndex = useMemo(() => {
    if (element) {
      const componentClass = element.classes.find((cls) => cls.startsWith("component-"));

      if (componentClass) {
        return parseInt(componentClass.split("-")[1]);
      }
    }

    return -1;
  }, [element]);

  const componentColor =
    componentIndex >= 0
      ? COMPONENT_COLORS[componentIndex % COMPONENT_COLORS.length]
      : "transparent";

  const visitedNodes = useMemo(() => {
    const visited = Array.from(step.visited || new Set<string>()).map((nodeId) => {
      const node = graphUtils.getNode(nodeId);
      return node ? node.label : nodeId;
    });

    return visited;
  }, [step.visited, graphUtils]);

  const queueNodes = useMemo(() => {
    const queue = step.queue?.map((nodeId) => {
      return {
        id: nodeId,
        label: graphUtils.getNode(nodeId)?.label,
      };
    }) as Array<GraphNode>;

    return queue;
  }, [step.queue, graphUtils]);

  return (
    <TableRow
      key={index}
      ref={rowRef}
      className={cn("group", {
        "bg-blue-50! border-l-4 border-l-blue-500": isActive,
      })}
    >
      {/* Step Number */}
      <TableCell
        className="border-l-4 text-center"
        style={{
          borderColor: componentColor,
        }}
      >
        <JumpButton index={index} />
      </TableCell>

      {/* Element */}
      <TableCell className="px-3 py-2 text-center text-nowrap">
        {element?.type === "node" ? (
          <span className="px-2 py-0.5 rounded text-gray-700 bg-gray-100">{element.label}</span>
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
            className={cn("px-2 py-0.5 rounded bg-gray-100 font-medium text-nowrap")}
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
        {step.message?.map((msg, idx) => (
          <div key={idx}>- {msg}</div>
        ))}
      </TableCell>
    </TableRow>
  );
}

export default memo(StepTableRow);
