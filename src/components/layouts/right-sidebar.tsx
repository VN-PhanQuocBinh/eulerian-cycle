import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraphReport } from "@/components/layouts/right-sidebar/graph-report";
import AlgorithmStatePanel from "@/components/layouts/right-sidebar/algorithm-state-panel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Ellipsis } from "lucide-react";
import { useUIStore } from "@/stores";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

function RightSidebar() {
  const [currentTab, setCurrentTab] = useState<"reports" | "details">("reports");

  const showStack = useUIStore((state) => state.showStack);
  const showQueue = useUIStore((state) => state.showQueue);
  const toggleShowStack = useUIStore((state) => state.toggleShowStack);
  const toggleShowQueue = useUIStore((state) => state.toggleShowQueue);

  const handleTabChange = (value: string) => {
    setCurrentTab(value as "reports" | "details");
  };

  return (
    <aside className="h-full min-w-0 overflow-hidden rounded-md p-3 bg-(--gl-bg-surface)">
      <Tabs
        onValueChange={handleTabChange}
        defaultValue="reports"
        className="flex h-full min-h-0 flex-col gap-2"
      >
        <div className="flex items-center justify-between gap-2">
          <TabsList variant="line" className="w-max shrink-0">
            <TabsTrigger value="reports" className="px-3 rounded-sm">
              Reports
            </TabsTrigger>
            <TabsTrigger value="details" className="px-3 rounded-sm">
              Algorithm state
            </TabsTrigger>
          </TabsList>

          {currentTab === "details" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-sm">
                  <Ellipsis size={16} />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-72 border-(--gl-border) bg-(--gl-bg-surface)"
                side="top"
                sideOffset={10}
              >
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="toggle-show-stack"
                    className="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 hover:bg-(--gl-bg-subtle)"
                  >
                    <span className="text-sm text-(--gl-text-main)">Show Stack</span>
                    <Checkbox
                      id="toggle-show-stack"
                      checked={showStack}
                      onCheckedChange={(checked) => toggleShowStack(checked === true)}
                    />
                  </label>

                  <label
                    htmlFor="toggle-show-queue"
                    className="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 hover:bg-(--gl-bg-subtle)"
                  >
                    <span className="text-sm text-(--gl-text-main)">Show Queue</span>
                    <Checkbox
                      id="toggle-show-queue"
                      checked={showQueue}
                      onCheckedChange={(checked) => toggleShowQueue(checked === true)}
                    />
                  </label>
                </div>
              </PopoverContent>
            </Popover>
          )}
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
