import { useState, useEffect } from "react";
import { RotateCcw, RefreshCw, Copy, Check } from "lucide-react";
import { useGraphStore } from "@/contexts/graph-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { graphToEdgeList, parseEdgeList } from "@/utils";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { useToast } from "@/components/ui/toast";

function InputTab({ className }: { className?: string }) {
  const { showToast } = useToast();
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const isDirected = useGraphStore((state) => state.isDirected);
  const drawGraphFromData = useGraphStore((state) => state.drawGraphFromData);
  const autoLayout = useGraphStore((state) => state.autoLayout);

  const getStoreText = () => graphToEdgeList(nodes, edges);

  const [text, setText] = useState(getStoreText);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");

  // Sync textarea khi store thay đổi từ bên ngoài (canvas)
  useEffect(() => {
    setText(getStoreText());
  }, [nodes, edges]);

  const handleReset = () => {
    setText(getStoreText());
  };

  const handleSync = () => {
    const { nodes: parsedNodes, edges: parsedEdges } = parseEdgeList(text);
    console.log("Parsed nodes:", parsedNodes);
    console.log("Parsed edges:", parsedEdges);
    drawGraphFromData({ nodes: parsedNodes, edges: parsedEdges, isDirected });
    autoLayout();
  };

  const handleCopy = () => {
    try {
      copyToClipboard(getStoreText());
      setCopyStatus("success");

      setTimeout(() => {
        setCopyStatus("idle");
      }, 3000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setCopyStatus("error");
      showToast({
        message: "Failed to copy edge list",
        type: "error",
        duration: 2000,
      });
    }
  };

  return (
    <div className={cn("flex flex-col h-full gap-3 bg-background", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Edge List
        </span>
        {/* <span className="text-xs text-muted-foreground">
          {edges.length} edge{edges.length !== 1 ? "s" : ""}
        </span> */}
      </div>

      <div className="relative group bg-gray-50 flex-1 w-full ">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          placeholder={"# one edge per line\nA B\nB C\nC A"}
          className="w-full h-full resize-none rounded-md border border-input px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
          disabled={copyStatus === "success"}
        >
          {copyStatus === "success" ? (
            <Check strokeWidth={3} className="size-4" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </div>

      <div className=" flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 min-w-[120px]"
          onClick={handleReset}
        >
          <RotateCcw />
          Reset
        </Button>
        <Button size="sm" className="flex-1 min-w-[120px]" onClick={handleSync}>
          <RefreshCw />
          Sync
        </Button>
      </div>
    </div>
  );
}

export default InputTab;
