import GraphCanvas from "./components/graph-canvas";
import { NewSidebar } from "./components/layouts/new-sidebar";
import { BottomPanel } from "./components/layouts/bottom-panel";
import { NodeInputProvider } from "./components/ui/node-input";
import { ToastProvider } from "./components/ui/toast";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import type { PanelImperativeHandle } from "react-resizable-panels";
import { useEffect, useRef } from "react";
import { useAlgorithmSync } from "./hooks/use-algorithm-sync";
import { useUIStore } from "./stores";

function App() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const isBottomPanelOpen = useUIStore((state) => state.isBottomPanelOpen);
  const sidebarPanelRef = useRef<PanelImperativeHandle>(null);
  const bottomPanelRef = useRef<PanelImperativeHandle>(null);
  const toggleBottomPanel = useUIStore((state) => state.toggleBottomPanel);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  useAlgorithmSync();

  useEffect(() => {
    if (isSidebarOpen) {
      sidebarPanelRef.current?.expand();
    } else {
      sidebarPanelRef.current?.collapse();
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    if (isBottomPanelOpen) {
      bottomPanelRef.current?.expand();
    } else {
      bottomPanelRef.current?.collapse();
    }
  }, [isBottomPanelOpen]);

  const handleResize = () => {
    if (!sidebarPanelRef.current) return;

    const isCollapsed = sidebarPanelRef.current.isCollapsed();
    toggleSidebar(!isCollapsed);
  };

  const handleBottomPanelResize = () => {
    if (!bottomPanelRef.current) return;
    const isCollapsed = bottomPanelRef.current.isCollapsed();
    toggleBottomPanel(!isCollapsed);
  };

  return (
    <ToastProvider>
      <div className="flex h-screen w-screen bg-slate-100 overflow-hidden text-slate-900">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel
            minSize={260}
            defaultSize={300}
            maxSize={450}
            panelRef={sidebarPanelRef}
            collapsible
            collapsedSize={56}
            onResize={handleResize}
          >
            <NewSidebar isOpen={isSidebarOpen} onOpenChange={toggleSidebar} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel>
            <main className="flex-1 h-full">
              <ResizablePanelGroup orientation="vertical">
                <ResizablePanel defaultSize="75%" minSize="25%" className="p-4">
                  <NodeInputProvider>
                    <GraphCanvas />
                  </NodeInputProvider>
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-slate-300 hover:bg-slate-400" />

                <ResizablePanel
                  panelRef={bottomPanelRef}
                  collapsible
                  collapsedSize={0}
                  defaultSize="25%"
                  minSize="25%"
                  onResize={handleBottomPanelResize}
                >
                  <BottomPanel />
                </ResizablePanel>
              </ResizablePanelGroup>
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ToastProvider>
  );
}

export default App;
