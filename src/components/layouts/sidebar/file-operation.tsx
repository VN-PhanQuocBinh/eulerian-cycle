import { cn } from "@/utils/cn";
import { FolderOpen, Save } from "lucide-react";
import { useFileOperations } from "@/hooks/use-file-operations";

interface FileOperationProps {
  className?: string;
  disabled?: boolean;
}

function FileOperation({ disabled = false, className }: FileOperationProps) {
  const { loadGraph, saveGraph } = useFileOperations();

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
