import {
  MousePointer2,
  PlusCircle,
  SplinePointer,
  BrushCleaning,
  LayoutDashboard,
  LucideIcon,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import FunctionButton from "@/components/ui/function-button";
import { useGraphDataStore, useUIStore, useAlgorithmStore } from "@/stores";
import { graphService } from "@/services/graph-service";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GraphMode } from "@/types/ui-store";
import { Tooltip } from "@/components/ui/tooltip";

const modes: { value: GraphMode; label: string; icon: LucideIcon }[] = [
  { value: "view", label: "Select / Move", icon: MousePointer2 },
  { value: "add-edge", label: "Add Edge", icon: SplinePointer },
  { value: "add-node", label: "Add Node", icon: PlusCircle },
];

function FunctionalBar() {
  const interactionMode = useUIStore((s) => s.mode);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const setMode = useUIStore((s) => s.setMode);
  const clearGraphData = useGraphDataStore((s) => s.clearGraphData);
  const setSteps = useAlgorithmStore((s) => s.setSteps);

  const handleClear = () => {
    graphService.clearCanvas();
    clearGraphData();
    setSteps([]);
  };

  const handleValueChange = (value: GraphMode) => {
    setMode(value);
  };

  const handleAutoLayout = () => {
    graphService.autoLayout(currentAlgorithm);
  };

  const handleZoomIn = () => {
    graphService.zoomGraph("in");
  };

  const handleZoomOut = () => {
    graphService.zoomGraph("out");
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-1 bg-white shadow-md px-1 rounded-md">
      <div className="flex items-center py-1 gap-1">
        <ToggleGroup
          type="single"
          className="gap-0 bg-gray-100 px-1 rounded-sm h-full"
          onValueChange={handleValueChange}
          value={interactionMode}
        >
          {modes.map(({ value, label, icon: Icon }) => (
            <Tooltip key={value} content={label} asChild={false}>
              <ToggleGroupItem
                value={value}
                className="data-[state=on]:bg-blue-600 data-[state=on]:text-white outline-none"
                asChild
              >
                <Icon />
              </ToggleGroupItem>
            </Tooltip>
          ))}
        </ToggleGroup>

        <FunctionButton
          onClick={handleAutoLayout}
          tooltipContent="Auto layout"
          icon={LayoutDashboard}
          side="bottom"
        />
      </div>

      {/* Separator */}
      <div className="w-px min-h-full bg-gray-100" />

      <FunctionButton
        onClick={handleZoomIn}
        tooltipContent="Zoom In"
        icon={ZoomIn}
        className=""
        side="bottom"
      />
      <FunctionButton
        onClick={handleZoomOut}
        tooltipContent="Zoom Out"
        icon={ZoomOut}
        className=""
        side="bottom"
      />
      <div className="w-px min-h-full bg-gray-100" />

      <FunctionButton
        onClick={handleClear}
        tooltipContent="Clear Graph"
        icon={BrushCleaning}
        side="bottom"
        className=" hover:text-red-600 hover:bg-red-100"
      />
    </div>
  );
}

export default FunctionalBar;
