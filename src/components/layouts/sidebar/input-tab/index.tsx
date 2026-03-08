import { useState, useEffect } from "react";
import { RotateCcw, RefreshCw } from "lucide-react";
import { useGraphStore } from "@/contexts/graph-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { graphToEdgeList, parseEdgeList } from "@/utils";

function InputTab({ className }: { className?: string }) {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const isDirected = useGraphStore((state) => state.isDirected);
  const drawGraphFromData = useGraphStore((state) => state.drawGraphFromData);
  const autoLayout = useGraphStore((state) => state.autoLayout);

  const getStoreText = () => graphToEdgeList(nodes, edges);

  const [text, setText] = useState(getStoreText);

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

  return (
    <div className={cn("flex flex-col h-full gap-3 bg-background", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Edge List
        </span>
        <span className="text-xs text-muted-foreground">
          {edges.length} edge{edges.length !== 1 ? "s" : ""}
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        placeholder={"# one edge per line\nA B\nB C\nC A"}
        className="bg-gray-50 flex-1 w-full resize-none rounded-md border border-input px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />

      <div className="flex flex-wrap gap-2">
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
