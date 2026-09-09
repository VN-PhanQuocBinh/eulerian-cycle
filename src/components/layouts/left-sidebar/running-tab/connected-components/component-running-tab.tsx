import GraphElement from "@/components/layouts/bottom-panel/graph-element";
import type { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import DetailBlock from "../detail-block";
import { ConnectedComponentsDetails } from "./connected-components-details";
import { SccDetails } from "./scc-details";

export function ComponentStepCard({ step }: { step: Step }) {
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

export function ComponentDetails({
  step,
  graphUtils,
}: {
  step: Step;
  graphUtils: ReturnType<typeof createGraphUtils>;
}) {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const isScc = currentAlgorithm === "connected-components" && isDirected;
  const Fields = isScc ? SccDetails : ConnectedComponentsDetails;
  const element = step.elements[0];

  return (
    <div className="grid grid-cols-2 gap-4">
      {element && (
        <DetailBlock title="Current">
          <div className="flex items-center gap-2">
            {element.type === "edge" ? (
              <GraphElement label={`${element.source.label} -> ${element.target.label}`} />
            ) : (
              <GraphElement label={element.label} />
            )}
          </div>
        </DetailBlock>
      )}
      <Fields step={step} graphUtils={graphUtils} />
      <MessageGroup messages={step.message ?? []} />
    </div>
  );
}

export function MessageGroup({ messages }: { messages: string[] }) {
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
