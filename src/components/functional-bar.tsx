import { MousePointer2, PlusCircle, Trash2, SplinePointer } from "lucide-react";
import FunctionButton from "@/components/ui/function-button";
import { useUIStore } from "@/stores";
import { graphService } from "@/services/graph-service";

function FunctionalBar() {
  const interactionMode = useUIStore((s) => s.mode);
  const setMode = useUIStore((s) => s.setMode);
  const clearGraph = useUIStore((s) => s.clearGraph);

  const handleClear = () => {
    graphService.clearCanvas();
    clearGraph();
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      <FunctionButton
        onClick={() => setMode("view")}
        tooltipContent="Select / Move"
        icon={MousePointer2}
        side="bottom"
        active={interactionMode === "view"}
      />

      <FunctionButton
        onClick={() => setMode("add-edge")}
        tooltipContent="Add Edge"
        icon={SplinePointer}
        side="bottom"
        active={interactionMode === "add-edge"}
      />

      <FunctionButton
        onClick={() => setMode("add-node")}
        tooltipContent="Add Node"
        icon={PlusCircle}
        side="bottom"
        active={interactionMode === "add-node"}
      />

      <FunctionButton
        onClick={handleClear}
        tooltipContent="Clear Graph"
        icon={Trash2}
        side="bottom"
        className="bg-red-50 text-red-600 hover:bg-red-100"
      />
    </div>
  );
}

export default FunctionalBar;
