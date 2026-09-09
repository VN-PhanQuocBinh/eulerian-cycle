import { COMPONENT_COLORS } from "@/types/styles";
import type { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import GraphElement from "@/components/layouts/bottom-panel/graph-element";
import { NodeDetailBlock } from "./component-detail-blocks";
import DetailBlock from "../detail-block";

export function SccDetails({
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

  return (
    <>
      <NodeDetailBlock label="Stack" nodeIds={step.stack ?? []} graphUtils={graphUtils} />
      {componentIndex >= 0 && (
        <DetailBlock title="SCC">
          <span
            className="inline-flex rounded border border-(--gl-border) px-2 py-0.5 font-medium"
            style={{ color: componentColor }}
          >
            SCC {componentIndex + 1}
          </span>
        </DetailBlock>
      )}
      <DiscLowDetailBlock step={step} graphUtils={graphUtils} />
    </>
  );
}

function DiscLowDetailBlock({
  step,
  graphUtils,
}: {
  step: Step;
  graphUtils: ReturnType<typeof createGraphUtils>;
}) {
  const disc = step.dsc;
  if (!disc || disc.size === 0) return null;

  return (
    <DetailBlock title="Disc / Low-link">
      <div className="max-h-32 overflow-y-auto custom-scrollbar rounded-sm border border-(--gl-border)">
        <div className="sticky top-0 grid grid-cols-3 border-b border-(--gl-border) bg-(--gl-bg-base) text-[11px] font-semibold uppercase tracking-wide text-(--gl-text-muted)">
          <div className="border-r border-(--gl-border) px-2 py-1.5">Node</div>
          <div className="border-r border-(--gl-border) px-2 py-1.5">Disc</div>
          <div className="px-2 py-1.5">Low</div>
        </div>
        {Array.from(disc.entries()).map(([nodeId, discValue]) => {
          const lowValue = step.lowLink?.get(nodeId);
          return (
            <div key={nodeId} className="grid grid-cols-3 border-b border-(--gl-border)/60 last:border-b-0">
              <div className="min-w-0 border-r border-(--gl-border)/60 px-2 py-1.5 wrap-break-word">
                <GraphElement label={graphUtils.getNode(nodeId)?.label ?? nodeId} />
              </div>
              <div className="border-r border-(--gl-border)/60 px-2 py-1.5 font-mono">
                {discValue === -1 ? "-" : discValue}
              </div>
              <div className="px-2 py-1.5 font-mono">
                {lowValue === undefined || lowValue === -1 ? "-" : lowValue}
              </div>
            </div>
          );
        })}
      </div>
    </DetailBlock>
  );
}

function getComponentIndex(element: Step["elements"][number] | undefined) {
  const componentClass = element?.classes.find((className) => className.startsWith("component-"));
  if (!componentClass) return -1;

  const componentIndex = Number.parseInt(componentClass.slice("component-".length), 10);
  return Number.isNaN(componentIndex) ? -1 : componentIndex;
}
