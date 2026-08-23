import { useNodeInput } from "@/components/ui/node-input";
import { graphService } from "@/services/graph-service";
import { generateNodeId } from "@/utils/generate-id";
import { useGraphDataStore, useUIStore } from "@/stores";
import { useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import AddNodeCommand from "@/stores/commands/add-node-command";
import { useCommandManager } from "./use-command-manager";
import AddEdgeCommand from "@/stores/commands/add-edge-command";
import BatchRemoveCommand from "@/stores/commands/batch-remove-command";
import MoveNodesCommand from "@/stores/commands/move-nodes-command";

export const useGraphInteractions = () => {
  // Graph Data Store
  const updateNode = useGraphDataStore((s) => s.updateNode);
  const isNodeExists = useGraphDataStore((s) => s.isNodeExists);

  const updateNodes = useGraphDataStore((s) => s.updateNodes);
  const updateEdges = useGraphDataStore((s) => s.updateEdges);

  const { showToast } = useToast();

  const { execute: executeCommand } = useCommandManager();

  // Node Input
  const { openNodeInputAt } = useNodeInput();

  const initCoreListeners = () => {
    graphService.bindEvents({
      onNodeAdd: (positions) => {
        const interactionMode = useUIStore.getState().mode;
        if (interactionMode !== "add-node") return;

        const { renderedPosition, position } = positions;

        openNodeInputAt({
          x: renderedPosition.x,
          y: renderedPosition.y,
          onComplete: (label: string) => {
            if (!label.trim()) return;

            const nodeId = generateNodeId(label);

            if (isNodeExists(nodeId)) {
              showToast({
                message: `A node with label "${label}" already exists.`,
                type: "error",
              });

              return;
            }

            executeCommand(
              new AddNodeCommand({
                id: nodeId,
                label,
                x: position.x,
                y: position.y,
              }),
            );
          },
        });
      },
      onEdgeAdd: (edge) => {
        executeCommand(new AddEdgeCommand(edge));
      },
      onNodeUpdate: ({ id, x, y }) => {
        const interactionMode = useUIStore.getState().mode;
        if (!["view", "add-edge"].includes(interactionMode) || !x || !y) return;

        openNodeInputAt({
          x,
          y,
          onComplete: (label: string) => {
            if (!label.trim()) return;

            graphService.updateNodeInCy({ id, label });
            updateNode(id, { label });
          },
        });
      },
      onNodePositionChange: (changes) => {
        executeCommand(new MoveNodesCommand(changes));
      },
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        executeCommand(new BatchRemoveCommand());
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { initCoreListeners };
};
