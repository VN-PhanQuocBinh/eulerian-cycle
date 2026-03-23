import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ResultPanel from "./bottom-panel/result-panel";
import { PseudoCodeViewer } from "./bottom-panel/pseudo-code-viewer";
import { GraphReport } from "./bottom-panel/graph-report";
import { useAlgorithmStore, useUIStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { ScanEye, EyeClosed, X } from "lucide-react";
// import { createPortal } from "react-dom";
import { useRef, useEffect, useCallback } from "react";

export type BottomPanelTab = "steps" | "pseudo-code" | "reports";

const tabs: Array<{ label: string; value: BottomPanelTab }> = [
  { label: "Algorithm Steps", value: "steps" },
  { label: "Pseudo Code", value: "pseudo-code" },
  { label: "Reports", value: "reports" },
];

export function BottomPanel() {
  const steps = useAlgorithmStore((state) => state.steps);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);

  const enableSmartScroll = useUIStore((state) => state.enableSmartScroll);
  const bottomPanelTab = useUIStore((state) => state.bottomPanelTab);
  const toggleSmartScroll = useUIStore((state) => state.toggleSmartScroll);
  const setBottomPanelTab = useUIStore((state) => state.setBottomPanelTab);
  const toggleBottomPanel = useUIStore((state) => state.toggleBottomPanel);

  const tabsRootRef = useRef<HTMLDivElement | null>(null);

  return (
    <Tabs
      ref={tabsRootRef}
      defaultValue="steps"
      className="h-full tabs-bar px-2 relative bg-(--od-bg-1) border-t border-border"
      onValueChange={(tab) => setBottomPanelTab(tab as BottomPanelTab)}
    >
      <div className="flex items-center mb-2 py-2">
        <TabsList variant="line" className="">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex-1 flex justify-end items-center gap-2 text-right text-sm ">
          {bottomPanelTab === "steps" && (
            <>
              <Button variant="outline" size="sm" onClick={toggleSmartScroll}>
                {enableSmartScroll ? (
                  <EyeClosed className="size-4" />
                ) : (
                  <ScanEye className="size-4" />
                )}
                {enableSmartScroll ? "Disable" : "Enable"} Smart Scroll
              </Button>
              <span className="text-gray-500">
                Step {steps.length > 0 ? currentStepIndex + 1 : 0} / {steps.length}
              </span>
            </>
          )}

          {/* Separator */}
          <div className="border-l border-border h-6 mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleBottomPanel(false)}
            className=" p-1! size-8"
          >
            <X className="size-3" />
          </Button>
        </div>
      </div>

      <TabsContent value="steps" className="overflow-hidden">
        <ResultPanel />
      </TabsContent>

      <TabsContent value="pseudo-code" className="overflow-hidden">
        <PseudoCodeViewer />
      </TabsContent>

      <TabsContent value="reports" className="overflow-hidden">
        <GraphReport />
      </TabsContent>
    </Tabs>
  );
}
