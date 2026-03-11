import { MousePointer2, PlusCircle, Trash2, SplinePointer } from "lucide-react";
import { useGraphStore } from "@/contexts/graph-context";
import FunctionButton from "@/components/ui/function-button";

function FunctionalBar() {
  const { mode, setMode, clearGraph } = useGraphStore();

  const handleClear = () => {
    clearGraph();
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      <FunctionButton
        onClick={() => setMode("view")}
        tooltipContent="Select / Move"
        icon={MousePointer2}
        side="bottom"
        active={mode === "view"}
      />

      <FunctionButton
        onClick={() => setMode("add-edge")}
        tooltipContent="Add Edge"
        icon={SplinePointer}
        side="bottom"
        active={mode === "add-edge"}
      />

      <FunctionButton
        onClick={() => setMode("add-node")}
        tooltipContent="Add Node"
        icon={PlusCircle}
        side="bottom"
        active={mode === "add-node"}
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
