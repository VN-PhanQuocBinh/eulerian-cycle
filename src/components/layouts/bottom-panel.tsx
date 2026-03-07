import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ResultPanel from "./bottom-panel/result-panel";
import { PseudoCodeViewer } from "./bottom-panel/pseudo-code-viewer";
import { GraphReport } from "./bottom-panel/graph-report";

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
        <PseudoCodeViewer />
      </TabsContent>

      <TabsContent value="reports" className="overflow-hidden">
        <GraphReport />
      </TabsContent>
    </Tabs>
  );
}
