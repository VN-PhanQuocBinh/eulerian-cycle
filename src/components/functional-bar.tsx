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

function Separator() {
  return <div className="w-px min-h-full bg-(--od-border)" />;
}

function ButtonGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center py-1 gap-1">{children}</div>;
}

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
    if (!value) return;

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
    <div className="absolute top-4 right-4 z-10 flex gap-1 rounded-md border-2 border-(--od-border) bg-(--od-bg-2) px-1 shadow-md">
      <ButtonGroup>
        <ToggleGroup
          type="single"
          className="h-full gap-0 rounded-sm bg-(--od-bg-1) px-1"
          onValueChange={handleValueChange}
          value={interactionMode}
        >
          {modes.map(({ value, label, icon: Icon }) => (
            <Tooltip key={value} content={label} asChild={false}>
              <ToggleGroupItem
                value={value}
                className="text-(--od-fg-1) hover:bg-(--od-bg-3) data-[state=on]:bg-(--od-blue) data-[state=on]:text-(--primary-foreground) outline-none"
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
      </ButtonGroup>

      <Separator />

      <ButtonGroup>
        <FunctionButton
          onClick={handleZoomIn}
          tooltipContent="Zoom In"
          icon={ZoomIn}
          side="bottom"
        />
        <FunctionButton
          onClick={handleZoomOut}
          tooltipContent="Zoom Out"
          icon={ZoomOut}
          side="bottom"
        />
      </ButtonGroup>

      <Separator />

      <ButtonGroup>
        <FunctionButton
          onClick={handleClear}
          tooltipContent="Clear Graph"
          icon={BrushCleaning}
          side="bottom"
          className="hover:bg-(--od-red)/20 text-(--od-red)"
        />
      </ButtonGroup>
    </div>
  );
}

export default FunctionalBar;
