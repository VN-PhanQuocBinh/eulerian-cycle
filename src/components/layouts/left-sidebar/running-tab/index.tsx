import { useMemo, useState } from "react";
import { useAlgorithmStore, useGraphDataStore, useUIStore } from "@/stores";
import { cn } from "@/utils/cn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PseudoCodeViewer } from "@/components/layouts/bottom-panel/pseudo-code-viewer";
import { VerticalStepper } from "./vertical-stepper";
import { GraphAlgorithm, Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";

import { DijkstraDetails, DijkstraStepCard } from "./dijkstra/dijkstra-running-tab";
import { TraversalDetails, TraversalStepCard } from "./dfs-bfs/dfs-bfs-running-tab";
import { ComponentDetails, ComponentStepCard } from "./connected-components/component-running-tab";
import {
  EulerianCycleDetails,
  EulerianCycleStepCard,
} from "./eulerian-cycle/eulerian-cycle-running-tab";
import { Tooltip } from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";

import { ScanEye, EyeClosed } from "lucide-react";

const algorithmToRunningTabComponent: Record<
  GraphAlgorithm,
  {
    card: React.ComponentType<{ step: Step; isActive?: boolean }>;
    details: React.ComponentType<{ step: Step; graphUtils: ReturnType<typeof createGraphUtils> }>;
  }
> = {
  dijkstra: {
    card: DijkstraStepCard,
    details: DijkstraDetails,
  },
  dfs: {
    card: TraversalStepCard,
    details: TraversalDetails,
  },
  bfs: {
    card: TraversalStepCard,
    details: TraversalDetails,
  },
  "eulerian-cycle": {
    card: EulerianCycleStepCard,
    details: EulerianCycleDetails,
  },
  "connected-components": {
    card: ComponentStepCard,
    details: ComponentDetails,
  },
};

function RunningTab({ className }: { className?: string }) {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const enableSmartScroll = useUIStore((state) => state.enableSmartScroll);
  const toggleSmartScroll = useUIStore((state) => state.toggleSmartScroll);

  const steps = useAlgorithmStore((state) => state.steps);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const graphUtils = useMemo(
    () => createGraphUtils({ nodes, edges, isDirected }),
    [nodes, edges, isDirected],
  );

  const [currentTab, setCurrentTab] = useState<"steps" | "pseudo-code">("steps");

  const CurrentCardComponent = algorithmToRunningTabComponent[currentAlgorithm].card;
  const CurrentDetailsComponent = algorithmToRunningTabComponent[currentAlgorithm].details;

  const handleTabChange = (value: string) => {
    if (value === "steps" || value === "pseudo-code") {
      setCurrentTab(value);
    }
  };

  return (
    <aside className={cn("h-full overflow-hidden rounded-md bg-(--gl-bg-surface) p-3", className)}>
      <Tabs
        onValueChange={handleTabChange}
        defaultValue="steps"
        className="flex h-full min-h-0 min-w-0 flex-col gap-2"
      >
        <div className="flex items-center justify-between gap-2">
          <TabsList variant="line" className="w-max shrink-0">
            <TabsTrigger value="steps" className="px-3 rounded-sm text-[12px]">
              Steps
            </TabsTrigger>
            <TabsTrigger value="pseudo-code" className="px-3 rounded-sm text-[12px]">
              Pseudo Code
            </TabsTrigger>
          </TabsList>

          {currentTab === "steps" && (
            <Tooltip content={enableSmartScroll ? "Disable Smart Scroll" : "Enable Smart Scroll"}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSmartScroll}
                className="text-[12px] p-1! size-8"
              >
                {enableSmartScroll ? <EyeClosed size={14} /> : <ScanEye size={14} />}
              </Button>
            </Tooltip>
          )}
        </div>

        <TabsContent value="steps" className="min-h-0 min-w-0 overflow-hidden">
          {steps.length > 0 ? (
            <VerticalStepper
              items={steps}
              activeIndex={currentStepIndex}
              graphUtils={graphUtils}
              details={CurrentDetailsComponent}
              card={CurrentCardComponent}
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-(--gl-text-muted)">
              Run an algorithm to view its steps.
            </div>
          )}
        </TabsContent>

        <TabsContent value="pseudo-code" className="flex flex-col overflow-hidden">
          <PseudoCodeViewer className="flex-1 w-full min-w-0" />
        </TabsContent>
      </Tabs>
    </aside>
  );
}

export default RunningTab;
