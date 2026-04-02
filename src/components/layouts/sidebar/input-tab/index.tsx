import { useState, useEffect } from "react";
import { RotateCcw, RefreshCw, Copy, Check, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { graphToEdgeList, parseEdgeList } from "@/utils";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { useToast } from "@/components/ui/toast";
import { GRAPH_EXAMPLES, GraphExampleLine } from "@/constant/graph-examples";
import { useGraphDataStore, useAlgorithmStore } from "@/stores";
import { graphService } from "@/services/graph-service";

function parseGraphExample(lines: GraphExampleLine[]): string {
  return lines.map(line => line.join(" ")).join("\n");
}

function InputTab({ className }: { className?: string }) {
  const { showToast } = useToast();
  const nodes = useGraphDataStore((state) => state.nodes);
  const edges = useGraphDataStore((state) => state.edges);
  const updateGraphData = useGraphDataStore((state) => state.updateGraphData);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const isDirected = useGraphDataStore((state) => state.isDirected);

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
    graphService.drawGraphFromData({ nodes: parsedNodes, edges: parsedEdges, isDirected });
    graphService.autoLayout(currentAlgorithm, false);
    updateGraphData({
      nodes: parsedNodes,
      edges: parsedEdges,
      isDirected,
    });
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

  const handleSuggest = () => {
    const examples =
      GRAPH_EXAMPLES[isDirected ? "directed" : "undirected"]?.[currentAlgorithm!] || [];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setText(parseGraphExample(randomExample));
  };

  return (
    <div className={cn("flex flex-col h-full gap-3 bg-(--od-bg-0)", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
          Edge List
        </span>
      </div>

      <div className="relative group flex-1 w-full ">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          placeholder={"# one edge per line\nA B\nB C\nC A"}
          className="w-full h-full resize-none rounded-md border border-gray-600 px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent bg-transparent text-white"
        />
        {text && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 opacity-0 bg-[#4d5565] group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
            disabled={copyStatus === "success"}
          >
            {copyStatus === "success" ? (
              <Check strokeWidth={3} className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
        )}
      </div>

      <Button variant="secondary" size="sm" className="min-w-[120px]" onClick={handleSuggest}>
        <WandSparkles />
        Suggest Graph
      </Button>

      <div className=" flex flex-wrap gap-2 pt-4 border-t border-(--od-fg-2)">
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
