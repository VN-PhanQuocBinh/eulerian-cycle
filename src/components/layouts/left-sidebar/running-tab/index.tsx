import { useAlgorithmStore } from "@/stores";
import DijkstraRunningTab from "./dijkstra/dijkstra-running-tab";
import { cn } from "@/utils/cn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PseudoCodeViewer } from "@/components/layouts/bottom-panel/pseudo-code-viewer";

function RunningTab({ className }: { className?: string }) {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);

  return (
    <aside className={cn("h-full overflow-hidden rounded-md bg-(--gl-bg-surface) p-3", className)}>
      <Tabs defaultValue="steps" className="flex h-full min-h-0 min-w-0 flex-col gap-2">
        <TabsList variant="line" className="w-max shrink-0">
          <TabsTrigger value="steps" className="px-3 rounded-sm">
            Steps
          </TabsTrigger>
          <TabsTrigger value="pseudo-code" className="px-3 rounded-sm">
            Pseudo Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="min-h-0 min-w-0 overflow-hidden">
          {/* <h3 className="text-lg font-semibold mb-4">Algorithm Steps</h3> */}
          {currentAlgorithm === "dijkstra" ? (
            <DijkstraRunningTab />
          ) : (
            <div className="grid h-full place-items-center text-center text-sm text-(--gl-text-muted)">
              Run the selected algorithm to see its steps.
            </div>
          )}
        </TabsContent>

        <TabsContent value="pseudo-code" className="flex flex-col overflow-hidden">
          {/* <h3 className="text-lg font-semibold mb-4">Pseudo Code</h3> */}
          <PseudoCodeViewer className="flex-1 w-full min-w-0" />
        </TabsContent>
      </Tabs>
    </aside>
  );
}

export default RunningTab;
