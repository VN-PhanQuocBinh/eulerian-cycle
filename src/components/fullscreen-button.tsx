import { Maximize2, Minimize2 } from "lucide-react";
import FunctionButton from "./ui/function-button";
import { useUIStore } from "@/stores/ui-store";
import { useCallback } from "react";
import { useRegisterHotkey } from "@/hooks/use-register-hotkey";

function FullscreenButton() {
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const isBottomPanelOpen = useUIStore((s) => s.isBottomPanelOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const toggleBottomPanel = useUIStore((s) => s.toggleBottomPanel);
  useRegisterHotkey("f", () => {

  }) 

  const handleToggleFullscreen = useCallback(() => {
    if (isSidebarOpen || isBottomPanelOpen) {
      toggleSidebar(false);
      toggleBottomPanel(false);
    } else {
      toggleSidebar(true);
      toggleBottomPanel(true);
    }
  }, [isSidebarOpen, isBottomPanelOpen, toggleSidebar, toggleBottomPanel]);

  const icon = isSidebarOpen || isBottomPanelOpen ? Maximize2 : Minimize2;

  return (
    <FunctionButton
      className="absolute bottom-4 left-4 z-20"
      icon={icon}
      onClick={handleToggleFullscreen}
      tooltipContent={isSidebarOpen || isBottomPanelOpen ? "Enter Fullscreen" : "Exit Fullscreen"}
    ></FunctionButton>
  );
}

export default FullscreenButton;
