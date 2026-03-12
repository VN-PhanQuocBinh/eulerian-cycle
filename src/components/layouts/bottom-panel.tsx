import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ResultPanel from "./bottom-panel/result-panel";
import { PseudoCodeViewer } from "./bottom-panel/pseudo-code-viewer";
import { GraphReport } from "./bottom-panel/graph-report";
import { useGraphStore } from "@/contexts/graph-context";

export function BottomPanel() {
  const steps = useGraphStore((state) => state.steps);
  const currentStepIndex = useGraphStore((state) => state.currentStepIndex);

  return (
    <Tabs defaultValue="steps" className="h-full tabs-bar p-2">
      <div className="flex items-center border-b mb-2">
        <TabsList variant="line" className="">
          <TabsTrigger value="steps" className="px-4">
            Algorithim Steps
          </TabsTrigger>
          <TabsTrigger value="pseudo-code" className="px-4">
            Pseudo Code
          </TabsTrigger>
          <TabsTrigger value="reports" className="px-4">
            Reports
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 text-right text-sm text-gray-500 pr-6">
          Step {steps.length > 0 ? currentStepIndex + 1 : 0} of {steps.length}
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
