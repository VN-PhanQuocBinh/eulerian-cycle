import { useMemo, memo } from "react";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { TableRow, TableCell } from "@/components/ui/table";
import { CopyButton } from "@/components/copy-button";
import JumpButton from "../../jump-button";
import { Step, StepNodeElement } from "@/types/algorithm-store";
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
  const elements = step.elements;

  const currentNode: StepNodeElement | undefined = useMemo(() => {
    return elements.length == 1 && elements[0].type === "node"
      ? (elements[0] as StepNodeElement)
      : undefined;
  }, [elements]);

  const nextNode: StepNodeElement | undefined = useMemo(() => {
    return elements.filter((el) => el.type === "edge")[0]?.target;
  }, [elements]);

  const stackNodes = useMemo(() => {
    return (
      step.stack?.map((nodeId) => ({
        id: nodeId,
        label: graphUtils.getNode(nodeId)?.label || nodeId,
      })) ?? []
    );
  }, [step.stack, graphUtils]);

  const circuitNodes = useMemo(() => {
    return (
      step.circuit?.map((nodeId) => ({
        id: nodeId,
        label: graphUtils.getNode(nodeId)?.label || nodeId,
      })) ?? []
    );
  }, [step.circuit, graphUtils]);

  return (
    <TableRow
      key={index}
      ref={rowRef}
      className={cn("group border-b border-(--gl-border) hover:bg-(--gl-bg-subtle)", {
        "bg-(--gl-bg-subtle) border-l-4 border-l-(--gl-blue-dark)": isActive,
      })}
    >
      <TableCell className="text-(--gl-text-main)">
        <JumpButton index={index} />
      </TableCell>

      <TableCell className="px-3 py-2 text-center">
        {currentNode ? (
          <span className="inline-flex rounded border border-(--gl-border) bg-(--gl-bg-subtle) px-2 py-0.5 text-(--gl-text-main)">
            {currentNode.label}
          </span>
        ) : (
          <span className="italic text-(--gl-text-muted)">_</span>
        )}
      </TableCell>

      <TableCell className="px-3 py-2 text-center">
        {nextNode ? (
          <span className="inline-flex rounded border border-(--gl-border) bg-(--gl-bg-subtle) px-2 py-0.5 text-(--gl-text-main)">
            {nextNode.label}
          </span>
        ) : (
          <span className="italic text-(--gl-text-muted)">_</span>
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
                    className="w-max rounded border border-(--gl-border) bg-(--gl-bg-subtle) px-1.5 py-0.5 text-xs text-(--gl-blue-dark)"
                  >
                    {node.label}
                  </span>
                ))}
              </div>
              <CopyButton text={arrayToString(stackNodes.map((node) => node.label))} />
            </>
          ) : (
            <span className="italic text-(--gl-text-muted)">Empty stack</span>
          )}
        </div>
      </TableCell>

      <TableCell className="px-3 py-2">
        <div className="flex max-w-[220px] items-center">
          {circuitNodes.length > 0 ? (
            <>
              <div className="flex flex-1 flex-wrap items-center gap-2">
                {circuitNodes.map((node, idx) => (
                  <span
                    key={node.id + "-" + idx}
                    className="w-max rounded border border-(--gl-border) bg-(--gl-bg-subtle) px-1.5 py-0.5 text-xs text-(--gl-amber-dark)"
                  >
                    {node.label}
                  </span>
                ))}
              </div>
              <CopyButton text={arrayToString(circuitNodes.map((node) => node.label))} />
            </>
          ) : (
            <span className="italic text-(--gl-text-muted)">Empty circuit</span>
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
