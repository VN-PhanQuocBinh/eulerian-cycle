import { useMemo } from "react";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { SCCStepsTable } from "./scc-steps-table";
import { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import GraphElement from "../../graph-element";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SCCResult({ steps }: { steps: Step[] }) {
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const currentStep = steps[currentStepIndex] ?? steps[steps.length - 1];

  if (steps.length === 0) {
    return (
      <div className="grid h-full place-items-center text-sm text-(--gl-text-muted)">
        No steps to display. Run the algorithm first.
      </div>
    );
  }

  return (
    <div className="flex h-full gap-2 text-(--gl-text-main)">
      <div className="min-w-0 flex-1 max-h-full overflow-y-auto rounded-md bg-(--gl-bg-surface) custom-scrollbar">
        <SCCStepsTable steps={steps} />
      </div>

      <div className="top-0 w-56 basis-[220px] overflow-y-auto rounded-md border border-(--gl-border) bg-(--gl-bg-surface) p-3 custom-scrollbar">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-(--gl-text-muted)">
          disc / low-link
        </div>
        <DiscLowLinkTable disc={currentStep?.dsc} lowLink={currentStep?.lowLink} />
      </div>
    </div>
  );
}

function DiscLowLinkTable({
  disc,
  lowLink,
}: {
  disc?: Map<string, number>;
  lowLink?: Map<string, number>;
}) {
  const edges = useGraphDataStore((state) => state.edges);
  const nodes = useGraphDataStore((state) => state.nodes);
  const isDirected = useGraphDataStore((state) => state.isDirected);

  const graphUtils = useMemo(() => {
    return createGraphUtils({
      nodes,
      edges,
      isDirected,
    });
  }, [nodes, edges, isDirected]);

  if (!disc || disc.size === 0) {
    return <span className="text-xs italic text-(--gl-text-muted)">—</span>;
  }

  return (
    <div className="rounded-md border border-(--gl-border) bg-(--gl-bg-base)">
      <Table className="space-y-1 border-collapse">
        <TableHeader>
          <TableRow className="pb-1 text-xs font-medium text-(--gl-text-muted)">
            <TableHead className="border-r border-(--gl-border) font-semibold">
              Node
            </TableHead>
            <TableHead className="border-r border-(--gl-border) text-center font-semibold">
              Disc
            </TableHead>
            <TableHead className="text-center font-semibold">Low</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(disc.entries()).map(([nodeId, discValue]) => {
            const lowValue = lowLink?.get(nodeId);

            return (
              <TableRow
                key={nodeId}
                className="rounded px-1 py-1 text-base transition-colors hover:bg-(--gl-bg-subtle)"
              >
                <TableCell className="border-r border-(--gl-border)">
                  <GraphElement
                    label={graphUtils.getNode(nodeId)?.label || nodeId}
                    className="m-auto"
                  />
                </TableCell>
                <TableCell className="border-r border-(--gl-border) text-center font-mono font-semibold text-(--gl-blue-dark)">
                  {discValue === -1 ? "-" : discValue}
                </TableCell>
                <TableCell className="text-center font-mono font-semibold text-(--gl-blue-dark)">
                  {lowValue === -1 || lowValue === undefined ? "-" : lowValue}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
