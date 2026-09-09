import { useMemo } from "react";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import type { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import GraphElement from "@/components/layouts/bottom-panel/graph-element";
import { VerticalStepper } from "../vertical-stepper";

function DijkstraRunningTab() {
  const steps = useAlgorithmStore((state) => state.steps);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const graphUtils = useMemo(
    () => createGraphUtils({ nodes, edges, isDirected }),
    [nodes, edges, isDirected],
  );

  if (steps.length === 0) {
    return (
      <div className="grid h-full place-items-center text-center text-sm text-(--gl-text-muted)">
        Run Dijkstra to see its steps.
      </div>
    );
  }

  return (
    <VerticalStepper
      items={steps}
      activeIndex={currentStepIndex}
      details={(step) => <DijkstraDetails step={step} graphUtils={graphUtils} />}
    >
      {(step) => <DijkstraStepCard step={step} />}
    </VerticalStepper>
  );
}

function DijkstraStepCard({ step, isActive = false }: { step: Step; isActive?: boolean }) {
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
      <div className="space-y-0.5 text-xs text-(--gl-text-muted)">
        {step.message.map((message, index) => (
          <div key={index}>- {message}</div>
        ))}
      </div>
    </>
  );
}

function DijkstraDetails({
  step,
  graphUtils,
}: {
  step: Step;
  graphUtils: ReturnType<typeof createGraphUtils>;
}) {
  const formatMap = (values: Map<string, number> | undefined) =>
    Array.from(values?.entries() ?? []).map(([nodeId, value]) => {
      const label = graphUtils.getNode(nodeId)?.label ?? nodeId;
      return `${label}: ${value === Infinity ? "Infinity" : (value ?? "-")}`;
    });

  const distances = formatMap(step.distances);
  const previousNodes = Array.from(step.previousNodes?.entries() ?? []).map(
    ([nodeId, previous]) => {
      const label = graphUtils.getNode(nodeId)?.label ?? nodeId;
      const previousLabel = previous ? (graphUtils.getNode(previous)?.label ?? previous) : "-";
      return `${label}: ${previousLabel}`;
    },
  );

  return (
    <div className="space-y-3">
      <DetailGroup label="Distance" values={distances} />
      <DetailGroup label="Previous" values={previousNodes} />
      {step.queue && <DetailGroup label="Queue" values={step.queue} />}
      {step.stack && <DetailGroup label="Stack" values={step.stack} />}
    </div>
  );
}

function DetailGroup({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;

  return (
    <div>
      <div className="mb-1 font-semibold uppercase tracking-wide text-(--gl-text-muted)">
        {label}
      </div>
      <div className="space-y-0.5 font-mono">
        {values.map((value, index) => (
          <div key={index}>{value}</div>
        ))}
      </div>
    </div>
  );
}

export default DijkstraRunningTab;
