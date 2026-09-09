import { Maximize2, Minimize2 } from "lucide-react";
import FunctionButton from "./ui/function-button";
import { useUIStore } from "@/stores/ui-store";
import { useCallback } from "react";
import { useRegisterHotkey } from "@/hooks/use-register-hotkey";

function FullscreenButton() {
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const isBottomPanelOpen = useUIStore((s) => s.isBottomPanelOpen);
  const isRightSidebarOpen = useUIStore((s) => s.isRightSidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const toggleBottomPanel = useUIStore((s) => s.toggleBottomPanel);
  const toggleRightSidebar = useUIStore((s) => s.toggleRightSidebar);

  const handleToggleFullscreen = useCallback(() => {
    if (isSidebarOpen || isBottomPanelOpen || isRightSidebarOpen) {
      toggleSidebar(false);
      toggleBottomPanel(false);
      toggleRightSidebar(false);
    } else {
      toggleSidebar(true);
      toggleBottomPanel(true);
      toggleRightSidebar(true);
    }
  }, [isSidebarOpen, isBottomPanelOpen, toggleSidebar, toggleBottomPanel]);

  useRegisterHotkey({
    type: "click",
    combo: "f",
    handler: handleToggleFullscreen,
  });

  const icon = isSidebarOpen || isBottomPanelOpen ? Maximize2 : Minimize2;

  return (
    <FunctionButton
      className="absolute bottom-4 left-4 z-20 bg-(--gl-bg-subtle) hover:bg-(--gl-bg-base) transition-colors"
      icon={icon}
      onClick={handleToggleFullscreen}
      tooltipContent={isSidebarOpen || isBottomPanelOpen ? "Enter Fullscreen" : "Exit Fullscreen"}
    ></FunctionButton>
  );
}

export default FullscreenButton;
