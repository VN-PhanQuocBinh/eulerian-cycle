import { GitBranch } from "lucide-react";
import { useMemo } from "react";
import { useAlgorithmStore, useGraphDataStore } from "@/stores";
import { createGraphUtils } from "@/core/helpers/graph-utils";
import GraphElement from "../bottom-panel/graph-element";
import { PanelHeader } from "./algorithm-state-panel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function DiscLowLinkItem() {
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const steps = useAlgorithmStore((state) => state.steps);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const currentStep = steps[currentStepIndex] ?? steps[steps.length - 1];
  const graphUtils = useMemo(
    () => createGraphUtils({ nodes, edges, isDirected }),
    [edges, isDirected, nodes],
  );
  const disc = currentStep?.dsc;

  return (
    <section className="overflow-hidden">
      <PanelHeader icon={<GitBranch size={14} />} label="Disc / low-link" />
      {!disc || disc.size === 0 ? (
        <div className="rounded-md border border-(--gl-border) bg-(--gl-bg-base) p-4 text-center text-xs italic text-(--gl-text-muted)">
          No discovery data
        </div>
      ) : (
        <div className="max-h-75 overflow-y-auto small-scrollbar rounded-md border border-(--gl-border) bg-(--gl-bg-base)">
          <Table className="border-collapse text-xs">
            <TableHeader>
              <TableRow>
                <TableHead className="z-10 bg-(--gl-bg-base)">Node</TableHead>
                <TableHead className="z-10 bg-(--gl-bg-base) text-center">Disc</TableHead>
                <TableHead className="z-10 bg-(--gl-bg-base) text-center">Low</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from(disc.entries()).map(([nodeId, discValue]) => {
                const lowValue = currentStep?.lowLink?.get(nodeId);
                return (
                  <TableRow key={nodeId} className="hover:bg-(--gl-bg-subtle)">
                    <TableCell>
                      <GraphElement label={graphUtils.getNode(nodeId)?.label ?? nodeId} />
                    </TableCell>
                    <TableCell className="text-center font-mono font-semibold text-(--gl-blue-dark)">
                      {discValue === -1 ? "-" : discValue}
                    </TableCell>
                    <TableCell className="text-center font-mono font-semibold text-(--gl-blue-dark)">
                      {lowValue === undefined || lowValue === -1 ? "-" : lowValue}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}

export default DiscLowLinkItem;
