import FunctionButton from "../ui/function-button";
import { useUIStore } from "@/stores";
import { ListChevronsDownUp, ListChevronsUpDown } from "lucide-react";

function CollapsedBottomPanel() {
  const isBottomPanelOpen = useUIStore((state) => state.isBottomPanelOpen);
  const toggleBottomPanel = useUIStore((state) => state.toggleBottomPanel);

  const handleToggleDetailsPanel = () => {
    toggleBottomPanel(!isBottomPanelOpen);
  };

  return;

  return (
    <div className="h-12 aspect-square flex items-center justify-center gap-1 rounded-md bg-(--gl-bg-surface) px-1 py-1 drop-shadow-md">
      <FunctionButton
        onClick={handleToggleDetailsPanel}
        tooltipContent={isBottomPanelOpen ? "Hide Details Panel" : "Show Details Panel"}
        icon={isBottomPanelOpen ? ListChevronsDownUp : ListChevronsUpDown}
        side="top"
      />
    </div>
  );
}

export default CollapsedBottomPanel;
