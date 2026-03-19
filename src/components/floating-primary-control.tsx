import {
  MousePointer2,
  PlusCircle,
  SplinePointer,
  BrushCleaning,
  LayoutDashboard,
  LucideIcon,
  ZoomIn,
  ZoomOut,
  SkipForward,
  SkipBack,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ListChevronsUpDown,
  ListChevronsDownUp,
} from "lucide-react";
import FunctionButton from "@/components/ui/function-button";
import { useGraphDataStore, useUIStore, useAlgorithmStore } from "@/stores";
import { graphService } from "@/services/graph-service";

import SpeedControl from "./speed-control";

function FloatintPrimaryControl() {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const clearGraphData = useGraphDataStore((s) => s.clearGraphData);
  const setSteps = useAlgorithmStore((s) => s.setSteps);
  const toggleBottomPanel = useUIStore((state) => state.toggleBottomPanel);
  const isBottomPanelOpen = useUIStore((state) => state.isBottomPanelOpen);

  const handleToggleRun = () => {};

  const handleBackward = () => {};

  const handleForward = () => {};

  const handleToggleDetailsPanel = () => {
    toggleBottomPanel(!isBottomPanelOpen);
  };

  return (
    <div className=" absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-white shadow-md px-1 rounded-md">
      <SpeedControl speed={1} disabled={false} setSpeed={() => {}} />

      <div className="flex items-center py-1 gap-1">
        <FunctionButton
          onClick={handleBackward}
          tooltipContent="Backward"
          icon={SkipBack}
          side="top"
          className="bg-gray-100"
        />
        <FunctionButton
          onClick={handleToggleRun}
          tooltipContent="Toggle Run"
          icon={Play}
          side="top"
          className=" bg-green-600 not-disabled:hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed!"
        />
        <FunctionButton
          onClick={handleForward}
          tooltipContent="Forward"
          icon={SkipForward}
          side="top"
          className="bg-gray-100"
        />
      </div>

      {/* Separator */}
      <div className="w-px min-h-full bg-gray-300" />

      <FunctionButton tooltipContent="Reset" icon={RotateCcw} className="" side="top" />
      <FunctionButton
        onClick={handleToggleDetailsPanel}
        tooltipContent={isBottomPanelOpen ? "Hide Details Panel" : "Show Details Panel"}
        icon={isBottomPanelOpen ? ListChevronsDownUp : ListChevronsUpDown}
        className=""
        side="top"
      />
    </div>
  );
}

export default FloatintPrimaryControl;
