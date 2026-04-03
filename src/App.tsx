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
import TopMenuBar from "@/components/layouts/top-menu-bar";
import { useAppHotkeys } from "./hooks/use-app-hotkeys";

function App() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const isBottomPanelOpen = useUIStore((state) => state.isBottomPanelOpen);
  const sidebarPanelRef = useRef<PanelImperativeHandle>(null);
  const bottomPanelRef = useRef<PanelImperativeHandle>(null);
  const toggleBottomPanel = useUIStore((state) => state.toggleBottomPanel);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  useAlgorithmSync();
  useAppHotkeys();

  useEffect(() => {
    if (isSidebarOpen) sidebarPanelRef.current?.expand();
    else sidebarPanelRef.current?.collapse();
  }, [isSidebarOpen]);

  useEffect(() => {
    if (isBottomPanelOpen) bottomPanelRef.current?.expand();
    else bottomPanelRef.current?.collapse();
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
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-(--od-bg-0) text-(--od-fg-0)">
        <TopMenuBar />

        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup orientation="horizontal" className="h-full">
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
              <main className="flex h-full flex-1">
                <ResizablePanelGroup orientation="vertical">
                  <ResizablePanel defaultSize="75%" minSize="25%">
                    <NodeInputProvider>
                      <GraphCanvas />
                    </NodeInputProvider>
                  </ResizablePanel>

                  <ResizableHandle withHandle />

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
      </div>
    </ToastProvider>
  );
}

export default App;
