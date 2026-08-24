import { useNodeInput } from "@/components/ui/node-input";
import { graphService } from "@/services/graph-service";
import { generateNodeId } from "@/utils/generate-id";
import { useGraphDataStore, useUIStore } from "@/stores";
import { useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { useCommandManager } from "./use-command-manager";

export const useGraphInteractions = () => {
  // Graph Data Store
  const isNodeExists = useGraphDataStore((s) => s.isNodeExists);

  const { showToast } = useToast();

  const { commands } = useCommandManager();

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

            commands.executeAddNodeCommand({
              id: nodeId,
              label,
              x: position.x,
              y: position.y,
            });
          },
        });
      },
      onEdgeAdd: (edge) => {
        commands.executeAddEdgeCommand(edge);
      },
      onNodeUpdate: ({ id, x, y }) => {
        const interactionMode = useUIStore.getState().mode;
        if (!["view", "add-edge"].includes(interactionMode) || !x || !y) return;

        openNodeInputAt({
          x,
          y,
          onComplete: (label: string) => {
            if (!label.trim()) return;

            commands.executeUpdateLabelCommand(id, label);
          },
        });
      },
      onNodePositionChange: (changes) => {
        commands.executeMoveNodesCommand(changes);
      },
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        commands.executeBatchRemoveCommand();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { initCoreListeners };
};
