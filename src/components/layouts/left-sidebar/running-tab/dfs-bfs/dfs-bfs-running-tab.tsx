import GraphElement from "@/components/layouts/bottom-panel/graph-element";
import type { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import DetailBlock from "../detail-block";
import { NodeListSlider } from "../node-list-slider";

export function TraversalStepCard({ step }: { step: Step }) {
  const element = step.currentNode ?? step.elements[0];
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

export function TraversalDetails({
  step,
  graphUtils,
}: {
  step: Step;
  graphUtils: ReturnType<typeof createGraphUtils>;
}) {
  const element = step.currentNode ?? step.elements[0];
  const visited = step.visited instanceof Set ? Array.from(step.visited) : (step.visited ?? []);

  return (
    <div className="grid grid-cols-2 gap-4">
      {element && (
        <DetailBlock title="Current">
          <div className="flex items-center gap-2">
            <GraphElement
              label={
                element.type === "edge"
                  ? `${element.source.label} -> ${element.target.label}`
                  : element.label
              }
            />
          </div>
        </DetailBlock>
      )}
      <NodeDetailBlock label="Stack" nodeIds={step.stack ?? []} graphUtils={graphUtils} />
      <NodeDetailBlock label="Queue" nodeIds={step.queue ?? []} graphUtils={graphUtils} />
      <NodeDetailBlock label="Visited" nodeIds={visited} graphUtils={graphUtils} />
      <MessageGroup messages={step.message} />
    </div>
  );
}

function NodeDetailBlock({
  label,
  nodeIds,
  graphUtils,
}: {
  label: string;
  nodeIds: string[];
  graphUtils: ReturnType<typeof createGraphUtils>;
}) {
  return (
    <DetailBlock title={label}>
      {nodeIds.length > 0 ? (
        <NodeListSlider
          nodeIds={nodeIds}
          graphUtils={graphUtils}
          initialPosition={label === "Stack" ? "end" : "start"}
        />
      ) : (
        <span className="text-xs italic text-(--gl-text-muted)">Empty</span>
      )}
    </DetailBlock>
  );
}

function MessageGroup({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;

  return (
    <DetailBlock title="Explain">
      <div className="space-y-1 text-xs text-(--gl-text-main)">
        {messages.map((message, index) => (
          <div key={index} className="rounded bg-(--gl-bg-base) px-1.5 py-1">
            {message}
          </div>
        ))}
      </div>
    </DetailBlock>
  );
}
