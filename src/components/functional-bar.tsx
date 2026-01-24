import { MousePointer2, PlusCircle, Play, Trash2 } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";

interface FunctionalBarProps {
  onToggleViewMode: () => void;
  onToggleAddMode: () => void;
  onToggleClearGraphMode: () => void;
  onToggleRunEulerMode: () => void;
}

function FunctionalBar({
  onToggleViewMode,
  onToggleAddMode,
  onToggleClearGraphMode,
  onToggleRunEulerMode,
}: FunctionalBarProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      <Tooltip content="Chọn / Di chuyển">
        <button
          onClick={onToggleViewMode}
          className={cn("flex justify-start items-center gap-2 bg-white p-3  rounded-lg shadow border text-sm hover:bg-slate-50 transition-all", {
            "bg-slate-100": false,
          })}
        >
          <MousePointer2 size={18} />
        </button>
      </Tooltip>

      <Tooltip content="Thêm đỉnh/cạnh">
        <button
          onClick={onToggleAddMode}
          className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow border text-sm hover:bg-slate-50 transition-all"
        >
          <PlusCircle size={16} />
        </button>
      </Tooltip>

      <Tooltip content="Xóa hết đồ thị">
        <button
          onClick={onToggleClearGraphMode}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg shadow border text-sm hover:bg-red-100 transition-all"
        >
          <Trash2 size={16} />
        </button>
      </Tooltip>

      <Tooltip content="Chạy thuật toán Euler">
        <button
          onClick={onToggleRunEulerMode}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg shadow text-sm hover:bg-blue-700 transition-all"
        >
          <Play size={16} />
        </button>
      </Tooltip>
    </div>
  );
}

export default FunctionalBar;
