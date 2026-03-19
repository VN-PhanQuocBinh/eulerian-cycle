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
    <section className={cn("mt-auto pt-4 border-t border-(--od-border)", className)}>
      <div className="flex flex-col gap-2">
        <button
          onClick={loadGraph}
          disabled={disabled}
          className="disabled:cursor-not-allowed disabled:border-(--od-border) disabled:bg-(--od-bg-3) disabled:text-(--od-fg-2) flex items-center justify-center gap-2 w-full py-2.5 bg-(--od-blue) border border-(--od-blue) hover:brightness-110 text-(--primary-foreground) rounded-lg transition-colors font-medium"
        >
          <FolderOpen size={16} />
          Open Graph
        </button>
        <button
          onClick={saveGraph}
          disabled={disabled}
          className="disabled:cursor-not-allowed disabled:border-(--od-border) disabled:bg-(--od-bg-3) disabled:text-(--od-fg-2) flex items-center justify-center gap-2 w-full py-2.5 bg-(--od-bg-2) border border-(--od-border-strong) hover:bg-(--od-bg-3) text-(--od-fg-1) rounded-lg transition-colors font-medium"
        >
          <Save size={16} />
          Save Graph
        </button>
      </div>
    </section>
  );
}

export default FileOperation;
