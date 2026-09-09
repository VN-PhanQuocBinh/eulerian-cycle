import { COMPONENT_COLORS } from "@/types/styles";
import type { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { NodeDetailBlock } from "./component-detail-blocks";
import DetailBlock from "../detail-block";

export function ConnectedComponentsDetails({
  step,
  graphUtils,
}: {
  step: Step;
  graphUtils: ReturnType<typeof createGraphUtils>;
}) {
  const componentIndex = getComponentIndex(step.elements[0]);
  const componentColor =
    componentIndex >= 0
      ? COMPONENT_COLORS[componentIndex % COMPONENT_COLORS.length].bg
      : undefined;
  const visited = Array.from(step.visited ?? new Set<string>());

  return (
    <>
      {componentIndex >= 0 && (
        <DetailBlock title="Component">
          <span
            className="inline-flex rounded border border-(--gl-border) px-2 py-0.5 font-medium"
            style={{ color: componentColor }}
          >
            Component {componentIndex + 1}
          </span>
        </DetailBlock>
      )}
      <NodeDetailBlock label="Visited Nodes" nodeIds={visited} graphUtils={graphUtils} />
      <NodeDetailBlock label="Queue" nodeIds={step.queue ?? []} graphUtils={graphUtils} />
    </>
  );
}

function getComponentIndex(element: Step["elements"][number] | undefined) {
  const componentClass = element?.classes.find((className) => className.startsWith("component-"));
  if (!componentClass) return -1;

  const componentIndex = Number.parseInt(componentClass.slice("component-".length), 10);
  return Number.isNaN(componentIndex) ? -1 : componentIndex;
}
