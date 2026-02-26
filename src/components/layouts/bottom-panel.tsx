import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ResultPanel from "../algorithm-result-panel";
import { PseudoCodeViewer, HIERHOLZER_PSEUDOCODE } from "../algorithm-result-panel/eulerian-pseudo-code";

export function BottomPanel() {
  return (
    <Tabs defaultValue="result" className="h-full tabs-bar p-2">
      <TabsList variant="line" className="">
        <TabsTrigger value="result" className="px-4">
          Result
        </TabsTrigger>
        <TabsTrigger value="pseudo-code" className="px-4">
          Pseudo Code
        </TabsTrigger>
        <TabsTrigger value="reports" className="px-4">
          Reports
        </TabsTrigger>
      </TabsList>

      <TabsContent value="result" className="overflow-hidden">
        <ResultPanel />
      </TabsContent>

      <TabsContent value="pseudo-code" className="overflow-hidden">
        <PseudoCodeViewer lines={HIERHOLZER_PSEUDOCODE} />
      </TabsContent>

      <TabsContent value="reports">
        <div className="p-3 text-xs text-slate-500 italic">Reports content coming soon...</div>
      </TabsContent>
    </Tabs>
  );
}
