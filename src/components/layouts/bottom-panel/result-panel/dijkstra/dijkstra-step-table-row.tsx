import { memo } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { cn } from "@/utils/cn";
import { useSmartScroll } from "@/hooks/use-smart-scroll";
import JumpButton from "../../jump-button";
import NodeElement from "../../node-element";

function DijkstraStepTableRow({
  step,
  index,
  isActive,
}: {
  step: Step;
  index: number;
  isActive: boolean;
  graphUtils: ReturnType<typeof createGraphUtils>;
}) {
  const rowRef = useSmartScroll(isActive);
  const element = step.elements[0];

  return (
    <TableRow
      ref={rowRef}
      className={cn("group border-b border-(--od-border) hover:bg-(--od-bg-2)", {
        "bg-(--od-bg-2)": isActive,
      })}
    >
      <TableCell className="border-l-4 text-(--od-fg-1)">
        <JumpButton index={index} />
      </TableCell>
      <TableCell className="px-3 py-2 text-center">
        {step.currentNode ? (
          <NodeElement label={step.currentNode.label} />
        ) : element?.type === "edge" ? (
          <div className="flex items-center justify-center gap-1">
            <NodeElement label={element.source.label} />
            <span className="text-(--od-fg-2)">→</span>
            <NodeElement label={element.target.label} />
          </div>
        ) : (
          <span className="text-(--od-fg-2) italic">-</span>
        )}
      </TableCell>
      <TableCell className="px-3 py-2 text-left text-(--od-fg-1)">
        {step.message.map((message, messageIndex) => (
          <div key={messageIndex}>- {message}</div>
        ))}
      </TableCell>
    </TableRow>
  );
}

export default memo(DijkstraStepTableRow);
