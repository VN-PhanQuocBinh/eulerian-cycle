import { ZoomIn, ZoomOut } from "lucide-react";
import FunctionButton from "@/components/ui/function-button";
import { graphService } from "@/services/graph-service";

function ZoomBar() {
  const handleZoomIn = () => {
    graphService.zoomGraph("in");
  };

  const handleZoomOut = () => {
    graphService.zoomGraph("out");
  };

  return (
    <div className="absolute bottom-4 right-4 z-50 flex flex-col gap-2">
      <FunctionButton
        onClick={handleZoomIn}
        tooltipContent="Zoom In"
        icon={ZoomIn}
        className="bg-white shadow"
        side="left"
      />
      <FunctionButton
        onClick={handleZoomOut}
        tooltipContent="Zoom Out"
        icon={ZoomOut}
        className="bg-white shadow"
        side="left"
      />
    </div>
  );
}

export default ZoomBar;
