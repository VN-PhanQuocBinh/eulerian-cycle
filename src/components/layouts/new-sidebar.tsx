import { useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InputTab from "./sidebar/input-tab";
import ControlTab from "./sidebar/control-tab";
import { FileCode2, Play } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

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
      <TabsList variant="line" className="flex flex-col justify-start p-0 py-2 bg-(--od-bg-1) ">
        <TabsTrigger
          value="input-tab"
          className="w-14! h-12! flex-none justify-center! group-data-[orientation=vertical]/tabs:after:left-0"
          onPointerDown={() => handlePointerDown("input-tab")}
          onClick={handleClick}
        >
          <Tooltip content="Input graph data" side="right">
            {/* Wrap the icon in a span for displaying tooltip because [&_svg]:pointer-events-none*/}
            <span className="">
              <FileCode2 className="size-7" />
            </span>
          </Tooltip>
        </TabsTrigger>
        <TabsTrigger
          value="control-tab"
          className="w-14! h-12! flex-none justify-center! group-data-[orientation=vertical]/tabs:after:left-0"
          onPointerDown={() => handlePointerDown("control-tab")}
          onClick={handleClick}
        >
          <Tooltip content="Control algorithm" side="right">
            <span className="">
              <Play className="size-7" />
            </span>
          </Tooltip>
        </TabsTrigger>
      </TabsList>

      {isOpen && (
        <>
          <TabsContent value="input-tab" className="overflow-hidden">
            <InputTab className="p-4 pl-2" />
          </TabsContent>
          <TabsContent value="control-tab" className="overflow-hidden">
            <ControlTab className="p-4 pl-2" />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
}
