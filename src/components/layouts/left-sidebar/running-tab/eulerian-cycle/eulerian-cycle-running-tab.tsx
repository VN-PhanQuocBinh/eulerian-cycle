import GraphElement from "@/components/layouts/bottom-panel/graph-element";
import type { Step, StepNodeElement } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import DetailBlock from "../detail-block";
import { NodeListSlider } from "../node-list-slider";

export function EulerianCycleStepCard({ step }: { step: Step }) {
  const element = step.elements[0];

  return (
    <>
      {element && (
        <div className="mb-2 flex items-center gap-2">
          {element.type === "edge" ? (
            <GraphElement label={`${element.source.label} -> ${element.target.label}`} />
          ) : (
            <GraphElement label={element.label} />
          )}
        </div>
      )}
      <div className="space-y-0.5 text-xs text-(--gl-text-muted)">
        {step.message.map((message, index) => (
          <div key={index} className="bg-(--gl-bg-base)/50 rounded-sm py-1.5 px-3">
            <span>{message}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export function EulerianCycleDetails({
  step,
  graphUtils,
}: {
  step: Step;
  graphUtils: ReturnType<typeof createGraphUtils>;
}) {
  const elements = step.elements;
  const currentNode =
    elements.length === 1 && elements[0].type === "node" ? elements[0] : undefined;
  const nextNode = elements.find((element) => element.type === "edge")?.target;

  return (
    <div className="grid grid-cols-2 gap-4">
      <NodeElementBlock title="Current" node={currentNode} />
      <NodeElementBlock title="Next" node={nextNode} />
      <NodeListBlock label="Stack" nodeIds={step.stack ?? []} graphUtils={graphUtils} />
      <NodeListBlock label="Circuit" nodeIds={step.circuit ?? []} graphUtils={graphUtils} circuit />
      <MessageGroup messages={step.message} />
    </div>
  );
}

function NodeElementBlock({ title, node }: { title: string; node?: StepNodeElement }) {
  return (
    <DetailBlock title={title}>
      {node ? (
        <GraphElement label={node.label} />
      ) : (
        <span className="text-xs italic text-(--gl-text-muted)">Empty</span>
      )}
    </DetailBlock>
  );
}

function NodeListBlock({
  label,
  nodeIds,
  graphUtils,
  circuit = false,
}: {
  label: string;
  nodeIds: string[];
  graphUtils: ReturnType<typeof createGraphUtils>;
  circuit?: boolean;
}) {
  return (
    <DetailBlock title={label}>
      {nodeIds.length > 0 ? (
        <NodeListSlider
          nodeIds={nodeIds}
          graphUtils={graphUtils}
          initialPosition={label === "Stack" ? "end" : "start"}
          itemClassName={circuit ? "text-(--gl-amber-dark) bg-(--gl-amber-soft)" : undefined}
        />
      ) : (
        <span className="text-xs italic text-(--gl-text-muted)">Empty {label.toLowerCase()}</span>
      )}
    </DetailBlock>
  );
}

function MessageGroup({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;

  return (
    <DetailBlock title="Explain">
      {messages.map((message, index) => (
        <div key={index} className="rounded bg-(--gl-bg-base) px-1.5 py-1 text-xs">
          {message}
        </div>
      ))}
    </DetailBlock>
  );
}
