import { ZoomIn, ZoomOut, LayoutDashboard } from "lucide-react";
import FunctionButton from "@/components/ui/function-button";
import { graphService } from "@/services/graph-service";
import { useAlgorithmStore } from "@/stores";

function ZoomBar() {
  const isAnimating = useAlgorithmStore((state) => state.isAnimating);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);

  const handleZoomIn = () => {
    graphService.zoomGraph("in");
  };

  const handleZoomOut = () => {
    graphService.zoomGraph("out");
  };

  const handleAutoLayout = () => {
    graphService.autoLayout(currentAlgorithm);
  };

  return (
    <div className="absolute bottom-4 right-4 z-50 flex flex-row gap-2">
      <FunctionButton
        onClick={handleAutoLayout}
        tooltipContent="Auto layout"
        icon={LayoutDashboard}
        className="mr-6"
      />

      <FunctionButton onClick={handleZoomOut} tooltipContent="Zoom Out" icon={ZoomOut} />

      <FunctionButton onClick={handleZoomIn} tooltipContent="Zoom In" icon={ZoomIn} />
    </div>
  );
}

export default ZoomBar;
