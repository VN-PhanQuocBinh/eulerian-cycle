import { memo, useMemo } from "react";
import { COMPONENT_COLORS } from "@/types/styles";
import { cn } from "@/utils/cn";
import { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { TableRow, TableCell } from "@/components/ui/table";
import { CopyButton } from "@/components/copy-button";
import JumpButton from "../../jump-button";
import { useSmartScroll } from "@/hooks/use-smart-scroll";

interface Props {
  step: Step;
  index: number;
  isActive: boolean;
  graphUtils: ReturnType<typeof createGraphUtils>;
}

function StepTableRow({ step, index, isActive, graphUtils }: Props) {
  const rowRef = useSmartScroll(isActive);

  let element: (typeof step.elements)[number] | undefined;

  if (step.elements && step.elements.length > 0) {
    element = step.elements[0];
  }

  const componentIndex = useMemo(() => {
    if (element) {
      const componentClass = element.classes.find((cls) => cls.startsWith("component-"));
      if (componentClass) {
        return parseInt(componentClass.split("-")[1]);
      }
    }

    return -1;
  }, [element]);

  const componentColor = useMemo(() => {
    const color =
      componentIndex >= 0
        ? COMPONENT_COLORS[componentIndex % COMPONENT_COLORS.length].bg
        : "transparent";

    return color;
  }, [componentIndex]);

  const stackNodes = useMemo(() => {
    const stack =
      step.stack?.map((nodeId) => ({
        id: nodeId,
        label: graphUtils.getNode(nodeId)?.label || nodeId,
      })) ?? [];

    return stack;
  }, [step.stack, graphUtils]);

  return (
    <TableRow
      key={index}
      ref={rowRef}
      className={cn("group border-b border-(--od-border) hover:bg-(--od-bg-2)", {
        "bg-(--od-bg-2)": isActive,
      })}
    >
      {/* Step Number */}
      <TableCell
        className="border-l-4 text-(--od-fg-1)"
        style={{ borderColor: componentIndex >= 0 ? componentColor : "transparent" }}
      >
        <JumpButton index={index} />
      </TableCell>

      {/* Element */}
      <TableCell className="px-3 py-2 text-center">
        {element?.type === "node" ? (
          <span className="px-2 py-0.5 rounded font-medium text-(--od-fg-0) bg-(--od-bg-2) border border-(--od-border)">
            {element.label}
          </span>
        ) : element?.type === "edge" && step.elements.length > 1 ? (
          <span className="text-(--od-fg-1)">
            {element.source.label} → {element.target.label}
          </span>
        ) : (
          <span className="text-(--od-fg-2) italic">_</span>
        )}
      </TableCell>

      {/* Tarjan Stack */}
      <TableCell className="px-3 py-2">
        <div className="flex items-center max-w-[200px]">
          {stackNodes.length > 0 ? (
            <>
              <div className="flex-1 flex items-center gap-1 flex-wrap">
                {stackNodes.map((node) => (
                  <span
                    key={node.id}
                    className="px-1.5 py-0.5 rounded text-xs text-(--od-purple) bg-(--od-bg-2) border border-(--od-border-strong)"
                  >
                    {node.label}
                  </span>
                ))}
              </div>
              <CopyButton text={`[${stackNodes.map((n) => n.label).join(", ")}]`} />
            </>
          ) : (
            <span className="text-(--od-fg-2) italic">Empty</span>
          )}
        </div>
      </TableCell>

      {/* SCC */}
      <TableCell className="px-3 py-2">
        {componentIndex >= 0 ? (
          <span
            className="px-2 py-0.5 rounded bg-(--od-bg-2) border border-(--od-border) font-medium"
            style={{ color: componentColor }}
          >
            SCC {componentIndex + 1}
          </span>
        ) : (
          <span className="text-(--od-fg-2) italic">—</span>
        )}
      </TableCell>

      {/* Message */}
      <TableCell className="px-3 py-2 text-(--od-fg-1) text-left">
        {step.message?.map((msg, idx) => (
          <div key={idx}>- {msg}</div>
        ))}
      </TableCell>
    </TableRow>
  );
}

export default memo(StepTableRow);
