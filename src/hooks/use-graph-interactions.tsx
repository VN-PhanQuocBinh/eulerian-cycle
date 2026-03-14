import { useNodeInput } from "@/components/ui/node-input";
import { graphService } from "@/services/graph-service";
import { generateNodeId } from "@/utils/generate-id";
import { useGraphDataStore, useUIStore } from "@/stores";
import { useEffect } from "react";

export const useGraphInteractions = () => {
  // Graph Data Store
  const addNode = useGraphDataStore((s) => s.addNode);
  const updateNode = useGraphDataStore((s) => s.updateNode);
  const addEdge = useGraphDataStore((s) => s.addEdge);

  const updateNodes = useGraphDataStore((s) => s.updateNodes);
  const updateEdges = useGraphDataStore((s) => s.updateEdges);

  // Node Input
  const { openNodeInputAt } = useNodeInput();

  const initCoreListeners = () => {
    graphService.bindEvents({
      onNodeAdd: (position) => {
        const interactionMode = useUIStore.getState().mode;
        if (interactionMode !== "add-node") return;

        const { x, y } = position;

        openNodeInputAt({
          x,
          y,
          onComplete: (label: string) => {
            if (!label.trim()) return;

            const nodeId = generateNodeId(label);

            graphService.addNodeToCy({ id: nodeId, label, x, y });
            addNode({ id: nodeId, label, x, y });
          },
        });
      },
      onEdgeAdd: addEdge,
      onNodeUpdate: ({ id, position }) => {
        const interactionMode = useUIStore.getState().mode;
        if (!["view", "add-edge"].includes(interactionMode)) return;

        const { x, y } = position;

        openNodeInputAt({
          x,
          y,
          onComplete: (label: string) => {
            graphService.updateNodeInCy({ id, label });
            updateNode(id, { label });
          },
        });
      },
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        const { nodeIds, edgeIds } = graphService.removeSelectedElements();

        const currentNodes = useGraphDataStore.getState().nodes;
        const currentEdges = useGraphDataStore.getState().edges;

        const updatedNodes = currentNodes.filter((n) => !nodeIds.includes(n.id));
        const updatedEdges = currentEdges.filter(
          (e) =>
            !edgeIds.includes(e.id) && !nodeIds.includes(e.source) && !nodeIds.includes(e.target),
        );

        updateNodes(updatedNodes);
        updateEdges(updatedEdges);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { initCoreListeners };
};
