import { useMemo, memo } from "react";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { TableRow, TableCell } from "@/components/ui/table";
import { CopyButton } from "@/components/copy-button";
import JumpButton from "../../jump-button";
import { Step } from "@/types/algorithm-store";
import { StepNodeElement } from "@/types/algorithm-store";
import { cn } from "@/utils/cn";
import { arrayToString } from "@/utils";

interface Props {
  step: Step;
  index: number;
  isActive: boolean;
  graphUtils: ReturnType<typeof createGraphUtils>;
}

function StepTableRow({ step, index, isActive, graphUtils }: Props) {
  const elements = step.elements;
  console.log("Rendering StepTableRow", { step, index, isActive });

  const currentNode: StepNodeElement | undefined = useMemo(() => {
    return elements.filter((el) => el.type === "node")[0];
  }, [elements]);

  const nextNode: StepNodeElement | undefined = useMemo(() => {
    return elements.filter((el) => el.type === "edge")[0]?.target;
  }, [elements]);

  const stackNodes = useMemo(() => {
    const stack = step.stack?.map((nodeId) => ({
      id: nodeId,
      label: graphUtils.getNode(nodeId)?.label || nodeId,
    }));

    return stack;
  }, [step.stack, graphUtils]);

  const circuitNodes = useMemo(() => {
    return step.circuit?.map((nodeId) => ({
      id: nodeId,
      label: graphUtils.getNode(nodeId)?.label || nodeId,
    }));
  }, [step.circuit, graphUtils]);

  return (
    <TableRow
      key={index}
      className={cn("", {
        "bg-blue-50! border-l-4 border-l-blue-500": isActive,
      })}
    >
      {/* Step Number */}
      <TableCell>
        <JumpButton index={index} />
      </TableCell>

      {/* Element */}
      <TableCell className="px-3 py-2 text-center">
        {currentNode ? (
          <span className="size-5 text-gray-700 bg-slate-100 px-2 py-0.5 rounded">
            {currentNode.label}
          </span>
        ) : (
          <span className="text-gray-400 italic">_</span>
        )}
      </TableCell>

      {/* Element */}
      <TableCell className="px-3 py-2 text-center">
        {nextNode ? (
          <span className="size-5 text-gray-700 bg-slate-100 px-2 py-0.5 rounded">
            {nextNode.label}
          </span>
        ) : (
          <span className="text-gray-400 italic">_</span>
        )}
      </TableCell>

      {/* Stack */}
      <TableCell className="px-3 py-2">
        <div className="flex items-center max-w-[150px]">
          {stackNodes && stackNodes.length > 0 ? (
            <>
              <div className="flex-1 flex items-center gap-2 flex-wrap">
                {stackNodes.map((node, idx) => (
                  <span
                    key={idx}
                    className="size-5 w-max text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded text-xs"
                  >
                    {node.label}
                  </span>
                ))}
              </div>
              <CopyButton text={arrayToString(stackNodes.map((node) => node.label))} />
            </>
          ) : (
            <span className="text-gray-400 italic">Empty stack</span>
          )}
        </div>
      </TableCell>

      {/* Circuit */}
      <TableCell className="px-3 py-2">
        <div className="flex items-center max-w-[200px]">
          {circuitNodes && circuitNodes.length > 0 ? (
            <>
              <div className="flex-1 flex items-center gap-2 flex-wrap">
                {circuitNodes.map((node, idx) => (
                  <span
                    key={idx}
                    className="size-5 w-max text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded text-xs"
                  >
                    {node.label}
                  </span>
                ))}
              </div>
              <CopyButton text={arrayToString(circuitNodes.map((node) => node.label))} />
            </>
          ) : (
            <span className="text-gray-400 italic">Empty circuit</span>
          )}
        </div>
      </TableCell>

      {/* Message */}
      <TableCell className="px-3 py-2 text-gray-600 text-left">
        {step.message.map((msg, idx) => (
          <div key={idx}>- {msg}</div>
        ))}
      </TableCell>
    </TableRow>
  );
}

export default memo(StepTableRow);
