import {
  MousePointer2,
  PlusCircle,
  SplinePointer,
  BrushCleaning,
  LayoutDashboard,
  LucideIcon,
  ZoomIn,
  ZoomOut,
  PanelRight,
} from "lucide-react";
import FunctionButton from "@/components/ui/function-button";
import { useUIStore, useAlgorithmStore } from "@/stores";
import { graphService } from "@/services/graph-service";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GraphMode } from "@/types/ui-store";
import { Tooltip } from "@/components/ui/tooltip";
import { useRegisterHotkey } from "@/hooks/use-register-hotkey";
import { HOTKEYS_CONFIG } from "@/configs/hotkeys-config";
import { useCommandManager } from "@/hooks/use-command-manager";

const modes: {
  id: keyof typeof HOTKEYS_CONFIG.CLICK;
  value: GraphMode;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "VIEW", value: "view", label: "Select / Move", icon: MousePointer2 },
  { id: "ADD_EDGE", value: "add-edge", label: "Add Edge", icon: SplinePointer },
  { id: "ADD_NODE", value: "add-node", label: "Add Node", icon: PlusCircle },
];

function FunctionalBar() {
  const { commands } = useCommandManager();

  const interactionMode = useUIStore((s) => s.mode);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const isRightSidebarOpen = useUIStore((state) => state.isRightSidebarOpen);
  const toggleRightSidebar = useUIStore((state) => state.toggleRightSidebar);
  const setMode = useUIStore((s) => s.setMode);

  const handleClear = () => {
    commands.executeClearGraphCommand();
  };

  const handleValueChange = (value: GraphMode) => {
    if (!value) return;

    setMode(value);
  };

  useRegisterHotkey({
    type: "click",
    combo: HOTKEYS_CONFIG.CLICK.VIEW,
    handler: () => handleValueChange("view"),
  });

  useRegisterHotkey({
    type: "click",
    combo: HOTKEYS_CONFIG.CLICK.ADD_EDGE,
    handler: () => handleValueChange("add-edge"),
  });

  useRegisterHotkey({
    type: "click",
    combo: HOTKEYS_CONFIG.CLICK.ADD_NODE,
    handler: () => handleValueChange("add-node"),
  });

  useRegisterHotkey({
    type: "click",
    combo: HOTKEYS_CONFIG.CLICK.AUTO_LAYOUT,
    handler: () => handleAutoLayout(),
  });

  useRegisterHotkey({
    type: "click",
    combo: HOTKEYS_CONFIG.CLICK.ZOOM_IN,
    handler: () => handleZoomIn(),
  });

  useRegisterHotkey({
    type: "click",
    combo: HOTKEYS_CONFIG.CLICK.ZOOM_OUT,
    handler: () => handleZoomOut(),
  });

  useRegisterHotkey({
    type: "click",
    combo: HOTKEYS_CONFIG.CLICK.CLEAR_GRAPH,
    handler: () => handleClear(),
  });

  const handleAutoLayout = () => {
    commands.executeAutoLayoutCommand(currentAlgorithm);
  };

  const handleZoomIn = () => {
    graphService.zoomGraph("in");
  };

  const handleZoomOut = () => {
    graphService.zoomGraph("out");
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-1 rounded-md bg-(--gl-bg-surface) px-1 shadow-md border border-(--gl-border)/50">
      <ButtonGroup>
        <ToggleGroup
          type="single"
          className="h-full gap-0 rounded-sm bg-(--gl-bg-base) px-1"
          onValueChange={handleValueChange}
          value={interactionMode}
        >
          {modes.map(({ id, value, label, icon: Icon }) => (
            <Tooltip
              key={id}
              content={`${label} (${HOTKEYS_CONFIG.CLICK[id]?.toUpperCase()})`}
              asChild={false}
            >
              <ToggleGroupItem
                value={value}
                className="text-(--gl-text-main) hover:bg-(--gl-bg-subtle) data-[state=on]:bg-(--gl-blue-soft) data-[state=on]:text-(--gl-blue-dark) outline-none"
                asChild
                size="sm"
              >
                <Icon />
              </ToggleGroupItem>
            </Tooltip>
          ))}
        </ToggleGroup>

        <FunctionButton
          onClick={handleAutoLayout}
          tooltipContent={`Auto Layout (${HOTKEYS_CONFIG.CLICK.AUTO_LAYOUT?.toUpperCase()})`}
          icon={LayoutDashboard}
          side="bottom"
        />
      </ButtonGroup>

      <Separator />

      <ButtonGroup>
        <FunctionButton
          onClick={handleZoomIn}
          tooltipContent={`Zoom In (${HOTKEYS_CONFIG.CLICK.ZOOM_IN?.toUpperCase()})`}
          icon={ZoomIn}
          side="bottom"
        />
        <FunctionButton
          onClick={handleZoomOut}
          tooltipContent={`Zoom Out (${HOTKEYS_CONFIG.CLICK.ZOOM_OUT?.toUpperCase()})`}
          icon={ZoomOut}
          side="bottom"
        />
      </ButtonGroup>

      <Separator />

      <ButtonGroup>
        <FunctionButton
          onClick={handleClear}
          tooltipContent={`Clear Canvas (${HOTKEYS_CONFIG.CLICK.CLEAR_GRAPH?.toUpperCase()})`}
          icon={BrushCleaning}
          side="bottom"
          className="hover:bg-(--gl-red-dark)/20 text-(--gl-red-dark)"
        />
      </ButtonGroup>

      {!isRightSidebarOpen && (
        <>
          <Separator />
          <ButtonGroup>
            <FunctionButton
              onClick={() => toggleRightSidebar(true)}
              tooltipContent={`Toggle Right Sidebar`}
              icon={PanelRight}
              side="bottom"
            />
          </ButtonGroup>
        </>
      )}
    </div>
  );
}

function Separator() {
  return <div className="w-px min-h-full bg-(--gl-border)/30" />;
}

function ButtonGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center py-1 gap-1">{children}</div>;
}

export default FunctionalBar;
