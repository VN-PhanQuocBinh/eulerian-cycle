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
    <section className={cn("mt-auto pt-4 border-t border-(--gl-border)", className)}>
      <div className="flex flex-col gap-2">
        <button
          onClick={loadGraph}
          disabled={disabled}
          className="disabled:cursor-not-allowed disabled:border-(--gl-border) disabled:bg-(--gl-bg-subtle) disabled:text-(--gl-text-muted) flex items-center justify-center gap-2 w-full py-2.5 bg-(--gl-blue-dark) border border-(--gl-blue-dark) hover:brightness-110 text-(--primary-foreground) rounded-lg transition-colors font-medium"
        >
          <FolderOpen size={16} />
          Open Graph
        </button>
        <button
          onClick={saveGraph}
          disabled={disabled}
          className="disabled:cursor-not-allowed disabled:border-(--gl-border) disabled:bg-(--gl-bg-subtle) disabled:text-(--gl-text-muted) flex items-center justify-center gap-2 w-full py-2.5 bg-(--gl-bg-subtle) border border-(--gl-border) hover:bg-(--gl-bg-subtle) text-(--gl-text-main) rounded-lg transition-colors font-medium"
        >
          <Save size={16} />
          Save Graph
        </button>
      </div>
    </section>
  );
}

export default FileOperation;
