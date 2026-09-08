import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraphReport } from "@/components/layouts/bottom-panel/graph-report";

function RightSidebar() {
  return (
    <aside className="h-full min-w-0 overflow-hidden rounded-md p-3 bg-(--gl-bg-surface)">
      <Tabs defaultValue="reports" className="flex h-full min-h-0 flex-col gap-2">
        <TabsList variant="line" className="w-max shrink-0">
          <TabsTrigger value="reports" className="px-3 rounded-sm">
            Reports
          </TabsTrigger>
          <TabsTrigger value="details" className="px-3 rounded-sm">
            Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="min-h-0 min-w-0 overflow-hidden">
          <GraphReport />
        </TabsContent>

        <TabsContent value="details" className="min-h-0 overflow-hidden">
          <div className="grid h-full place-items-center p-6 text-center text-sm text-(--gl-text-muted)">
            Select an item to view its details.
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}

export default RightSidebar;
