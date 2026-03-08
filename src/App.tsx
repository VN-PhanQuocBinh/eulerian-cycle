import GraphCanvas from "./components/graph-canvas";
import Sidebar from "./components/layouts/sidebar";
import { NewSidebar } from "./components/layouts/sidebar/new-sidebar";
import { BottomPanel } from "./components/layouts/bottom-panel";
import { NodeInputProvider } from "./components/ui/node-input";
import { ToastProvider } from "./components/ui/toast";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import type { PanelImperativeHandle } from "react-resizable-panels";
import { useEffect, useRef, useState } from "react";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarPanelRef = useRef<PanelImperativeHandle>(null);

  useEffect(() => {
    if (isSidebarOpen) {
      sidebarPanelRef.current?.expand();
    } else {
      sidebarPanelRef.current?.collapse();
    }
  }, [isSidebarOpen]);

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
          >
            <NewSidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel>
            <main className="flex-1 h-full">
              <NodeInputProvider>
                <ResizablePanelGroup orientation="vertical">
                  <ResizablePanel defaultSize="75%" minSize="25%" className="p-4">
                    <GraphCanvas />
                    {/* <DebugPanel /> */}
                  </ResizablePanel>

                  <ResizableHandle withHandle className="bg-slate-300 hover:bg-slate-400" />

                  <ResizablePanel defaultSize="25%" minSize="25%">
                    {/* <div className="w-full">Đang phát triển</div> */}
                    <BottomPanel />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </NodeInputProvider>
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ToastProvider>
  );
}

export default App;
