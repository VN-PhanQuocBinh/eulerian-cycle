import { useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InputTab from "./left-sidebar/input-tab";
import RunningTab from "./left-sidebar/running-tab";
import { FileCode2, Play } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { useRegisterHotkey } from "@/hooks/use-register-hotkey";
import { HOTKEYS_CONFIG } from "@/configs/hotkeys-config";
import LayoutContainer from "./layout-container";

interface NewSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewSidebar({ isOpen, onOpenChange }: NewSidebarProps) {
  const [activeTab, setActiveTab] = useState("input-tab");
  const wasActiveRef = useRef(false);

  const handlePointerDown = (value: string) => {
    wasActiveRef.current = value === activeTab && isOpen;
  };

  const handleClick = () => {
    if (wasActiveRef.current) onOpenChange(false);
  };

  useRegisterHotkey({
    type: "click",
    combo: HOTKEYS_CONFIG.CLICK.TOGGLE_SIDEBAR,
    handler: () => onOpenChange(!isOpen),
  });

  return (
    <Tabs
      value={isOpen ? activeTab : ""}
      onValueChange={(val) => {
        setActiveTab(val);
        onOpenChange(true);
      }}
      orientation="vertical"
      className="h-full tabs-bar gap-0"
    >
      <TabsList
        variant="line"
        className="flex flex-col justify-start p-1.5 py-1.5 bg-(--gl-bg-base) "
      >
        <TabsTrigger
          value="input-tab"
          className="w-10! h-10! flex-none justify-center! items-center"
          onPointerDown={() => handlePointerDown("input-tab")}
          onClick={handleClick}
        >
          <Tooltip content="Input graph data" side="right">
            {/* Wrap the icon in a span for displaying tooltip because [&_svg]:pointer-events-none*/}
            <span className="">
              <FileCode2 className="size-6" />
            </span>
          </Tooltip>
        </TabsTrigger>
        <TabsTrigger
          value="control-tab"
          className="w-10! h-10! flex-none justify-center!"
          onPointerDown={() => handlePointerDown("control-tab")}
          onClick={handleClick}
        >
          <Tooltip content="Control algorithm" side="right">
            <span className="">
              <Play className="size-6" />
            </span>
          </Tooltip>
        </TabsTrigger>
      </TabsList>

      {isOpen && (
        <>
          <TabsContent value="input-tab" className="overflow-hidden">
            <LayoutContainer>
              <InputTab className="p-3 rounded-md" />
            </LayoutContainer>
          </TabsContent>
          <TabsContent value="control-tab" className="overflow-hidden">
            <LayoutContainer>
              <RunningTab className="p-3 rounded-md" />
            </LayoutContainer>
          </TabsContent>
        </>
      )}
    </Tabs>
  );
}
