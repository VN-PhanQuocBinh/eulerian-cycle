import { Minus, Square, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function TopMenuBar() {
  const [fileOpen, setFileOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    (window as any).ipcRenderer.windowControls.isMaximized().then(setIsMaximized);
    return (window as any).ipcRenderer.windowControls.onMaximizedChanged(setIsMaximized);
  }, []);

  const openFile = () => {
    setViewOpen(false);
    setFileOpen(true);
  };

  const openView = () => {
    setFileOpen(false);
    setViewOpen(true);
  };

  const runFileAction = (action: () => Promise<boolean>) => {
    action().finally(() => setFileOpen(false));
  };

  const runViewAction = (action: () => Promise<boolean>) => {
    action().finally(() => setViewOpen(false));
  };

  return (
    <header className="window-drag h-10 border-b border-(--od-border) bg-(--od-bg-1) text-(--od-fg-0)">
      <div className="relative flex h-full items-center justify-between pl-2 pr-0.5">
        <div className="window-no-drag flex items-center">
          <img src="/icon.ico" alt="" className="mr-3 h-6 w-6" />

          <Popover
            open={fileOpen}
            onOpenChange={(open) => {
              setFileOpen(open);
              if (open) setViewOpen(false);
            }}
          >
            <PopoverTrigger asChild>
              <button
                onClick={openFile}
                className="rounded! px-2.5 py-1 text-sm! text-(--od-fg-1) hover:bg-(--od-bg-3) hover:text-(--od-fg-0)"
              >
                File
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              sideOffset={6}
              className="window-no-drag w-60 border-(--od-border) bg-(--od-bg-0) p-1"
            >
              <button
                onClick={() => runFileAction((window as any).ipcRenderer.appMenu.openGraph)}
                className="menu-item"
              >
                Open Graph <span>Ctrl+O</span>
              </button>
              <button
                onClick={() => runFileAction((window as any).ipcRenderer.appMenu.saveGraph)}
                className="menu-item"
              >
                Save Graph <span>Ctrl+S</span>
              </button>
              <button
                onClick={() => runFileAction((window as any).ipcRenderer.appMenu.saveImage)}
                className="menu-item"
              >
                Save Graph as Image <span>Ctrl+Shift+S</span>
              </button>
            </PopoverContent>
          </Popover>

          <Popover
            open={viewOpen}
            onOpenChange={(open) => {
              setViewOpen(open);
              if (open) setFileOpen(false);
            }}
          >
            <PopoverTrigger asChild>
              <button
                onClick={openView}
                className="rounded! px-2.5 py-1 text-sm! text-(--od-fg-1) hover:bg-(--od-bg-3) hover:text-(--od-fg-0)"
              >
                View
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              sideOffset={6}
              className="window-no-drag w-56 border-(--od-border) bg-(--od-bg-0) p-1"
            >
              <button
                onClick={() => runViewAction((window as any).ipcRenderer.appMenu.reload)}
                className="menu-item"
              >
                Reload
              </button>
              <button
                onClick={() => runViewAction((window as any).ipcRenderer.appMenu.toggleDevTools)}
                className="menu-item"
              >
                Toggle DevTools
              </button>
              <button
                onClick={() => runViewAction((window as any).ipcRenderer.appMenu.resetZoom)}
                className="menu-item"
              >
                Reset Zoom
              </button>
              <button
                onClick={() => runViewAction((window as any).ipcRenderer.appMenu.zoomIn)}
                className="menu-item"
              >
                Zoom In
              </button>
              <button
                onClick={() => runViewAction((window as any).ipcRenderer.appMenu.zoomOut)}
                className="menu-item"
              >
                Zoom Out
              </button>
            </PopoverContent>
          </Popover>
        </div>

        <div className="window-no-drag flex items-stretch">
          <button
            aria-label="Minimize"
            onClick={() => (window as any).ipcRenderer.windowControls.minimize()}
            className="grid h-9 w-13 place-items-center rounded-none! text-(--od-fg-1) hover:bg-(--od-bg-3) hover:text-(--od-fg-0)"
          >
            <Minus size={16} />
          </button>
          <button
            aria-label="Maximize"
            onClick={() => (window as any).ipcRenderer.windowControls.toggleMaximize()}
            className="grid h-9 w-13 place-items-center rounded-none! text-(--od-fg-1) hover:bg-(--od-bg-3) hover:text-(--od-fg-0)"
          >
            <Square size={14} className={isMaximized ? "opacity-60" : ""} />
          </button>
          <button
            aria-label="Close"
            onClick={() => (window as any).ipcRenderer.windowControls.close()}
            className="grid h-9 w-13 place-items-center rounded-none! text-(--od-fg-1) hover:bg-(--od-red) hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
