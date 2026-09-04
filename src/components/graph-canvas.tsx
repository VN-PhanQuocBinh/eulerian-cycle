import { useEffect, useMemo, useRef, useState } from "react";
import cytoscape from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import FunctionalBar from "./functional-bar";
import dagre from "cytoscape-dagre";
import { useGraphDataStore, useAlgorithmStore } from "@/stores";
import { graphService } from "@/services/graph-service";
import { useGraphInteractions } from "@/hooks/use-graph-interactions";
import { useUIStore } from "@/stores";
import { useFileOperations } from "@/hooks/use-file-operations";
import BottomToolbar from "./bottom-toolbar";
import FloatingStackQueuePanel from "./floating-stack-queue-panel";
import { useNodeInput } from "./ui/node-input";
import { useAlgorithmOperations } from "@/hooks/use-algorithm-operations";
import FullscreenButton from "./fullscreen-button";
import { useCommandManager } from "@/hooks/use-command-manager";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
} from "@/components/ui/context-menu";

cytoscape.use(edgehandles);
cytoscape.use(dagre);

type ContextTarget = { kind: "node"; id: string } | { kind: "edge"; id: string } | null;

const GraphCanvas = () => {
  const { initCoreListeners } = useGraphInteractions();
  const { loadGraph, saveGraph, saveImage } = useFileOperations();
  const { commands } = useCommandManager();

  const interactionMode = useUIStore((s) => s.mode);
  const isDirected = useGraphDataStore((state) => state.isDirected);
  const isWeighted = useGraphDataStore((state) => state.isWeighted);
  const edges = useGraphDataStore((state) => state.edges);
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const ALGORITHMS_WITH_TARGET_NODE = useAlgorithmStore(
    (state) => state.ALGORITHMS_WITH_TARGET_NODE,
  );
  const updateNode = useGraphDataStore((state) => state.updateNode);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contextTarget, setContextTarget] = useState<ContextTarget>(null);
  const { openNodeInputAt } = useNodeInput();
  const { handleStartNodeChange, handleTargetNodeChange } = useAlgorithmOperations();

  const triggerRef = useRef<HTMLDivElement>(null);

  const openRadixContextMenu = (event: cytoscape.EventObject) => {
    const nativeEvent = event.originalEvent as MouseEvent | undefined;
    if (!nativeEvent || !triggerRef.current) return;

    nativeEvent.preventDefault();

    triggerRef.current?.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: nativeEvent.clientX,
        clientY: nativeEvent.clientY,
        button: 2,
      }),
    );
  };

  useEffect(() => {
    const removeSaveListener = (window as any).ipcRenderer?.onRequestSaveGraph?.(() => {
      saveGraph();
    });

    const removeLoadListener = (window as any).ipcRenderer?.onRequestLoadGraph?.(() => {
      loadGraph();
    });

    const removeSaveImageListener = (window as any).ipcRenderer?.onRequestSaveImage?.(() => {
      saveImage();
    });

    return () => {
      if (removeSaveListener) removeSaveListener();
      if (removeLoadListener) removeLoadListener();
      if (removeSaveImageListener) removeSaveImageListener();
    };
  }, []);

  useEffect(() => {
    graphService.toggleDirected(isDirected);
  }, [isDirected, edges]);

  useEffect(() => {
    graphService.toggleWeighted(isWeighted);
  }, [isWeighted, edges]);

  // Initialize Cytoscape and EdgeHandles
  useEffect(() => {
    if (!containerRef.current) return;

    graphService.init(containerRef.current);
    initCoreListeners();

    return () => {
      graphService.destroy();
    };
  }, []);

  useEffect(() => {
    graphService.toggleDrawMode(interactionMode === "add-edge");
  }, [interactionMode]);

  useEffect(() => {
    const cy = graphService.cy;
    if (!cy) return;

    const onNodeContext = (event: cytoscape.EventObject) => {
      const node = event.target as cytoscape.NodeSingular;
      setContextTarget({ kind: "node", id: node.id() });
      node.select();
      openRadixContextMenu(event);
    };

    const onEdgeContext = (event: cytoscape.EventObject) => {
      const edge = event.target as cytoscape.EdgeSingular;
      setContextTarget({ kind: "edge", id: edge.id() });
      edge.select();
      openRadixContextMenu(event);
    };

    const onBackgroundTap = (event: cytoscape.EventObject) => {
      if (event.target === cy) setContextTarget(null);
    };

    cy.on("cxttap", "node", onNodeContext);
    cy.on("cxttap", "edge", onEdgeContext);
    cy.on("tap", onBackgroundTap);

    return () => {
      cy.off("cxttap", "node", onNodeContext);
      cy.off("cxttap", "edge", onEdgeContext);
      cy.off("tap", onBackgroundTap);
    };
  }, []);

  const handleDeleteTarget = () => {
    if (!contextTarget || !graphService.cy) return;
    const targetId = contextTarget.id;
    const targetType = contextTarget.kind;

    if (targetType === "node") {
      commands.executeRemoveNodeCommand(targetId);
    }

    if (targetType === "edge") {
      commands.executeRemoveEdgeCommand(targetId);
    }

    setContextTarget(null);
  };

  const handleEditNode = () => {
    if (!contextTarget || contextTarget.kind !== "node" || !graphService.cy) return;

    const node = graphService.cy.getElementById(contextTarget.id);
    if (!node || node.empty()) return;

    const pos = node.renderedPosition();

    openNodeInputAt({
      x: pos.x,
      y: pos.y,
      onComplete: (label: string) => {
        if (!label.trim()) return;

        graphService.updateNodeInCy({ id: contextTarget.id, label });
        updateNode(contextTarget.id, { label });
      },
    });

    setContextTarget(null);
  };

  const handleSetStartNode = () => {
    if (!contextTarget || contextTarget.kind !== "node") return;
    handleStartNodeChange(contextTarget.id);
    setContextTarget(null);
  };

  const handleSetTargetNode = () => {
    if (!contextTarget || contextTarget.kind !== "node") return;
    handleTargetNodeChange(contextTarget.id);
    setContextTarget(null);
  };

  return (
    <div className="relative flex-1 h-full overflow-hidden bg-(--od-bg-0)">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div ref={triggerRef} className="h-full w-full">
            <div ref={containerRef} className="h-full w-full" />
          </div>
        </ContextMenuTrigger>

        {contextTarget && (
          <ContextMenuContent className="w-52 border-(--od-border) bg-(--od-bg-0) p-1 text-(--od-fg-1)">
            <ContextMenuLabel className="text-(--od-fg-0)">
              {contextTarget?.kind === "node" ? "Node Actions" : "Edge Actions"}
            </ContextMenuLabel>

            {contextTarget?.kind === "node" && (
              <>
                <ContextMenuItem
                  onSelect={handleEditNode}
                  className="focus:bg-(--od-bg-2) focus:text-(--od-fg-0)"
                >
                  Edit
                </ContextMenuItem>
                <ContextMenuItem
                  onSelect={handleSetStartNode}
                  className="focus:bg-(--od-bg-2) focus:text-(--od-fg-0)"
                >
                  Set as Start Node
                </ContextMenuItem>
                {ALGORITHMS_WITH_TARGET_NODE.includes(currentAlgorithm) && (
                  <ContextMenuItem
                    onSelect={handleSetTargetNode}
                    className="focus:bg-(--od-bg-2) focus:text-(--od-fg-0)"
                  >
                    Set as Target Node
                  </ContextMenuItem>
                )}
                <ContextMenuSeparator className="bg-(--od-border)" />
                <ContextMenuItem
                  onSelect={handleDeleteTarget}
                  className="text-(--od-red) focus:bg-(--od-bg-2) focus:text-(--od-red)"
                >
                  Delete
                </ContextMenuItem>
              </>
            )}

            {contextTarget?.kind === "edge" && (
              <ContextMenuItem
                onSelect={handleDeleteTarget}
                className="text-(--od-red) focus:bg-(--od-bg-2) focus:text-(--od-red)"
              >
                Delete
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        )}
      </ContextMenu>

      <FunctionalBar />
      <BottomToolbar />
      <FloatingStackQueuePanel />
      <FullscreenButton />
    </div>
  );
};

export default GraphCanvas;
