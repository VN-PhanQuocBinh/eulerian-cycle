import { memo } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { cn } from "@/utils/cn";
import { useSmartScroll } from "@/hooks/use-smart-scroll";
import JumpButton from "../../jump-button";

function DijkstraStepTableRow({
  step,
  index,
  isActive,
  graphUtils,
}: {
  step: Step;
  index: number;
  isActive: boolean;
  graphUtils: ReturnType<typeof createGraphUtils>;
}) {
  const rowRef = useSmartScroll(isActive);
  const element = step.elements[0];
  const currentNode = step.currentNode || (element?.type === "node" ? element : undefined);

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
        {currentNode ? (
          <span className="rounded border border-(--od-border) bg-(--od-bg-2) px-2 py-0.5 font-medium text-(--od-fg-0)">
            {graphUtils.getNode(currentNode.id)?.label || currentNode.label}
          </span>
        ) : element?.type === "edge" ? (
          <span className="text-(--od-fg-1)">
            {element.source.label} &rarr; {element.target.label}
          </span>
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