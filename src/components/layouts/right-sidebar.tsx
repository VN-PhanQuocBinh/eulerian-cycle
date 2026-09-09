import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraphReport } from "@/components/layouts/right-sidebar/graph-report";
import AlgorithmStatePanel from "@/components/layouts/right-sidebar/algorithm-state-panel";
import { PanelRightClose } from "lucide-react";
import { useUIStore } from "@/stores";
import { Button } from "@/components/ui/button";

function RightSidebar() {
  const toggleRightSidebar = useUIStore((state) => state.toggleRightSidebar);

  return (
    <aside className="h-full min-w-0 overflow-hidden rounded-md p-3 bg-(--gl-bg-surface)">
      <Tabs defaultValue="reports" className="flex h-full min-h-0 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <TabsList variant="line" className="w-max shrink-0">
            <TabsTrigger value="reports" className="px-3 rounded-sm text-[12px]">
              Reports
            </TabsTrigger>
            <TabsTrigger value="details" className="px-3 rounded-sm text-[12px]">
              Algorithm state
            </TabsTrigger>
          </TabsList>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleRightSidebar(false)}
            className=" p-1! size-8"
          >
            <PanelRightClose className="size-3" />
          </Button>
        </div>

        <TabsContent value="reports" className="min-h-0 min-w-0 overflow-hidden">
          <GraphReport />
        </TabsContent>

        <TabsContent value="details" className="min-h-0 overflow-hidden">
          <AlgorithmStatePanel />
        </TabsContent>
      </Tabs>
    </aside>
  );
}

export default RightSidebar;
