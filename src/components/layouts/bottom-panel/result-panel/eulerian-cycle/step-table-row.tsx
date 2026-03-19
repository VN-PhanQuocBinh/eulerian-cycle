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
    return elements.filter((el) => el.type === "node")[0];
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
      className={cn("group border-b border-(--od-border) hover:bg-(--od-bg-2)", {
        "bg-(--od-bg-2) border-l-4 border-l-(--od-blue)": isActive,
      })}
    >
      <TableCell className="text-(--od-fg-1)">
        <JumpButton index={index} />
      </TableCell>

      <TableCell className="px-3 py-2 text-center">
        {currentNode ? (
          <span className="inline-flex rounded border border-(--od-border) bg-(--od-bg-2) px-2 py-0.5 text-(--od-fg-0)">
            {currentNode.label}
          </span>
        ) : (
          <span className="italic text-(--od-fg-2)">_</span>
        )}
      </TableCell>

      <TableCell className="px-3 py-2 text-center">
        {nextNode ? (
          <span className="inline-flex rounded border border-(--od-border) bg-(--od-bg-2) px-2 py-0.5 text-(--od-fg-0)">
            {nextNode.label}
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
            <span className="italic text-(--od-fg-2)">Empty stack</span>
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
                    className="w-max rounded border border-(--od-border-strong) bg-(--od-bg-2) px-1.5 py-0.5 text-xs text-(--od-yellow)"
                  >
                    {node.label}
                  </span>
                ))}
              </div>
              <CopyButton text={arrayToString(circuitNodes.map((node) => node.label))} />
            </>
          ) : (
            <span className="italic text-(--od-fg-2)">Empty circuit</span>
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
