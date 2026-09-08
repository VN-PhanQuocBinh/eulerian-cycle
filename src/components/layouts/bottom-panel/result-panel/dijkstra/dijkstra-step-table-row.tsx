import { memo } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { cn } from "@/utils/cn";
import { useSmartScroll } from "@/hooks/use-smart-scroll";
import JumpButton from "../../jump-button";
import GraphElement from "../../graph-element";

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
      className={cn(
        "group border-b border-(--gl-border) bg-(--gl-bg-surface) hover:bg-(--gl-bg-base)",
        {
          "bg-(--gl-bg-subtle)": isActive,
        },
      )}
    >
      <TableCell className=" text-(--gl-text-main)">
        <JumpButton index={index} />
      </TableCell>
      <TableCell className="px-3 py-2 text-center">
        {step.currentNode ? (
          <GraphElement label={step.currentNode.label} />
        ) : element?.type === "edge" ? (
          <div className="flex items-center justify-center gap-1">
            <GraphElement label={element.source.label} />
            <span className="text-(--gl-text-muted)">→</span>
            <GraphElement label={element.target.label} />
          </div>
        ) : (
          <span className="text-(--gl-text-muted) italic">-</span>
        )}
      </TableCell>
      <TableCell className="px-3 py-2 text-left text-(--gl-text-main)">
        {step.message.map((message, messageIndex) => (
          <div key={messageIndex}>- {message}</div>
        ))}
      </TableCell>
    </TableRow>
  );
}

export default memo(DijkstraStepTableRow);
