import { MousePointer2, PlusCircle, Play, Trash2, SplinePointer } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import { useGraphStore } from "@/contexts/graph-context";

function FunctionalBar() {
  const { mode, setMode, clearGraph, resetGraph, runAlgorithm } = useGraphStore();

  const handleReset = () => {
    resetGraph();
    clearGraph();
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      <Tooltip content="Chọn / Di chuyển">
        <button
          onClick={() => setMode("view")}
          className={cn(
            "flex justify-start items-center gap-2 bg-white p-3  rounded-lg shadow border text-sm hover:bg-slate-50 transition-all",
            {
              "bg-blue-600! text-white": mode === "view",
            },
          )}
        >
          <MousePointer2 size={18} />
        </button>
      </Tooltip>

      <Tooltip content="Thêm cạnh">
        <button
          onClick={() => setMode("add-edge")}
          className={cn(
            "flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow border text-sm hover:bg-slate-50 transition-all",
            {
              "bg-blue-600! text-white": mode === "add-edge",
            },
          )}
        >
          <SplinePointer size={16} />
        </button>
      </Tooltip>

      <Tooltip content="Thêm đỉnh">
        <button
          onClick={() => setMode("add-node")}
          className={cn(
            "flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow border text-sm hover:bg-slate-50 transition-all",
            {
              "bg-blue-600! text-white": mode === "add-node",
            },
          )}
        >
          <PlusCircle size={16} />
        </button>
      </Tooltip>

      <Tooltip content="Xóa hết đồ thị">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg shadow border text-sm hover:bg-red-100 transition-all"
        >
          <Trash2 size={16} />
        </button>
      </Tooltip>
    </div>
  );
}

export default FunctionalBar;
