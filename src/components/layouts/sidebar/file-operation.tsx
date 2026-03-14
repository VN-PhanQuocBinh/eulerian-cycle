import { cn } from "@/utils/cn";
import { useGraphStore } from "@/stores/graph-context";
import { FolderOpen, Save } from "lucide-react";

interface FileOperationProps {
  className?: string;
  disabled?: boolean;
}

function FileOperation({ disabled = false, className }: FileOperationProps) {
  const loadGraph = useGraphStore((state) => state.loadGraph);
  const saveGraph = useGraphStore((state) => state.saveGraph);

  return (
    <section className={cn("mt-auto pt-4 border-t border-slate-200", className)}>
      <div className="flex flex-col gap-2">
        <button
          onClick={loadGraph}
          disabled={disabled}
          className="disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <FolderOpen size={16} />
          Open Graph
        </button>
        <button
          onClick={saveGraph}
          disabled={disabled}
          className="disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
        >
          <Save size={16} />
          Save Graph
        </button>
      </div>
    </section>
  );
}

export default FileOperation;
