import { useMemo, memo } from "react";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { TableRow, TableCell } from "@/components/ui/table";
import { CopyButton } from "@/components/copy-button";
import JumpButton from "../../jump-button";
import { Step, StepNodeElement, StepEdgeElement } from "@/types/algorithm-store";
import { cn } from "@/utils/cn";
import { arrayToString } from "@/utils";
import { useSmartScroll } from "@/hooks/use-smart-scroll";

interface Props {
  step: Step;
  index: number;
  isActive: boolean;
  graphUtils: ReturnType<typeof createGraphUtils>;
}

function StepTableRow({ step, index, isActive, graphUtils }: Props) {
  const rowRef = useSmartScroll(isActive);

  const stackNodes = useMemo(() => {
    return (
      step.stack?.map((nodeId) => ({
        id: nodeId,
        label: graphUtils.getNode(nodeId)?.label || nodeId,
      })) ?? []
    );
  }, [step.stack, graphUtils]);

  const visitedNodes = useMemo(() => {
    const visitedArray =
      step.visited instanceof Set ? Array.from(step.visited) : step.visited || [];
    return visitedArray.map((nodeId) => ({
      id: nodeId,
      label: graphUtils.getNode(nodeId)?.label || nodeId,
    }));
  }, [step.visited, graphUtils]);

  return (
    <TableRow
      key={index}
      ref={rowRef}
      className={cn("group border-b border-(--od-border) hover:bg-(--od-bg-2)", {
        "bg-(--od-bg-2) border-l-4 border-l-(--od-blue)": isActive,
      })}
    >
      <TableCell className="text-(--od-fg-1)">
        <JumpButton index={index} />
      </TableCell>

      <TableCell className="px-3 py-2 text-center">
        {step.currentNode ? (
          <span className="inline-flex rounded border border-(--od-border) bg-(--od-bg-2) px-2 py-0.5 text-(--od-fg-0)">
            {step.currentNode.label}
          </span>
        ) : (
          <span className="italic text-(--od-fg-2)">_</span>
        )}
      </TableCell>

      <TableCell className="px-3 py-2">
        <div className="flex max-w-[160px] items-center">
          {stackNodes.length > 0 ? (
            <>
              <div className="flex flex-1 flex-wrap items-center gap-2">
                {stackNodes.map((node, idx) => (
                  <span
                    key={node.id + "-" + idx}
                    className="w-max rounded border border-(--od-border-strong) bg-(--od-bg-2) px-1.5 py-0.5 text-xs text-(--od-purple)"
                  >
                    {node.label}
                  </span>
                ))}
              </div>
              <CopyButton text={arrayToString(stackNodes.map((node) => node.label))} />
            </>
          ) : (
            <span className="italic text-(--od-fg-2)">Empty</span>
          )}
        </div>
      </TableCell>

      <TableCell className="px-3 py-2">
        <div className="flex max-w-[220px] items-center">
          {visitedNodes.length > 0 ? (
            <>
              <div className="flex flex-1 flex-wrap items-center gap-2">
                {visitedNodes.map((node, idx) => (
                  <span
                    key={node.id + "-" + idx}
                    className="w-max rounded border border-(--od-border-strong) bg-(--od-bg-2) px-1.5 py-0.5 text-xs text-(--od-yellow)"
                  >
                    {node.label}
                  </span>
                ))}
              </div>
              <CopyButton text={arrayToString(visitedNodes.map((node) => node.label))} />
            </>
          ) : (
            <span className="italic text-(--od-fg-2)">Empty</span>
          )}
        </div>
      </TableCell>

      <TableCell className="px-3 py-2 text-left text-(--od-fg-1)">
        {step.message.map((msg, idx) => (
          <div key={idx}>- {msg}</div>
        ))}
      </TableCell>
    </TableRow>
  );
}

export default memo(StepTableRow);
