import { useMemo, memo } from "react";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { TableRow, TableCell } from "@/components/ui/table";
import { CopyButton } from "@/components/copy-button";
import JumpButton from "../../jump-button";
import { Step } from "@/types/algorithm-store";
import { cn } from "@/utils/cn";
import { arrayToString } from "@/utils";
import { useSmartScroll } from "@/hooks/use-smart-scroll";
import GraphElement from "../../graph-element";

interface Props {
  step: Step;
  index: number;
  isActive: boolean;
  graphUtils: ReturnType<typeof createGraphUtils>;
}

function StackOrQueueNodes({ nodes }: { nodes: { id: string; label: string }[] }) {
  return (
    <>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {nodes.map((node, idx) => (
          <GraphElement key={node.id + "-" + idx} label={node.label} />
        ))}
      </div>
      <CopyButton text={arrayToString(nodes.map((node) => node.label))} />
    </>
  );
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

  const queueNodes = useMemo(() => {
    return (
      step.queue?.map((nodeId) => ({
        id: nodeId,
        label: graphUtils.getNode(nodeId)?.label || nodeId,
      })) ?? []
    );
  }, [step.queue, graphUtils]);

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
      className={cn(
        "group border-b border-(--gl-border) bg-(--gl-bg-surface) hover:bg-(--gl-bg-base)",
        {
          "bg-(--gl-bg-subtle) border-l-4 border-l-(--gl-blue-dark)": isActive,
        },
      )}
    >
      <TableCell className="text-(--gl-text-main)">
        <JumpButton index={index} />
      </TableCell>

      <TableCell className="px-3 py-2 text-center">
        {step.currentNode ? (
          <GraphElement label={step.currentNode.label} />
        ) : (
          <span className="italic text-(--gl-text-muted)">_</span>
        )}
      </TableCell>

      <TableCell className="px-3 py-2">
        <div className="flex max-w-[160px] items-center">
          {stackNodes.length > 0 ? (
            <StackOrQueueNodes nodes={stackNodes} />
          ) : queueNodes.length > 0 ? (
            <StackOrQueueNodes nodes={queueNodes} />
          ) : (
            <span className="italic text-(--gl-text-muted)">Empty</span>
          )}
        </div>
      </TableCell>

      <TableCell className="px-3 py-2">
        <div className="flex max-w-[220px] items-center">
          {visitedNodes.length > 0 ? (
            <>
              <div className="flex flex-1 flex-wrap items-center gap-2">
                {visitedNodes.map((node, idx) => (
                  <GraphElement key={node.id + "-" + idx} label={node.label} />
                ))}
              </div>
              <CopyButton text={arrayToString(visitedNodes.map((node) => node.label))} />
            </>
          ) : (
            <span className="italic text-(--gl-text-muted)">Empty</span>
          )}
        </div>
      </TableCell>

      <TableCell className="px-3 py-2 text-left text-(--gl-text-main)">
        {step.message.map((msg, idx) => (
          <div key={idx}>- {msg}</div>
        ))}
      </TableCell>
    </TableRow>
  );
}

export default memo(StepTableRow);
