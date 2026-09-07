import { createGraphUtils } from "@/core/helpers/graph-utils";
import { Step } from "@/types/algorithm-store";

export class PathElementBuilder {
  constructor(private utils: ReturnType<typeof createGraphUtils>) {}

  build(path: string[], classes: string[]): Step["elements"] {
    const inPathElements: Step["elements"] = [];

    for (let i = 0; i < path.length; i++) {
      const sourceNodeId = path[i];
      const sourceNode = this.utils.getNode(sourceNodeId);

      if (sourceNode) {
        inPathElements.push({
          type: "node",
          id: sourceNodeId,
          label: sourceNode.label,
          classes: [...classes],
        });
      }

      if (i < path.length - 1) {
        const targetNodeId = path[i + 1];

        const targetNode = this.utils.getNode(targetNodeId);
        const edge = this.utils.getEdges(sourceNodeId, targetNodeId)[0];

        if (sourceNode && targetNode && edge) {
          inPathElements.push({
            type: "edge",
            id: edge.id,
            source: {
              type: "node",
              id: sourceNodeId,
              label: sourceNode.label,
            },
            target: {
              type: "node",
              id: targetNodeId,
              label: targetNode.label,
            },
            classes: [...classes],
            label: String(i + 1),
          });
        }
      }
    }

    return inPathElements;
  }
}
