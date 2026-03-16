import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ResultPanel from "./bottom-panel/result-panel";
import { PseudoCodeViewer } from "./bottom-panel/pseudo-code-viewer";
import { GraphReport } from "./bottom-panel/graph-report";
import { useAlgorithmStore, useUIStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { ScanEye, EyeClosed, ChevronUp, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useRef, useState, useEffect, useCallback } from "react";

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
  const isBottomPanelOpen = useUIStore((state) => state.isBottomPanelOpen);
  const toggleSmartScroll = useUIStore((state) => state.toggleSmartScroll);
  const setBottomPanelTab = useUIStore((state) => state.setBottomPanelTab);
  const toggleBottomPanel = useUIStore((state) => state.toggleBottomPanel);

  const tabsRootRef = useRef<HTMLDivElement | null>(null);
  const [triggerRect, setTriggerRect] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);

  const updateTriggerRect = useCallback(() => {
    const el = tabsRootRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    setTriggerRect({
      left: rect.left,
      top: Math.max(0, rect.top - 60), // h-10 = 40px, nằm ngay trên Tabs
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    if (isBottomPanelOpen) {
      setTriggerRect(null);
      return;
    }

    updateTriggerRect();

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateTriggerRect) : null;

    if (observer && tabsRootRef.current) {
      observer.observe(tabsRootRef.current);
    }

    window.addEventListener("resize", updateTriggerRect);
    window.addEventListener("scroll", updateTriggerRect, true);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateTriggerRect);
      window.removeEventListener("scroll", updateTriggerRect, true);
    };
  }, [isBottomPanelOpen, updateTriggerRect]);

  return (
    <Tabs
      ref={tabsRootRef}
      defaultValue="steps"
      className="h-full tabs-bar px-2 relative"
      onValueChange={(tab) => setBottomPanelTab(tab as BottomPanelTab)}
    >
      {/* Mouse Trigger */}
      {!isBottomPanelOpen &&
        triggerRect &&
        createPortal(
          <div
            className="fixed z-10 h-10 group flex justify-center"
            style={{
              left: triggerRect.left,
              top: triggerRect.top,
              width: triggerRect.width,
            }}
          >
            <button
              className="pointer-events-auto opacity-0 translate-y-4 group-hover:opacity-100 grid group-hover:translate-y-0 transition-all place-items-center h-full w-20 bg-gray-200 rounded-none! rounded-tl-xl! rounded-tr-xl! "
              onClick={() => toggleBottomPanel(true)}
            >
              <ChevronUp size={24} />
            </button>
          </div>,
          document.body,
        )}

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
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSmartScroll}
                className="hover:bg-black/5"
              >
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
          <div className="border-l border-gray-300 h-6 mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleBottomPanel(false)}
            className="hover:bg-black/5 p-1! size-8"
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
