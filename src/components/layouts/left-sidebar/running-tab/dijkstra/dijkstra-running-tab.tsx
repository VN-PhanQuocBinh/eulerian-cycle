import type { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import GraphElement from "@/components/layouts/bottom-panel/graph-element";
import DetailBlock from "../detail-block";

export function DijkstraStepCard({ step }: { step: Step; isActive?: boolean }) {
  const element = step.currentNode ?? step.elements[0];

  return (
    <>
      {element && (
        <div className="mb-2 flex items-center gap-2">
          {element.type === "edge" ? (
            <GraphElement label={element.source.label + " ➔ " + element.target.label} />
          ) : (
            <GraphElement label={element.label} />
          )}
        </div>
      )}
      <div className="space-y-1 text-xs text-(--gl-text-muted)">
        {step.message.map((message, index) => (
          <div key={index} className="bg-(--gl-green-soft)/50 rounded-sm py-1.5 px-3">
            <span>{message}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export function DijkstraDetails({
  step,
  graphUtils,
}: {
  step: Step;
  graphUtils: ReturnType<typeof createGraphUtils>;
}) {
  const currentElement = step.currentNode ?? step.elements[0];

  return (
    <div className="grid grid-cols-2 gap-4">
      {currentElement && (
        <DetailBlock title="Current">
          <div className="flex items-center gap-2">
            {currentElement.type === "edge" ? (
              <GraphElement
                label={`${currentElement.source.label} -> ${currentElement.target.label}`}
              />
            ) : (
              <GraphElement label={currentElement.label} />
            )}
          </div>
        </DetailBlock>
      )}

      <DistanceAndPrevious step={step} graphUtils={graphUtils} />

      <MessageGroup messages={step.message} />
    </div>
  );
}

function DistanceAndPrevious({
  step,
  graphUtils,
}: {
  step: Step;
  graphUtils: ReturnType<typeof createGraphUtils>;
}) {
  return (
    <DetailBlock title="Distance / Previous">
      <div className="max-h-32 overflow-y-auto custom-scrollbar rounded-sm border border-(--gl-border) ">
        <div className="sticky top-0 bg-(--gl-bg-base) flex flex-row border-b border-(--gl-border) text-[11px] font-semibold uppercase tracking-wide text-(--gl-text-muted)">
          <div className="basis-14 border-r border-(--gl-border) px-2 py-1.5">Node</div>
          <div className="border-r flex-1 border-(--gl-border) px-2 py-1.5">Distance</div>
          <div className=" flex-1 px-2 py-1.5">Previous</div>
        </div>
        {Array.from(step.distances?.keys() || []).map((nodeId) => (
          <div
            key={nodeId}
            className="flex flex-row border-b border-(--gl-border)/60 last:border-b-0"
          >
            <div className="basis-14 min-w-0 border-r border-(--gl-border)/60 px-2 py-1.5 wrap-break-word">
              {graphUtils.getNode(nodeId)?.label ?? nodeId}
            </div>
            <div className="min-w-0 flex-1 border-r border-(--gl-border)/60 px-2 py-1.5 wrap-break-word">
              {step.distances?.get(nodeId) ?? "-"}
            </div>
            <div className="min-w-0 flex-1 px-2 py-1.5 wrap-break-word">
              {step.previousNodes?.get(nodeId)
                ? (graphUtils.getNode(step.previousNodes.get(nodeId) || "")?.label ??
                  step.previousNodes.get(nodeId))
                : "-"}
            </div>
          </div>
        ))}
      </div>
    </DetailBlock>
  );
}

function MessageGroup({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;

  return (
    <DetailBlock title="Explain">
      {messages.map((message, index) => (
        <div key={index} className="rounded bg-(--gl-bg-base) px-1.5 py-1">
          {message}
        </div>
      ))}
    </DetailBlock>
  );
}
