import { ZoomIn, ZoomOut, LayoutDashboard } from "lucide-react";
import { useGraphStore } from "@/stores/graph-context";
import FunctionButton from "@/components/ui/function-button";
import { graphService } from "@/services/graph-service";
import { useAlgorithmStore } from "@/stores";

function ZoomBar() {
  const cyInstance = useGraphStore((state) => state.cyInstance);
  const isAnimating = useGraphStore((state) => state.isAnimating);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);

  const handleZoomIn = () => {
    if (!cyInstance) return;
    cyInstance.zoom({
      level: cyInstance.zoom() * 1.2,
      renderedPosition: {
        x: cyInstance.width() / 2,
        y: cyInstance.height() / 2,
      },
    });
  };

  const handleZoomOut = () => {
    if (!cyInstance) return;
    cyInstance.zoom({
      level: cyInstance.zoom() / 1.2,
      renderedPosition: {
        x: cyInstance.width() / 2,
        y: cyInstance.height() / 2,
      },
    });
  };

  const handleAutoLayout = () => {
    graphService.autoLayout(currentAlgorithm);
  };

  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-row gap-2">
      <FunctionButton
        onClick={handleAutoLayout}
        tooltipContent="Auto layout"
        icon={LayoutDashboard}
        disabled={isAnimating}
        className="mr-6"
      />

      <FunctionButton
        onClick={handleZoomOut}
        tooltipContent="Zoom Out"
        icon={ZoomOut}
        disabled={isAnimating}
      />

      <FunctionButton
        onClick={handleZoomIn}
        tooltipContent="Zoom In"
        icon={ZoomIn}
        disabled={isAnimating}
      />
    </div>
  );
}

export default ZoomBar;
